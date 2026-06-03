import axios from "axios";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

// Helper to check if a string contains Telugu characters
function isTelugu(text: string): boolean {
  return /[\u0c00-\u0c7f]/.test(text);
}

// Helper to clean up strings (remove multiple spaces, trim)
function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .trim();
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function crawlCategory(categoryUrl: string) {
  try {
    console.log("====================================================================");
    console.log("Vignanam.org Category Crawler");
    console.log("====================================================================");
    console.log(`[Crawler] Fetching category index page: ${categoryUrl}...`);

    // Fetch the main category list page
    const indexResponse = await axios.get(categoryUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache"
      },
      timeout: 15000
    });

    const $index = cheerio.load(indexResponse.data);
    const stotramLinks: string[] = [];

    // Extract all category stotram links from the sidebar tree (class .link4)
    $index("a.link4").each((_, element) => {
      const href = $index(element).attr("href");
      if (!href) return;

      const cleanHref = href.trim();
      // Ensure it is a relative HTML file or paths
      const isHtml = cleanHref.endsWith(".html");
      const isNotBoilerplate = 
        !cleanHref.includes("index.html") &&
        !cleanHref.includes("about.html") &&
        !cleanHref.includes("contact.html") &&
        !cleanHref.startsWith("http://") &&
        !cleanHref.startsWith("https://");

      if (isHtml && isNotBoilerplate) {
        try {
          const resolvedUrl = new URL(cleanHref, categoryUrl).href;
          if (!stotramLinks.includes(resolvedUrl)) {
            stotramLinks.push(resolvedUrl);
          }
        } catch (e) {
          console.warn(`[Crawler] Failed to resolve URL for href: ${cleanHref}`);
        }
      }
    });

    console.log(`[Crawler] Discovered ${stotramLinks.length} category stotram links from sidebar menu.`);

    if (stotramLinks.length === 0) {
      console.log("[Crawler] No stotram links found. Please verify sidebar tree selectors.");
      return;
    }

    // Set up database paths
    const dataDir = path.join(process.cwd(), "src", "data");
    const filePath = path.join(dataDir, "vignanam-data.json");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Load existing database to append/update
    let database: any[] = [];
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        database = JSON.parse(fileContent);
        console.log(`[Crawler] Loaded existing database with ${database.length} entries.`);
      } catch (err) {
        console.log("[Crawler] Warning: Existing database corrupt. Starting fresh...");
      }
    }

    // Iterate through links with 2000ms delay to prevent rate-limiting
    for (let i = 0; i < stotramLinks.length; i++) {
      const url = stotramLinks[i];
      console.log(`\n------------------------------------------------------------`);
      console.log(`[Crawler] Processing ${i + 1}/${stotramLinks.length}: ${url}`);
      console.log(`------------------------------------------------------------`);

      // Rate limit safety sleep
      if (i > 0) {
        console.log("[Crawler] Safety delay: sleeping for 2000ms...");
        await sleep(2000);
      }

      try {
        const response = await axios.get(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
          },
          timeout: 10000
        });

        const $page = cheerio.load(response.data);

        // 1. Extract Title
        let rawTitle = cleanText($page("h1").first().text() || $page(".title").first().text() || $page(".stotram-title").first().text() || $page("title").text());
        if (!rawTitle) rawTitle = "Scraped Stotram";

        let titleTelugu = "";
        let titleEnglish = "";

        const splitTitleParts = rawTitle.split(/[-–|]/);
        if (splitTitleParts.length >= 2) {
          const part1 = cleanText(splitTitleParts[0]);
          const part2 = cleanText(splitTitleParts[1]);

          if (isTelugu(part1)) {
            titleTelugu = part1;
            titleEnglish = part2;
          } else {
            titleTelugu = part2;
            titleEnglish = part1;
          }
        } else {
          const words = rawTitle.split(/\s+/);
          const teluguWords: string[] = [];
          const englishWords: string[] = [];

          words.forEach((word) => {
            if (isTelugu(word)) {
              teluguWords.push(word);
            } else {
              englishWords.push(word);
            }
          });

          titleTelugu = teluguWords.join(" ") || rawTitle;
          titleEnglish = englishWords.join(" ") || "Scraped Stotram";
        }

        // Clean up titles
        titleTelugu = cleanText(titleTelugu);
        titleEnglish = cleanText(titleEnglish);

        // Double check English fallback from URL slug
        if (!titleEnglish || titleEnglish.trim().length < 2) {
          const urlParts = url.split("/");
          const lastSegment = urlParts[urlParts.length - 1] || "";
          const slug = lastSegment.replace(/\.html?$/, "").replace(/[-_]/g, " ");
          titleEnglish = slug.charAt(0).toUpperCase() + slug.slice(1);
        }

        // 2. Extract Lines
        const contentLines: string[] = [];
        $page("p, div.lyrics, div.content, div.stotram-content, pre").each((_, element) => {
          const text = $page(element).text();
          const subLines = text.split(/\r?\n/);
          
          subLines.forEach((subLine) => {
            const cleaned = cleanText(subLine);
            if (isTelugu(cleaned) && cleaned.length > 3) {
              if (!contentLines.includes(cleaned)) {
                contentLines.push(cleaned);
              }
            }
          });
        });

        // Cheerio Fallback for child text nodes
        if (contentLines.length === 0) {
          $page("*").each((_, element) => {
            $page(element).contents().each((_, node) => {
              if (node.type === "text") {
                const text = cleanText($page(node).text());
                if (isTelugu(text) && text.length > 3 && !contentLines.includes(text)) {
                  contentLines.push(text);
                }
              }
            });
          });
        }

        if (contentLines.length === 0) {
          console.log(`[Crawler] Skip: Failed to parse Telugu lyrics content for ${url}`);
          continue;
        }

        // Promote first line if Telugu Title is generic
        let finalTitleTelugu = titleTelugu;
        let finalContentLines = [...contentLines];
        if (finalTitleTelugu.toLowerCase() === "telugu" && finalContentLines.length > 0) {
          finalTitleTelugu = finalContentLines[0];
          finalContentLines.shift();
        }

        // 3. Infer Category
        let category = "devotional";
        const lowerTitleEnglish = titleEnglish.toLowerCase();
        
        if (lowerTitleEnglish.includes("ganesha") || lowerTitleEnglish.includes("vinayaka") || finalTitleTelugu.includes("గణేశ") || finalTitleTelugu.includes("వినాయక")) {
          category = "ganesha";
        } else if (lowerTitleEnglish.includes("shiva") || lowerTitleEnglish.includes("linga") || lowerTitleEnglish.includes("tandava") || finalTitleTelugu.includes("శివ") || finalTitleTelugu.includes("లింగ")) {
          category = "shiva";
        } else if (lowerTitleEnglish.includes("devi") || lowerTitleEnglish.includes("lalitha") || lowerTitleEnglish.includes("durga") || finalTitleTelugu.includes("దేవి") || finalTitleTelugu.includes("లలితా")) {
          category = "devi";
        } else if (lowerTitleEnglish.includes("rama") || finalTitleTelugu.includes("రామ")) {
          category = "rama";
        } else if (lowerTitleEnglish.includes("krishna") || finalTitleTelugu.includes("కృష్ణ")) {
          category = "krishna";
        } else {
          // Deduce from URL slug path
          const match = url.match(/\/telugu\/([a-z-]+)-/i) || url.match(/\/([a-z-]+)\/[a-z-]+\.html/i);
          if (match && match[1]) {
            category = match[1];
          }
        }

        const slugId = titleEnglish
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");

        // Format structured object matching request
        const stotramItem = {
          id: slugId,
          slug: slugId,
          title: titleEnglish,
          title_telugu: finalTitleTelugu,
          category: category,
          contentLines: finalContentLines,
          pdfLink: null // Reserved for Google Drive links
        };

        // Merge back into memory array
        const existingIdx = database.findIndex((item) => item.id === stotramItem.id);
        if (existingIdx > -1) {
          database[existingIdx] = stotramItem;
          console.log(`[Crawler] Updated in-memory: "${stotramItem.title}"`);
        } else {
          database.push(stotramItem);
          console.log(`[Crawler] Added in-memory: "${stotramItem.title}"`);
        }

        // Periodically write to disk to preserve data in case of crashes
        fs.writeFileSync(filePath, JSON.stringify(database, null, 2), "utf-8");
        console.log(`[Crawler] Saved progress successfully.`);

      } catch (err: any) {
        console.error(`[Crawler] Failed to crawl page: ${url}`);
        console.error(err.message || err);
      }
    }

    console.log(`\n====================================================================`);
    console.log(`[Crawler] SUCCESS! Finished category crawl.`);
    console.log(`[Crawler] Total database entries: ${database.length}`);
    console.log(`====================================================================`);

  } catch (error: any) {
    console.error(`[Crawler] Fatal error running crawler:`);
    console.error(error.message || error);
    process.exit(1);
  }
}

// Entry Point parsing CLI arguments
const seedUrl = process.argv[2];

if (!seedUrl) {
  console.log("====================================================================");
  console.log("Vignanam.org Category List Crawler");
  console.log("====================================================================");
  console.log("Usage:");
  console.log("  npx tsx scripts/scrape-vignanam.ts <CATEGORY_INDEX_URL>");
  console.log("\nExample:");
  console.log("  npx tsx scripts/scrape-vignanam.ts https://vignanam.org/telugu/shiva-stotrams.html");
  console.log("====================================================================");
  
  // Default seed URL if none is provided
  const defaultCategory = "https://vignanam.org/telugu/lingashtakam.html";
  console.log(`\n[Crawler] No seed URL provided. Running crawl check on default Shiva stotram page:\n  ${defaultCategory}\n`);
  crawlCategory(defaultCategory);
} else {
  crawlCategory(seedUrl);
}
