import { Stotram, StotramIndexItem } from "@/types";
import indexData from "./stotrams-index.json";

interface RawStotramItem {
  id?: string;
  slug?: string;
  title_telugu?: string;
  title_english?: string;
  title?: string;
  category?: string;
  content_lines?: string[];
  contentLines?: string[];
  pdfLink?: string | null;
}

// In-memory cache for full stotrams during SSG
let cachedStotrams: Stotram[] | null = null;
let cachedSlugMap: Map<string, Stotram> | null = null;

// Return lightweight ~120KB index for fast homepage search, filters, and panchang
export function getStotramsIndex(): StotramIndexItem[] {
  return indexData as StotramIndexItem[];
}

export function getAllStotrams(): Stotram[] {
  if (cachedStotrams) return cachedStotrams;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const defaultStotrams = require("./stotrams.json") as RawStotramItem[];
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const dryScraped = require("./stotrams-scraped.json") as RawStotramItem[];
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const vignanamScraped = require("./vignanam-data.json") as RawStotramItem[];

  const stotrams: Stotram[] = [];
  const slugMap = new Map<string, Stotram>();

  // Helper to map and sanitize stotram objects
  const mapItem = (item: RawStotramItem): Stotram => ({
    id: item.id || "",
    slug: item.slug || item.id,
    title_telugu: item.title_telugu || "",
    title_english: item.title_english || item.title || "",
    category: item.category || "devotional",
    content_lines: item.content_lines || item.contentLines || [],
    pdfLink: item.pdfLink || null
  });

  // 1. Initialize with default stotrams
  defaultStotrams.forEach((item) => {
    stotrams.push(mapItem(item));
  });

  // 2. Load and merge dry-scraped stotrams
  dryScraped.forEach((item) => {
    if (!stotrams.some((s) => s.id === item.id)) {
      stotrams.push(mapItem(item));
    }
  });

  // 3. Load and merge vignanam-scraped stotrams
  vignanamScraped.forEach((item) => {
    const existingIndex = stotrams.findIndex((s) => s.id === item.id);
    const mapped = mapItem(item);

    if (existingIndex > -1) {
      // Overwrite with newly scraped details if matched
      stotrams[existingIndex] = mapped;
    } else {
      stotrams.push(mapped);
    }
  });

  stotrams.forEach((s) => {
    if (s.slug) slugMap.set(s.slug, s);
    if (s.id) slugMap.set(s.id, s);
  });

  cachedStotrams = stotrams;
  cachedSlugMap = slugMap;
  return stotrams;
}

export function getStotramBySlug(slug: string): Stotram | undefined {
  if (!cachedSlugMap) {
    getAllStotrams();
  }
  return cachedSlugMap?.get(slug);
}
