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

  // 1. Remove Private Use Area (PUA) characters that render as tofu rectangles
  cleaned = cleaned.replace(/[\uE000-\uF8FF\u{F0000}-\u{FFFFD}\u{100000}-\u{10FFFD}]/gu, "");

  // 2. Remove corrupted symbols and mojibake
  cleaned = cleaned.replace(/[¶þìýíû]/g, "");

  // 3. Replace Vedic double svarita U+1CDA with standard double udatta U+0951\u0951.
  // Standard fonts lack U+1CDA (rendering rectangles), whereas U+0951\u0951 renders accurately on all platforms.
  cleaned = cleaned.replace(/\u1CDA/g, "\u0951\u0951");

  // 4. Replace Devanagari Atisvara U+A8F3 with standard Telugu Vedic gum anusvara
  cleaned = cleaned.replace(/\uA8F3/g, "గ్ం");

  // 5. Fix known leading anusvara corruptions
  cleaned = cleaned.replace(/^\u0C02ధకార/g, "అంధకార");
  cleaned = cleaned.replace(/\s\u0C02ధకార/g, " అంధకార");

  // 6. Fix OCR corruption where 'మ' (Ma) was split into Anusvara ం + independent vowel
  cleaned = cleaned.replace(/\u0C02([\u0951\u0952]*)([\u0C05-\u0C14\u0C60])/gu, (_match, tones, vowel) => {
    const base = VOWEL_MAP[vowel] || ("\u0C2E" + vowel);
    return base + (tones || "");
  });

  // 7. Fix space before anusvara/visarga that causes font shaping engines to insert dotted circles:
  // e.g. "నేత్రము ందివియంగా" -> "నేత్రముం దివియంగా"
  cleaned = cleaned.replace(/([^\s\p{P}])\s+\u0C02([^\s])/gu, "$1\u0C02 $2");
  cleaned = cleaned.replace(/([^\s\p{P}])\s+\u0C02(\s|$)/gu, "$1\u0C02$2");
  cleaned = cleaned.replace(/([^\s\p{P}])\s+\u0C03/gu, "$1\u0C03 ");

  // 8. Fix space before candrabindu U+0C00
  cleaned = cleaned.replace(/\s+\u0C00/g, " \u0C01");

  // 9. Fix remaining orphan combining marks (vowel signs, viramas, anusvaras preceded by whitespace or start of line)
  // Ensures font rendering engines never insert dotted circles (U+25CC)
  cleaned = cleaned.replace(/(^|\s)\u0C02([^\s])/gu, "$1మ$2");
  cleaned = cleaned.replace(/(^|\s)[\u0C00\u0C02\u0C03](?=\s|$)/gu, "$1");
  cleaned = cleaned.replace(/(^|\s)([\u0C3E-\u0C4D\u0C55\u0C56])/gu, "$1అ$2");

  return cleaned;
}

export function sanitizeLines(lines: string[]): string[] {
  if (!Array.isArray(lines)) return [];
  return lines.map((l) => sanitizeTeluguText(l));
}
