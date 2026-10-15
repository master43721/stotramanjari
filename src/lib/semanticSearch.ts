import { StotramIndexItem } from "@/types";

export interface SemanticIntent {
  id: string;
  label: string;
  labelTelugu: string;
  iconName: "ShieldIcon" | "LotusIcon" | "SunIcon" | "ScrollIcon" | "BookIcon" | "StarIcon";
  description: string;
  keywords: string[];
  canonicalSlugs: string[];
  canonicalRegex: RegExp;
}

export interface SemanticDeity {
  canonical: string;
  name: string;
  nameTelugu: string;
  synonyms: string[];
}

export interface SemanticForm {
  key: string;
  label: string;
  keywords: string[];
}

export interface SemanticMatchReason {
  type: "intent" | "deity" | "form" | "title" | "token";
  label: string;
}

export interface ScoredStotramItem {
  item: StotramIndexItem;
  score: number;
  reasons: SemanticMatchReason[];
  primaryTag?: string;
}

export interface SemanticAnalysisResult {
  query: string;
  cleanedQuery: string;
  matchedIntents: SemanticIntent[];
  matchedDeities: SemanticDeity[];
  matchedForms: SemanticForm[];
  isSemantic: boolean;
  summaryLabel?: string;
  summarySubtitle?: string;
}

export interface SemanticSearchResult {
  results: StotramIndexItem[];
  scoredResults: ScoredStotramItem[];
  analysis: SemanticAnalysisResult;
}

// 1. Comprehensive Sacred Intent Ontology
export const SACRED_INTENTS: SemanticIntent[] = [
  {
    id: "wealth_prosperity",
    label: "Wealth & Prosperity",
    labelTelugu: "సంపద & ఐశ్వర్యం",
    iconName: "LotusIcon",
    description: "Sacred stotrams for financial abundance, clearing debts, poverty eradication, and business prosperity.",
    keywords: [
      "wealth", "money", "prosperity", "rich", "riches", "financial", "finance", "debt", "debts",
      "loan", "loans", "poverty", "daridrya", "lakshmi", "kubera", "kanaka", "swarna", "dhana",
      "aishwarya", "runa", "rinavimochana", "business", "growth", "abundance", "poor", "job", "career",
      "ధనం", "డబ్బు", "సంపద", "ఐశ్వర్యం", "అప్పులు", "దారిద్ర్యం", "కనకధార", "లక్ష్మి", "కుబేర", "రుణ"
    ],
    canonicalSlugs: [
      "kanakadhara-stotram", "maha-lakshmi-ashtakam", "sri-suktam",
      "runa-vimochana-ganapathi-stotram", "sri-runa-vimochana-nrusimha-stotram",
      "ashta-lakshmi-stotram", "lakshmi-ashtottara-sata-namavali", "kubera-ashta-lakshmi-mantra-stotram",
      "sri-mahalakshmi-hrudaya-stotram"
    ],
    canonicalRegex: /kanakadhara|lakshmi|suktam|runa\s*vimochana|kubera|dhana|aishwarya|daridrya/i
  },
  {
    id: "health_healing",
    label: "Health & Healing",
    labelTelugu: "ఆరోగ్యం & ఆయుష్షు",
    iconName: "SunIcon",
    description: "Sacred chants for disease relief, vitality, long life, eyesight healing, and physical strength.",
    keywords: [
      "health", "healthy", "cure", "curing", "disease", "illness", "healing", "heal", "longevity",
      "long life", "ayurveda", "medicine", "doctor", "fever", "eye sight", "eyesight", "mrityu",
      "mrityunjaya", "mrutyunjaya", "dhanvantari", "arogya", "ayush", "roga", "vyadhi", "chikitsa",
      "sickness", "hospital", "pain", "remedy", "ఆరోగ్యం", "ఆయుష్షు", "రోగాలు", "వ్యాధి", "స్వస్థత",
      "మృత్యుంజయ", "ధన్వంతరి"
    ],
    canonicalSlugs: [
      "maha-mrutyunjaya-stotram-rudram", "vaidyanatha-ashtakam", "dhanvantari-mantra",
      "aditya-hrudayam", "suryashtakam", "surya-kavacham", "chakshushopanishad",
      "sitala-ashtakam", "mruthyunjaya-stotram"
    ],
    canonicalRegex: /mrityun|mrutyun|vaidyanath|dhanvantari|aditya|surya|arogya|ayush|chakshu/i
  },
  {
    id: "protection_courage",
    label: "Protection & Courage",
    labelTelugu: "రక్షణ & ధైర్యం",
    iconName: "ShieldIcon",
    description: "Invincible divine armor (Kavacham) protecting against negative energies, fear, and enemies.",
    keywords: [
      "protection", "protect", "shield", "armor", "fear", "fearless", "courage", "brave",
      "enemies", "enemy", "evil", "negative energy", "ghost", "ghosts", "bhoota", "black magic",
      "danger", "raksha", "kavacha", "kavacham", "bhaya", "shatru", "abhaya", "defense", "ward",
      "nightmare", "anxiety", "రక్షణ", "భయం", "ధైర్యం", "శత్రు", "కవచం", "రక్ష", "దిష్టి", "అభయం"
    ],
    canonicalSlugs: [
      "sri-rama-raksha-stotram", "hanuman-chalisa", "hanuman-kavacham", "shiva-kavacham",
      "narasimha-kavacham", "sudarshana-ashtakam", "durga-kavacham", "anjaneya-dandakam",
      "subrahmanya-kavacham", "devi-kavacham", "sri-rudra-kavacham"
    ],
    canonicalRegex: /raksha|kavach|kavacha|chalisa|narasimha|sudarshana|durga|bhairava|manyu|dandakam/i
  },
  {
    id: "wisdom_education",
    label: "Wisdom & Education",
    labelTelugu: "విద్య & జ్ఞానం",
    iconName: "ScrollIcon",
    description: "Sacred hymns for sharpening memory, academic excellence, intellect, eloquence, and divine wisdom.",
    keywords: [
      "wisdom", "education", "study", "studies", "student", "students", "memory", "intellect",
      "intelligence", "exam", "exams", "learning", "knowledge", "speech", "vidya", "jnana",
      "medha", "buddhi", "saraswati", "hayagriva", "dakshinamurthy", "focus", "school", "college",
      "test", "tests", "చదువు", "విద్య", "జ్ఞానం", "తెలివి", "జ్ఞాపకశక్తి", "పరీక్షలు", "సరస్వతి", "హయగ్రీవ"
    ],
    canonicalSlugs: [
      "saraswati-stotram", "medha-suktam", "sri-hayagriva-stotram", "sri-medha-dakshina-murthy-stotram",
      "saraswati-ashtottara-sata-namavali", "hayagriva-sampada-stotram", "ganesha-pancharatnam",
      "saraswati-suktam"
    ],
    canonicalRegex: /saraswati|medha|hayagriva|dakshina\s*murthy|buddhi|jnana|vidya/i
  },
  {
    id: "peace_liberation",
    label: "Inner Peace & Moksha",
    labelTelugu: "శాంతి & మోక్షం",
    iconName: "BookIcon",
    description: "Vedantic hymns and philosophical stotras for mental tranquility, detachment, and supreme bliss.",
    keywords: [
      "peace", "inner peace", "peace of mind", "calm", "stress", "anxiety", "depression",
      "relaxation", "moksha", "liberation", "enlightenment", "philosophy", "vedanta", "nirvana",
      "shanti", "atma", "tattva", "meditation", "sleep", "quiet", "mental peace",
      "శాంతి", "ప్రశాంతత", "మోక్షం", "ఆత్మ", "నిర్వాణ", "వేదాంత"
    ],
    canonicalSlugs: [
      "nirvana-shatakam", "bhaja-govindam", "shiva-manasa-puja", "atmarpana-stuti", "shanti-mantra",
      "srimad-bhagavad-gita", "upanishad", "dakshinamurthy-stotram"
    ],
    canonicalRegex: /nirvana|shanti|bhaja\s*govindam|manasa\s*puja|atma|vedanta|upanishad|gita/i
  },
  {
    id: "obstacles_success",
    label: "Obstacle Removal & Victory",
    labelTelugu: "విఘ్న నివారణ & విజయం",
    iconName: "StarIcon",
    description: "Powerful chants to remove stumbling blocks, ensure victory, and achieve success in all undertakings.",
    keywords: [
      "obstacle", "obstacles", "hurdle", "hurdles", "problem", "problems", "success", "victory",
      "win", "difficulties", "trouble", "troubles", "sankata", "vighna", "vijaya", "karya siddhi",
      "barrier", "clear", "removing", "విఘ్నాలు", "కష్టాలు", "విజయం", "కార్యసిద్ధి", "సంకట"
    ],
    canonicalSlugs: [
      "sankata-nashana-ganesha-stotram", "ganesha-pancharatnam", "runa-vimochana-ganapathi-stotram",
      "aditya-hrudayam", "hanuman-chalisa", "ganesha-kavacham"
    ],
    canonicalRegex: /ganesha|ganapathi|vighna|sankata|chalisa|aditya|karya\s*siddhi|vijaya/i
  },
  {
    id: "morning_routine",
    label: "Morning & Daily Chants",
    labelTelugu: "ప్రాతః స్మరణం & నిత్య పారాయణ",
    iconName: "SunIcon",
    description: "Essential awakening and auspicious dawn prayers to begin the day with divine grace.",
    keywords: [
      "morning", "sunrise", "wake up", "daily", "routine", "pratah", "suprabhatam", "nitya",
      "dainandika", "dhyana", "karadarshanam", "deepam", "dawn", "early morning",
      "ఉదయం", "ప్రాతఃకాలం", "రోజువారీ", "నిత్య", "సుప్రభాతం"
    ],
    canonicalSlugs: [
      "sri-venkateswara-suprabhatam", "pratha-smarana-stotram", "karadarshanam", "gayatri-mantra",
      "daily-prayers", "nitya-parayana"
    ],
    canonicalRegex: /suprabhatam|pratah|pratha|karadarshanam|nitya|daily/i
  }
];

// 2. Deity Ontology with Avatars and Sacred Names
export const DEITY_ONTOLOGY: Record<string, SemanticDeity> = {
  hanuman: {
    canonical: "hanuman",
    name: "Lord Hanuman",
    nameTelugu: "శ్రీ ఆంజనేయ స్వామి",
    synonyms: [
      "hanuman", "anjaneya", "maruti", "bajrangbali", "vayuputra", "sankat mochan",
      "pavanaputra", "kesarinandana", "kapishwara", "హనుమంతుడు", "ఆంజనేయ", "మారుతి", "బజరంగబలి"
    ]
  },
  shiva: {
    canonical: "shiva",
    name: "Lord Shiva",
    nameTelugu: "శ్రీ పరమేశ్వరుడు",
    synonyms: [
      "shiva", "siva", "mahadev", "mahadeva", "shankara", "sankara", "rudra", "bholenath",
      "triyambaka", "tryambakam", "neelakantha", "nataraja", "gangadhara", "chandrashekhara",
      "linga", "lingeshwara", "someshwara", "kedareshwara", "vaidyanatha", "mrityunjaya",
      "శివుడు", "శంకరుడు", "రుద్రుడు", "మహాదేవుడు", "నీలకంఠుడు", "భోలేనాథ్"
    ]
  },
  vishnu: {
    canonical: "vishnu",
    name: "Lord Vishnu",
    nameTelugu: "శ్రీ మహా విష్ణువు",
    synonyms: [
      "vishnu", "narayana", "hari", "govinda", "madhava", "padmanabha", "keshava",
      "perumal", "damodara", "achuta", "achyuta", "mukunda", "ananta", "garudadhwaja",
      "విష్ణువు", "నారాయణుడు", "హరి", "శ్రీహరి"
    ]
  },
  krishna: {
    canonical: "krishna",
    name: "Lord Krishna",
    nameTelugu: "శ్రీ కృష్ణ పరమాత్మ",
    synonyms: [
      "krishna", "krsna", "gopala", "kanha", "mukunda", "vasudeva", "muralidhara",
      "jagannatha", "balagopala", "shyam", "radhe", "కృష్ణుడు", "గోపాలుడు"
    ]
  },
  rama: {
    canonical: "rama",
    name: "Lord Sri Rama",
    nameTelugu: "శ్రీ సీతారామ చంద్రుడు",
    synonyms: [
      "rama", "ramachandra", "raghava", "raghupati", "kousalyatanaya", "dasharathasuta",
      "kodanda", "sita rama", "రాముడు", "రామచంద్రుడు"
    ]
  },
  venkateshwara: {
    canonical: "venkateshwara",
    name: "Lord Venkateshwara",
    nameTelugu: "శ్రీ వేంకటేశ్వర స్వామి",
    synonyms: [
      "venkateshwara", "venkateswara", "balaji", "srinivasa", "govinda", "tirupati",
      "venkataramana", "venkatadri", "ezhumalayan", "వేంకటేశ్వరుడు", "శ్రీనివాసుడు", "బాలాజీ", "తిరుపతి"
    ]
  },
  devi: {
    canonical: "devi",
    name: "Goddess Devi / Divine Mother",
    nameTelugu: "శ్రీ జగన్మాత",
    synonyms: [
      "devi", "parvati", "durga", "lakshmi", "saraswati", "ambika", "mahishasuramardini",
      "lalita", "tripura sundari", "bhavani", "kali", "chandika", "chamundeshwari",
      "annapurna", "gayatri", "kamakshi", "meenakshi", "విశ్వమాత", "దేవి", "దుర్గ", "లక్ష్మి", "పార్వతి"
    ]
  },
  lakshmi: {
    canonical: "lakshmi",
    name: "Goddess Lakshmi",
    nameTelugu: "శ్రీ మహాలక్ష్మి",
    synonyms: [
      "lakshmi", "laxmi", "sri", "shri", "mahalakshmi", "kanakadhara", "padma", "kamala",
      "chanchala", "varalakshmi", "లక్ష్మీదేవి", "మహాలక్ష్మి", "కనకధార"
    ]
  },
  ganesha: {
    canonical: "ganesha",
    name: "Lord Ganesha",
    nameTelugu: "శ్రీ వినాయకుడు",
    synonyms: [
      "ganesha", "ganesh", "vinayaka", "ganapati", "vighnaharta", "gajanana", "lambodara",
      "pillaiyar", "vakratunda", "ekadanta", "heramba", "గణపతి", "వినాయకుడు", "గణేశుడు"
    ]
  },
  subrahmanya: {
    canonical: "subrahmanya",
    name: "Lord Subrahmanya",
    nameTelugu: "శ్రీ సుబ్రహ్మణ్య స్వామి",
    synonyms: [
      "subrahmanya", "subramanya", "murugan", "kartikeya", "skanda", "shanmukha",
      "saravanabhava", "vel", "guha", "సుబ్రహ్మణ్య", "మురుగన్", "కార్తికేయ"
    ]
  },
  surya: {
    canonical: "surya",
    name: "Lord Surya Bhagavan",
    nameTelugu: "సూర్య భగవానుడు",
    synonyms: [
      "surya", "sun", "sun god", "aditya", "bhaskara", "ravi", "dinakara", "divakara",
      "prabhakara", "mitra", "సూర్యభగవానుడు", "ఆదిత్యుడు"
    ]
  },
  saraswati: {
    canonical: "saraswati",
    name: "Goddess Saraswati",
    nameTelugu: "శ్రీ సరస్వతీ దేవి",
    synonyms: [
      "saraswati", "sharada", "bharati", "vani", "vagdevi", "veena", "సరస్వతి", "శారద"
    ]
  },
  dattatreya: {
    canonical: "dattatreya",
    name: "Lord Dattatreya",
    nameTelugu: "శ్రీ దత్తాత్రేయుడు",
    synonyms: ["dattatreya", "datta", "guru datta", "anusuya tanaya", "దత్తాత్రేయ"]
  },
  guru: {
    canonical: "guru",
    name: "Sadguru / Raghavendra / Sai",
    nameTelugu: "శ్రీ గురుదేవులు",
    synonyms: ["guru", "raghavendra", "rayaru", "saibaba", "dakshinamurthy", "adi shankara", "sadguru", "గురుదేవులు", "రాఘవేంద్ర"]
  }
};

// 3. Stotra Form Taxonomy
export const SACRED_FORMS: Record<string, SemanticForm> = {
  sahasranama: {
    key: "sahasranama",
    label: "Sahasranama (1,000 Sacred Names)",
    keywords: ["sahasranama", "sahasranamam", "1000 names", "thousand names", "సహస్రనామ"]
  },
  ashtottara: {
    key: "ashtottara",
    label: "Ashtottaram (108 Sacred Names)",
    keywords: ["ashtottara", "ashtottaram", "ashtottarasata", "108 names", "అష్టోత్తర"]
  },
  kavacha: {
    key: "kavacha",
    label: "Kavacham (Protective Armor)",
    keywords: ["kavacham", "kavacha", "armor", "shield", "protective", "కవచం"]
  },
  ashtakam: {
    key: "ashtakam",
    label: "Ashtakam (8 Sacred Verses)",
    keywords: ["ashtakam", "ashtaka", "8 verses", "eight verses", "అష్టకం"]
  },
  suprabhatam: {
    key: "suprabhatam",
    label: "Suprabhatam (Dawn Awakening)",
    keywords: ["suprabhatam", "suprabhatham", "morning awakening", "wake up", "సుప్రభాతం"]
  },
  suktam: {
    key: "suktam",
    label: "Vedic Suktam",
    keywords: ["suktam", "sukta", "vedic hymn", "సూక్తం"]
  },
  pancharatnam: {
    key: "pancharatnam",
    label: "Pancharatnam (5 Gems)",
    keywords: ["pancharatnam", "pancharatna", "5 gems", "five verses", "పంచరత్న"]
  },
  chalisa: {
    key: "chalisa",
    label: "Chalisa (40 Verses)",
    keywords: ["chalisa", "chaalisa", "40 verses", "చాలీసా"]
  },
  dandakam: {
    key: "dandakam",
    label: "Dandakam (Metrical Hymn)",
    keywords: ["dandakam", "dandaka", "దండకం"]
  }
};

// Conversational stop-words to clean natural queries
const STOP_WORDS = new Set([
  "a", "an", "the", "in", "on", "of", "for", "to", "and", "or", "with", "by", "is", "are",
  "what", "which", "give", "me", "show", "tell", "best", "stotra", "stotram", "stotras",
  "stotrams", "sloka", "slokas", "slokam", "mantra", "mantras", "chant", "chants", "prayer",
  "prayers", "hymn", "hymns", "please", "can", "you", "i", "want", "need", "about"
]);

/**
 * Clean query and strip conversational filler words
 */
export function cleanQuery(rawQuery: string): string {
  return rawQuery
    .toLowerCase()
    .replace(/[^\w\s\u0C00-\u0C7F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Perform deep semantic analysis and ranked retrieval on stotrams.
 */
export function executeSemanticSearch(
  rawQuery: string,
  stotrams: StotramIndexItem[],
  activeCategory: string = "all"
): SemanticSearchResult {
  const query = cleanQuery(rawQuery);

  if (!query) {
    const defaultResults = activeCategory === "all"
      ? stotrams
      : stotrams.filter((s) => s.category === activeCategory);

    return {
      results: defaultResults,
      scoredResults: defaultResults.map((item) => ({
        item,
        score: 0,
        reasons: [],
      })),
      analysis: {
        query: rawQuery,
        cleanedQuery: "",
        matchedIntents: [],
        matchedDeities: [],
        matchedForms: [],
        isSemantic: false,
      },
    };
  }

  // 1. Detect Intents
  const matchedIntents: { intent: SemanticIntent; score: number }[] = [];
  for (const intent of SACRED_INTENTS) {
    let matchScore = 0;
    for (const kw of intent.keywords) {
      if (query.includes(kw)) {
        matchScore += kw.length > 4 ? 2 : 1;
      }
    }
    if (matchScore > 0) {
      matchedIntents.push({ intent, score: matchScore });
    }
  }
  matchedIntents.sort((a, b) => b.score - a.score);

  // 2. Detect Deities
  const matchedDeities: SemanticDeity[] = [];
  for (const key in DEITY_ONTOLOGY) {
    const deity = DEITY_ONTOLOGY[key];
    for (const syn of deity.synonyms) {
      if (query.includes(syn)) {
        matchedDeities.push(deity);
        break;
      }
    }
  }

  // 3. Detect Forms
  const matchedForms: SemanticForm[] = [];
  for (const key in SACRED_FORMS) {
    const form = SACRED_FORMS[key];
    for (const kw of form.keywords) {
      if (query.includes(kw)) {
        matchedForms.push(form);
        break;
      }
    }
  }

  // Filter tokens (excluding common stop words)
  const queryTokens = query
    .split(/\s+/)
    .filter((token) => token.length >= 2 && !STOP_WORDS.has(token));

  // Determine if this is a semantic conceptual query
  const isSemantic =
    matchedIntents.length > 0 ||
    matchedDeities.length > 0 ||
    matchedForms.length > 0;

  // 4. Score each stotram
  const scoredItems: ScoredStotramItem[] = [];

  for (const item of stotrams) {
    // If a category filter is active, enforce it
    if (activeCategory !== "all" && item.category !== activeCategory) {
      continue;
    }

    let score = 0;
    const reasons: SemanticMatchReason[] = [];
    let primaryTag: string | undefined;

    const titleEn = (item.title_english || "").toLowerCase();
    const titleTe = item.title_telugu || "";
    const slug = (item.slug || item.id || "").toLowerCase();
    const category = (item.category || "").toLowerCase();
    const deity = (item.deity || "").toLowerCase();

    // A. Literal title matches
    if (titleEn.includes(query)) {
      score += 260;
      reasons.push({ type: "title", label: "Title Match" });
    } else if (titleTe.includes(rawQuery.trim())) {
      score += 260;
      reasons.push({ type: "title", label: "శీర్షిక సరిపోలింది" });
    }

    // B. Query Token Overlap
    for (const token of queryTokens) {
      if (titleEn.includes(token)) {
        score += 65;
        reasons.push({ type: "token", label: `Matched '${token}'` });
      } else if (titleTe.includes(token)) {
        score += 70;
        reasons.push({ type: "token", label: `Matched '${token}'` });
      } else if (slug.includes(token)) {
        score += 40;
      } else if (category.includes(token)) {
        score += 30;
      } else if (deity.includes(token)) {
        score += 50;
      }
    }

    // C. Intent Semantic Match
    for (const m of matchedIntents) {
      const intent = m.intent;
      const isCanonical = intent.canonicalSlugs.some(
        (cs) => slug.includes(cs) || cs.includes(slug)
      );

      if (isCanonical) {
        score += 360 * m.score;
        reasons.push({ type: "intent", label: intent.label });
        if (!primaryTag) primaryTag = intent.label;
      } else if (intent.canonicalRegex.test(titleEn) || intent.canonicalRegex.test(slug)) {
        score += 240 * m.score;
        reasons.push({ type: "intent", label: intent.label });
        if (!primaryTag) primaryTag = intent.label;
      }
    }

    // D. Deity Semantic Match
    for (const d of matchedDeities) {
      const isDirect =
        deity === d.canonical ||
        category === d.canonical ||
        slug.includes(d.canonical) ||
        titleEn.includes(d.canonical);

      if (isDirect) {
        score += 320;
        reasons.push({ type: "deity", label: d.name });
        if (!primaryTag) primaryTag = d.name;
      } else {
        const matchesSyn = d.synonyms.some(
          (syn) => titleEn.includes(syn) || slug.includes(syn) || titleTe.includes(syn)
        );
        if (matchesSyn) {
          score += 280;
          reasons.push({ type: "deity", label: d.name });
          if (!primaryTag) primaryTag = d.name;
        }
      }
    }

    // E. Form Semantic Match
    for (const f of matchedForms) {
      if (titleEn.includes(f.key) || slug.includes(f.key)) {
        score += 160;
        reasons.push({ type: "form", label: f.label });
        if (!primaryTag) primaryTag = f.label;
      }
    }

    if (score > 0) {
      // Deduplicate reasons
      const uniqueReasons: SemanticMatchReason[] = [];
      const seen = new Set<string>();
      for (const r of reasons) {
        if (!seen.has(r.label)) {
          seen.add(r.label);
          uniqueReasons.push(r);
        }
      }

      scoredItems.push({
        item,
        score,
        reasons: uniqueReasons,
        primaryTag,
      });
    }
  }

  // Sort descending by relevance score
  scoredItems.sort((a, b) => b.score - a.score);

  // Summary generation
  let summaryLabel: string | undefined;
  let summarySubtitle: string | undefined;

  if (matchedIntents.length > 0 && matchedDeities.length > 0) {
    summaryLabel = `${matchedIntents[0].intent.label} • ${matchedDeities[0].name}`;
    summarySubtitle = `Understood spiritual intent for ${matchedIntents[0].intent.label.toLowerCase()} dedicated to ${matchedDeities[0].name}`;
  } else if (matchedIntents.length > 0) {
    summaryLabel = matchedIntents[0].intent.label;
    summarySubtitle = matchedIntents[0].intent.description;
  } else if (matchedDeities.length > 0) {
    summaryLabel = matchedDeities[0].name;
    summarySubtitle = `Showing sacred stotrams and prayers dedicated to ${matchedDeities[0].name}`;
  } else if (matchedForms.length > 0) {
    summaryLabel = matchedForms[0].label;
    summarySubtitle = `Showing stotrams formatted as ${matchedForms[0].label}`;
  }

  return {
    results: scoredItems.map((s) => s.item),
    scoredResults: scoredItems,
    analysis: {
      query: rawQuery,
      cleanedQuery: query,
      matchedIntents: matchedIntents.map((m) => m.intent),
      matchedDeities,
      matchedForms,
      isSemantic,
      summaryLabel,
      summarySubtitle,
    },
  };
}

