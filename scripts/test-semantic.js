const fs = require('fs');
const index = require('../src/data/stotrams-index.json');

// 1. Intent Definitions
const INTENTS = [
  {
    id: 'wealth_prosperity',
    label: 'Wealth & Prosperity',
    labelTelugu: 'సంపద & ఐశ్వర్యం',
    keywords: [
      'wealth', 'money', 'prosperity', 'rich', 'riches', 'financial', 'finance', 'debt', 'debts',
      'loan', 'loans', 'poverty', 'daridrya', 'lakshmi', 'kubera', 'kanaka', 'swarna', 'dhana',
      'aishwarya', 'runa', 'rinavimochana', 'business', 'growth', 'abundance', 'poor', 'job',
      'ధనం', 'డబ్బు', 'సంపద', 'ఐశ్వర్యం', 'అప్పులు', 'దారిద్ర్యం', 'కనకధార', 'లక్ష్మి', 'కుబేర'
    ],
    canonicalSlugs: [
      'kanakadhara-stotram', 'maha-lakshmi-ashtakam', 'sri-suktam',
      'runa-vimochana-ganapathi-stotram', 'sri-runa-vimochana-nrusimha-stotram',
      'ashta-lakshmi-stotram', 'lakshmi-ashtottara-sata-namavali', 'kubera-ashta-lakshmi-mantra-stotram'
    ],
    canonicalRegex: /kanakadhara|lakshmi|suktam|runa\s*vimochana|kubera|dhana|aishwarya/i
  },
  {
    id: 'health_healing',
    label: 'Health & Healing',
    labelTelugu: 'ఆరోగ్యం & ఆయుష్షు',
    keywords: [
      'health', 'healthy', 'cure', 'curing', 'disease', 'illness', 'healing', 'heal', 'longevity',
      'long life', 'ayurveda', 'medicine', 'doctor', 'fever', 'eye sight', 'mrityu', 'mrityunjaya',
      'mrutyunjaya', 'dhanvantari', 'arogya', 'ayush', 'roga', 'vyadhi', 'chikitsa', 'sickness',
      'hospital', 'pain', 'remedy', 'ఆరోగ్యం', 'ఆయుష్షు', 'రోగాలు', 'వ్యాధి', 'స్వస్థత', 'మృత్యుంజయ', 'ధన్వంతరి'
    ],
    canonicalSlugs: [
      'maha-mrutyunjaya-stotram-rudram', 'vaidyanatha-ashtakam', 'dhanvantari-mantra',
      'aditya-hrudayam', 'suryashtakam', 'surya-kavacham', 'chakshushopanishad'
    ],
    canonicalRegex: /mrityun|mrutyun|vaidyanath|dhanvantari|aditya|surya|arogya/i
  },
  {
    id: 'protection_courage',
    label: 'Protection & Courage',
    labelTelugu: 'రక్షణ & ధైర్యం',
    keywords: [
      'protection', 'protect', 'shield', 'armor', 'fear', 'fearless', 'courage', 'brave',
      'enemies', 'enemy', 'evil', 'negative energy', 'ghost', 'ghosts', 'bhoota', 'black magic',
      'danger', 'raksha', 'kavacha', 'kavacham', 'bhaya', 'shatru', 'abhaya', 'defense', 'ward',
      'రక్షణ', 'భయం', 'ధైర్యం', 'శత్రు', 'కవచం', 'రక్ష', 'దిష్టి', 'అభయం'
    ],
    canonicalSlugs: [
      'sri-rama-raksha-stotram', 'hanuman-chalisa', 'hanuman-kavacham', 'shiva-kavacham',
      'narasimha-kavacham', 'sudarshana-ashtakam', 'durga-kavacham', 'anjaneya-dandakam'
    ],
    canonicalRegex: /raksha|kavach|kavacha|chalisa|narasimha|sudarshana|durga|bhairava|manyu/i
  },
  {
    id: 'wisdom_education',
    label: 'Wisdom & Education',
    labelTelugu: 'విద్య & జ్ఞానం',
    keywords: [
      'wisdom', 'education', 'study', 'studies', 'student', 'students', 'memory', 'intellect',
      'intelligence', 'exam', 'exams', 'learning', 'knowledge', 'speech', 'vidya', 'jnana',
      'medha', 'buddhi', 'saraswati', 'hayagriva', 'dakshinamurthy', 'focus', 'school', 'college',
      'చదువు', 'విద్య', 'జ్ఞానం', 'తెలివి', 'జ్ఞాపకశక్తి', 'పరీక్షలు', 'సరస్వతి', 'హయగ్రీవ'
    ],
    canonicalSlugs: [
      'saraswati-stotram', 'medha-suktam', 'sri-hayagriva-stotram', 'sri-medha-dakshina-murthy-stotram',
      'saraswati-ashtottara-sata-namavali', 'hayagriva-sampada-stotram', 'ganesha-pancharatnam'
    ],
    canonicalRegex: /saraswati|medha|hayagriva|dakshina\s*murthy|buddhi|jnana/i
  },
  {
    id: 'peace_liberation',
    label: 'Inner Peace & Moksha',
    labelTelugu: 'శాంతి & మోక్షం',
    keywords: [
      'peace', 'inner peace', 'peace of mind', 'calm', 'stress', 'anxiety', 'depression',
      'relaxation', 'moksha', 'liberation', 'enlightenment', 'philosophy', 'vedanta', 'nirvana',
      'shanti', 'atma', 'tattva', 'meditation', 'sleep', 'quiet', 'mental peace',
      'శాంతి', 'ప్రశాంతత', 'మోక్షం', 'ఆత్మ', 'నిర్వాణ', 'వేదాంత'
    ],
    canonicalSlugs: [
      'nirvana-shatakam', 'bhaja-govindam', 'shiva-manasa-puja', 'atmarpana-stuti', 'shanti-mantra'
    ],
    canonicalRegex: /nirvana|shanti|bhaja\s*govindam|manasa\s*puja|atma|vedanta|upanishad|gita/i
  },
  {
    id: 'obstacles_success',
    label: 'Obstacle Removal & Success',
    labelTelugu: 'విఘ్న నివారణ & విజయం',
    keywords: [
      'obstacle', 'obstacles', 'hurdle', 'hurdles', 'problem', 'problems', 'success', 'victory',
      'win', 'difficulties', 'trouble', 'troubles', 'sankata', 'vighna', 'vijaya', 'karya siddhi',
      'barrier', 'clear', 'removing', 'విఘ్నాలు', 'కష్టాలు', 'విజయం', 'కార్యసిద్ధి', 'సంకట'
    ],
    canonicalSlugs: [
      'sankata-nashana-ganesha-stotram', 'ganesha-pancharatnam', 'runa-vimochana-ganapathi-stotram',
      'aditya-hrudayam', 'hanuman-chalisa'
    ],
    canonicalRegex: /ganesha|ganapathi|vighna|sankata|chalisa|aditya|karya\s*siddhi/i
  },
  {
    id: 'morning_routine',
    label: 'Morning & Daily Chants',
    labelTelugu: 'ప్రాతః స్మరణం & నిత్య పారాయణ',
    keywords: [
      'morning', 'sunrise', 'wake up', 'daily', 'routine', 'pratah', 'suprabhatam', 'nitya',
      'dainandika', 'dhyana', 'karadarshanam', 'deepam', 'dawn', 'early morning',
      'ఉదయం', 'ప్రాతఃకాలం', 'రోజువారీ', 'నిత్య', 'సుప్రభాతం'
    ],
    canonicalSlugs: [
      'sri-venkateswara-suprabhatam', 'pratha-smarana-stotram', 'karadarshanam', 'gayatri-mantra'
    ],
    canonicalRegex: /suprabhatam|pratah|pratha|karadarshanam|nitya|daily/i
  }
];

// 2. Deity Ontology
const DEITIES = {
  hanuman: {
    canonical: 'hanuman',
    name: 'Lord Hanuman',
    nameTelugu: 'హనుమంతుడు',
    synonyms: ['hanuman', 'anjaneya', 'maruti', 'bajrangbali', 'vayuputra', 'sankat mochan', 'pavanaputra', 'kesarinandana', 'kapishwara', 'హనుమంతుడు', 'ఆంజనేయ', 'మారుతి', 'బజరంగబలి']
  },
  shiva: {
    canonical: 'shiva',
    name: 'Lord Shiva',
    nameTelugu: 'శివుడు',
    synonyms: ['shiva', 'siva', 'mahadev', 'mahadeva', 'shankara', 'sankara', 'rudra', 'bholenath', 'triyambaka', 'tryambakam', 'neelakantha', 'nataraja', 'gangadhara', 'chandrashekhara', 'linga', 'lingeshwara', 'someshwara', 'kedareshwara', 'vaidyanatha', 'mrityunjaya', 'శివుడు', 'శంకరుడు', 'రుద్రుడు', 'మహాదేవుడు', 'నీలకంఠుడు', 'భోలేనాథ్']
  },
  vishnu: {
    canonical: 'vishnu',
    name: 'Lord Vishnu',
    nameTelugu: 'విష్ణువు',
    synonyms: ['vishnu', 'narayana', 'hari', 'govinda', 'madhava', 'padmanabha', 'keshava', 'perumal', 'damodara', 'achuta', 'achyuta', 'mukunda', 'ananta', 'garudadhwaja', 'విష్ణువు', 'నారాయణుడు', 'హరి']
  },
  krishna: {
    canonical: 'krishna',
    name: 'Lord Krishna',
    nameTelugu: 'శ్రీ కృష్ణుడు',
    synonyms: ['krishna', 'krsna', 'gopala', 'kanha', 'mukunda', 'vasudeva', 'muralidhara', 'jagannatha', 'balagopala', 'shyam', 'radhe', 'కృష్ణుడు', 'గోపాలుడు']
  },
  rama: {
    canonical: 'rama',
    name: 'Lord Sri Rama',
    nameTelugu: 'శ్రీ రాముడు',
    synonyms: ['rama', 'ramachandra', 'raghava', 'raghupati', 'kousalyatanaya', 'dasharathasuta', 'kodanda', 'sita rama', 'రాముడు', 'రామచంద్రుడు']
  },
  venkateshwara: {
    canonical: 'venkateshwara',
    name: 'Lord Venkateshwara',
    nameTelugu: 'శ్రీ వేంకటేశ్వర స్వామి',
    synonyms: ['venkateshwara', 'venkateswara', 'balaji', 'srinivasa', 'govinda', 'tirupati', 'venkataramana', 'venkatadri', 'ezhumalayan', 'వేంకటేశ్వరుడు', 'శ్రీనివాసుడు', 'బాలాజీ', 'తిరుపతి']
  },
  devi: {
    canonical: 'devi',
    name: 'Goddess Devi / Divine Mother',
    nameTelugu: 'శ్రీ దేవి',
    synonyms: ['devi', 'parvati', 'durga', 'lakshmi', 'saraswati', 'ambika', 'mahishasuramardini', 'lalita', 'tripura sundari', 'bhavani', 'kali', 'chandika', 'chamundeshwari', 'annapurna', 'gayatri', 'kamakshi', 'meenakshi', 'విశ్వమాత', 'దేవి', 'దుర్గ', 'లక్ష్మి', 'పార్వతి']
  },
  lakshmi: {
    canonical: 'lakshmi',
    name: 'Goddess Lakshmi',
    nameTelugu: 'శ్రీ మహాలక్ష్మి',
    synonyms: ['lakshmi', 'laxmi', 'sri', 'shri', 'mahalakshmi', 'kanakadhara', 'padma', 'kamala', 'chanchala', 'varalakshmi', 'లక్ష్మీదేవి', 'మహాలక్ష్మి', 'కనకధార']
  },
  ganesha: {
    canonical: 'ganesha',
    name: 'Lord Ganesha',
    nameTelugu: 'శ్రీ గణేశుడు',
    synonyms: ['ganesha', 'ganesh', 'vinayaka', 'ganapati', 'vighnaharta', 'gajanana', 'lambodara', 'pillaiyar', 'vakratunda', 'ekadanta', 'heramba', 'గణపతి', 'వినాయకుడు', 'గణేశుడు']
  },
  subrahmanya: {
    canonical: 'subrahmanya',
    name: 'Lord Subrahmanya',
    nameTelugu: 'శ్రీ సుబ్రహ్మణ్య స్వామి',
    synonyms: ['subrahmanya', 'subramanya', 'murugan', 'kartikeya', 'skanda', 'shanmukha', 'saravanabhava', 'vel', 'guha', 'సుబ్రహ్మణ్య', 'మురుగన్', 'కార్తికేయ']
  },
  surya: {
    canonical: 'surya',
    name: 'Lord Surya Bhagavan',
    nameTelugu: 'సూర్య భగవానుడు',
    synonyms: ['surya', 'sun', 'sun god', 'aditya', 'bhaskara', 'ravi', 'dinakara', 'divakara', 'prabhakara', 'mitra', 'సూర్యభగవానుడు', 'ఆదిత్యుడు']
  },
  saraswati: {
    canonical: 'saraswati',
    name: 'Goddess Saraswati',
    nameTelugu: 'శ్రీ సరస్వతీ దేవి',
    synonyms: ['saraswati', 'sharada', 'bharati', 'vani', 'vagdevi', 'veena', 'సరస్వతి', 'శారద']
  }
};

// 3. Form Taxonomy
const FORMS = {
  sahasranama: { keywords: ['sahasranama', 'sahasranamam', '1000 names', 'thousand names', 'సహస్రనామ'], label: 'Sahasranama (1,000 Names)' },
  ashtottara: { keywords: ['ashtottara', 'ashtottaram', 'ashtottarasata', '108 names', 'అష్టోత్తర'], label: 'Ashtottaram (108 Names)' },
  kavacha: { keywords: ['kavacham', 'kavacha', 'armor', 'shield', 'protective', 'కవచం'], label: 'Kavacham (Shield)' },
  ashtakam: { keywords: ['ashtakam', 'ashtaka', '8 verses', 'eight verses', 'అష్టకం'], label: 'Ashtakam (8 Verses)' },
  suprabhatam: { keywords: ['suprabhatam', 'suprabhatham', 'morning awakening', 'wake up', 'సుప్రభాతం'], label: 'Suprabhatam' },
  suktam: { keywords: ['suktam', 'sukta', 'vedic hymn', 'సూక్తం'], label: 'Vedic Suktam' },
  chalisa: { keywords: ['chalisa', 'chaalisa', '40 verses', 'చాలీసా'], label: 'Chalisa' }
};

// 4. Semantic Search Function
function semanticSearch(rawQuery, stotrams) {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return { results: stotrams, analysis: null };

  // A. Detect Intent
  const matchedIntents = [];
  for (const intent of INTENTS) {
    let score = 0;
    for (const kw of intent.keywords) {
      if (query.includes(kw)) {
        score += 1;
      }
    }
    if (score > 0) {
      matchedIntents.push({ intent, score });
    }
  }
  matchedIntents.sort((a, b) => b.score - a.score);

  // B. Detect Deities
  const matchedDeities = [];
  for (const key in DEITIES) {
    const d = DEITIES[key];
    for (const syn of d.synonyms) {
      if (query.includes(syn)) {
        matchedDeities.push(d);
        break;
      }
    }
  }

  // C. Detect Forms
  const matchedForms = [];
  for (const key in FORMS) {
    const f = FORMS[key];
    for (const kw of f.keywords) {
      if (query.includes(kw)) {
        matchedForms.push({ key, label: f.label });
        break;
      }
    }
  }

  // D. Scoring items
  const scored = [];
  const queryTokens = query.split(/\s+/).filter(t => t.length > 2);

  for (const item of stotrams) {
    let score = 0;
    const reasons = [];

    const titleEn = (item.title_english || '').toLowerCase();
    const titleTe = (item.title_telugu || '');
    const slug = (item.slug || item.id || '').toLowerCase();
    const category = (item.category || '').toLowerCase();
    const deity = (item.deity || '').toLowerCase();

    // 1. Exact Title Substring
    if (titleEn.includes(query)) {
      score += 250;
      reasons.push('Title Match');
    } else if (titleTe.includes(rawQuery.trim())) {
      score += 250;
      reasons.push('Telugu Title Match');
    }

    // 2. Token overlap
    for (const token of queryTokens) {
      if (titleEn.includes(token)) score += 60;
      if (slug.includes(token)) score += 40;
      if (category.includes(token)) score += 30;
      if (deity.includes(token)) score += 50;
    }

    // 3. Deity semantic match
    for (const d of matchedDeities) {
      if (deity === d.canonical || category === d.canonical || slug.includes(d.canonical) || titleEn.includes(d.canonical)) {
        score += 300;
        reasons.push(`Deity: ${d.name}`);
      } else {
        for (const syn of d.synonyms) {
          if (titleEn.includes(syn) || slug.includes(syn)) {
            score += 280;
            reasons.push(`Deity: ${d.name}`);
            break;
          }
        }
      }
    }

    // 4. Intent semantic match
    for (const m of matchedIntents) {
      const intent = m.intent;
      // Canonical slug match
      if (intent.canonicalSlugs.some(s => slug.includes(s) || s.includes(slug))) {
        score += 350;
        reasons.push(`Intent: ${intent.label}`);
      } else if (intent.canonicalRegex.test(titleEn) || intent.canonicalRegex.test(slug)) {
        score += 240;
        reasons.push(`Intent: ${intent.label}`);
      }
    }

    // 5. Form match
    for (const f of matchedForms) {
      if (titleEn.includes(f.key) || slug.includes(f.key)) {
        score += 150;
        reasons.push(`Form: ${f.label}`);
      }
    }

    if (score > 0) {
      scored.push({ item, score, reasons: Array.from(new Set(reasons)) });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  return {
    results: scored.map(s => s.item),
    scoredResults: scored,
    analysis: {
      matchedIntents: matchedIntents.map(m => m.intent),
      matchedDeities,
      matchedForms,
      isSemantic: matchedIntents.length > 0 || matchedDeities.length > 0 || matchedForms.length > 0
    }
  };
}

// 5. Run Tests
const testQueries = [
  "wealth and money",
  "prayer for curing health and long life",
  "protection from fear and enemies",
  "stotra for exams and memory",
  "maruti prayers",
  "bholenath",
  "1000 names of vishnu",
  "morning wake up chant",
  "ధనం సంపద",
  "ఆరోగ్యం"
];

for (const q of testQueries) {
  console.log(`\n============================`);
  console.log(`🔍 QUERY: "${q}"`);
  const res = semanticSearch(q, index);
  console.log(`Semantic Analysis:`, {
    intents: res.analysis.matchedIntents.map(i => i.label),
    deities: res.analysis.matchedDeities.map(d => d.name),
    forms: res.analysis.matchedForms.map(f => f.label)
  });
  console.log(`Top 5 Results (Total: ${res.results.length}):`);
  res.scoredResults.slice(0, 5).forEach((r, idx) => {
    console.log(`  ${idx + 1}. [Score: ${r.score}] ${r.item.title_english} (${r.item.title_telugu}) -> ${r.reasons.join(', ')}`);
  });
}

