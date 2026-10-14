/**
 * Offline Brahmic Multi-Script Transliteration Engine
 * Supports Telugu, Devanagari, Kannada, Tamil, and IAST (Roman)
 */

import { sanitizeTeluguText } from "./sanitizeTelugu";

export type SupportedScript = "telugu" | "devanagari" | "kannada" | "tamil" | "iast";

// Canonical token maps
interface ScriptScheme {
  vowels: string[];
  vowelMarks: string[];
  consonants: string[];
  other: {
    virama: string;
    anusvara: string;
    visarga: string;
    avagraha: string;
    candrabindu?: string;
  };
  digits: string[];
}

const SCHEMES: Record<"devanagari" | "telugu" | "kannada" | "tamil", ScriptScheme> = {
  devanagari: {
    vowels: [
      "अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ॠ", "ऌ", "ॡ",
      "ए", "ऐ", "ओ", "औ", "ऍ", "ऑ"
    ],
    vowelMarks: [
      "", "ा", "ि", "ी", "ु", "ू", "ृ", "ॄ", "ॢ", "ॣ",
      "े", "ै", "ो", "ौ", "ॅ", "ॉ"
    ],
    consonants: [
      "क", "ख", "ग", "घ", "ङ",
      "च", "छ", "ज", "झ", "ञ",
      "ट", "ठ", "ड", "ढ", "ण",
      "त", "थ", "द", "ध", "न",
      "प", "फ", "ब", "भ", "म",
      "य", "र", "ल", "व",
      "श", "ष", "स", "ह",
      "ळ", "क्ष", "ज्ञ"
    ],
    other: {
      virama: "्",
      anusvara: "ं",
      visarga: "ः",
      avagraha: "ऽ",
      candrabindu: "ँ",
    },
    digits: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
  },
  telugu: {
    vowels: [
      "అ", "ఆ", "ఇ", "ఈ", "ఉ", "ఊ", "ఋ", "ౠ", "ఌ", "ౡ",
      "ఏ", "ఐ", "ఓ", "ఔ", "ఎ", "ఒ"
    ],
    vowelMarks: [
      "", "ా", "ి", "ీ", "ు", "ూ", "ృ", "ౄ", "ౢ", "ౣ",
      "ే", "ై", "ో", "ౌ", "ె", "ొ"
    ],
    consonants: [
      "క", "ఖ", "గ", "ఘ", "ఙ",
      "చ", "ఛ", "జ", "ఝ", "ఞ",
      "ట", "ఠ", "డ", "ఢ", "ణ",
      "త", "థ", "ద", "ధ", "న",
      "ప", "ఫ", "బ", "భ", "మ",
      "య", "ర", "ల", "వ",
      "శ", "ష", "స", "హ",
      "ళ", "క్ష", "జ్ఞ"
    ],
    other: {
      virama: "్",
      anusvara: "ం",
      visarga: "ః",
      avagraha: "ఽ",
      candrabindu: "ఁ",
    },
    digits: ["౦", "౧", "౨", "౩", "౪", "౫", "౬", "౭", "౮", "౯"],
  },
  kannada: {
    vowels: [
      "ಅ", "ಆ", "ಇ", "ಈ", "ಉ", "ಊ", "ಋ", "ೠ", "ಌ", "ೡ",
      "ಏ", "ಐ", "ಓ", "ಔ", "ಎ", "ಒ"
    ],
    vowelMarks: [
      "", "ಾ", "ಿ", "ೀ", "ು", "ೂ", "ೃ", "ೄ", "ೢ", "ೣ",
      "ೇ", "ೈ", "ೋ", "ೌ", "ೆ", "ೊ"
    ],
    consonants: [
      "ಕ", "ಖ", "ಗ", "ಘ", "ಙ",
      "ಚ", "ಛ", "ಜ", "ಝ", "ಞ",
      "ಟ", "ಠ", "ಡ", "ಢ", "ಣ",
      "ತ", "ಥ", "ದ", "ಧ", "ನ",
      "ಪ", "ಫ", "ಬ", "ಭ", "ಮ",
      "ಯ", "ರ", "ಲ", "ವ",
      "ಶ", "ಷ", "ಸ", "ಹ",
      "ಳ", "ಕ್ಷ", "ಜ್ಞ"
    ],
    other: {
      virama: "್",
      anusvara: "ಂ",
      visarga: "ಃ",
      avagraha: "ಽ",
      candrabindu: "ँ",
    },
    digits: ["೦", "೧", "೨", "೩", "೪", "೫", "೬", "೭", "೮", "೯"],
  },
  tamil: {
    vowels: [
      "அ", "ஆ", "இ", "ஈ", "உ", "ஊ", "ரி", "ரீ", "லி", "லீ",
      "ஏ", "ஐ", "ஓ", "ஔ", "எ", "ஒ"
    ],
    vowelMarks: [
      "", "ா", "ி", "ீ", "ு", "ூ", "்ரி", "்ரீ", "்லி", "்லீ",
      "ே", "ை", "ோ", "ௌ", "ெ", "ொ"
    ],
    consonants: [
      "க", "க", "க", "க", "ங",
      "ச", "ச", "ஜ", "ஜ", "ஞ",
      "ட", "ட", "ட", "ட", "ண",
      "த", "த", "த", "த", "ந",
      "ப", "ப", "ப", "ப", "ம",
      "ய", "ர", "ல", "வ",
      "ஶ", "ஷ", "ஸ", "ஹ",
      "ள", "க்ஷ", "ஜ்ஞ"
    ],
    other: {
      virama: "்",
      anusvara: "ம்",
      visarga: "ஃ",
      avagraha: "’",
      candrabindu: "",
    },
    digits: ["௦", "௧", "௨", "௩", "௪", "௫", "௬", "௭", "௮", "௯"],
  },
};

const IAST_MAP = {
  vowels: [
    "a", "ā", "i", "ī", "u", "ū", "ṛ", "ṝ", "ḷ", "ḹ",
    "e", "ai", "o", "au", "e", "o"
  ],
  vowelMarks: [
    "a", "ā", "i", "ī", "u", "ū", "ṛ", "ṝ", "ḷ", "ḹ",
    "e", "ai", "o", "au", "e", "o"
  ],
  consonants: [
    "k", "kh", "g", "gh", "ṅ",
    "c", "ch", "j", "jh", "ñ",
    "ṭ", "ṭh", "ḍ", "ḍh", "ṇ",
    "t", "th", "d", "dh", "n",
    "p", "ph", "b", "bh", "m",
    "y", "r", "l", "v",
    "ś", "ṣ", "s", "h",
    "ḻ", "kṣ", "jñ"
  ],
  other: {
    virama: "",
    anusvara: "ṃ",
    visarga: "ḥ",
    avagraha: "'",
  },
  digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
};

/**
 * Detect script of a given text sample
 */
export function detectScript(text: string): SupportedScript {
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code >= 0x0c00 && code <= 0x0c7f) return "telugu";
    if (code >= 0x0900 && code <= 0x097f) return "devanagari";
    if (code >= 0x0c80 && code <= 0x0cff) return "kannada";
    if (code >= 0x0b80 && code <= 0x0bff) return "tamil";
  }
  return "telugu";
}

/**
 * Convert Telugu text to Devanagari Unicode
 */
function teluguToDevanagari(text: string): string {
  const result: string[] = [];
  const telScheme = SCHEMES.telugu;
  const devScheme = SCHEMES.devanagari;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    // Check vowels
    const vIdx = telScheme.vowels.indexOf(char);
    if (vIdx !== -1) {
      result.push(devScheme.vowels[vIdx] || char);
      continue;
    }

    // Check vowel marks
    const vmIdx = telScheme.vowelMarks.indexOf(char);
    if (vmIdx > 0) {
      result.push(devScheme.vowelMarks[vmIdx] || char);
      continue;
    }

    // Check consonants
    const cIdx = telScheme.consonants.indexOf(char);
    if (cIdx !== -1) {
      result.push(devScheme.consonants[cIdx] || char);
      continue;
    }

    // Check other symbols
    if (char === telScheme.other.virama) {
      result.push(devScheme.other.virama);
      continue;
    }
    if (char === telScheme.other.anusvara) {
      result.push(devScheme.other.anusvara);
      continue;
    }
    if (char === telScheme.other.visarga) {
      result.push(devScheme.other.visarga);
      continue;
    }
    if (char === telScheme.other.avagraha) {
      result.push(devScheme.other.avagraha);
      continue;
    }
    if (char === telScheme.other.candrabindu) {
      result.push(devScheme.other.candrabindu || "");
      continue;
    }

    // Check digits
    const dIdx = telScheme.digits.indexOf(char);
    if (dIdx !== -1) {
      result.push(devScheme.digits[dIdx]);
      continue;
    }

    // Common Telugu vowel signs that may be composite
    if (char === "ై") {
      result.push(devScheme.vowelMarks[11]); // ai
      continue;
    }
    if (char === "ౌ") {
      result.push(devScheme.vowelMarks[13]); // au
      continue;
    }

    result.push(char);
  }

  return result.join("");
}

/**
 * Convert Devanagari text to target Indic script (Telugu, Kannada, Tamil)
 */
function devanagariToIndic(text: string, targetScript: "telugu" | "kannada" | "tamil"): string {
  const result: string[] = [];
  const devScheme = SCHEMES.devanagari;
  const tgtScheme = SCHEMES[targetScript];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    // Check vowels
    const vIdx = devScheme.vowels.indexOf(char);
    if (vIdx !== -1) {
      result.push(tgtScheme.vowels[vIdx] || char);
      continue;
    }

    // Check vowel marks
    const vmIdx = devScheme.vowelMarks.indexOf(char);
    if (vmIdx > 0) {
      result.push(tgtScheme.vowelMarks[vmIdx] || char);
      continue;
    }

    // Check consonants
    const cIdx = devScheme.consonants.indexOf(char);
    if (cIdx !== -1) {
      result.push(tgtScheme.consonants[cIdx] || char);
      continue;
    }

    // Check others
    if (char === devScheme.other.virama) {
      result.push(tgtScheme.other.virama);
      continue;
    }
    if (char === devScheme.other.anusvara) {
      result.push(tgtScheme.other.anusvara);
      continue;
    }
    if (char === devScheme.other.visarga) {
      result.push(tgtScheme.other.visarga);
      continue;
    }
    if (char === devScheme.other.avagraha) {
      result.push(tgtScheme.other.avagraha);
      continue;
    }
    if (char === devScheme.other.candrabindu) {
      result.push(tgtScheme.other.candrabindu || "");
      continue;
    }

    // Check digits
    const dIdx = devScheme.digits.indexOf(char);
    if (dIdx !== -1) {
      result.push(tgtScheme.digits[dIdx]);
      continue;
    }

    result.push(char);
  }

  return result.join("");
}

/**
 * Convert Telugu text directly to IAST Roman
 */
export function teluguToIAST(text: string): string {
  const devanagari = teluguToDevanagari(text);
  return devanagariToIAST(devanagari);
}

/**
 * Convert Devanagari text to IAST Roman
 */
function devanagariToIAST(text: string): string {
  const result: string[] = [];
  const devScheme = SCHEMES.devanagari;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1] || "";

    // Vowel
    const vIdx = devScheme.vowels.indexOf(char);
    if (vIdx !== -1) {
      result.push(IAST_MAP.vowels[vIdx]);
      continue;
    }

    // Consonant
    const cIdx = devScheme.consonants.indexOf(char);
    if (cIdx !== -1) {
      const baseRom = IAST_MAP.consonants[cIdx];
      // Check next char for virama or matra
      if (nextChar === devScheme.other.virama) {
        result.push(baseRom);
        i++; // skip virama
      } else {
        const vmIdx = devScheme.vowelMarks.indexOf(nextChar);
        if (vmIdx > 0) {
          result.push(baseRom + IAST_MAP.vowelMarks[vmIdx]);
          i++; // skip matra
        } else {
          // inherent 'a'
          result.push(baseRom + "a");
        }
      }
      continue;
    }

    // Anusvara
    if (char === devScheme.other.anusvara) {
      result.push(IAST_MAP.other.anusvara);
      continue;
    }

    // Visarga
    if (char === devScheme.other.visarga) {
      result.push(IAST_MAP.other.visarga);
      continue;
    }

    // Avagraha
    if (char === devScheme.other.avagraha) {
      result.push(IAST_MAP.other.avagraha);
      continue;
    }

    // Digits
    const dIdx = devScheme.digits.indexOf(char);
    if (dIdx !== -1) {
      result.push(IAST_MAP.digits[dIdx]);
      continue;
    }

    // Pass through punctuation (॥, ।, |, etc.)
    result.push(char);
  }

  return result.join("");
}


/**
 * Transliterate input text from source script (auto-detected if omitted) to targetScript
 */
export function transliterate(text: string, targetScript: SupportedScript): string {
  if (!text) return "";
  const cleanedText = sanitizeTeluguText(text);
  const source = detectScript(cleanedText);
  if (source === targetScript) return cleanedText;

  // Step 1: Normalize source to Devanagari intermediate
  let devText = cleanedText;
  if (source === "telugu") {
    devText = teluguToDevanagari(cleanedText);
  } else if (source === "kannada") {
    // Convert kannada -> devanagari by reverse mapping
    const res: string[] = [];
    const kn = SCHEMES.kannada;
    const dv = SCHEMES.devanagari;
    for (const c of text) {
      const v = kn.vowels.indexOf(c);
      if (v !== -1) { res.push(dv.vowels[v]); continue; }
      const vm = kn.vowelMarks.indexOf(c);
      if (vm > 0) { res.push(dv.vowelMarks[vm]); continue; }
      const cn = kn.consonants.indexOf(c);
      if (cn !== -1) { res.push(dv.consonants[cn]); continue; }
      if (c === kn.other.virama) { res.push(dv.other.virama); continue; }
      if (c === kn.other.anusvara) { res.push(dv.other.anusvara); continue; }
      if (c === kn.other.visarga) { res.push(dv.other.visarga); continue; }
      res.push(c);
    }
    devText = res.join("");
  }

  // Step 2: Convert Devanagari intermediate to target
  if (targetScript === "devanagari") return devText;
  if (targetScript === "iast") return devanagariToIAST(devText);
  if (targetScript === "telugu") return devanagariToIndic(devText, "telugu");
  if (targetScript === "kannada") return devanagariToIndic(devText, "kannada");
  if (targetScript === "tamil") return devanagariToIndic(devText, "tamil");

  return text;
}
