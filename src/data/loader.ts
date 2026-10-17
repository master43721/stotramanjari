import { Stotram, StotramIndexItem } from "@/types";
import indexData from "./stotrams-index.json";
import { sanitizeLines, sanitizeTeluguText } from "@/lib/sanitizeTelugu";

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

const TELUGU_CATEGORY_MAP: Record<string, string> = {
  bilvaashtakam: "shiva",
  rudrashtakam: "shiva",
  totakashtakam: "guru",
  madhurashtakam: "krishna",
  suryashtakam: "surya",
  govindashtakam: "krishna",
  achyutashtakam: "krishna",
  harivarasanam: "ayyappa",
  dhanyashtakam: "ashtakas",
  gurvashtakam: "guru",
};

// Return lightweight ~120KB index for fast homepage search, filters, and panchang
export function getStotramsIndex(): StotramIndexItem[] {
  const seen = new Set<string>();

  return (indexData as StotramIndexItem[]).flatMap((item) => {
    const slug = item.slug || item.id;
    // A canonical slug is the public identity of an entry. Do not render the
    // same chant twice when source datasets overlap.
    if (!slug || seen.has(slug)) return [];
    seen.add(slug);
    const cat = item.category === "telugu" ? TELUGU_CATEGORY_MAP[slug] || "devotional" : item.category;
    return [{
      ...item,
      category: cat,
      title_telugu: sanitizeTeluguText(item.title_telugu || ""),
    }];
  });
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
  const mapItem = (item: RawStotramItem): Stotram => {
    const slug = item.slug || item.id || "";
    let category = item.category || "devotional";
    if (category === "telugu") {
      category = TELUGU_CATEGORY_MAP[slug] || "devotional";
    }
    return {
      id: item.id || "",
      slug: slug,
      title_telugu: sanitizeTeluguText(item.title_telugu || ""),
      title_english: item.title_english || item.title || "",
      category,
      content_lines: sanitizeLines(item.content_lines || item.contentLines || []),
      pdfLink: item.pdfLink || null,
    };
  };

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

  // 4. Load and merge Brihat Stotra Ratnakar stotrams
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const brihatStotrams = require("./brihat-stotrams.json") as RawStotramItem[];
    brihatStotrams.forEach((item) => {
      const existingIndex = stotrams.findIndex((s) => s.id === item.id);
      const mapped = mapItem(item);
      if (existingIndex > -1) {
        stotrams[existingIndex] = mapped;
      } else {
        stotrams.push(mapped);
      }
    });
  } catch {}

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
