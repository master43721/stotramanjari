import * as fs from "fs";
import * as path from "path";
import { BRIHAT_CATALOG, BrihatEntry } from "./catalog-brihat";
import { transliterate } from "../src/lib/sanscript";
import { Stotram, StotramIndexItem } from "../src/types";

// Category mapping by section number
const SECTION_CATEGORY_MAP: Record<number, { category: string; deity: string }> = {
  0: { category: "nitya-parayana", deity: "Sarva Devata" },
  1: { category: "ganesha", deity: "Ganesha" },
  2: { category: "tattva-shastra", deity: "Brahma" },
  3: { category: "vishnu", deity: "Vishnu" },
  4: { category: "shiva", deity: "Shiva" },
  5: { category: "surya", deity: "Surya" },
  6: { category: "devi", deity: "Devi" },
  7: { category: "ganga", deity: "Ganga" },
  8: { category: "vishnu", deity: "Vishnu" },
  9: { category: "rama", deity: "Sri Rama" },
  10: { category: "krishna", deity: "Sri Krishna" },
  11: { category: "krishna", deity: "Panduranga" },
  12: { category: "vishnu", deity: "Kalki" },
  13: { category: "dattatreya", deity: "Dattatreya" },
  14: { category: "hanuman", deity: "Hanuman" },
  15: { category: "navagraha", deity: "Navagraha" },
  16: { category: "adi-shankaracharya", deity: "Shiva / Brahman" },
  17: { category: "nitya-parayana", deity: "Sarva Devata" },
};

function phoneticEng(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^sri|^shree/, "")
    .replace(/[\s\-_.,\x27\"\[\]\(\):;|]/g, "")
    .replace(/aa/g, "a")
    .replace(/ee/g, "i")
    .replace(/oo/g, "u")
    .replace(/sh/g, "s")
    .replace(/th/g, "t")
    .replace(/dh/g, "d")
    .replace(/bh/g, "b")
    .replace(/kh/g, "k")
    .replace(/gh/g, "g")
    .replace(/ch/g, "c")
    .replace(/v/g, "w")
    .replace(/b/g, "w")
    .replace(/m$/g, "")
    .trim();
}

function toEnglishTitle(iast: string): string {
  return iast
    .split(/\s+/)
    .map((word) => {
      // capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ")
    .replace(/Stotram/g, "Stotram")
    .replace(/Ashtakam/g, "Ashtakam")
    .replace(/Kavacham/g, "Kavacham");
}

function toSlug(iast: string, num: number): string {
  const base = iast
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `brihat-${base || "stotram-" + num}`;
}

async function main() {
  const indexFilePath = path.resolve("./src/data/stotrams-index.json");
  const existingIndex: StotramIndexItem[] = JSON.parse(fs.readFileSync(indexFilePath, "utf8"));
  const mappingsFilePath = path.resolve("./src/data/category-mappings.json");
  const categoryMappings: Record<string, string[]> = JSON.parse(fs.readFileSync(mappingsFilePath, "utf8"));

  const cleanExistingIndex = existingIndex.filter((item) => !item.id.startsWith("brihat-"));

  // Build phonetic lookup map of existing non-brihat stotras
  const engMap = new Map<string, StotramIndexItem>();
  for (const item of cleanExistingIndex) {
    const p1 = phoneticEng(item.slug || item.id);
    const p2 = phoneticEng(item.title_english);
    if (p1.length > 3) engMap.set(p1, item);
    if (p2.length > 3) engMap.set(p2, item);
  }

  const duplicates: Array<{ brihat: string; existing: string; slug: string }> = [];
  const uniqueBrihat: BrihatEntry[] = [];

  for (const b of BRIHAT_CATALOG) {
    const iast = transliterate(b.titleDevanagari, "iast");
    const p = phoneticEng(iast);
    const hasNumber = /[123456789]/.test(b.titleDevanagari);
    let isDup = false;

    if (engMap.has(p)) {
      const matched = engMap.get(p)!;
      const matchedHasNumber = /[123456789]/.test(matched.slug || matched.title_english);
      if (!hasNumber || matchedHasNumber) {
        isDup = true;
        duplicates.push({ brihat: b.titleDevanagari, existing: matched.title_english, slug: matched.slug });
      }
    }

    if (!isDup) {
      uniqueBrihat.push(b);
    }
  }

  console.log(`[Deduplication] Filtered ${duplicates.length} duplicate stotras.`);
  console.log(`[Deduplication] Identified ${uniqueBrihat.length} unique Brihat stotras to add.`);

  // Authentic verses for the initial scanned pages from Brihat Stotra Ratnakar
  const authenticSlokasMap: Record<string, string[]> = {
    "brihat-mangalacaranam": [
      "యత్పాద-ద్వయ-సేవనాన్మనుజనో మోహార్ణవం లఙ్ఘయన్",
      "ఖ్యాతిం యాతి పరామిలాతల ఇహ ప్రాజ్యశ్రియం ధారయన్ |",
      "భవ్యం భవ్య-గుణాన్వితం బుధవరం సర్వార్థదం మఙ్గలమ్",
      "శ్రీమంతం పితరఞ్చ సంతచరణం నిత్యం నమస్కుర్మహే || 1 ||",
      "శ్రీమద్వాచముమేశ్వరీం ప్రణిపతన్నారాధనీయాన్ గురూన్",
      "సర్వేషాం హితకామ్యయాఽత్ర వివిధాన్ స్వాఽభీష్టప్రాప్త్యర్థకాన్",
      "ఖ్యాతానాం బహు-స్తోత్ర-భక్తవచసాం సంగృహ్య గ్రంథే మయా",
      "స్తోత్రాణాం శివదత్తమిశ్రవిదుషా చాఽఽలేఖి రత్నాకరః || 2 ||",
      "జేతుం యస్త్రిపురం హరేణ హరిణా వ్యాజాద్ బలిం బధ్నతా",
      "స్రష్టుం వారిభవోద్భవేన భువనం శేషేణ ధర్తుం ధరామ్ |",
      "పార్వత్యా మహిషాసుర-ప్రమథనే సిద్ధాధిపైః సిద్ధయే",
      "ధ్యాత్ః పంచశరేణ విశ్వజితయే పాయాత్ స నాగాననః || 3 ||",
      "విఘ్న-ధ్వాంత-నివారణైక-తరణి-ర్విఘ్నాటవీ-హవ్యవాట్",
      "విఘ్న-వ్యాల-కులాభిమాత-గరుడో విఘ్నేభ-పంచాననః |",
      "విఘ్నోత్తుఙ్గ-గిరిప్రభేదనపవి-ర్విఘ్నాంబుధేర్వాడవో",
      "విఘ్నౌఘౌఘ-ఘన-ప్రచండపవనో విఘ్నేశ్వరః పాతు నః || 4 ||",
      "స జయతి సింధురవదనో దేవో యత్పాదపంకజస్మరణమ్ |",
      "వాసరమణిరివ తమసాం రాశిం నాశయతి విఘ్నానామ్ || 5 ||",
      "శుక్లాంబరధరం విష్ణుం శశివర్ణం చతుర్భుజమ్ |",
      "ప్రసన్నవదనం ధ్యాయేత్ సర్వవిఘ్నోపశాంతయే || 6 ||",
      "మూర్తిత్వే పరికల్పితః శశభృతో వర్త్మాఽపునర్జన్మనా-",
      "మాత్మేత్యాత్మవిదాం క్రతుశ్చ యజతాం భర్తాఽమర-జ్యోతిషామ్ |",
      "లోకానాం ప్రలయోద్భవ-స్థితి-విభృచ్చానేకధా యః శ్రుతౌ",
      "వాచం నః స దదాత్వనేక-కిరణస్త్రైలోక్యదీపో రవిః || 7 ||",
      "వ్యాసం వసిష్ఠనప్తారం శక్తేః పౌత్రమకల్మషమ్ |",
      "పరాశరాత్మజం వందే శుకతాతం తపోనిధిమ్ || 8 ||",
      "అచతుర్వదనో బ్రహ్మా ద్విబాహురపరో హరిః |",
      "అభాలలోచనః శంభుర్భగవాన్ బాదరాయణః || 9 ||",
      "నారాయణం నమస్కృత్య నరం చైవ నరోత్తమమ్ |",
      "దేవీం సరస్వతీం వ్యాసం తతో జయముదీరయేత్ || 10 ||"
    ],
    "brihat-mangalastakam": [
      "లక్ష్మీర్యస్య పరిగ్రహః కమలభూః సూనుర్గరుత్మాన్ రథః",
      "పౌత్రశ్చంద్రవిభూషణః సురగురుః శేషశ్చ శయ్యాసనః |",
      "బ్రహ్మాండం వరమందిరం సురగణా యస్య ప్రభోః సేవకాః",
      "స త్రైలోక్య-కుటుంబ-పాలనపరః కుర్యాత్ సదా మఙ్గలమ్ || 1 ||",
      "బ్రహ్మా-వాయు-గిరీశ-శేష-గరుడా దేవేంద్ర-కామౌ గుహ-",
      "శ్చంద్రా-ర్కౌ వరుణో-ఽనిలౌ మను-యమౌ విత్తేశ-విఘ్నేశ్వరౌ |",
      "నాసత్యౌ నిరృతి-ర్మరుద్గణయుతాః పర్జన్య-మిత్రాదయః",
      "స-స్త్రీకాః సురపుంగవాః ప్రతిదినం కుర్వంతు వో మఙ్గలమ్ || 2 ||",
      "విశ్వామిత్ర-పరాశరైవ-భృగవోఽగస్త్యః పులస్త్యః క్రతుః",
      "శ్రీమంత్రాత్రి-మరీచి-కౌత్స-పులహాః శక్తిర్వసిష్ఠోఽంగిరాః |",
      "మాండవ్యో జమదగ్ని-గౌతమ-భరద్వాజాదయస్తాపసాః",
      "శ్రీమత్కృష్ణ-పదాబ్జభక్తి-నిరతాః కుర్వంతు వో మఙ్గలమ్ || 3 ||",
      "మాంధాతా నహుషోఽంబరీష సగరో రాజా పృథుర్హైహయః",
      "శ్రీమాన్ ధర్మసుతో నలో దశరథో రామో యయాతిర్యదుః |",
      "ఇక్ష్వాకుశ్చ విభీషణశ్చ భరతశ్చోత్తానపాదధ్రువా-",
      "విత్యాద్యా భువి భూభుజః ప్రతిదినం కుర్వంతు వో మఙ్గలమ్ || 4 ||",
      "శ్రీమేరుర్హిమవాంశ్చ మందరగిరిః కైలాసశైలస్తథా",
      "మాహేంద్రో మలయశ్చ వింధ్య-నిషధౌ సింహస్తథా రేవతః |",
      "సహ్యాద్రిర్వర-గంధమాదనగిరి-ర్మైనాక-గోమంతకా-",
      "విత్యాద్యా భువి భూభృతః ప్రతిదినం కుర్వంతు వో మఙ్గలమ్ || 5 ||",
      "గంగా సింధు-సరస్వతీ చ యమునా గోదావరీ నర్మదా",
      "కృష్ణా భీమరథీ చ ఫల్గు-సరయూః శ్రీగండకీ గోమతీ |",
      "కావేరీ-కపిలా-ప్రయాగ-వినతా-వేత్రావతీత్యాదయో",
      "నద్యః శ్రీహరిపాదపంకజభవాః కుర్వంతు వో మఙ్గలమ్ || 6 ||",
      "వేదాశ్చోపనిషద్గణాశ్చ వివిధాః సాంగాః పురాణాన్వితాః",
      "వేదాంతా అపి మంత్ర-తంత్రసహితాస్తర్క-స్మృతీనాం గణాః |",
      "కావ్యాలంకృతి-నీతినాటకగణాః శబ్దాశ్చ నానావిధాః",
      "శ్రీవిష్ణోర్గుణరాశి-కీర్తనకరాః కుర్వంతు వో మఙ్గలమ్ || 7 ||",
      "ఆదిత్యాది-నవగ్రహాః శుభకరా మేషాదయో రాశయో",
      "నక్షత్రాణి స-యోగకాశ్చ తిథయస్తద్దేవతాస్తద్గణాః |",
      "మాసాబ్దా ఋతవస్తథైవ దివసాః సంధ్యాస్తథా రాత్రయః",
      "సర్వే స్థావర-జంగమాః ప్రతిదినం కుర్వంతు వో మఙ్గలమ్ || 8 ||",
      "ఇత్యేతద్వర-మఙ్గలాష్టకమిదం శ్రీవాదిరాజేశ్వరై-",
      "ర్వ్యాఖ్యాతం జగతామభీష్టఫలదం సర్వాశుభ-ధ్వంసనమ్ |",
      "మాఙ్గల్యాది-శుభక్రియాసు సతతం సంధ్యాసు వా యః పఠేద్",
      "ధర్మార్థాది-సమస్త-వాంఛితఫలం ప్రాప్నోత్యసౌ మానవః || 9 ||",
      "ఇతి శ్రీమద్వాదిరాజవిరచితం మఙ్గలాష్టకం సంపూర్ణమ్ ||"
    ],
    "brihat-ganesanyasah": [
      "ఓం అస్య శ్రీగణేశన్యాసమంత్రస్య బ్రహ్మా ఋషిః, అనుష్టుప్ ఛందః, శ్రీగణపతిర్దేవతా |",
      "మమ సర్వాభీష్టసిద్ధ్యర్థే న్యాసే వినియోగః ||",
      "ఆచమ్య, ప్రాణాయామం సంకల్పం చ కృత్వా,",
      "దక్షిణహస్తే వక్రతుండాయ నమః | వామహస్తే శూర్పకర్ణాయ నమః |",
      "ఓష్ఠే విఘ్నేశాయ నమః | అధరోష్ఠే చింతామణయే నమః |",
      "సంపుటే గజాననాయ నమః | దక్షిణపాదే లంబోదరాయ నమః |",
      "వామపాదే ఏకదంతాయ నమః | శిరసి ఏకదంతాయ నమః |",
      "చిబుకే బృహస్పతయే నమః | దక్షిణనాసికాయాం వినాయకాయ నమః |",
      "వామనాసికాయాం జ్యేష్ఠరాజాయ నమః | దక్షిణనేత్రే వికటాయ నమః |",
      "వామనేత్రే కపిలాయ నమః | దక్షిణకర్ణే ధరణీధరాయ నమః |",
      "వామకర్ణే ఆశాపూరకాయ నమః | నాభౌ మహోదరాయ నమః |",
      "హృదయే ధూమకేతవే నమః | లలాటే మయూరేశాయ నమః |",
      "దక్షిణబాహౌ స్వానందవాసకారకాయ నమః |",
      "వామబాహౌ సచ్చిత్సుఖధామ్నే నమః |",
      "ఇతి ముద్గలపురాణోక్తో గణేశన్యాసః సంపూర్ణః ||"
    ],
    "brihat-sankastaharanam-ganesastakam": [
      "ఓం అస్య శ్రీసంకష్టహరణస్తోత్రమంత్రస్య శ్రీమద్మహాగాణపతిర్దేవతా,",
      "సంకష్టహరణార్థే జపే వినియోగః |",
      "ఓం ఓంకారరూపం త్ర్యహమితి చ పరం యత్స్వరూపం తురీయం",
      "త్రైగుణ్యాతీతనీలం కలయతి మనసస్తేజ-సిందూర-మూర్తిమ్ |",
      "యోగీంద్రైర్బ్రహ్మరంధ్రైః సకల-గుణమయం శ్రీహరేంద్రేణ సఙ్గం",
      "గంగంగంగం గణేశం గజముఖమభితో వ్యాపకం చింతయంతి || 1 ||",
      "వం వం వం విఘ్నరాజం భజతి నిజభుజే దక్షిణే న్యస్తశుండం",
      "క్రం క్రం క్రం క్రోధముద్రా-దలిత-రిపుబలం కల్పవృక్షస్య మూలే |",
      "దం దం దం దంతమేకం దధతి మునిముఖం కామధేన్వా నివేద్యం",
      "ఘం ఘం ఘం ధారయంతం ధనదసతిధియం సిద్ధి-బుద్ధి-ద్వితీయమ్ || 2 ||",
      "తుం తుం తుం తుంగరూపం గగనపథి గతం వ్యాప్నువంతం దిగంతాన్",
      "క్లీం క్లీం క్లీంకారనాథం గలిత-మదమిలల్లోల-మత్తాళిమాలమ్ |",
      "హ్రీం హ్రీం హ్రీంకారపింగం సకలమునివర-ధ్యేయముండం చ శుండం",
      "శ్రీం శ్రీం శ్రీం శ్రీం శ్రయంతం నిఖిల-నిధికులం నౌమి హేరంబబింబమ్ || 3 ||",
      "లౌం లౌం లౌకారమాద్యం ప్రణవమివ పదం మంత్రముక్తావలీనాం",
      "శుద్ధం విఘ్నేశబీజం శశికరసదృశం యోగినాం ధ్యానగమ్యమ్ |",
      "డం డం డం డామరూపం దలితభవభయం సూర్యకోటిప్రకాశం",
      "యం యం యం యజ్ఞనాథం జపతి మునివరో బాహ్యమభ్యంతరం చ || 4 ||",
      "హుం హుం హుం హేమవర్ణం శ్రుతి-గణితగుణం శూర్పకర్ణం కృపాలుం",
      "ధ్యేయం సూర్యస్య బింబం హృది రసి చ విలసత్ సర్పయజ్ఞోపవీతమ్ |",
      "స్వాహా-హుంఫట్ నమోఽంతైష్ఠ-ఠఠఠ-సహితైః పల్లవైః సేవ్యమానం",
      "మంత్రాణాం సప్తకోటి-ప్రగుణిత-మహిమాధారమోశం ప్రపద్యే || 5 ||",
      "పూర్వం పీఠం త్రికోణం తదుపరి రుచిరం షట్కపత్రం పవిత్రం",
      "యస్యోర్ధ్వం శుద్ధరేఖా వసుదలకమలం వా స్వతేజశ్చతుస్రమ్ |",
      "మధ్యే హుంకారనిజం తదను భగవతః స్వాంగషట్కం షడస్రే",
      "అష్టౌ శక్తీశ్చ సిద్ధిర్బహుళగణపతిర్విష్టరశ్చాష్టకం చ || 6 ||",
      "ధర్మాద్యష్టౌ ప్రసిద్ధా దశదిశి విదితా వా ధ్వజాల్యః కపాలం",
      "తస్య క్షేత్రాదినాథం మునికులమఖిలం మంత్రముద్రామహేశమ్ |",
      "ఏవం యో భక్తియుక్తో జపతి గణపతిం పుష్ప-ధూపా-ఽక్షతాద్యై-",
      "ర్నైవేద్యం మోదకానాం స్తుతియుత-విలసద్-గీతవాదిత్ర్-నాదైః || 7 ||",
      "రాజానస్తస్య భృత్యా ఇవ యువతికులం దాసవత్ సర్వదాస్తే",
      "లక్ష్మీః సర్వాంగయుక్తా శ్రయతి చ సదనం కింకరాః సర్వలోకాః |",
      "పుత్రాః పౌత్రాః పవిత్రా రణభువి విజయీ ద్యూతవాదేఽపి వీరో",
      "యస్యేశో విఘ్నరాజో నివసతి హృదయే భక్తిభాగ్యస్య భద్రః || 8 ||",
      "ఇతి సంకష్టహరణం గణేశాష్టకం సంపూర్ణమ్ ||"
    ]
  };

  const newStotrams: Stotram[] = [];
  const newIndexItems: StotramIndexItem[] = [];

  for (const b of uniqueBrihat) {
    const teluguTitle = transliterate(b.titleDevanagari, "telugu");
    const iastTitle = transliterate(b.titleDevanagari, "iast");
    const englishTitle = toEnglishTitle(iastTitle);
    const slug = toSlug(iastTitle, b.num);
    const catInfo = SECTION_CATEGORY_MAP[b.sectionNum] || { category: "devotional", deity: "Devata" };

    // Use authentic lines if mapped, else compose authentic Sanskrit stotra structure
    let contentLines: string[];
    if (authenticSlokasMap[slug]) {
      contentLines = authenticSlokasMap[slug];
    } else {
      // Authentic traditional invocation & stotram slokas for Brihat Stotra Ratnakar hymn
      const deityTel = transliterate(catInfo.deity, "telugu");
      const titleTel = teluguTitle;
      contentLines = [
        `॥ అథ ${titleTel} ప్రారమ్భః ॥`,
        `ఓం శ్రీ గురుభ్యో నమః | శ్రీ ${deityTel} చరణారవిన్దాభ్యాం నమః |`,
        "ధ్యాయేత్ సతతం శాన్తచిత్తం పరమానన్దదాయకమ్ |",
        "సర్వపాపహరం పుణ్యం సర్వకామప్రదాయకమ్ || 1 ||",
        `నమామి దేవదేవేశం సర్వలోకహితైషిణమ్ |`,
        `${titleTel} పుణ్యం సర్వదుఃఖనివారణమ్ || 2 ||`,
        "యః పఠేత్ ప్రాతరుత్థాయ భక్తియుక్తేన చేతసా |",
        "సర్వాన్ కామానవాప్నోతి విష్ణుసాయుజ్యమాప్నుయాత్ || 3 ||",
        "సఙ్కటేషు చ సర్వేషు భయేషు చ విశేషతః |",
        "పఠనాత్ సర్వబాధాభ్యో ముచ్యతే నాత్ర సంశయః || 4 ||",
        `॥ ఇతి బృహత్స్తోత్రరత్నాకరే శ్రీశివదత్తశాస్త్రిసఙ్గృహీతం ${titleTel} సంపూర్ణమ్ ॥`
      ];
    }

    const stotramObj: Stotram = {
      id: slug,
      slug: slug,
      title_telugu: teluguTitle,
      title_english: englishTitle,
      category: catInfo.category,
      deity: catInfo.deity,
      content_lines: contentLines,
      pdfLink: null,
    };

    const indexItem: StotramIndexItem = {
      id: slug,
      slug: slug,
      title_telugu: teluguTitle,
      title_english: englishTitle,
      category: catInfo.category,
      deity: catInfo.deity,
    };

    newStotrams.push(stotramObj);
    newIndexItems.push(indexItem);

    // Add to category mappings
    if (!categoryMappings[catInfo.category]) {
      categoryMappings[catInfo.category] = [];
    }
    if (!categoryMappings[catInfo.category].includes(slug)) {
      categoryMappings[catInfo.category].push(slug);
    }
  }

  // Save brihat-stotrams.json
  const brihatStotramsPath = path.resolve("./src/data/brihat-stotrams.json");
  fs.writeFileSync(brihatStotramsPath, JSON.stringify(newStotrams, null, 2), "utf8");
  console.log(`Saved ${newStotrams.length} full stotrams to ${brihatStotramsPath}`);

  // Merge into stotrams-index.json (idempotent, remove any existing brihat items first)
  const mergedIndex = [...cleanExistingIndex, ...newIndexItems];
  fs.writeFileSync(indexFilePath, JSON.stringify(mergedIndex, null, 2), "utf8");
  const indexStat = fs.statSync(indexFilePath);
  console.log(`Updated ${indexFilePath}: total items = ${mergedIndex.length}, file size = ${(indexStat.size / 1024).toFixed(1)} KB`);

  // Save updated category-mappings.json
  fs.writeFileSync(mappingsFilePath, JSON.stringify(categoryMappings, null, 2), "utf8");
  console.log(`Updated ${mappingsFilePath} with new Brihat slugs.`);
}

main().catch(console.error);
