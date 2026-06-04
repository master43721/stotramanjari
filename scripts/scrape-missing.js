const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const dataDir = path.join(__dirname, '..', 'src', 'data');
const databasePath = path.join(dataDir, 'vignanam-data.json');
const structurePath = path.join(dataDir, 'categories-structure.json');

// Load database
let database = [];
if (fs.existsSync(databasePath)) {
  database = JSON.parse(fs.readFileSync(databasePath, 'utf-8'));
}
console.log(`Loaded database with ${database.length} entries.`);

// Load structure
const structure = JSON.parse(fs.readFileSync(structurePath, 'utf-8'));

// Load category mappings
const mappings = JSON.parse(fs.readFileSync(path.join(dataDir, 'category-mappings.json'), 'utf-8'));

// Build fallback telugu titles map from structure
const fallbackTeluguTitles = new Map();
structure.forEach(c => {
  c.stotrams.forEach(s => {
    const parts = s.href.split('/');
    const slug = parts[parts.length - 1].replace(/\.html$/, '');
    fallbackTeluguTitles.set(slug, s.title_telugu || "");
  });
});

// Extract all unique target URLs and map slugs to their category IDs
const targetUrlsMap = new Map();
Object.keys(mappings).forEach(catId => {
  mappings[catId].forEach(slug => {
    const fullUrl = `https://vignanam.org/telugu/${slug}.html`;
    if (!targetUrlsMap.has(slug)) {
      targetUrlsMap.set(slug, {
        url: fullUrl,
        categories: [catId],
        title_telugu: fallbackTeluguTitles.get(slug) || ""
      });
    } else {
      const item = targetUrlsMap.get(slug);
      if (!item.categories.includes(catId)) {
        item.categories.push(catId);
      }
    }
  });
});

console.log(`Targeting ${targetUrlsMap.size} unique stotrams across all categories.`);

// Filter for missing ones
const missingStotrams = [];
const existingSlugs = new Set(database.map(s => s.slug || s.id));

for (const [slug, item] of targetUrlsMap.entries()) {
  if (!existingSlugs.has(slug)) {
    missingStotrams.push({ slug, ...item });
  }
}

// Sort missingStotrams so that ones containing 'ashtottara' in their categories are processed first
missingStotrams.sort((a, b) => {
  const aHasAshtottara = a.categories.some(c => c.includes('ashtottara'));
  const bHasAshtottara = b.categories.some(c => c.includes('ashtottara'));
  if (aHasAshtottara && !bHasAshtottara) return -1;
  if (!aHasAshtottara && bHasAshtottara) return 1;
  return 0;
});

console.log(`Need to crawl ${missingStotrams.length} missing stotrams.`);

// Helper functions
function isTelugu(text) {
  return /[\u0c00-\u0c7f]/.test(text);
}

function cleanText(text) {
  return text.replace(/\s+/g, ' ').trim();
}

const isBannerText = (text) => {
  const lower = text.toLowerCase();
  return (
    lower.includes("simplified anusvaras") ||
    lower.includes("correct anusvaras marked") ||
    lower.includes("సరళ తెలుగు") ||
    lower.includes("శుద్ధ తెలుగు")
  );
};

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
];

async function fetchWithRetry(url, retries = 3, delay = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const ua = userAgents[Math.floor(Math.random() * userAgents.length)];
      const response = await axios.get(url, {
        headers: {
          'User-Agent': ua,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache'
        },
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.warn(`[Attempt ${attempt}/${retries}] Failed to fetch: ${url}. Error: ${error.message}`);
      if (attempt === retries) throw error;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

async function scrapeAll() {
  let count = 0;
  let consecutiveFailures = 0;
  for (let i = 0; i < missingStotrams.length; i++) {
    const item = missingStotrams[i];
    console.log(`[Crawl ${i + 1}/${missingStotrams.length}] Fetching: ${item.url}...`);
    
    try {
      // 1500ms polite delay to avoid AWS WAF rate limit blocks
      await new Promise(r => setTimeout(r, 1500));
      
      const html = await fetchWithRetry(item.url);
      const $page = cheerio.load(html);
      
      // Extract titles
      const pageTitleText = $page('title').text() || '';
      const bodyTitleText = $page('#stitle').first().text() || $page('.stotramtitle').first().text() || '';
      
      let titleTelugu = isTelugu(bodyTitleText) ? cleanText(bodyTitleText) : '';
      let titleEnglish = '';
      
      const titleParts = pageTitleText.split(/[-–|]/).map(p => cleanText(p));
      if (titleParts.length > 0) {
        const nonTeluguPart = titleParts.find(p => !isTelugu(p) && p.toLowerCase() !== 'telugu' && !p.toLowerCase().includes('vaidika vignanam'));
        if (nonTeluguPart) {
          titleEnglish = nonTeluguPart;
        }
      }
      
      if (!titleEnglish) {
        const slugText = item.slug.replace(/[-_]/g, ' ');
        titleEnglish = slugText.charAt(0).toUpperCase() + slugText.slice(1);
      }
      
      if (!titleTelugu) {
        const teluguPart = titleParts.find(p => isTelugu(p));
        titleTelugu = teluguPart ? teluguPart : item.title_telugu || titleEnglish;
      }
      
      // Clean page elements
      $page("script, style, iframe, header, footer, nav, .sidebar, #sidebar, .menu, #menu, .comment, #comment, .advertisement, #advertisement").remove();
      
      const contentLines = [];
      const mainSelectors = ['#stext', '#content', '.stotram', '.lyrics', '.content', '.stotram-content', 'article', 'main'];
      let mainContent = $page('body');
      
      for (const selector of mainSelectors) {
        const found = $page(selector);
        if (found.length > 0) {
          mainContent = found;
          break;
        }
      }
      
      // Extract lines
      mainContent.find('p, div, pre, blockquote, td').each((_, element) => {
        const $el = $page(element);
        if ($el.find('p, div').length > 0) {
          return;
        }
        const text = $el.text();
        const subLines = text.split(/\r?\n/);
        subLines.forEach((subLine) => {
          const cleaned = cleanText(subLine);
          if (isTelugu(cleaned) && cleaned.length > 3 && !isBannerText(cleaned)) {
            if (!contentLines.includes(cleaned)) {
              contentLines.push(cleaned);
            }
          }
        });
      });
      
      // Fallback
      if (contentLines.length === 0) {
        $page('body').find('*').contents().each((_, node) => {
          if (node.type === 'text') {
            const text = cleanText($page(node).text());
            if (isTelugu(text) && text.length > 3 && !isBannerText(text) && !contentLines.includes(text)) {
              contentLines.push(text);
            }
          }
        });
      }
      
      if (contentLines.length === 0) {
        consecutiveFailures++;
        console.warn(`[Crawler] Warning: No Telugu lyrics extracted for ${item.url} (Failure ${consecutiveFailures})`);
        console.log(`[Crawler] Page HTML snippet: ${html.substring(0, 500).replace(/\s+/g, ' ')}`);
        
        if (consecutiveFailures >= 3) {
          console.error('[Crawler] Too many consecutive failures. Stopping scraper.');
          break;
        }
        
        console.log('[Crawler] Pausing for 3 minutes (180s) to cool down before retry...');
        await new Promise(r => setTimeout(r, 180000));
        i--; // Retry same page
        continue;
      }
      consecutiveFailures = 0; // Reset counter on success
      
      // Format Title
      let finalTitleTelugu = titleTelugu;
      let finalContentLines = [...contentLines];
      if (finalTitleTelugu.toLowerCase() === 'telugu' && finalContentLines.length > 0) {
        finalTitleTelugu = finalContentLines[0];
        finalContentLines.shift();
      }
      
      // Determine primary category
      const primaryCategory = item.categories[0];
      
      const stotramItem = {
        id: item.slug,
        slug: item.slug,
        title: titleEnglish,
        title_telugu: finalTitleTelugu,
        category: primaryCategory,
        contentLines: finalContentLines,
        pdfLink: null
      };
      
      database.push(stotramItem);
      count++;
      
      // Incrementally save database
      fs.writeFileSync(databasePath, JSON.stringify(database, null, 2), 'utf-8');
      console.log(`[Crawler] Saved successfully [${count}]: "${stotramItem.title}"`);
      
    } catch (err) {
      console.error(`[Crawler] Error scraping page: ${item.url}. Reason: ${err.message}`);
    }
  }
  
  console.log(`Scraping finished. Added ${count} new stotrams. Total database items: ${database.length}`);
}

scrapeAll();
