import fs from "fs";
import path from "path";
import { Stotram } from "@/types";
import defaultStotrams from "./stotrams.json";

export function getAllStotrams(): Stotram[] {
  const stotrams: Stotram[] = [...defaultStotrams];

  const dataDir = path.join(process.cwd(), "src", "data");

  // Helper to safely read and parse a JSON file if it exists
  const safeReadJSON = (filename: string): any[] => {
    try {
      const filePath = path.join(dataDir, filename);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(fileContent);
      }
    } catch (error) {
      console.warn(`[Loader] Failed to read or parse file: ${filename}`);
    }
    return [];
  };

  // 1. Load and merge stotrams-scraped.json (original dry-run scraper)
  const dryScraped = safeReadJSON("stotrams-scraped.json");
  dryScraped.forEach((item) => {
    if (!stotrams.some((s) => s.id === item.id)) {
      stotrams.push({
        id: item.id,
        slug: item.slug || item.id,
        title_telugu: item.title_telugu || "",
        title_english: item.title_english || item.title || "",
        category: item.category || "devotional",
        content_lines: item.content_lines || item.contentLines || [],
        pdfLink: item.pdfLink || null
      });
    }
  });

  // 2. Load and merge vignanam-data.json (category crawler records)
  const vignanamScraped = safeReadJSON("vignanam-data.json");
  vignanamScraped.forEach((item) => {
    // If it has already been loaded, we update it; otherwise, append it
    const existingIndex = stotrams.findIndex((s) => s.id === item.id);
    const mappedItem: Stotram = {
      id: item.id,
      slug: item.slug || item.id,
      title_telugu: item.title_telugu || "",
      title_english: item.title || item.title_english || "",
      category: item.category || "devotional",
      content_lines: item.contentLines || item.content_lines || [],
      pdfLink: item.pdfLink || null
    };

    if (existingIndex > -1) {
      // Overwrite static files if a newly scraped file has more detailed content
      stotrams[existingIndex] = mappedItem;
    } else {
      stotrams.push(mappedItem);
    }
  });

  return stotrams;
}
