const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');
const structurePath = path.join(dataDir, 'categories-structure.json');
const outputPath = path.join(dataDir, 'category-mappings.json');

const structure = JSON.parse(fs.readFileSync(structurePath, 'utf-8'));

// Full map of Telugu raw names (stripped of count) to English ID and display name
const catMetaMap = {
  'నిత్య పారాయణ శ్లోకాః': { id: 'nitya-parayana', name: 'Nitya Parayana Slokas / Daily Prayers' },
  'వేద మంత్రాః': { id: 'vedic-chants', name: 'Vedic Chants' },
  'ఉపనిషదః': { id: 'upanishads', name: 'Upanishads' },
  'శివ స్తోత్రాణి': { id: 'shiva', name: 'Shiva Stotrams' },
  'విష్ణు స్తోత్రాణి': { id: 'vishnu', name: 'Vishnu Stotrams' },
  'శ్రీ రామ స్తోత్రాణి': { id: 'rama', name: 'Sri Rama Stotrams' },
  'శ్రీ కృష్ణ స్తోత్రాణి': { id: 'krishna', name: 'Sri Krishna Stotrams' },
  'శ్రీ వేంకటేశ్వర స్వామి స్తోత్రాణి': { id: 'venkateshwara', name: 'Sri Venkateshwara Swami Stotrams' },
  'దేవీ స్తోత్రాణి': { id: 'devi', name: 'Devi Stotrams' },
  'దుర్గా స్తోత్రాణి': { id: 'durga', name: 'Durga Stotrams' },
  'లక్ష్మీ స్తోత్రాణి': { id: 'lakshmi', name: 'Lakshmi Stotrams' },
  'గణేశ స్తోత్రాణి': { id: 'ganesha', name: 'Ganesha Stotrams' },
  'హనుమ స్తోత్రాణి': { id: 'hanuman', name: 'Hanuman Stotrams' },
  'సూర్య భగవాన్ స్తోత్రాణి': { id: 'surya', name: 'Surya Bhagavan Stotrams' },
  'సరస్వతీ స్తోత్రాణి': { id: 'saraswati', name: 'Saraswati Stotrams' },
  'సుబ్రహ్మణ్య స్వామి స్తోత్రాణి': { id: 'subrahmanya', name: 'Subrahmanya Swami Stotrams' },
  'గంగా స్తోత్రాణి': { id: 'ganga', name: 'Ganga Stotrams' },
  'దత్తాత్రేయ స్తోత్రాణి': { id: 'dattatreya', name: 'Dattatreya Stotrams' },
  'నవగ్రహ స్తోత్రాణి': { id: 'navagraha', name: 'Navagraha Stotrams' },
  'శ్రీ వేంకటేశ్వర స్వామి కీర్తనాః': { id: 'venkateshwara-keerthanas', name: 'Sri Venkateshwara Swami Keerthanas' },
  'గురు స్తోత్రాణి': { id: 'guru', name: 'Guru Stotrams' },
  'నిత్యదిన/దైనందిక ప్రార్థన': { id: 'daily-prayers', name: 'Daily Prayers / Dainandika Prarthana' },
  'అష్టోత్తర శత నామావళి': { id: 'ashtottara-namavali', name: 'Ashtottara Sata Namavali' },
  'అష్టోత్తర శత నామ స్తోత్రం': { id: 'ashtottara-stotram', name: 'Ashtottara Sata Nama Stotram' },
  'కవచ స్తోత్రాణి': { id: 'kavacha-stotrams', name: 'Kavacha Stotrams' },
  'పంచ రత్న స్తోత్రాణి': { id: 'pancha-ratna', name: 'Pancha Ratna Stotrams' },
  'సహస్ర నామ స్తోత్రాణి': { id: 'sahasra-nama', name: 'Sahasra Nama Stotrams' },
  'శ్రీమద్భగవద్గీతా పారాయణ': { id: 'bhagavad-gita', name: 'Srimad Bhagavad Gita' },
  'ఉద్ధవగీతా': { id: 'uddhava-gita', name: 'Uddhava Gita' },
  'పతంజలి యోగ సూత్రాణి': { id: 'patanjali-yoga-sutras', name: 'Patanjali Yoga Sutras' },
  'తైత్తిరీయ ఉపనిషద్': { id: 'taittiriya-upanishad', name: 'Taittiriya Upanishad' },
  'కేన ఉపనిషద్': { id: 'kena-upanishad', name: 'Kena Upanishad' },
  'ముండక ఉపనిషద్': { id: 'mundaka-upanishad', name: 'Mundaka Upanishad' },
  'దేవీ మాహాత్మ్యం/దుర్గా సప్తశతీ': { id: 'devi-mahatmyam', name: 'Devi Mahatmyam / Durga Saptashati' },
  'దేవీ భాగవత పురాణ': { id: 'devi-bhagavata-purana', name: 'Devi Bhagavata Purana' },
  'మణిద్వీప వర్ణన': { id: 'manidweepa-varnanam', name: 'Manidweepa Varnanam' },
  'చాణక్య నీతి': { id: 'chanakya-neeti', name: 'Chanakya Neeti' },
  'విదుర నీతి': { id: 'vidura-neeti', name: 'Vidura Neeti' },
  'గీతగోవిందం': { id: 'gita-govindam', name: 'Gita Govindam / Jayadeva-Ashtapadi' },
  'శ్రీ రామచరిత మానస': { id: 'ramacharitamanas', name: 'Sri Ramacharitamanas' },
  'శ్రీ మూక పంచ శతి': { id: 'mooka-pancha-shati', name: 'Sri Mooka Pancha Shati' },
  'భర్తృహరి శతక త్రిశతి': { id: 'bhartruhari-shataka-trishati', name: 'Bhartruhari Shataka Trishati' },
  'శతకాని': { id: 'shatakas', name: 'Shatakas (Telugu)' },
  'అష్టకాని': { id: 'ashtakas', name: 'Ashtakas' },
  'ఆది శంకరాచార్య స్తోత్రాణి': { id: 'adi-shankaracharya', name: 'Adi Shankaracharya Stotrams' },
  'శ్రీ రామ కీర్తనాః': { id: 'rama-keerthanas', name: 'Sri Rama Keerthanas' },
  'అన్నమయ్య కీర్తనాః': { id: 'annamayya-keerthanas', name: 'Annamayya Keerthanas' },
  'త్యాగరాజ కీర్తనాః': { id: 'thyagaraja-keerthanas', name: 'Thyagaraja Keerthanas' },
  'రామదాసు కీర్తనాః': { id: 'ramadasu-keerthanas', name: 'Ramadasu Keerthanas' },
  'రాఘవేంద్ర స్వామి స్తోత్రాణి': { id: 'raghavendra-swami', name: 'Raghavendra Swami Stotrams' },
  'తెలుగు గీతాని': { id: 'telugu-geethalu', name: 'Telugu Devotional / Songs' },
  'భారత మాత': { id: 'bharata-mata', name: 'Bharata Mata / Patriotic' },
  'స్వరాభ్యాసః - కర్ణాటక సంగీత పాఠాః': { id: 'carnatic-swarabhyasam', name: 'Carnatic Music Swarabhyasa' },
  'గీతాని - కర్ణాటక సంగీత పాఠాః': { id: 'carnatic-geetham', name: 'Carnatic Music Geetham' },
  'స్వరజతి - కర్ణాటక సంగీత పాఠాః': { id: 'carnatic-swarajathi', name: 'Carnatic Music Swarajathi' },
  'సంస్కృత గీతాని': { id: 'sanskrit-geethalu', name: 'Sanskrit Devotional Songs' },
  'కర్మ సిద్ధాంత': { id: 'karma-siddhanta', name: 'Karma Siddhanta' },
  'తత్త్వ శాస్త్ర': { id: 'tattva-shastra', name: 'Tattva Shastra' },
  'ప్రథమ కాండ - కృష్ణ యజుర్వేద తైత్తిరీయ సంహితా': { id: 'yajurveda-samhita-1', name: 'Krishna Yajurveda Taittiriya Samhita - Kanda 1' },
  'ద్వితీయ కాండ - కృష్ణ యజుర్వేద తైత్తిరీయ సంహితా': { id: 'yajurveda-samhita-2', name: 'Krishna Yajurveda Taittiriya Samhita - Kanda 2' },
  'తృతీయ కాండ - కృష్ణ యజుర్వేద తైత్తిరీయ సంహితా': { id: 'yajurveda-samhita-3', name: 'Krishna Yajurveda Taittiriya Samhita - Kanda 3' },
  'చతుర్థ కాండ - కృష్ణ యజుర్వేద తైత్తిరీయ సంహితా': { id: 'yajurveda-samhita-4', name: 'Krishna Yajurveda Taittiriya Samhita - Kanda 4' },
  'పంచమ కాండ - కృష్ణ యజుర్వేద తైత్తిరీయ సంహితా': { id: 'yajurveda-samhita-5', name: 'Krishna Yajurveda Taittiriya Samhita - Kanda 5' },
  'షష్ఠ కాండ - కృష్ణ యజుర్వేద తైత్తిరీయ సంహితా': { id: 'yajurveda-samhita-6', name: 'Krishna Yajurveda Taittiriya Samhita - Kanda 6' },
  'సప్తమ కాండ - కృష్ణ యజుర్వేద తైత్తిరీయ సంహితా': { id: 'yajurveda-samhita-7', name: 'Krishna Yajurveda Taittiriya Samhita - Kanda 7' }
};

const mappings = {};
const frontendCategories = [];

// Initialize mapping arrays
Object.keys(catMetaMap).forEach(key => {
  const meta = catMetaMap[key];
  mappings[meta.id] = [];
  frontendCategories.push({ id: meta.id, name: meta.name });
});

let unmatched = 0;
structure.forEach(c => {
  // Extract category name without count. e.g., "నిత్య పారాయణ శ్లోకాః (26)" -> "నిత్య పారాయణ శ్లోకాః"
  const catName = c.rawName.split('(')[0].trim();
  
  if (catMetaMap[catName]) {
    const meta = catMetaMap[catName];
    c.stotrams.forEach(s => {
      const parts = s.href.split('/');
      const slug = parts[parts.length - 1].replace(/\.html$/, '');
      if (!mappings[meta.id].includes(slug)) {
        mappings[meta.id].push(slug);
      }
    });
  } else {
    console.warn(`Unmatched category in structure: ${catName}`);
    unmatched++;
  }
});

// Save mappings to category-mappings.json
fs.writeFileSync(outputPath, JSON.stringify(mappings, null, 2), 'utf-8');
console.log(`Saved category mappings to src/data/category-mappings.json`);
console.log(`Unmatched categories count: ${unmatched}`);

// Output frontend structure for page.tsx
console.log('\n--- Copy for src/app/page.tsx ---');
console.log('const VIGNANAM_CATEGORIES = ' + JSON.stringify(frontendCategories, null, 2) + ';');
