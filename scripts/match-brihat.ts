import * as fs from "fs";
import * as path from "path";
import { transliterate } from "../src/lib/sanscript";

interface BrihatItem {
  num: number;
  section: string;
  sectionNum: number;
  titleDevanagari: string;
  page: number;
  titleTelugu: string;
  titleIast: string;
}

interface StotramIndex {
  id: string;
  slug: string;
  title_telugu: string;
  title_english: string;
  category: string;
}

function normalizeStr(str: string): string {
  return str
    .toLowerCase()
    .replace(/[\s\-_.,'\"\[\]\(\):;0-9]/g, "")
    .replace(/[శషస]/g, "స")
    .replace(/[ణన]/g, "న")
    .replace(/[లళ]/g, "ల")
    .replace(/ం/g, "మ")
    .replace(/ః/g, "")
    .trim();
}

function normalizeEnglish(str: string): string {
  return str
    .toLowerCase()
    .replace(/[\s\-_.,'\"\[\]\(\):;0-9]/g, "")
    .replace(/sh/g, "s")
    .replace(/th/g, "t")
    .replace(/v/g, "w")
    .replace(/b/g, "v")
    .replace(/stotra(m)?/g, "")
    .replace(/ashtaka(m)?/g, "")
    .replace(/kavacha(m)?/g, "")
    .replace(/sri/g, "")
    .trim();
}

function main() {
  const catalog: BrihatItem[] = JSON.parse(fs.readFileSync(path.resolve("./scripts/brihat_catalog.json"), "utf8"));
  const index: StotramIndex[] = JSON.parse(fs.readFileSync(path.resolve("./src/data/stotrams-index.json"), "utf8"));

  const matched: Array<{ brihat: BrihatItem; indexItem: StotramIndex; matchType: string }> = [];
  const unmatched: BrihatItem[] = [];

  const indexMapByTeluguNorm = new Map<string, StotramIndex>();
  const indexMapBySlugNorm = new Map<string, StotramIndex>();

  for (const item of index) {
    indexMapByTeluguNorm.set(normalizeStr(item.title_telugu), item);
    indexMapBySlugNorm.set(normalizeEnglish(item.slug || item.id), item);
    indexMapBySlugNorm.set(normalizeEnglish(item.title_english || ""), item);
  }

  for (const b of catalog) {
    const normTel = normalizeStr(b.titleTelugu);
    const normIast = normalizeEnglish(b.titleIast);
    const normDev = normalizeEnglish(b.titleDevanagari);

    let found: StotramIndex | undefined;
    let matchType = "";

    // 1. Direct normalized Telugu match
    if (indexMapByTeluguNorm.has(normTel)) {
      found = indexMapByTeluguNorm.get(normTel);
      matchType = "exact-telugu";
    }

    // 2. Substring matching in Telugu
    if (!found) {
      for (const item of index) {
        const itemNormTel = normalizeStr(item.title_telugu);
        if (normTel.length > 5 && (itemNormTel.includes(normTel) || normTel.includes(itemNormTel))) {
          found = item;
          matchType = "sub-telugu";
          break;
        }
      }
    }

    // 3. IAST / English slug match
    if (!found) {
      if (indexMapBySlugNorm.has(normIast)) {
        found = indexMapBySlugNorm.get(normIast);
        matchType = "exact-iast";
      }
    }

    // 4. Substring English / IAST match
    if (!found) {
      for (const item of index) {
        const itemNormEng = normalizeEnglish(item.slug || item.title_english || "");
        if (normIast.length > 5 && itemNormEng.length > 5 && (itemNormEng.includes(normIast) || normIast.includes(itemNormEng))) {
          found = item;
          matchType = "sub-iast";
          break;
        }
      }
    }

    if (found) {
      matched.push({ brihat: b, indexItem: found, matchType });
    } else {
      unmatched.push(b);
    }
  }

  console.log(`Total Brihat items: ${catalog.length}`);
  console.log(`Matched existing website stotras: ${matched.length}`);
  console.log(`Unmatched (new stotras to add): ${unmatched.length}`);

  fs.writeFileSync(
    path.resolve("./scripts/match_results.json"),
    JSON.stringify({ matched, unmatched }, null, 2),
    "utf8"
  );
  console.log("Saved scripts/match_results.json.");
}

main();
