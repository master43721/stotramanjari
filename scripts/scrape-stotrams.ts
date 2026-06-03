import axios from "axios";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

// Helper to check if a string contains Telugu characters
function isTelugu(text: string): boolean {
  return /[\u0c00-\u0c7f]/.test(text);
}

// Helper to clean up strings (remove weird double spaces, trim)
function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .trim();
}

async function scrapeStotram(targetUrl: string) {
  try {
    console.log(`[Scraper] Initiating fetch for: ${targetUrl}...`);

    // Mask our scraper as a standard Chrome browser to prevent 202/403 blocks
    const response = await axios.get(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache"
      },
      timeout: 15000
    });

    console.log("[Scraper] HTML fetched successfully. Loading Cheerio parser...");
    const $ = cheerio.load(response.data);

    // 1. Extract and split Title
    const pageTitleText = $("title").text() || "";
    const bodyTitleText = $("#stitle").first().text() || $(".stotramtitle").first().text() || "";

    const urlParts = targetUrl.split("/");
    const lastSegment = urlParts[urlParts.length - 1] || "";
    const urlSlug = lastSegment.replace(/\.html?$/, "");

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

    console.log(`[Scraper] Parsed Titles:`);
    console.log(`  - Telugu:  "${titleTelugu}"`);
    console.log(`  - English: "${titleEnglish}"`);

    // 2. Infer Category
    let category = "devotional";
    const lowerTitleEnglish = titleEnglish.toLowerCase();
    
    if (lowerTitleEnglish.includes("ganesha") || lowerTitleEnglish.includes("vinayaka") || titleTelugu.includes("గణేశ") || titleTelugu.includes("వినాయక")) {
      category = "ganesha";
    } else if (lowerTitleEnglish.includes("shiva") || lowerTitleEnglish.includes("linga") || lowerTitleEnglish.includes("tandava") || titleTelugu.includes("శివ") || titleTelugu.includes("లింగ")) {
      category = "shiva";
    } else if (lowerTitleEnglish.includes("devi") || lowerTitleEnglish.includes("lalitha") || lowerTitleEnglish.includes("durga") || titleTelugu.includes("దేవి") || titleTelugu.includes("లలితా")) {
      category = "devi";
    } else if (lowerTitleEnglish.includes("rama") || titleTelugu.includes("రామ")) {
      category = "rama";
    } else if (lowerTitleEnglish.includes("krishna") || titleTelugu.includes("కృష్ణ")) {
      category = "krishna";
    } else {
      // Deduce from URL slug path if possible
      const match = targetUrl.match(/\/telugu\/([a-z-]+)-/i) || targetUrl.match(/\/([a-z-]+)\/[a-z-]+\.html/i);
      if (match && match[1]) {
        category = match[1];
      }
    }

    console.log(`[Scraper] Inferred Category: "${category}"`);

    // 3. Extract Stotram Lines using a highly robust Telugu character match
    console.log("[Scraper] Extracting Telugu content lines...");
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

    // Traverse all elements that might hold lines (p, div, td, span, pre)
    // We look primarily for <p> tags first as they hold narrative lyrics
    $("p, div.lyrics, div.content, div.stotram-content, pre").each((_, element) => {
      const text = $(element).text();
      
      // Split by newlines to examine line-by-line
      const subLines = text.split(/\r?\n/);
      
      subLines.forEach((subLine) => {
        const cleaned = cleanText(subLine);
        
        // Ensure it contains Telugu script, is not empty, and isn't a header menu
        if (isTelugu(cleaned) && cleaned.length > 3 && !isBannerText(cleaned)) {
          // Avoid adding duplicate lines
          if (!contentLines.includes(cleaned)) {
            contentLines.push(cleaned);
          }
        }
      });
    });

    // If no lines found from structured containers, fallback to checking ALL paragraphs or elements
    if (contentLines.length === 0) {
      console.log("[Scraper] Warning: No structured container found, falling back to page-wide search...");
      $("*").each((_, element) => {
        // Only target elements that contain direct text to avoid capturing nested layouts
        $(element).contents().each((_, node) => {
          if (node.type === "text") {
            const text = cleanText($(node).text());
            if (isTelugu(text) && text.length > 3 && !isBannerText(text) && !contentLines.includes(text)) {
              contentLines.push(text);
            }
          }
        });
      });
    }

    console.log(`[Scraper] Extracted ${contentLines.length} Telugu stotram lines.`);

    if (contentLines.length === 0) {
      throw new Error("Failed to extract any Telugu stotram content lines. selector structure might have changed.");
    }

    // 4. Generate structured item
    let finalTitleTelugu = titleTelugu;
    let finalContentLines = [...contentLines];

    // If Telugu title is generic metadata, promote first Telugu line of content
    if (finalTitleTelugu.toLowerCase() === "telugu" && finalContentLines.length > 0) {
      finalTitleTelugu = finalContentLines[0];
      finalContentLines.shift();
      console.log(`[Scraper] Promoted first content line to Telugu Title: "${finalTitleTelugu}"`);
    }

    const slugId = titleEnglish
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Keep alphanumeric, spaces, hyphens
      .trim()
      .replace(/\s+/g, "-"); // Replace spaces with hyphens

    const scrapedStotram = {
      id: slugId,
      title_telugu: finalTitleTelugu,
      title_english: titleEnglish,
      category: category,
      content_lines: finalContentLines
    };

    // 5. Save/Append to src/data/stotrams-scraped.json
    const dataDir = path.join(process.cwd(), "src", "data");
    const filePath = path.join(dataDir, "stotrams-scraped.json");

    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    let existingData: any[] = [];
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        existingData = JSON.parse(fileContent);
      } catch (err) {
        console.log("[Scraper] Warning: Existing file corrupt. Starting fresh...");
      }
    }

    // Check if stotram is already present, if so, update it, otherwise push new
    const existingIndex = existingData.findIndex((item) => item.id === scrapedStotram.id);
    if (existingIndex > -1) {
      console.log(`[Scraper] Updating existing stotram "${scrapedStotram.id}" in database...`);
      existingData[existingIndex] = scrapedStotram;
    } else {
      console.log(`[Scraper] Adding new stotram "${scrapedStotram.id}" to database...`);
      existingData.push(scrapedStotram);
    }

    // Write back to disk formatted beautifully
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), "utf-8");
    console.log(`[Scraper] SUCCESS! Saved stotram to: ${filePath}`);
    console.log(`  - Saved details: ${scrapedStotram.title_english} in category "${scrapedStotram.category}".`);

  } catch (error: any) {
    console.error("[Scraper] ERROR during scraping operations:");
    console.error(error.message || error);
    process.exit(1);
  }
}

// Execution Entry Point
const targetUrl = process.argv[2];

if (!targetUrl) {
  console.log("====================================================================");
  console.log("Stotram Web Scraper Utility");
  console.log("====================================================================");
  console.log("Usage:");
  console.log("  npx tsx scripts/scrape-stotrams.ts <TARGET_URL>");
  console.log("\nExample:");
  console.log("  npx tsx scripts/scrape-stotrams.ts https://vignanam.org/telugu/shiva-panchakshari-stotram.html");
  console.log("====================================================================");
  
  // Default URL to test scraper if none provided
  const defaultTestUrl = "https://vignanam.org/telugu/lingashtakam.html";
  console.log(`\n[Scraper] No URL provided. Running dry-run check on default test page:\n  ${defaultTestUrl}\n`);
  scrapeStotram(defaultTestUrl);
} else {
  scrapeStotram(targetUrl);
}
