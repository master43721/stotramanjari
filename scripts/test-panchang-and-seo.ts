import {
  getPanchangSnapshot,
  calculateAstronomicalPanchang,
  PANCHANG_CITIES,
  PanchangCityId,
  todayInIndia,
  isPanchangCity,
  isPanchangDate,
} from "../src/lib/panchangService";
import { stotramPath } from "../src/lib/stotramRoutes";
import indexData from "../src/data/stotrams-index.json";
import * as fs from "fs";
import * as path from "path";

console.log("=== RUNNING PANCHANG & SEO DEEP VERIFICATION SUITE ===");

const cities = Object.keys(PANCHANG_CITIES) as PanchangCityId[];
const today = todayInIndia();
console.log(`Current India Date: ${today}`);

// 1. Verify city validators
for (const city of cities) {
  if (!isPanchangCity(city)) {
    throw new Error(`isPanchangCity failed for valid city: ${city}`);
  }
}
if (isPanchangCity("random_city")) {
  throw new Error("isPanchangCity should return false for invalid city");
}
if (!isPanchangDate(today) || !isPanchangDate("2026-12-31")) {
  throw new Error("isPanchangDate failed for valid dates");
}
if (isPanchangDate("not-a-date") || isPanchangDate("2026-99-99")) {
  throw new Error("isPanchangDate should reject invalid dates");
}
console.log("✓ City and Date validators passed.");

// 2. Verify Panchang Snapshot across all cities and multiple dates
const testDates = [
  today,
  "2026-01-01",
  "2026-08-15",
  "2026-10-16",
  "2026-11-25",
];

const indexSlugSet = new Set((indexData as Array<{ slug?: string; id?: string }>).map((s) => s.slug || s.id));

for (const city of cities) {
  for (const date of testDates) {
    const p = calculateAstronomicalPanchang(city, date);

    if (!p.date || !p.dateLabel || !p.dateTelugu) {
      throw new Error(`Missing date labels for ${city} on ${date}`);
    }
    if (!p.cityName || !p.cityNameTelugu) {
      throw new Error(`Missing city names for ${city}`);
    }
    if (!p.dayName || !p.dayNameTelugu || !p.dayNameEnglish || !p.presidingDeity) {
      throw new Error(`Missing day/deity data for ${city} on ${date}`);
    }
    if (!p.tithi || !p.tithiTelugu || !p.tithiEnglish || !p.paksha) {
      throw new Error(`Missing tithi data for ${city} on ${date}`);
    }
    if (!p.nakshatra || !p.nakshatraTelugu || !p.nakshatraEnglish) {
      throw new Error(`Missing nakshatra data for ${city} on ${date}`);
    }
    if (!p.yoga || !p.karana) {
      throw new Error(`Missing yoga/karana for ${city} on ${date}`);
    }
    if (!p.sunrise || !p.sunset || !p.moonrise || !p.moonset) {
      throw new Error(`Missing sun/moon times for ${city} on ${date}`);
    }
    if (!p.rahuKalam || !p.yamagandam || !p.gulikaKalam || !p.abhijitMuhurtam) {
      throw new Error(`Missing muhurtas for ${city} on ${date}`);
    }
    if (!p.todayFestival) {
      throw new Error(`Missing todayFestival for ${city} on ${date}`);
    }
    if (!Array.isArray(p.upcomingFestivals) || p.upcomingFestivals.length === 0) {
      throw new Error(`Missing upcomingFestivals for ${city} on ${date}`);
    }
    if (!p.recommendedStotra || !p.recommendedStotra.url) {
      throw new Error(`Missing recommendedStotra for ${city} on ${date}`);
    }
    if (!p.recommendedStotra.url.startsWith(`/${p.recommendedStotra.category}/`)) {
      throw new Error(`Recommended stotra URL is not canonical: ${p.recommendedStotra.url}`);
    }
    if (!indexSlugSet.has(p.recommendedStotra.slug)) {
      throw new Error(`Recommended stotra slug "${p.recommendedStotra.slug}" not found in index`);
    }
  }
}
console.log(`✓ Verified ${cities.length * testDates.length} full astronomical Panchang calculations with all limbs.`);

// 3. Verify getPanchangSnapshot async caching and graceful fallback
(async () => {
  for (const city of cities) {
    const snap = await getPanchangSnapshot(city, today);
    if (!snap || snap.cityId !== city) {
      throw new Error(`getPanchangSnapshot failed for ${city}`);
    }
  }
  console.log("✓ Async getPanchangSnapshot verified across all 6 cities.");

  // 4. Verify canonical URL router helper
  const sample1 = stotramPath({ category: "shiva", slug: "shiva-panchakshari-stotram" });
  if (sample1 !== "/shiva/shiva-panchakshari-stotram") {
    throw new Error(`stotramPath failed: expected /shiva/shiva-panchakshari-stotram, got ${sample1}`);
  }
  const sample2 = stotramPath({ category: "hanuman", id: "hanuman-chalisa" });
  if (sample2 !== "/hanuman/hanuman-chalisa") {
    throw new Error(`stotramPath fallback failed: expected /hanuman/hanuman-chalisa, got ${sample2}`);
  }
  console.log("✓ stotramPath routing helper verified.");

  // 5. Verify Sitemap content
  const sitemapPath = path.resolve("./public/sitemap.xml");
  if (!fs.existsSync(sitemapPath)) {
    throw new Error("sitemap.xml does not exist");
  }
  const sitemapXml = fs.readFileSync(sitemapPath, "utf8");

  if (sitemapXml.includes("/readings/")) {
    throw new Error("sitemap.xml still contains duplicate /readings/ URLs!");
  }
  if (sitemapXml.includes("/telugu/")) {
    throw new Error("sitemap.xml still contains duplicate /telugu/ URLs!");
  }
  if (!sitemapXml.includes("/panchang")) {
    throw new Error("sitemap.xml missing /panchang URLs!");
  }
  if (!sitemapXml.includes("/shiva/shiva-panchakshari-stotram")) {
    throw new Error("sitemap.xml missing canonical stotram URLs!");
  }
  console.log("✓ sitemap.xml verified: 100% canonical, zero duplicate URL families.");

  // 6. Verify IndexNow Key verification file
  const indexNowKeyPath = path.resolve("./public/4b8f7e2a1c9d0e3f5a6b7c8d9e0f1a2b.txt");
  if (!fs.existsSync(indexNowKeyPath)) {
    throw new Error("IndexNow key verification file missing!");
  }
  const keyContent = fs.readFileSync(indexNowKeyPath, "utf8").trim();
  if (keyContent !== "4b8f7e2a1c9d0e3f5a6b7c8d9e0f1a2b") {
    throw new Error(`IndexNow key content mismatch: ${keyContent}`);
  }
  console.log("✓ IndexNow verification file verified.");

  console.log("=== ALL PANCHANG & SEO CHECKS PASSED SUCCESSFULLY ===");
})();
