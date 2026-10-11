/**
 * Rich Stotram Dataset with Multi-Script Text, Word-by-Word Meanings,
 * Philosophical Bhavartha, and Karaoke Audio Timestamps
 */
(function (global) {
  'use strict';

  var STOTRAMS_DATA = [
    {
      id: 'ganesha-pancharatnam',
      title_telugu: 'శ్రీ గణేశ పంచరత్న స్తోత్రం',
      title_devanagari: 'श्री गणेश पञ्चरत्न स्तोत्रम्',
      title_english: 'Sri Ganesha Pancharatnam',
      deity: 'Lord Ganesha',
      composer: 'Adi Shankaracharya',
      category: 'ganesha',
      totalDurationSec: 86,
      verses: [
        {
          verseNumber: 1,
          startTime: 0,
          endTime: 14,
          lines_telugu: [
            'ముదాకరాత్తమోదకం సదావిముక్తిసాధకం',
            'కలాధరావతంసకం విలాసిలోకరక్షకమ్ |',
            'అనాయకైకనాయకం వినాశితేభదైత్యకం',
            'నతాశుభాశునాశకం నమామి తం వినాయకమ్ || 1 ||'
          ],
          lines_devanagari: [
            'मुदाकरात्तमोदकं सदाविमुक्तिसाधकं',
            'कलाधरावतंसकं विलासिलोकरक्षकम् ।',
            'अनायकैकनायकं विनाशितेभदैत्यकं',
            'नताशुभाशुनाशकं नमामि तं विनायकम् ॥ १ ॥'
          ],
          wordBreakdown: [
            { word: 'ముదా-కర-ఆత్త-మోదకం', meaning: 'Holding the delicious sweet modaka in hand with pure joy' },
            { word: 'సదా-విముక్తి-సాధకం', meaning: 'The eternal guide who bestows liberation and moksha upon devotees' },
            { word: 'కలాధర-అవతంసకం', meaning: 'Wearing the radiant crescent moon as his supreme crown ornament' },
            { word: 'విలాసి-లోక-రక్షకం', meaning: 'The playful protector of the entire cosmic universe' },
            { word: 'అనాయక-ఏక-నాయకం', meaning: 'The sole supreme refuge and lord for those with no other savior' },
            { word: 'వినాశిత-ఇభ-దైత్యకం', meaning: 'The vanquisher of the proud elephant demon Gajasura' },
            { word: 'నత-అశుభ-ఆశు-నాశకం', meaning: 'Quickly annihilating the inauspicious misfortunes of surrendered seekers' },
            { word: 'నమామి తం వినాయకం', meaning: 'I bow down with total reverence to that magnificent Lord Vinayaka' }
          ],
          englishSummary: 'I bow with deep devotion to Lord Vinayaka, who joyfully holds the sacred modaka sweetmeat in His hand, who bestows eternal liberation, who wears the crescent moon as an adornment, and who instantly dispels all afflictions of those who surrender to Him.',
          teluguTatparyam: 'ఆనందముతో చేతియందు మోదకమును ధరించినవాడు, ముక్తిని ప్రసాదించువాడు, చంద్రుని శిరస్సున అలంకరించుకున్నవాడు, దిక్కులేని వారికి ఏకైక నాయకుడైన శ్రీ వినాయకునకు భక్తితో ప్రణమిల్లుచున్నాను.'
        },
        {
          verseNumber: 2,
          startTime: 14,
          endTime: 28,
          lines_telugu: [
            'నతేతరాతిభీకరం నవోదితార్కభాస్వరం',
            'నమత్సరారినిర్జరం నతాధికాపదుద్ధరమ్ |',
            'సురేశ్వరం నిధీశ్వరం గజేశ్వరం గణేశ్వరం',
            'మహేశ్వరం తమాశ్రయే పరాత్పరం నిరంతరమ్ || 2 ||'
          ],
          lines_devanagari: [
            'नतेतरातिभीकरं नवोदितार्कभास्वरं',
            'नमत्सुरारिनिर्जरं नताधिकापदुद्धरम् ।',
            'सुरेश्वरं निधीश्वरं गजेश्वरं गणेश्वरं',
            'महेश्वरं तमाश्रये परात्परं निरन्तरम् ॥ २ ॥'
          ],
          wordBreakdown: [
            { word: 'నత-ఇతర-అతి-భీకరం', meaning: 'Fierce and terrifying only to enemies of dharma' },
            { word: 'నవోదిత-అర్క-భాస్వరం', meaning: 'Shining brilliantly like the blazing freshly-risen morning sun' },
            { word: 'నమత్-సురారి-నిర్జరం', meaning: 'Revered and saluted by devas and even vanquished foes' },
            { word: 'నత-అధిక-ఆపద్-ఉద్ధరం', meaning: 'Lifting his surrendered devotees above deep perils and tribulations' },
            { word: 'సురేశ్వరం నిధీశ్వరం', meaning: 'Supreme Lord of divine gods and master of all treasures (Nidhis)' },
            { word: 'గజేశ్వరం గణేశ్వరం', meaning: 'The noble elephant-headed Lord, master of all celestial ganas' },
            { word: 'మహేశ్వరం తమ్ ఆశ్రయే', meaning: 'To that great almighty Supreme Lord, I take eternal refuge' }
          ],
          englishSummary: 'I continually surrender to the Supreme Ruler, who shines dazzling like the morning sun, who delivers surrendered souls from supreme calamities, and who is the revered master of the celestials and all spiritual treasures.',
          teluguTatparyam: 'ఉదయించే సూర్యుని వలె దేదీప్యమానుడై, శరణుజొచ్చిన భక్తులను ఘోరమైన ఆపదల నుండి రక్షించే దేవదేవుడైన గణేశ్వరుని నిరంతరం ఆశ్రయిస్తున్నాను.'
        },
        {
          verseNumber: 3,
          startTime: 28,
          endTime: 42,
          lines_telugu: [
            'సమస్తలోకశంకరం నిరస్తదైత్యకుంజరం',
            'దరేతరోదరం వరం వరేభవక్త్రమక్షరమ్ |',
            'కృపాకరం క్షమాకరం ముదాకరం యశస్కరం',
            'మనస్కరం నమస్కృతాం నమస్కరోమి భాస్వరమ్ || 3 ||'
          ],
          lines_devanagari: [
            'समस्तलोकशङ्करं निरस्तदैत्यकुञ्जरं',
            'दरेतरोदरं वरं वरेभवक्त्रमक्षरम् ।',
            'कृपाकरं क्षमाकरं मुदाकरं यशस्करं',
            'मनस्करं नमस्कृतां नमस्करोमि भास्वरम् ॥ ३ ॥'
          ],
          wordBreakdown: [
            { word: 'సమస్త-లోక-శంకరం', meaning: 'Bestower of auspicious blessings and tranquility to all worlds' },
            { word: 'నిరస్త-దైత్య-కుంజరం', meaning: 'Subduer of the arrogant demon armies that resemble rutting wild elephants' },
            { word: 'దరేతర-ఉదరం వరం', meaning: 'Possessing a magnificent broad belly representing cosmic fullness' },
            { word: 'వరేభ-వక్త్రమ్-అక్షరమ్', meaning: 'Having the sacred face of an auspicious tusker, imperishable and eternal' },
            { word: 'కృపాకరం క్షమాకరం', meaning: 'Abundant ocean of boundless compassion and forgiving grace' },
            { word: 'ముదాకరం యశస్కరం', meaning: 'Granter of unceasing bliss and glowing righteous fame' },
            { word: 'నమస్కరోమి భాస్వరమ్', meaning: 'I offer my reverent obeisances to that luminous, effulgent deity' }
          ],
          englishSummary: 'I bow down to that luminous, eternal Lord, who bestows auspiciousness upon all existence, who has a benevolent form, and who graciously pours out mercy, forgiveness, happiness, and noble renown upon all who prostrate before Him.',
          teluguTatparyam: 'సకల లోకాలకు శుభాలను కూర్చువాడు, కరుణాసముద్రుడు, క్షమాశీలుడు, సంతోషాన్ని, కీర్తిని అనుగ్రహించే ఆ దివ్య స్వరూపునికి నా ప్రణామాలు.'
        },
        {
          verseNumber: 4,
          startTime: 42,
          endTime: 56,
          lines_telugu: [
            'అకించనార్తిమార్జనం చిరంతనోక్తిభాజనం',
            'పురారిపూర్వనందనం సురారిగర్వచర్వణమ్ |',
            'ప్రపంచనాశభీషణం ధనంజయాదిభూషణం',
            'కపోలదానవారణం భజే పురాణవారణమ్ || 4 ||'
          ],
          lines_devanagari: [
            'अकिञ्चनार्तिमार्जनं चिरन्तनोक्तिभाजनं',
            'पुरारिपूर्वनन्दनं सुरारिगर्वचर्वणम् ।',
            'प्रपञ्चनाशभीषणं धनञ्जयादिभूषणं',
            'कपोलदानवारणं भजे पुराणवारणम् ॥ ४ ॥'
          ],
          wordBreakdown: [
            { word: 'అకించన-ఆర్తి-మార్జనం', meaning: 'Dispelling the misery and suffering of the humble and helpless' },
            { word: 'చిరంతన-ఉక్తి-భాజనం', meaning: 'The central praise and truth celebrating the ancient Vedic hymns' },
            { word: 'పురారి-పూర్వ-నందనం', meaning: 'The elder beloved son of Lord Shiva (the destroyer of Tripura)' },
            { word: 'సురారి-గర్వ-చర్వణం', meaning: 'Crushing the arrogant ego and pride of the adversaries of divinity' },
            { word: 'భజే పురాణ-వారణమ్', meaning: 'I adore and meditate upon this ancient, primeval elephant deity' }
          ],
          englishSummary: 'I worship the ancient cosmic deity, who wipes away the distress of the destitute, who is praised in the ageless scriptures, and who is the first-born divine son of Tripurantaka Shiva.',
          teluguTatparyam: 'దీనుల కష్టములను తీర్చువాడు, వేదాలలో కీర్తించబడినవాడు, పరమశివుని జ్యేష్ఠ కుమారుడు అయిన ఆ పురాతన గణపతిని నేను పూజిస్తున్నాను.'
        },
        {
          verseNumber: 5,
          startTime: 56,
          endTime: 70,
          lines_telugu: [
            'నితాంతకాంతదంతకాంతిమంతకాంతకాత్మజం',
            'అచింత్యరూపమంతహీనమంతరాయకృంతనమ్ |',
            'హృదంతరే నిరంతరం వసంతమేవ యోగినాం',
            'తమేకదంతమేవ తం విచింతయామి సంతతమ్ || 5 ||'
          ],
          lines_devanagari: [
            'नितान्तकान्तदन्तकान्तिमन्तकान्तकात्मजं',
            'अचिन्त्यरूपमन्तहीनमन्तरायकृन्तनम् ।',
            'हृदन्तरे निरन्तरं वसन्तमेव योगिनां',
            'तमेकदन्तमेव तं विचिन्तयामि सन्ततम् ॥ ५ ॥'
          ],
          wordBreakdown: [
            { word: 'నితాంత-కాంత-దంత-కాంతిమ్', meaning: 'Having a single gleaming, wondrously radiant tusk' },
            { word: 'అంతకాంతక-ఆత్మజం', meaning: 'The noble son of Shiva, who conquered Yamaraja (the lord of death)' },
            { word: 'అచింత్య-రూపం అంత-హీనం', meaning: 'Incomprehensible in cosmic nature, boundless and infinite' },
            { word: 'అంతరాయ-కృంతనమ్', meaning: 'Severing and dispelling all obstacles, barriers, and anxieties' },
            { word: 'హృద్-అంతరే నిరంతరం వసంతం', meaning: 'Ever-abiding within the sanctum sanctorum of the yogis’ hearts' },
            { word: 'తమ్ ఏకదంతం విచింతయామి', meaning: 'Upon that glorious Ekadanta alone, I constantly meditate' }
          ],
          englishSummary: 'I meditate continuously upon that single-tusked Ekadanta, child of Shiva, whose infinite form is beyond mental comprehension, who cleaves all hindrances, and who resides eternally within the hearts of self-realized yogis.',
          teluguTatparyam: 'తేజోవంతమైన ఏకదంతమును కలిగినవాడు, యమసంహారకుడైన శివుని పుత్రుడు, యోగుల హృదయ కమలాలలో నివసించే ఆ ఏకదంతుని ఎల్లప్పుడూ ధ్యానిస్తున్నాను.'
        },
        {
          verseNumber: 6,
          startTime: 70,
          endTime: 86,
          lines_telugu: [
            'మహాగణేశపంచరత్నమాదరేణ యోఽన్వహం',
            'ప్రజల్పతి ప్రభాతకే హృది స్మరన్గణేశ్వరమ్ |',
            'అరోగతామదోషతాం సుసాహితీం సుపుత్రతాం',
            'సమాయురష్టభూతిమభ్యుపైతి సోఽచిరాత్ || ఫలశ్రుతిః ||'
          ],
          lines_devanagari: [
            'महागणेशपञ्चरत्नमादरेण योऽन्वहं',
            'प्रजल्पति प्रभातके हृदि स्मरन्गनेश्वरम् ।',
            'अरोगतामदोषतां सुसाहितीं सुपुत्रतां',
            'समायुरष्टभूतिमभ्युपैति सोऽचिरात् ॥ फलश्रुतिः ॥'
          ],
          wordBreakdown: [
            { word: 'మహాగణేశ-పంచరత్నం', meaning: 'This jewel hymn of five verses to Maha Ganesha' },
            { word: 'ఆదరేణ యః అన్వహం', meaning: 'Whoever chants with sincere devotion day after day' },
            { word: 'ప్రభాతకే హృది స్మరన్', meaning: 'At dawn, keeping the Lord visualized in their heart' },
            { word: 'అరోగతాం అదోషతాం', meaning: 'Flawless radiant health, freedom from sickness and sins' },
            { word: 'సుసాహితీం సుపుత్రతాం', meaning: 'Mastery over eloquence, arts and literature, noble progeny' },
            { word: 'అష్ట-భూతిమ్ అభ్యుపైతి', meaning: 'Attains long life and the eight divine spiritual & material opulences' }
          ],
          englishSummary: '[Phalasruthi] Whoever recites this Ganesha Pancharatnam with heartfelt reverence every dawn, holding Ganeshwara in their heart, swiftly attains sound health, freedom from blemishes, sublime learning, noble progeny, long life, and all eight prosperity boons.',
          teluguTatparyam: '[ఫలశ్రుతి] ప్రతి ఉదయం భక్తితో ఈ శ్రీ గణేశ పంచరత్న స్తోత్రమును పఠించేవారు ఆరోగ్యం, పాపరహిత జీవితం, విద్యా వివేకములు, దీర్ఘాయుష్షు మరియు అష్టైశ్వర్యములను పొందుతారు.'
        }
      ]
    },
    {
      id: 'shiva-panchakshari',
      title_telugu: 'శ్రీ శివ పంచాక్షరి స్తోత్రం',
      title_devanagari: 'श्री शिव पञ्चाक्षरी स्तोत्रम्',
      title_english: 'Sri Shiva Panchakshari Stotram',
      deity: 'Lord Shiva',
      composer: 'Adi Shankaracharya',
      category: 'shiva',
      totalDurationSec: 74,
      verses: [
        {
          verseNumber: 1,
          startTime: 0,
          endTime: 12,
          lines_telugu: [
            'నాగేంద్రహారాయ త్రిలోచనాయ',
            'భస్మాంగరాగాయ మహేశ్వరాయ |',
            'నిత్యాయ శుద్ధాయ దిగంబరాయ',
            'తస్మై నకారాయ నమః శివాయ || 1 ||'
          ],
          lines_devanagari: [
            'नागेन्द्रहाराय त्रिलोचनाय',
            'भस्माङ्गरागाय महेश्वराय ।',
            'नित्याय शुद्धाय दिगम्बराय',
            'तस्मै नकाराय नमः शिवाय ॥ १ ॥'
          ],
          wordBreakdown: [
            { word: 'నాగేంద్ర-హారాయ', meaning: 'To Him who has the king of serpents as garland' },
            { word: 'త్రిలోచనాయ', meaning: 'To the three-eyed Lord who sees past, present, and future' },
            { word: 'భస్మ-అంగరాగాయ', meaning: 'Whose divine body is smeared with sacred ashes' },
            { word: 'నిత్యాయ శుద్ధాయ', meaning: 'Eternal, ever-pure, untouched by impurities' },
            { word: 'తస్మై "న"కారాయ నమః శివాయ', meaning: 'Salutations to Shiva, embodied as the sacred syllable "NA"' }
          ],
          englishSummary: 'To the three-eyed Great God adorned with the king of serpents as His garland, smeared with holy ash, ever-pure and boundless — to Him, embodied in the syllable "NA", salutations to Shiva!',
          teluguTatparyam: 'పాములను హారంగా ధరించి, మూడు కన్నులు కలిగి, విభూతిని పూసుకున్న నిత్యుడైన శివునికి, "న"కార స్వరూపునికి నమస్కారం.'
        },
        {
          verseNumber: 2,
          startTime: 12,
          endTime: 24,
          lines_telugu: [
            'మందాకినీసలిలచందనచర్చితాయ',
            'నందీశ్వరప్రమథనాథమహేశ్వరాయ |',
            'మందారపుష్పబహుపుష్పసుపూజితాయ',
            'తస్మై మకారాయ నమః శివాయ || 2 ||'
          ],
          lines_devanagari: [
            'मन्दाकिनीसलिलचन्दनचर्चिताय',
            'नन्दीश्वरप्रमथनाथमहेश्वराय ।',
            'मन्दारपुष्पबहुपुष्पसुपूजिताय',
            'तस्मै मकाराय नमः शिवाय ॥ २ ॥'
          ],
          wordBreakdown: [
            { word: 'మందాకినీ-సలిల-చందన-చర్చితాయ', meaning: 'Bathed with heavenly Ganga waters and sandalwood paste' },
            { word: 'నందీశ్వర-ప్రమథనాథ-మహేశ్వరాయ', meaning: 'Master of Nandi and sovereign lord of the Pramatha ganas' },
            { word: 'మందార-పుష్ప-సుపూజితాయ', meaning: 'Worshipped with Mandara and celestial fragrant flowers' },
            { word: 'తస్మై "మ"కారాయ నమః శివాయ', meaning: 'Salutations to Shiva, embodied as the sacred syllable "MA"' }
          ],
          englishSummary: 'To the Supreme Lord worshipped with waters of the Mandakini Ganga and sandalwood, ruler of Nandi and the Pramathas, adored with Mandara blossoms — to Him, embodied in the syllable "MA", salutations to Shiva!',
          teluguTatparyam: 'గంగాజలముతో, గంధముతో అభిషేకించబడి, నందికి ప్రభువైన "మ"కార స్వరూపుడైన శ్రీ సాంబశివునికి నా నమస్కారములు.'
        },
        {
          verseNumber: 3,
          startTime: 24,
          endTime: 36,
          lines_telugu: [
            'శివాయ గౌరీవదనాబ్జబృంద-',
            'సూర్యాయ దక్షాధ్వరనాశకాయ |',
            'శ్రీనీలకంఠాయ వృషధ్వజాయ',
            'తస్మై శికారాయ నమః శివాయ || 3 ||'
          ],
          lines_devanagari: [
            'शिवाय गौरीवदनाब्जबृन्द-',
            'सूर्याय दक्षाध्वरनाशकाय ।',
            'श्रीनीलकण्ठाय वृषध्वजाय',
            'तस्मै शिकाराय नमः शिवाय ॥ ३ ॥'
          ],
          wordBreakdown: [
            { word: 'గౌరీ-వదన-అబ్జ-సూర్యాయ', meaning: 'The radiant sun that blooms the lotus-face of Goddess Gauri' },
            { word: 'దక్ష-అధ్వర-నాశకాయ', meaning: 'The destroyer of Daksha’s arrogant ritual sacrifice' },
            { word: 'శ్రీనీలకంఠాయ వృషధ్వజాయ', meaning: 'The blue-throated savior who bears the bull flag' },
            { word: 'తస్మై "శి"కారాయ నమః శివాయ', meaning: 'Salutations to Shiva, embodied as the sacred syllable "SHI"' }
          ],
          englishSummary: 'To Him who is the sun blossoming the lotus face of Mother Gauri, destroyer of Daksha’s sacrifice, blue-throated and bearing the bull emblem — to Him, embodied in the syllable "SHI", salutations to Shiva!',
          teluguTatparyam: 'పార్వతీదేవి ముఖపద్మాన్ని వికసింపజేసే సూర్యుడు, నీలకంఠుడు, "శి"కార స్వరూపుడైన పరమశివునికి ప్రణామాలు.'
        },
        {
          verseNumber: 4,
          startTime: 36,
          endTime: 48,
          lines_telugu: [
            'వసిష్ఠకుంభోద్భవగౌతమార్యు-',
            'మునీంద్రదేవార్చితశేఖరాయ |',
            'చంద్రార్కవైశ్వానరలోచనాయ',
            'తస్మై వకారాయ నమః శివాయ || 4 ||'
          ],
          lines_devanagari: [
            'वसिष्ठकुम्भोद्भवगौतमार्य-',
            'मुनीन्द्रदेवार्चितशेखराय ।',
            'चन्द्रार्कवैश्वानरलोचनाय',
            'तस्मै वकाराय नमः शिवाय ॥ ४ ॥'
          ],
          wordBreakdown: [
            { word: 'వసిష్ఠ-కుంభోద్భవ-గౌతమ-అర్చిత', meaning: 'Worshipped by great sages Vasishta, Agastya, and Gautama' },
            { word: 'చంద్ర-అర్క-వైశ్వానర-లోచనాయ', meaning: 'Whose three eyes are the Moon, the Sun, and Agni fire' },
            { word: 'తస్మై "వ"కారాయ నమః శివాయ', meaning: 'Salutations to Shiva, embodied as the sacred syllable "VA"' }
          ],
          englishSummary: 'To Him whose crowned head is revered by great sages Vasishta, Agastya, and Gautama, whose three eyes are the Moon, Sun, and Fire — to Him, embodied in the syllable "VA", salutations to Shiva!',
          teluguTatparyam: 'వసిష్ఠ, అగస్త్య, గౌతమ మహర్షుల చేత పూజింపబడుతూ, చంద్ర, సూర్య, అగ్నులను నేత్రాలుగా కలిగిన "వ"కార స్వరూపునికి నమస్కారం.'
        },
        {
          verseNumber: 5,
          startTime: 48,
          endTime: 60,
          lines_telugu: [
            'యజ్ఞస్వరూపాయ జటాధరాయ',
            'పినాకహస్తాయ సనాతనాయ |',
            'దివ్యాయ దేవాయ దిగంబరాయ',
            'తస్మై యకారాయ నమః శివాయ || 5 ||'
          ],
          lines_devanagari: [
            'यज्ञस्वरूपाय जटाधराय',
            'पिनाकहस्ताय सनातनाय ।',
            'दिव्याय देवाय दिगम्बराय',
            'तस्मै यकाराय नमः शिवाय ॥ ५ ॥'
          ],
          wordBreakdown: [
            { word: 'యజ్ఞస్వరూపాయ జటాధరాయ', meaning: 'The embodiment of holy sacrifice, bearing matted locks' },
            { word: 'పినాక-హస్తాయ సనాతనాయ', meaning: 'Holding the sacred bow Pinaka, primeval and ageless' },
            { word: 'తస్మై "య"కారాయ నమః శివాయ', meaning: 'Salutations to Shiva, embodied as the sacred syllable "YA"' }
          ],
          englishSummary: 'To the embodiment of cosmic sacrifice, bearing matted locks, holding the Pinaka bow, primeval and resplendent — to Him, embodied in the syllable "YA", salutations to Shiva!',
          teluguTatparyam: 'యజ్ఞస్వరూపుడు, జటాజూటధారి, పినాక ధనుస్సును చేతబూనిన ఆదిదేవుడైన "య"కార స్వరూపునికి ప్రణామాలు.'
        },
        {
          verseNumber: 6,
          startTime: 60,
          endTime: 74,
          lines_telugu: [
            'పంచాక్షరమిదం పుణ్యం యః పఠేచ్ఛివసన్నిధౌ |',
            'శివలోకమవాప్నోతి శివేన సహ మోదతే || ఫలశ్రుతిః ||'
          ],
          lines_devanagari: [
            'पञ्चाक्षरमिदं पुण्यं यः पठेच्छिवसन्निधौ ।',
            'शिवलोकमवाप्नोति शिवेन सह मोदते ॥ फलश्रुतिः ॥'
          ],
          wordBreakdown: [
            { word: 'పంచాక్షరమ్ ఇదం పుణ్యం', meaning: 'This sacred Panchakshari stotram' },
            { word: 'యః పఠేత్ శివ-సన్నిధౌ', meaning: 'Whoever recites in the presence or meditation of Shiva' },
            { word: 'శివలోకమ్ అవాప్నోతి', meaning: 'Attains the eternal abode of Shiva (Shivaloka)' },
            { word: 'శివేన సహ మోదతే', meaning: 'And rejoices in supreme bliss with Lord Shiva forever' }
          ],
          englishSummary: '[Phalasruthi] Whoever recites this meritorious Panchakshari hymn in the presence of Shiva attains the supreme abode of Shivaloka and rejoices in everlasting bliss with Shiva.',
          teluguTatparyam: '[ఫలశ్రుతి] ఈ పవిత్రమైన పంచాక్షర స్తోత్రమును భక్తితో పఠించువారు శివలోకమును పొంది, పరమశివుని సన్నిధిలో శాశ్వత ఆనందాన్ని అనుభవిస్తారు.'
        }
      ]
    }
  ];

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = STOTRAMS_DATA;
  } else {
    global.STOTRAMS_DATA = STOTRAMS_DATA;
  }
})(typeof window !== 'undefined' ? window : this);
