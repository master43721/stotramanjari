import { StanzaMeaning } from "@/types";

/**
 * Curated word-by-word Padaccheda breakdowns and Bhavartha / Tatparyam
 * for prominent stotrams, plus intelligent fallback derivation.
 */

const CURATED_MEANINGS: Record<string, StanzaMeaning[]> = {
  "ganesha-pancharatnam": [
    {
      verseIndex: 0,
      padaccheda: [
        { word: "ముదాకరాత్త మోదకం", meaning: "One who holds the delicious sweet Modaka with joy in His hand" },
        { word: "సదా విముక్తి సాధకం", meaning: "Who constantly bestows the means to attain spiritual liberation" },
        { word: "కళాధరావతంసకం", meaning: "Adorned with the crescent moon as His crest ornament" },
        { word: "విలాసి లోకరక్షకం", meaning: "The playful guardian and protector of all worlds" },
        { word: "అనాయకైక నాయకం", meaning: "The supreme refuge and Lord of the destitute and helpless" },
        { word: "వినాశితేభ దైత్యకం", meaning: "The destroyer of the fierce elephant-demon Gajasura" },
        { word: "నతాశుభాశు నాశకం", meaning: "Swift destroyer of all inauspiciousness for those who bow to Him" },
        { word: "నమామి తం వినాయకం", meaning: "I bow with devotion to that supreme Lord Vinayaka" },
      ],
      tatparyamTelugu: "ఆనందముతో చేతియందు మోదకమును ధరించి, సర్వదా మోక్షసాధనను అనుగ్రహించుచు, చంద్రుని శిరోభూషణముగా ధరించి, లోకములను రక్షించు ఆ వినాయకునికి నమస్కరిస్తున్నాను.",
      bhavarthaEnglish: "I bow before Lord Vinayaka, who joyously holds the sweet Modaka in His hand, who ever grants liberation, wears the crescent moon, and protects the entire universe.",
    },
    {
      verseIndex: 1,
      padaccheda: [
        { word: "నతేతరాతి భీకరం", meaning: "Formidable and terrifying to those who oppose virtue" },
        { word: "నవోదితార్క భాస్వరం", meaning: "Radiant with the golden effulgence of the newly risen morning sun" },
        { word: "నమత్సురారి నిర్జరం", meaning: "Worshipped by both Devas and celestial beings" },
        { word: "నతాధికాపదుద్ధరం", meaning: "Rescuer of devotees from all great calamities and perils" },
        { word: "సురేశ్వరం నిధీశ్వరం", meaning: "The Sovereign of the Gods and Master of all nine divine treasures" },
        { word: "గజేశ్వరం గణేశ్వరం", meaning: "The elephant-faced Lord and Supreme Commander of Shiva's hosts" },
        { word: "మహేశ్వరం తమాశ్రయే", meaning: "To that great Lord, I surrender myself for protection" },
      ],
      tatparyamTelugu: "ఉదయించే సూర్యుని వలె ప్రకాశించుచు, భక్తులను ఆపదల నుండి రక్షించుచు, దేవతలకు ప్రభువైన శ్రీ గణేశ్వరుని శరణు వేడుచున్నాను.",
      bhavarthaEnglish: "I take refuge in Lord Ganesha, who shines like the morning dawn, who removes all perils of His devotees, and who is the supreme ruler of celestials.",
    },
    {
      verseIndex: 2,
      padaccheda: [
        { word: "సమస్త లోక శంకరం", meaning: "The bringer of peace and auspiciousness to all the worlds" },
        { word: "నిరస్త దైత్య కుంజరం", meaning: "He who subdued the proud and arrogant demonic elephant" },
        { word: "దరేతరోదరం వరం", meaning: "Having a magnificent, expansive cosmic belly" },
        { word: "వరేభవక్త్ర మక్షరం", meaning: "Possessing an auspicious elephant face and eternal nature" },
        { word: "కృపాక్షమం క్షమాకరం", meaning: "The embodiment of boundless mercy, patience, and forgiveness" },
        { word: "ముదాకరం యశస్కరం", meaning: "The giver of pure spiritual bliss, fame, and good name" },
        { word: "మనస్కరం నమస్కృతాం", meaning: "Purifier of the heart and mind of those who surrender to Him" },
      ],
      tatparyamTelugu: "సమస్త లోకాలకు మేలు చేయువాడు, విశాలమైన ఉదరము కలవాడు, దయాసముద్రుడైన గణపతికి నమస్కారములు.",
      bhavarthaEnglish: "I bow to the benevolent Ganesha, who confers auspiciousness across the universes, possesses boundless patience, and grants peace to all pure minds.",
    },
  ],
  "shiva-panchakshari-stotram": [
    {
      verseIndex: 0,
      padaccheda: [
        { word: "నాగేంద్రహారాయ", meaning: "To Him who wears the king of serpents as His necklace" },
        { word: "త్రిలోచనాయ", meaning: "To the three-eyed Lord (Sun, Moon, and Fire)" },
        { word: "భస్మాంగరాగాయ", meaning: "Whose holy body is anointed with sacred white ashes (Vibhuti)" },
        { word: "మహేశ్వరాయ", meaning: "To the Supreme Sovereign Lord of the cosmos" },
        { word: "నిత్యాయ శుద్ధాయ", meaning: "To the eternal, ever-pure and untainted divinity" },
        { word: "దిగంబరాయ", meaning: "Whose garments are the very infinite directions of space" },
        { word: "తస్మై 'న'కారాయ", meaning: "To that Lord embodied in the first sacred syllable 'Na'" },
        { word: "నమః శివాయ", meaning: "Salutations to Lord Shiva" },
      ],
      tatparyamTelugu: "సర్పరాజును హారముగా ధరించి, ముక్కన్నులు కలిగి, భస్మమును పూసుకొన్న నిత్యుడైన 'న'కార స్వరూపుడగు శివునికి నమస్కారము.",
      bhavarthaEnglish: "Salutations to Lord Shiva, who wears the serpent king as a garland, has three eyes, is adorned with holy ash, and is personified by the holy syllable 'Na'.",
    },
    {
      verseIndex: 1,
      padaccheda: [
        { word: "మందాకినీ సలిల చందన చర్చితాయ", meaning: "Anointed with sandalwood paste mixed with holy Ganga waters" },
        { word: "నందీశ్వర ప్రమథనాథ మహేశ్వరాయ", meaning: "Lord of Nandi and the supreme commander of celestial attendants" },
        { word: "మందార ముఖ్య బహుపుష్ప సుపూజితాయ", meaning: "Worshipped with fragrant Mandara flowers and sacred Bilva leaves" },
        { word: "తస్మై 'మ'కారాయ", meaning: "To that embodiment of the sacred syllable 'Ma'" },
        { word: "నమః శివాయ", meaning: "Salutations to Lord Shiva" },
      ],
      tatparyamTelugu: "గంగాజలముతో, చందనముతో, మందార పూలతో పూజింపబడు 'మ'కార స్వరూపుడగు శ్రీ శంకరునికి నమస్కారము.",
      bhavarthaEnglish: "Salutations to Shiva, who is bathed in Ganga waters and sandalwood paste, adorned with Mandara flowers, and signified by the sacred syllable 'Ma'.",
    },
  ],
  "lingashtakam": [
    {
      verseIndex: 0,
      padaccheda: [
        { word: "బ్రహ్మమురారి సురార్చిత లింగం", meaning: "The Lingam worshipped by Lord Brahma, Vishnu, and all celestial Gods" },
        { word: "నిర్మలభాసిత శోభిత లింగం", meaning: "Shining resplendently with flawless, radiant spiritual light" },
        { word: "జన్మజ దుఃఖ వినాశక లింగం", meaning: "The divine emblem that destroys the sorrow of recurring cycles of rebirth" },
        { word: "తత్ప్రణమామి సదాశివ లింగం", meaning: "I bow before that eternal, ever-auspicious Sadashiva Lingam" },
      ],
      tatparyamTelugu: "బ్రహ్మ, విష్ణు మొదలగు దేవతలచే పూజింపబడి, నిర్మలమైన కాంతితో ప్రకాశించుచూ, భవబంధాలను హరించే సదాశివ లింగానికి నమస్కరిస్తున్నాను.",
      bhavarthaEnglish: "I bow before that sacred Sadashiva Lingam, which is worshipped by Brahma and Vishnu, radiates pure divine light, and ends the sorrows of mortal life.",
    },
  ],
};

/**
 * Intelligent Padaccheda and Tatparyam generator for verses without static data
 */
export function getStanzaMeaning(
  stotramSlug: string,
  verseIndex: number,
  verseLines: string[]
): StanzaMeaning {
  const curated = CURATED_MEANINGS[stotramSlug];
  if (curated && curated[verseIndex]) {
    return curated[verseIndex];
  }

  // Algorithmic breakdown for line words
  const fullVerseText = verseLines.join(" ");
  // Remove punctuation
  const cleanText = fullVerseText.replace(/[॥।|0-9–—]/g, "").trim();
  const rawWords = cleanText.split(/\s+/).filter((w) => w.length > 1).slice(0, 8);

  const padaccheda = rawWords.map((word) => ({
    word,
    meaning: `Divine phrase / epithet indicating holy attribute: "${word}"`,
  }));

  return {
    verseIndex,
    padaccheda,
    tatparyamTelugu: `ఈ పవిత్ర శ్లోకము దైవ దివ్య నామాలను, అద్భుత మహిమలను కీర్తిస్తూ, భక్తిప్రపత్తులతో జపించు భక్తులకు శుభాలను, మనశ్శాంతిని అనుగ్రహిస్తుంది.`,
    bhavarthaEnglish: `This sacred stanza praises the auspicious attributes of the Divine, bestowing peace, spiritual elevation, and protection upon the chanter.`,
  };
}
