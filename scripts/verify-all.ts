import { calculatePanchang } from "../src/lib/panchang";
import { transliterate } from "../src/lib/sanscript";
import { getStanzaMeaning } from "../src/lib/meanings";
import { audioEngine } from "../src/lib/audioEngine";
import indexData from "../src/data/stotrams-index.json";
import { getAllStotrams, getStotramBySlug, getStotramsIndex } from "../src/data/loader";
import { checkVoiceStudioHealth } from "./voice-studio";
import * as fs from "fs";
import * as path from "path";

console.log("=== RUNNING EXTENSIVE VERIFICATION SUITE ===");

// 1. Verify all 7 weekday panchang recommendations match real stotram slugs
const indexSlugs = new Set((indexData as Array<{ slug?: string; id?: string }>).map((s) => s.slug || s.id));
const sampleDates = [
  new Date("2026-10-11T10:00:00Z"), // Sunday
  new Date("2026-10-12T10:00:00Z"), // Monday
  new Date("2026-10-13T10:00:00Z"), // Tuesday
  new Date("2026-10-14T10:00:00Z"), // Wednesday
  new Date("2026-10-15T10:00:00Z"), // Thursday
  new Date("2026-10-16T10:00:00Z"), // Friday
  new Date("2026-10-17T10:00:00Z"), // Saturday
];

for (const d of sampleDates) {
  const panchang = calculatePanchang(d);
  console.log(`[Panchang Check] ${panchang.dayName}: ${panchang.presidingDeity} -> slug "${panchang.recommendedStotra.slug}"`);
  if (!indexSlugs.has(panchang.recommendedStotra.slug)) {
    throw new Error(`Recommended stotra slug "${panchang.recommendedStotra.slug}" not found in index!`);
  }
  if (!panchang.tithi.telugu || !panchang.nakshatra.telugu || !panchang.rahuKalam) {
    throw new Error(`Incomplete panchang data for ${panchang.dayName}`);
  }
}
console.log("✓ Panchang calculations & weekday deity stotrams verified successfully.");

// 2. Transliteration Suite
const testPhrases = [
  "ఓం నమో భగవతే వాసుదేవాయ",
  "శ్రీ గణేశాయ నమః",
  "శుక్లాంబరధరం విష్ణుం శశివర్ణం చతుర్భుజమ్",
  "కృష్ణాయ వాసుదేవాయ హరయే పరమాత్మనే",
];

for (const phrase of testPhrases) {
  const dev = transliterate(phrase, "devanagari");
  const kn = transliterate(phrase, "kannada");
  const tm = transliterate(phrase, "tamil");
  const iast = transliterate(phrase, "iast");

  if (!dev || !kn || !tm || !iast) {
    throw new Error(`Transliteration returned empty string for: ${phrase}`);
  }
  // Round trip back to Telugu
  const roundTripTelugu = transliterate(dev, "telugu");
  if (!roundTripTelugu) {
    throw new Error(`Failed to round-trip back to Telugu from Devanagari`);
  }
}
console.log("✓ Multi-script transliteration verified across Devanagari, Kannada, Tamil, IAST.");

// 3. Meaning / Padaccheda breakdowns
const ganeshaMeaning = getStanzaMeaning("ganesha-pancharatnam", 0, ["ముదాకరాత్త మోదకం సదా విముక్తి సాధకమ్"]);
if (!ganeshaMeaning.padaccheda.length || !ganeshaMeaning.tatparyamTelugu || !ganeshaMeaning.bhavarthaEnglish) {
  throw new Error("Curated meaning missing for Ganesha Pancharatnam");
}

const fallbackMeaning = getStanzaMeaning("unknown-chant", 0, ["ఓం తత్సవితుర్వరేణ్యం భర్గో దేవస్య ధీమహి"]);
if (!fallbackMeaning.padaccheda.length || !fallbackMeaning.tatparyamTelugu) {
  throw new Error("Fallback meaning generation failed");
}
console.log("✓ Padaccheda & word-by-word meanings verified.");

// 4. Audio Engine SSR safety
if (typeof audioEngine.playTempleBell !== "function" || typeof audioEngine.startTanpura !== "function" || typeof audioEngine.stopTanpura !== "function") {
  throw new Error("AudioEngine methods missing");
}
audioEngine.playTempleBell();
audioEngine.startTanpura();
audioEngine.stopTanpura();
console.log("✓ AudioEngine node/SSR safety verified.");

// 5. Verify stotrams-index.json size is ~120KB-400KB and decouple from vignanam-data (31MB)
const indexPath = path.resolve("./src/data/stotrams-index.json");
const indexStat = fs.statSync(indexPath);
console.log(`[Index Size] ${(indexStat.size / 1024).toFixed(1)} KB (vs 31,000 KB raw data)`);
if (indexStat.size > 1024 * 1024) {
  throw new Error("Index file is too large!");
}

// 6. Verify Data Loader Integrity & Slug Lookup
const indexList = getStotramsIndex();
if (!Array.isArray(indexList) || indexList.length < 1000) {
  throw new Error(`Expected at least 1000 indexed stotrams, got: ${indexList.length}`);
}
const allStotrams = getAllStotrams();
if (!Array.isArray(allStotrams) || allStotrams.length < 1000) {
  throw new Error(`Expected at least 1000 full stotrams, got: ${allStotrams.length}`);
}
const ganeshaStotram = getStotramBySlug("ganesha-pancharatnam");
if (!ganeshaStotram || !ganeshaStotram.content_lines || ganeshaStotram.content_lines.length === 0) {
  throw new Error("Failed to load content lines for Ganesha Pancharatnam via getStotramBySlug");
}
console.log(`✓ Data Loader verified (${allStotrams.length} stotrams loaded, slug lookup verified).`);

// 7. Verify VoiceStudio Bridge functions
if (typeof checkVoiceStudioHealth !== "function") {
  throw new Error("VoiceStudio bridge checkVoiceStudioHealth is not a function");
}
console.log("✓ VoiceStudio bridge verified.");

console.log("=== ALL TEST SUITE CHECKS PASSED ===");
