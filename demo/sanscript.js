/**
 * Sanscript.js - Lightweight Brahmic & IAST Transliteration Engine
 * Supports Telugu, Devanagari, Kannada, Tamil, and IAST (Roman).
 * Self-contained, zero-dependency, works 100% offline.
 */
(function (global) {
  'use strict';

  var Sanscript = {};

  // Phonetic scheme definition
  var SCHEMES = {
    devanagari: {
      vowels: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ॠ', 'ऌ', 'ॡ', 'ए', 'ऐ', 'ओ', 'औ'],
      vowel_marks: ['ा', 'ि', 'ी', 'ु', 'ू', 'ृ', 'ॄ', 'ॢ', 'ॣ', 'े', 'ै', 'ो', 'ौ'],
      consonants: [
        'क', 'ख', 'ग', 'घ', 'ङ',
        'च', 'छ', 'ज', 'झ', 'ञ',
        'ट', 'ठ', 'ड', 'ढ', 'ण',
        'त', 'थ', 'द', 'ध', 'न',
        'प', 'फ', 'ब', 'भ', 'म',
        'य', 'र', 'ल', 'व',
        'श', 'ष', 'स', 'ह',
        'ळ', 'क्ष', 'ज्ञ'
      ],
      virama: '्',
      anusvara: 'ं',
      visarga: 'ः',
      avagraha: 'ऽ',
      danda: '।',
      double_danda: '॥'
    },

    telugu: {
      vowels: ['అ', 'ఆ', 'ఇ', 'ఈ', 'ఉ', 'ఊ', 'ఋ', 'ౠ', 'ఌ', 'ౡ', 'ఏ', 'ఐ', 'ఓ', 'ఔ'],
      vowel_marks: ['ా', 'ి', 'ీ', 'ు', 'ూ', 'ృ', 'ౄ', 'ౢ', 'ౣ', 'ే', 'ై', 'ో', 'ౌ'],
      consonants: [
        'క', 'ఖ', 'గ', 'ఘ', 'ఙ',
        'చ', 'ఛ', 'జ', 'ఝ', 'ఞ',
        'ట', 'ఠ', 'డ', 'ఢ', 'ణ',
        'త', 'థ', 'ద', 'ధ', 'న',
        'ప', 'ఫ', 'బ', 'భ', 'మ',
        'య', 'ర', 'ల', 'వ',
        'శ', 'ష', 'స', 'హ',
        'ళ', 'క్ష', 'జ్ఞ'
      ],
      virama: '్',
      anusvara: 'ం',
      visarga: 'ః',
      avagraha: 'ఽ',
      danda: '|',
      double_danda: '||'
    },

    kannada: {
      vowels: ['ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಋ', 'ೠ', 'ಌ', 'ೡ', 'ಏ', 'ಐ', 'ಓ', 'ಔ'],
      vowel_marks: ['ಾ', 'ಿ', 'ೀ', 'ು', 'ೂ', 'ೃ', 'ೄ', '಼', 'ಽ', 'ೇ', 'ೈ', 'ೋ', 'ೌ'],
      consonants: [
        'ಕ', 'ಖ', 'ಗ', 'ಘ', 'ಙ',
        'ಚ', 'ಛ', 'ಜ', 'ಝ', 'ಞ',
        'ಟ', 'ಠ', 'ಡ', 'ಢ', 'ಣ',
        'ತ', 'ಥ', 'ದ', 'ಧ', 'ನ',
        'ಪ', 'ಫ', 'ಬ', 'ಭ', 'ಮ',
        'ಯ', 'ರ', 'ಲ', 'ವ',
        'ಶ', 'ಷ', 'ಸ', 'ಹ',
        'ಳ', 'ಕ್ಷ', 'ಜ್ಞ'
      ],
      virama: '್',
      anusvara: 'ಂ',
      visarga: 'ಃ',
      avagraha: 'ಽ',
      danda: '|',
      double_danda: '||'
    },

    tamil: {
      vowels: ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'ரு', 'ரூ', 'லு', 'லூ', 'ஏ', 'ஐ', 'ஓ', 'ஔ'],
      vowel_marks: ['ா', 'ி', 'ீ', 'ு', 'ூ', '்ரு', '்ரூ', '்லு', '்லூ', 'ே', 'ை', 'ோ', 'ௌ'],
      consonants: [
        'க', 'க²', 'க³', 'க⁴', 'ங',
        'ச', 'ச²', 'ஜ', 'ஜ²', 'ஞ',
        'ட', 'ட²', 'ட³', 'ட⁴', 'ண',
        'த', 'த²', 'த³', 'த⁴', 'ந',
        'ப', 'ப²', 'ப³', 'ப⁴', 'ம',
        'ய', 'ர', 'ல', 'வ',
        'ஶ', 'ஷ', 'ஸ', 'ஹ',
        'ள', 'க்ஷ', 'ஜ்ஞ'
      ],
      virama: '்',
      anusvara: 'ம்',
      visarga: 'ஃ',
      avagraha: "'",
      danda: '|',
      double_danda: '||'
    },

    iast: {
      vowels: ['a', 'ā', 'i', 'ī', 'u', 'ū', 'ṛ', 'ṝ', 'ḷ', 'ḹ', 'e', 'ai', 'o', 'au'],
      vowel_marks: ['ā', 'i', 'ī', 'u', 'ū', 'ṛ', 'ṝ', 'ḷ', 'ḹ', 'e', 'ai', 'o', 'au'],
      consonants: [
        'ka', 'kha', 'ga', 'gha', 'ṅa',
        'ca', 'cha', 'ja', 'jha', 'ña',
        'ṭa', 'ṭha', 'ḍa', 'ḍha', 'ṇa',
        'ta', 'tha', 'da', 'dha', 'na',
        'pa', 'pha', 'ba', 'bha', 'ma',
        'ya', 'ra', 'la', 'va',
        'śa', 'ṣa', 'sa', 'ha',
        'ḷa', 'kṣa', 'jña'
      ],
      virama: '',
      anusvara: 'ṃ',
      visarga: 'ḥ',
      avagraha: "'",
      danda: '|',
      double_danda: '||'
    }
  };

  // Canonical token list ordered for phonological mapping
  var CANONICAL_VOWELS = ['a', 'aa', 'i', 'ii', 'u', 'uu', 'r', 'rr', 'l', 'll', 'e', 'ai', 'o', 'au'];
  var CANONICAL_CONSONANTS = [
    'k', 'kh', 'g', 'gh', 'ng',
    'c', 'ch', 'j', 'jh', 'ny',
    'tt', 'tth', 'dd', 'ddh', 'nn',
    't', 'th', 'd', 'dh', 'n',
    'p', 'ph', 'b', 'bh', 'm',
    'y', 'r_c', 'l_c', 'v',
    'sh_pal', 'sh_ret', 's', 'h',
    'll_c', 'ksh', 'jny'
  ];

  // Build bidirectional index maps for Brahmic scripts
  var scriptTokenMaps = {};

  Object.keys(SCHEMES).forEach(function (scriptName) {
    var s = SCHEMES[scriptName];
    var map = {
      vowelsToCan: {},
      marksToCan: {},
      consToCan: {},
      symbolsToCan: {},
      canToVowel: {},
      canToMark: {},
      canToCons: {}
    };

    CANONICAL_VOWELS.forEach(function (can, idx) {
      if (s.vowels[idx]) {
        map.vowelsToCan[s.vowels[idx]] = can;
        map.canToVowel[can] = s.vowels[idx];
      }
      if (idx > 0 && s.vowel_marks[idx - 1]) {
        map.marksToCan[s.vowel_marks[idx - 1]] = can;
        map.canToMark[can] = s.vowel_marks[idx - 1];
      }
    });

    CANONICAL_CONSONANTS.forEach(function (can, idx) {
      if (s.consonants[idx]) {
        map.consToCan[s.consonants[idx]] = can;
        map.canToCons[can] = s.consonants[idx];
      }
    });

    if (s.anusvara) map.symbolsToCan[s.anusvara] = 'M';
    if (s.visarga) map.symbolsToCan[s.visarga] = 'H';
    if (s.avagraha) map.symbolsToCan[s.avagraha] = 'AVAGRAHA';
    if (s.danda) map.symbolsToCan[s.danda] = '|';
    if (s.double_danda) map.symbolsToCan[s.double_danda] = '||';

    scriptTokenMaps[scriptName] = map;
  });

  // Fast direct character transliteration map between Brahmic scripts
  // Telugu Unicode range: 0x0C00 - 0x0C7F
  // Devanagari Unicode range: 0x0900 - 0x097F
  // Kannada Unicode range: 0x0C80 - 0x0CFF
  // Tamil Unicode range: 0x0B80 - 0x0BFF
  // Brahmic code points are largely aligned modulo 0x80 offset!
  
  function brahmicToBrahmicChar(charCode, fromBase, toBase) {
    var offset = charCode - fromBase;
    return String.fromCharCode(toBase + offset);
  }

  var BRAHMIC_BASES = {
    devanagari: 0x0900,
    telugu: 0x0C00,
    kannada: 0x0C80,
    tamil: 0x0B80
  };

  /**
   * High-accuracy phonetic transliteration
   */
  Sanscript.t = function (text, fromScript, toScript) {
    if (!text || fromScript === toScript) return text;

    fromScript = (fromScript || 'telugu').toLowerCase();
    toScript = (toScript || 'devanagari').toLowerCase();

    // Direct Brahmic mapping table for Telugu <-> Devanagari <-> Kannada
    // Because Sanskrit Vedic Unicode points in Indic scripts have direct 1:1 offsets
    if (
      (fromScript === 'telugu' || fromScript === 'devanagari' || fromScript === 'kannada') &&
      (toScript === 'telugu' || toScript === 'devanagari' || toScript === 'kannada')
    ) {
      var diff = BRAHMIC_BASES[toScript] - BRAHMIC_BASES[fromScript];
      var result = '';
      for (var i = 0; i < text.length; i++) {
        var cp = text.charCodeAt(i);
        var base = BRAHMIC_BASES[fromScript];
        if (cp >= base && cp <= base + 0x7f) {
          // Special handling for danda/double danda which are Devanagari (0x0964, 0x0965)
          result += String.fromCharCode(cp + diff);
        } else if (cp === 0x0964) { // Danda
          result += (toScript === 'devanagari' ? '।' : '|');
        } else if (cp === 0x0965) { // Double danda
          result += (toScript === 'devanagari' ? '॥' : '||');
        } else if (text.substr(i, 2) === '||') {
          result += (toScript === 'devanagari' ? '॥' : '||');
          i++;
        } else {
          result += text[i];
        }
      }
      return result;
    }

    // Comprehensive tokenizer for IAST and Tamil conversion
    // Step 1: Decode from source script into Phoneme tokens
    var tokens = tokenize(text, fromScript);

    // Step 2: Encode Phoneme tokens into target script
    return encodeTokens(tokens, toScript);
  };

  function tokenize(text, from) {
    var tokens = [];
    var len = text.length;
    var i = 0;

    var s = SCHEMES[from];
    var base = BRAHMIC_BASES[from];

    if (from === 'iast') {
      // Tokenize IAST Roman text
      var iastConsMap = {
        'kṣ': 'ksh', 'jñ': 'jny',
        'kh': 'kh', 'gh': 'gh', 'ch': 'ch', 'jh': 'jh',
        'ṭh': 'tth', 'ḍh': 'ddh', 'th': 'th', 'dh': 'dh', 'ph': 'ph', 'bh': 'bh',
        'k': 'k', 'g': 'g', 'ṅ': 'ng', 'c': 'c', 'j': 'j', 'ñ': 'ny',
        'ṭ': 'tt', 'ḍ': 'dd', 'ṇ': 'nn', 't': 't', 'd': 'd', 'n': 'n',
        'p': 'p', 'b': 'b', 'm': 'm', 'y': 'y', 'r': 'r_c', 'l': 'l_c',
        'v': 'v', 'ś': 'sh_pal', 'ṣ': 'sh_ret', 's': 's', 'h': 'h', 'ḷ': 'll_c'
      };

      var iastVowelMap = {
        'ai': 'ai', 'au': 'au', 'ā': 'aa', 'ī': 'ii', 'ū': 'uu',
        'ṝ': 'rr', 'ṛ': 'r', 'ḹ': 'll', 'ḷ': 'l', 'a': 'a', 'i': 'i',
        'u': 'u', 'e': 'e', 'o': 'o'
      };

      while (i < len) {
        var ch2 = text.substr(i, 2).toLowerCase();
        var ch1 = text.charAt(i).toLowerCase();
        var origChar = text.charAt(i);

        if (text.substr(i, 2) === '||' || text.substr(i, 2) === '॥') {
          tokens.push({ type: 'punct', val: '||' });
          i += 2;
          continue;
        }
        if (origChar === '|' || origChar === '।') {
          tokens.push({ type: 'punct', val: '|' });
          i++;
          continue;
        }
        if (origChar === 'ṃ' || origChar === 'ṁ') {
          tokens.push({ type: 'anusvara' });
          i++;
          continue;
        }
        if (origChar === 'ḥ') {
          tokens.push({ type: 'visarga' });
          i++;
          continue;
        }
        if (origChar === "'") {
          tokens.push({ type: 'avagraha' });
          i++;
          continue;
        }

        // Check consonant
        var matchedCons = iastConsMap[ch2] || iastConsMap[ch1];
        if (matchedCons) {
          var step = iastConsMap[ch2] ? 2 : 1;
          i += step;
          // Check following vowel
          var nextVowel2 = text.substr(i, 2).toLowerCase();
          var nextVowel1 = text.charAt(i).toLowerCase();
          var matchedVowel = iastVowelMap[nextVowel2] || iastVowelMap[nextVowel1];

          if (matchedVowel) {
            tokens.push({ type: 'syllable', cons: matchedCons, vowel: matchedVowel });
            i += iastVowelMap[nextVowel2] ? 2 : 1;
          } else {
            // Half consonant with virama
            tokens.push({ type: 'halant_cons', cons: matchedCons });
          }
          continue;
        }

        // Check standalone vowel
        var standaloneVowel = iastVowelMap[ch2] || iastVowelMap[ch1];
        if (standaloneVowel) {
          tokens.push({ type: 'vowel', val: standaloneVowel });
          i += iastVowelMap[ch2] ? 2 : 1;
          continue;
        }

        tokens.push({ type: 'other', val: origChar });
        i++;
      }
      return tokens;
    }

    // Tokenize from Brahmic (Telugu, Devanagari, Kannada, Tamil)
    // Convert first to Devanagari normalized representation
    var devanagariText = text;
    if (from !== 'devanagari') {
      var baseFrom = BRAHMIC_BASES[from] || 0x0C00;
      var devanagariChars = [];
      for (var c = 0; c < text.length; c++) {
        var code = text.charCodeAt(c);
        if (code >= baseFrom && code <= baseFrom + 0x7f) {
          devanagariChars.push(String.fromCharCode(code - baseFrom + 0x0900));
        } else {
          devanagariChars.push(text[c]);
        }
      }
      devanagariText = devanagariChars.join('');
    }

    // Now tokenize standard Devanagari representation
    var dScheme = SCHEMES.devanagari;
    var dMap = scriptTokenMaps.devanagari;

    while (i < devanagariText.length) {
      var cur = devanagariText[i];
      var next = devanagariText[i + 1] || '';

      if (cur === '॥' || devanagariText.substr(i, 2) === '||') {
        tokens.push({ type: 'punct', val: '||' });
        i += (cur === '॥' ? 1 : 2);
        continue;
      }
      if (cur === '।' || cur === '|') {
        tokens.push({ type: 'punct', val: '|' });
        i++;
        continue;
      }
      if (cur === 'ं') {
        tokens.push({ type: 'anusvara' });
        i++;
        continue;
      }
      if (cur === 'ः') {
        tokens.push({ type: 'visarga' });
        i++;
        continue;
      }
      if (cur === 'ऽ') {
        tokens.push({ type: 'avagraha' });
        i++;
        continue;
      }

      // Check Standalone Vowel
      var vCan = dMap.vowelsToCan[cur];
      if (vCan) {
        tokens.push({ type: 'vowel', val: vCan });
        i++;
        continue;
      }

      // Check Consonant
      var cCan = dMap.consToCan[cur];
      if (cCan) {
        if (next === '्') {
          // Virama / Halant
          tokens.push({ type: 'halant_cons', cons: cCan });
          i += 2;
        } else {
          // Check following vowel mark
          var mCan = dMap.marksToCan[next];
          if (mCan) {
            tokens.push({ type: 'syllable', cons: cCan, vowel: mCan });
            i += 2;
          } else {
            // Implicit 'a'
            tokens.push({ type: 'syllable', cons: cCan, vowel: 'a' });
            i++;
          }
        }
        continue;
      }

      tokens.push({ type: 'other', val: cur });
      i++;
    }

    return tokens;
  }

  function encodeTokens(tokens, toScript) {
    var out = '';
    var s = SCHEMES[toScript];
    var map = scriptTokenMaps[toScript];

    if (toScript === 'iast') {
      var iastCons = {
        'k': 'k', 'kh': 'kh', 'g': 'g', 'gh': 'gh', 'ng': 'ṅ',
        'c': 'c', 'ch': 'ch', 'j': 'j', 'jh': 'jh', 'ny': 'ñ',
        'tt': 'ṭ', 'tth': 'ṭh', 'dd': 'ḍ', 'ddh': 'ḍh', 'nn': 'ṇ',
        't': 't', 'th': 'th', 'd': 'd', 'dh': 'dh', 'n': 'n',
        'p': 'p', 'ph': 'ph', 'b': 'b', 'bh': 'bh', 'm': 'm',
        'y': 'y', 'r_c': 'r', 'l_c': 'l', 'v': 'v',
        'sh_pal': 'ś', 'sh_ret': 'ṣ', 's': 's', 'h': 'h',
        'll_c': 'ḷ', 'ksh': 'kṣ', 'jny': 'jñ'
      };
      var iastVowels = {
        'a': 'a', 'aa': 'ā', 'i': 'i', 'ii': 'ī', 'u': 'u', 'uu': 'ū',
        'r': 'ṛ', 'rr': 'ṝ', 'l': 'ḷ', 'll': 'ḹ', 'e': 'e', 'ai': 'ai',
        'o': 'o', 'au': 'au'
      };

      tokens.forEach(function (t) {
        if (t.type === 'vowel') {
          out += iastVowels[t.val] || t.val;
        } else if (t.type === 'syllable') {
          out += (iastCons[t.cons] || t.cons) + (iastVowels[t.vowel] || t.vowel);
        } else if (t.type === 'halant_cons') {
          out += (iastCons[t.cons] || t.cons);
        } else if (t.type === 'anusvara') {
          out += 'ṃ';
        } else if (t.type === 'visarga') {
          out += 'ḥ';
        } else if (t.type === 'avagraha') {
          out += "'";
        } else if (t.type === 'punct') {
          out += t.val;
        } else {
          out += t.val;
        }
      });
      return out;
    }

    // Brahmic script encoding (Telugu, Devanagari, Kannada, Tamil)
    tokens.forEach(function (t) {
      if (t.type === 'vowel') {
        out += map.canToVowel[t.val] || '';
      } else if (t.type === 'syllable') {
        var baseCons = map.canToCons[t.cons] || '';
        if (t.vowel === 'a') {
          out += baseCons;
        } else {
          var mark = map.canToMark[t.vowel] || '';
          out += baseCons + mark;
        }
      } else if (t.type === 'halant_cons') {
        var c = map.canToCons[t.cons] || '';
        out += c + s.virama;
      } else if (t.type === 'anusvara') {
        out += s.anusvara;
      } else if (t.type === 'visarga') {
        out += s.visarga;
      } else if (t.type === 'avagraha') {
        out += s.avagraha;
      } else if (t.type === 'punct') {
        out += (t.val === '||' ? s.double_danda : s.danda);
      } else {
        out += t.val;
      }
    });

    return out;
  }

  // Available scripts list with native names
  Sanscript.SUPPORTED_SCRIPTS = [
    { id: 'telugu', label: 'తెలుగు (Telugu)', nativeName: 'తెలుగు' },
    { id: 'devanagari', label: 'देवनागरी (Devanagari)', nativeName: 'देवनागरी' },
    { id: 'kannada', label: 'ಕನ್ನಡ (Kannada)', nativeName: 'ಕನ್ನಡ' },
    { id: 'tamil', label: 'தமிழ் (Tamil)', nativeName: 'தமிழ்' },
    { id: 'iast', label: 'English / IAST (Roman)', nativeName: 'IAST' }
  ];

  // Expose to window/global
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Sanscript;
  } else {
    global.Sanscript = Sanscript;
  }
})(typeof window !== 'undefined' ? window : this);
