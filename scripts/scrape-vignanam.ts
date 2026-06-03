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

const SEED_URLS = [
  "https://vignanam.org/telugu/lingashtakam.html",
  "https://vignanam.org/telugu/sankata-nashana-ganesha-stotram.html",
  "https://vignanam.org/telugu/sri-venkateswara-suprabhatam.html",
  "https://vignanam.org/telugu/kanakadhara-stotram.html",
  "https://vignanam.org/telugu/subrahmanya-ashtakam-karavalamba-stotram.html",
  "https://vignanam.org/telugu/hanuman-chalisa.html",
  "https://vignanam.org/telugu/aditya-hrudayam.html",
  "https://vignanam.org/telugu/sri-suktam.html"
];

async function crawlDatabase(customSeeds?: string[]) {
  try {
    console.log("====================================================================");
    console.log("Resilient Vignanam.org Deep Crawler");
    console.log("====================================================================");

    const seedsToUse = customSeeds && customSeeds.length > 0 ? customSeeds : SEED_URLS;
    const stotramUrlsSet = new Set<string>();

    // Step 1: Harvest all unique stotram links from seed sidebars
    for (let s = 0; s < seedsToUse.length; s++) {
      const seed = seedsToUse[s];
      console.log(`[Crawler] Harvesting links from seed [${s + 1}/${seedsToUse.length}]: ${seed}...`);
      try {
        const response = await axios.get(seed, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache"
          },
          timeout: 15000
        });

        const $ = cheerio.load(response.data);
        let count = 0;

        $("a.link4").each((_, element) => {
          const href = $(element).attr("href");
          if (!href) return;

          const cleanHref = href.trim();
          const isHtml = cleanHref.endsWith(".html");
          const isNotBoilerplate = 
            !cleanHref.includes("index.html") &&
            !cleanHref.includes("about.html") &&
            !cleanHref.includes("contact.html") &&
            !cleanHref.startsWith("http://") &&
            !cleanHref.startsWith("https://");

          if (isHtml && isNotBoilerplate) {
            try {
              const resolvedUrl = new URL(cleanHref, seed).href;
              stotramUrlsSet.add(resolvedUrl);
              count++;
            } catch (e) {
              // ignore URL resolution errors
            }
          }
        });

        console.log(`[Crawler] Discovered ${count} links on seed page. Cumulative unique links: ${stotramUrlsSet.size}`);
        await sleep(1500); // safety gap
      } catch (err: any) {
        console.error(`[Crawler] Failed to harvest from seed: ${seed}. Error: ${err.message || err}`);
      }
    }

    const stotramLinks = Array.from(stotramUrlsSet);
    console.log(`[Crawler] Finished link harvesting. Total unique URLs to crawl: ${stotramLinks.length}`);

    if (stotramLinks.length === 0) {
      console.log("[Crawler] No links collected. Exiting.");
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
        console.log("[Crawler] Warning: Existing database corrupt or empty. Starting fresh...");
      }
    }

    // Step 2: Iterate through links with 1500ms safety delay
    for (let i = 0; i < stotramLinks.length; i++) {
      const url = stotramLinks[i];

      // Derive slug to check existing item
      const urlParts = url.split("/");
      const lastSegment = urlParts[urlParts.length - 1] || "";
      const urlSlug = lastSegment.replace(/\.html?$/, "");

      // Check if stotram is already fully scraped in the JSON database
      const existingIdx = database.findIndex((item) => item.slug === urlSlug || item.id === urlSlug);
      if (existingIdx > -1 && database[existingIdx].contentLines && database[existingIdx].contentLines.length > 0) {
        console.log(`[Scraped ${i + 1}/${stotramLinks.length}] Skip (Already in DB): "${database[existingIdx].title}"`);
        continue;
      }

      console.log(`[Scraped ${i + 1}/${stotramLinks.length}] Crawling: ${url}...`);

      // Rate limit safety sleep
      await sleep(1500);

      try {
        const response = await axios.get(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache"
          },
          timeout: 12000
        });

        const $page = cheerio.load(response.data);

        // 1. Extract Title
        const pageTitleText = $page("title").text() || "";
        const bodyTitleText = $page("#stitle").first().text() || $page(".stotramtitle").first().text() || "";

        let titleTelugu = isTelugu(bodyTitleText) ? cleanText(bodyTitleText) : "";
        let titleEnglish = "";

        const titleParts = pageTitleText.split(/[-–|]/).map(p => cleanText(p));
        if (titleParts.length > 0) {
          const nonTeluguPart = titleParts.find(p => !isTelugu(p) && p.toLowerCase() !== "telugu" && !p.toLowerCase().includes("vaidika vignanam"));
          if (nonTeluguPart) {
            titleEnglish = nonTeluguPart;
          }
        }

        if (!titleEnglish) {
          const slugText = urlSlug.replace(/[-_]/g, " ");
          titleEnglish = slugText.charAt(0).toUpperCase() + slugText.slice(1);
        }

        if (!titleTelugu) {
          const teluguPart = titleParts.find(p => isTelugu(p));
          if (teluguPart) {
            titleTelugu = teluguPart;
          } else {
            titleTelugu = titleEnglish;
          }
        }

        // 2. Extract Lines
        // Clean out layout elements, scripts, ads
        $page("script, style, iframe, header, footer, nav, .sidebar, #sidebar, .menu, #menu, .comment, #comment, .advertisement, #advertisement").remove();

        const contentLines: string[] = [];

        const isBannerText = (text: string): boolean => {
          const lower = text.toLowerCase();
          return (
            lower.includes("simplified anusvaras") ||
            lower.includes("correct anusvaras marked") ||
            lower.includes("సరళ తెలుగు") ||
            lower.includes("శుద్ధ తెలుగు")
          );
        };

        // Check potential main content containers
        const mainSelectors = ["#content", ".stotram", ".lyrics", ".content", ".stotram-content", "article", "main"];
        let mainContent: any = $page("body");
        
        for (const selector of mainSelectors) {
          const found = $page(selector);
          if (found.length > 0) {
            mainContent = found;
            break;
          }
        }

        // Extract paragraphs or divs containing Telugu lyrics
        mainContent.find("p, div, pre, blockquote, td").each((_: number, element: any) => {
          const $el = $page(element);
          
          // Prevent duplicate capturing of nested text containers
          if ($el.find("p, div").length > 0) {
            return;
          }
          
          const text = $el.text();
          const subLines = text.split(/\r?\n/);
          
          subLines.forEach((subLine) => {
            const cleaned = cleanText(subLine);
            // Verify it has Telugu glyphs and is of readable length
            if (isTelugu(cleaned) && cleaned.length > 3 && !isBannerText(cleaned)) {
              if (!contentLines.includes(cleaned)) {
                contentLines.push(cleaned);
              }
            }
          });
        });

        // Fallback to text node matching if container parsing returns nothing
        if (contentLines.length === 0) {
          $page("body").find("*").contents().each((_, node) => {
            if (node.type === "text") {
              const text = cleanText($page(node).text());
              if (isTelugu(text) && text.length > 3 && !isBannerText(text) && !contentLines.includes(text)) {
                contentLines.push(text);
              }
            }
          });
        }

        if (contentLines.length === 0) {
          console.warn(`[Crawler] Warning: No Telugu lyrics content extracted for ${url}`);
          continue;
        }

        // Format Telugu title if generic
        let finalTitleTelugu = titleTelugu;
        let finalContentLines = [...contentLines];
        if (finalTitleTelugu.toLowerCase() === "telugu" && finalContentLines.length > 0) {
          finalTitleTelugu = finalContentLines[0];
          finalContentLines.shift();
        }

        // 3. Infer Category
        let category = "devotional";
        const lowerTitleEnglish = titleEnglish.toLowerCase();
        
        if (
          lowerTitleEnglish.includes("ganesha") || 
          lowerTitleEnglish.includes("vinayaka") || 
          finalTitleTelugu.includes("గణేశ") || 
          finalTitleTelugu.includes("వినాయక")
        ) {
          category = "ganesha";
        } else if (
          lowerTitleEnglish.includes("shiva") || 
          lowerTitleEnglish.includes("linga") || 
          lowerTitleEnglish.includes("tandava") || 
          finalTitleTelugu.includes("శివ") || 
          finalTitleTelugu.includes("లింగ")
        ) {
          category = "shiva";
        } else if (
          lowerTitleEnglish.includes("devi") || 
          lowerTitleEnglish.includes("lalitha") || 
          lowerTitleEnglish.includes("durga") || 
          finalTitleTelugu.includes("దేవి") || 
          finalTitleTelugu.includes("లలితా")
        ) {
          category = "devi";
        } else if (lowerTitleEnglish.includes("rama") || finalTitleTelugu.includes("రామ")) {
          category = "rama";
        } else if (lowerTitleEnglish.includes("krishna") || finalTitleTelugu.includes("కృష్ణ")) {
          category = "krishna";
        } else {
          // Deduce from URL path category matches
          const match = url.match(/\/telugu\/([a-z-]+)-/i) || url.match(/\/([a-z-]+)\/[a-z-]+\.html/i);
          if (match && match[1]) {
            category = match[1];
          }
        }

        const stotramItem = {
          id: urlSlug,
          slug: urlSlug,
          title: titleEnglish,
          title_telugu: finalTitleTelugu,
          category: category,
          contentLines: finalContentLines,
          pdfLink: null
        };

        // Merge back into database in-memory array
        if (existingIdx > -1) {
          database[existingIdx] = stotramItem;
        } else {
          database.push(stotramItem);
        }

        // Write to database incrementally to protect progress in case of crash/kill
        fs.writeFileSync(filePath, JSON.stringify(database, null, 2), "utf-8");
        console.log(`[Crawler] Saved successfully: "${stotramItem.title}"`);

      } catch (err: any) {
        console.error(`[Crawler] Error crawling page: ${url}. Reason: ${err.message || err}`);
      }
    }

    console.log(`\n====================================================================`);
    console.log(`[Crawler] SUCCESS! Finished deep crawler run.`);
    console.log(`[Crawler] Total database entries: ${database.length}`);
    console.log(`====================================================================`);

  } catch (error: any) {
    console.error(`[Crawler] Fatal error running crawler:`, error.message || error);
    process.exit(1);
  }
}

// Entry Point
const argSeed = process.argv[2];
if (argSeed) {
  console.log(`[Crawler] Launching single custom seed crawl: ${argSeed}`);
  crawlDatabase([argSeed]);
} else {
  console.log("[Crawler] Launching full deep crawl over all seed categories...");
  crawlDatabase();
}
