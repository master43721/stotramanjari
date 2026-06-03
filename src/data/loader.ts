import { Stotram } from "@/types";
import defaultStotrams from "./stotrams.json";
import dryScraped from "./stotrams-scraped.json";
import vignanamScraped from "./vignanam-data.json";

export function getAllStotrams(): Stotram[] {
  const stotrams: Stotram[] = [];

  // Helper to map and sanitize stotram objects
  const mapItem = (item: any): Stotram => ({
    id: item.id,
    slug: item.slug || item.id,
    title_telugu: item.title_telugu || "",
    title_english: item.title_english || item.title || "",
    category: item.category || "devotional",
    content_lines: item.content_lines || item.contentLines || [],
    pdfLink: item.pdfLink || null
  });

  // 1. Initialize with default stotrams
  (defaultStotrams as any[]).forEach((item) => {
    stotrams.push(mapItem(item));
  });

  // 2. Load and merge dry-scraped stotrams
  (dryScraped as any[]).forEach((item) => {
    if (!stotrams.some((s) => s.id === item.id)) {
      stotrams.push(mapItem(item));
    }
  });

  // 3. Load and merge vignanam-scraped stotrams
  (vignanamScraped as any[]).forEach((item) => {
    const existingIndex = stotrams.findIndex((s) => s.id === item.id);
    const mapped = mapItem(item);

    if (existingIndex > -1) {
      // Overwrite with newly scraped details if matched
      stotrams[existingIndex] = mapped;
    } else {
      stotrams.push(mapped);
    }
  });

  return stotrams;
}
