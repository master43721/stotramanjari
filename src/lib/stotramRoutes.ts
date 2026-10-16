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

/** The single, canonical indexable URL for a stotram. */
export function stotramPath(stotram: { category?: string; slug?: string; id?: string }): string {
  const slug = stotram.slug || stotram.id || "";
  let cat = stotram.category || "devotional";
  if (cat === "telugu") {
    cat = TELUGU_CATEGORY_MAP[slug] || "devotional";
  }
  return `/${cat}/${slug}`;
}
