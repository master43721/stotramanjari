/**
 * Telugu and Sanskrit Unicode Text Sanitizer
 * Fixes rendering artifacts that cause missing glyph rectangles (tofu) and dotted circles (U+25CC)
 * in web browsers and mobile devices.
 */

const VOWEL_MAP: Record<string, string> = {
  "\u0C05": "\u0C2E",             // అ -> మ
  "\u0C06": "\u0C2E\u0C3E",       // ఆ -> మా
  "\u0C07": "\u0C2E\u0C3F",       // ఇ -> మి
  "\u0C08": "\u0C2E\u0C40",       // ఈ -> మీ
  "\u0C09": "\u0C2E\u0C41",       // ఉ -> ము
  "\u0C0A": "\u0C2E\u0C42",       // ఊ -> మూ
  "\u0C0B": "\u0C2E\u0C43",       // ఋ -> మృ
  "\u0C60": "\u0C2E\u0C44",       // ౠ -> మౄ
  "\u0C0E": "\u0C2E\u0C46",       // ఎ -> మె
  "\u0C0F": "\u0C2E\u0C47",       // ఏ -> మే
  "\u0C10": "\u0C2E\u0C48",       // ఐ -> మై
  "\u0C12": "\u0C2E\u0C4A",       // ఒ -> మొ
  "\u0C13": "\u0C2E\u0C4B",       // ఓ -> మో
  "\u0C14": "\u0C2E\u0C4C",       // ఔ -> మౌ
};

export function sanitizeTeluguText(text: string): string {
  if (!text) return text;

  let cleaned = text;

  // 1. Remove all PUA, surrogate, and non-standard high plane 12-16 characters that render as tofu rectangles
  cleaned = cleaned.replace(/[\uD800-\uDFFF\uE000-\uF8FF\u{C0000}-\u{10FFFD}]/gu, "");

  // 2. Remove corrupted symbols and mojibake
  cleaned = cleaned.replace(/[¶þìýíû]/g, "");

  // 3. Fix specific known OCR / copy-paste corrupted words
  cleaned = cleaned.replace(/నమత్సరариనిర్జరం/g, "నమత్సురారి నిర్జరం");
  cleaned = cleaned.replace(/బుద్ధ్యా‌உత్మనా/g, "బుద్ధ్యాఽత్మనా");
  cleaned = cleaned.replace(/ఝ్āంబవతా/g, "జాంబవతా");

  // 4. Map Devanagari candrabindu U+0901 to Telugu candrabindu U+0C01
  cleaned = cleaned.replace(/\u0901/g, "\u0C01");

  // 5. Replace Vedic double svarita U+1CDA with standard double udatta U+0951\u0951
  cleaned = cleaned.replace(/\u1CDA/g, "\u0951\u0951");

  // 6. Replace Devanagari Atisvara U+A8F3 with standard Telugu Vedic gum anusvara
  cleaned = cleaned.replace(/\uA8F3/g, "గ్ం");

  // 7. Fix known leading anusvara corruptions
  cleaned = cleaned.replace(/^\u0C02ధకార/g, "అంధకార");
  cleaned = cleaned.replace(/\s\u0C02ధకార/g, " అంధకార");

  // 8. Fix OCR corruption where 'మ' (Ma) was split into Anusvara ం + independent vowel
  cleaned = cleaned.replace(/\u0C02([\u0951\u0952]*)([\u0C05-\u0C14\u0C60])/gu, (_match, tones, vowel) => {
    const base = VOWEL_MAP[vowel] || ("\u0C2E" + vowel);
    return base + (tones || "");
  });

  // 9. Fix hyphen/punctuation before combining marks (e.g. "విధర్మ-ంజనయన్" -> "విధర్మం-జనయన్", "’ం" -> "ం’")
  cleaned = cleaned.replace(/([^\s\p{P}])\s*-\s*([\u0C00-\u0C03])/gu, "$1$2-");
  cleaned = cleaned.replace(/’\u0C02/g, "\u0C02’");

  // 10. Fix pre-consonant / pre-vowel candrabindu (e.g. " ఁలో" -> " లోఀ", " ఁవా" -> " వాఀ", "^ఀయా" -> "యాఀ")
  // In Telugu script, combining candrabindu MUST follow the base consonant/vowel cluster.
  cleaned = cleaned.replace(/(^|[\s\p{P}])([ఁఀ])([\u0C05-\u0C39\u0C58-\u0C61][\u0C3E-\u0C4D\u0C55\u0C56\u0951\u0952]*)/gu, "$1$3\u0C00");

  // 11. Fix orphan candrabindu before danda or at end of line / punctuation (e.g. "శం-యోః ఁ।" -> "శం-యోః ।")
  cleaned = cleaned.replace(/\s+[ఁఀ]+(?=[\s।॥\p{P}]|$)/gu, "");
  cleaned = cleaned.replace(/[-–—][ఁఀ]+(?=[\s।॥\p{P}]|$)/gu, "");

  // 12. Fix space before udatta/anudatta Vedic tones (e.g. "సం​విఀ ॑శేమ" -> "సం​విఀ॑శేమ", "శు॒క్ర ॑ఇవ॒" -> "శు॒క్ర॑ ఇవ॒")
  cleaned = cleaned.replace(/([^\s\p{P}])\s+([\u0951\u0952]+)([^\s\p{P}])/gu, "$1$2 $3");
  cleaned = cleaned.replace(/([^\s\p{P}])\s+([\u0951\u0952]+)(?=\s|[\p{P}]|$)/gu, "$1$2");

  // 13. Fix space before anusvara/visarga that causes font shaping engines to insert dotted circles
  cleaned = cleaned.replace(/([^\s\p{P}])\s+\u0C02([^\s])/gu, "$1\u0C02 $2");
  cleaned = cleaned.replace(/([^\s\p{P}])\s+\u0C02(\s|$)/gu, "$1\u0C02$2");
  cleaned = cleaned.replace(/([^\s\p{P}])\s+\u0C03/gu, "$1\u0C03 ");

  // 14. Fix remaining orphan combining marks (vowel signs, viramas, anusvaras preceded by whitespace or start of line)
  cleaned = cleaned.replace(/(^|\s)\u0C02([^\s])/gu, "$1మ$2");
  cleaned = cleaned.replace(/(^|\s)[\u0C00-\u0C03](?=\s|$)/gu, "$1");
  cleaned = cleaned.replace(/(^|\s)([\u0C3E-\u0C4D\u0C55\u0C56])/gu, "$1");

  return cleaned;
}

export function sanitizeLines(lines: string[]): string[] {
  if (!Array.isArray(lines)) return [];
  return lines.map((l) => sanitizeTeluguText(l));
}
