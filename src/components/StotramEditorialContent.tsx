"use client";

import Link from "next/link";
import { Stotram, StotramIndexItem } from "@/types";
import { getStanzaMeaning } from "@/lib/meanings";
import { stotramPath } from "@/lib/stotramRoutes";
import { SparklesIcon, BookIcon, StarIcon } from "./Icons";

interface StotramEditorialContentProps {
  stotram: Stotram;
  relatedStotrams?: StotramIndexItem[];
}

// Curated deity editorial knowledge base
const DEITY_EDITORIAL: Record<
  string,
  {
    author: string;
    origin: string;
    idealTime: string;
    idealDays: string;
    significanceTelugu: string;
    significanceEnglish: string;
    benefitsTelugu: string[];
    benefitsEnglish: string[];
    methodTelugu: string;
    methodEnglish: string;
  }
> = {
  shiva: {
    author: "శ్రీ ఆది శంకరాచార్యులు / వేదవ్యాస మహర్షి (Traditional Acharyas)",
    origin: "శివ పురాణం / వేద సంహితలు",
    idealTime: "బ్రాహ్మీ ముహూర్తం (ఉదయం 4:30 – 6:00) లేదా ప్రదోష వేళ (సాయంత్రం 5:30 – 7:30)",
    idealDays: "సోమవారము, మాస శివరాత్రి, ప్రదోష దినములు మరియు కార్తీక మాసము",
    significanceTelugu:
      "పరమశివుడు లయకారకుడు మాత్రమే గాక, భక్తుల ఆర్తిని బాపి మోక్షాన్ని ప్రసాదించే భోళాశంకరుడు. ఈ పవిత్ర స్తోత్ర పఠనం మానసిక ఆందోళనలను తొలగించి పరమశాంతిని, ఆధ్యాత్మిక జాగృతిని చేకూరుస్తుంది.",
    significanceEnglish:
      "Dedicated to Lord Shiva, the auspicious embodiment of supreme consciousness. Reciting this hymn dissolves inner anxieties, bestows serenity, and leads towards self-realization.",
    benefitsTelugu: [
      "మానసిక ప్రశాంతత, ఏకాగ్రత మరియు భయ విముక్తి",
      "అకాల మృత్యు భయ నివారణ మరియు ఆయురారోగ్య వృద్ధి",
      "ప్రదోష కాలంలో పఠించినచో సర్వ పాప విమోచన మరియు శివానుగ్రహ ప్రాప్తి",
    ],
    benefitsEnglish: [
      "Mental tranquility, unwavering focus, and dispelling of deep-seated fears.",
      "Protection from untimely adversities and enhancement of vitality.",
      "Liberation from karmic encumbrances when recited with bilva archana during Pradosha twilight.",
    ],
    methodTelugu:
      "శుచియై, విభూతి లేదా చందనము ధరించి, ఉత్తరాభిముఖంగా లేదా తూర్పు ముఖంగా కూర్చుని, దీపము వెలిగించి శివ ధ్యానముతో పఠించవలెను.",
    methodEnglish:
      "Take a holy bath, apply sacred Vibhuti or Sandalwood, face East or North, light a traditional ghee lamp, and recite with contemplative devotion.",
  },
  ganesha: {
    author: "శ్రీ ఆది శంకరాచార్యులు / నారద మహర్షి",
    origin: "గణేశ పురాణం / ముద్గల పురాణం",
    idealTime: "ప్రాతఃకాలం (సూర్యోదయ సమయం)",
    idealDays: "బుధవారము, శుక్ల చవితి (వినాయక చవితి), సంకష్టహర చతుర్థి",
    significanceTelugu:
      "సర్వ విఘ్నాలను తొలగించి, కార్యసిద్ధిని ప్రసాదించే ప్రథమ పూజ్యుడు శ్రీ మహాగణపతి. ఏ శుభకార్యమైనా ప్రారంభించే ముందు ఈ స్తోత్రమును పఠించుట మన సనాతన సంప్రదాయము.",
    significanceEnglish:
      "Lord Ganesha is the foremost deity worshipped before embarking on any auspicious undertaking. Chanting His hymns dissolves impediments and bestows sharp intellect and wisdom.",
    benefitsTelugu: [
      "కార్య విఘ్నాలు తొలగిపోయి ఆశించిన పనులు విజయవంతమగును",
      "విద్యాబుద్ధులు, మేధాశక్తి మరియు వాక్శుద్ధి పెరుగును",
      "గృహంలో శాంతి, సౌభాగ్యాలు మరియు అష్టైశ్వర్యాలు సమకూరును",
    ],
    benefitsEnglish: [
      "Removal of all spiritual and material hindrances from your ventures.",
      "Sharpness of intellect, enhanced retention, and eloquence in speech.",
      "Domestic harmony, auspicious tidings, and overall prosperity.",
    ],
    methodTelugu:
      "ఉదయాన్నే స్నానానంతరం గణపతి వద్ద దూర్వాయుగ్మం (గరిక) సమర్పించి, 3 లేదా 11 సార్లు భక్తిశ్రద్ధలతో పఠించవలెను.",
    methodEnglish:
      "After morning purification, offer sacred Durva grass or red flowers, and recite 3 or 11 times with unwavering devotion.",
  },
  hanuman: {
    author: "గోస్వామి తులసీదాస్ / వ్యాస మహర్షి",
    origin: "రామచరితమానస్ / వాల్మీకి రామాయణం",
    idealTime: "ప్రాతః సంధ్య లేదా సాయం సంధ్య వేళ",
    idealDays: "మంగళవారము, శనివారము మరియు హనుమజ్జయంతి",
    significanceTelugu:
      "అసమాన బలపరాక్రమాలు, నిస్వార్థ భక్తి, నిరంతర రామ సేవకు ప్రతీక శ్రీ ఆంజనేయుడు. ఈ స్తోత్రమును పఠించు భక్తులకు భయము, గ్రహపీడలు మరియు అనారోగ్య బాధలు నశించును.",
    significanceEnglish:
      "Embodiment of indomitable courage, supreme intellect, and selfless devotion to Sri Rama. Sincere recitation invokes invincible inner strength and dispels all distress.",
    benefitsTelugu: [
      "సర్వ భయాలు, శత్రుపీడలు మరియు పీడకలల నివారణ",
      "ఆత్మవిశ్వాసం, శారీరక దృఢత్వం మరియు వ్యాధి నిరోధక శక్తి పెంపు",
      "శని దోష నివారణ మరియు కష్టాల నుండి సత్వర ఉపశమనం",
    ],
    benefitsEnglish: [
      "Freedom from paralyzing fears, negative energies, and malevolent planetary influences.",
      "Surge of self-confidence, mental fortitude, and radiant vitality.",
      "Mitigation of Saturn-related afflictions and swift relief from hardships.",
    ],
    methodTelugu:
      "సిందూరము, తమలపాకుల మాల లేదా ఎర్రటి పుష్పములను సమర్పించి, నువ్వుల నూనె దీపము వద్ద 11 లేదా 21 సార్లు పఠించవలెను.",
    methodEnglish:
      "Offer betel leaves or red vermilion, light a sesame oil lamp, and chant 11 or 21 times for protective grace.",
  },
  vishnu: {
    author: "వేదవ్యాస మహర్షి / భీష్మ పితామహులు (మహాభారతం)",
    origin: "శ్రీమద్భాగవతం / మహాభారత అనుశాసనిక పర్వం",
    idealTime: "బ్రాహ్మీ ముహూర్తం లేదా ప్రాతఃకాలం",
    idealDays: "గురువారము, శనివారము, ఏకాదశి మరియు శ్రవణ నక్షత్ర దినములు",
    significanceTelugu:
      "సర్వ జగద్రక్షకుడైన శ్రీ మహావిష్ణువు దివ్య నామాలు సర్వదా తరణోపాయములు. ఈ స్తోత్ర పఠనం వలన గృహంలో లక్ష్మీదేవి కొలువై ఉండి సర్వ శుభాలు చేకూరును.",
    significanceEnglish:
      "Lord Maha Vishnu is the supreme preserver and sustainer of the cosmos. Reciting His divine names purifies consciousness and invites permanent peace and auspiciousness.",
    benefitsTelugu: [
      "సర్వ పాప విముక్తి మరియు జన్మ పరంపరల నుండి మోక్ష సాధన",
      "సంసార తాపత్రయాలు తీరి మనస్సు నిర్మలమగును",
      "ఆర్థిక స్థిరత్వం, సంతాన సౌభాగ్యం మరియు దీర్ఘాయుష్షు",
    ],
    benefitsEnglish: [
      "Purification of subtle impressions and attainment of divine grace.",
      "Resolution of existential anxieties and mental tranquility.",
      "Spiritual fulfillment, family harmony, and righteous prosperity.",
    ],
    methodTelugu:
      "తులసి దళములను సమర్పించి, పసుపు వస్త్రములను ధరించి, తులసి మాలతో విష్ణు సహస్ర నామాలను లేదా స్తోత్రమును పఠించవలెను.",
    methodEnglish:
      "Offer sacred Tulasi leaves, wear clean attire, sit facing East, and recite with rhythmic contemplation.",
  },
  lakshmi: {
    author: "శ్రీ ఆది శంకరాచార్యులు / ఇంద్ర కృతం",
    origin: "శ్రీ సూక్తం / విష్ణు పురాణం",
    idealTime: "సాయం సంధ్యా సమయం (ప్రదోష వేళ)",
    idealDays: "శుక్రవారము, పూర్ణిమ, వరలక్ష్మీ వ్రతం మరియు దీపావళి",
    significanceTelugu:
      "సర్వ మంగళదాయకి, విష్ణు పత్ని శ్రీ మహాలక్ష్మి. ఈ స్తోత్ర పఠనం దారిద్ర్య బాధలను రూపుమాపి, సంపద, సంతోషం, కీర్తి ప్రతిష్టలను అనుగ్రహిస్తుంది.",
    significanceEnglish:
      "Goddess Mahalakshmi is the divine mother of abundance, virtue, and grace. Chanting Her stotras purifies the home and attracts spiritual and material flourishing.",
    benefitsTelugu: [
      "దారిద్ర్య నివారణ మరియు స్థిర లక్ష్మీ కటాక్షము",
      "గృహములో పరస్పర అనురాగం, శాంతి మరియు ప్రశాంతత",
      "వ్యాపార, ఉద్యోగ రంగములలో నిరంతర ఉన్నతి",
    ],
    benefitsEnglish: [
      "Dispelling of scarcity consciousness and invocation of lasting wealth.",
      "Harmonious interpersonal relationships and family serenity.",
      "Progress and ethical success in endeavors and daily life.",
    ],
    methodTelugu:
      "ఆవు నేతితో దీపము వెలిగించి, కమలములు లేదా పసుపు పుష్పములతో అర్చించి, తామర గింజల మాలతో పఠించవలెను.",
    methodEnglish:
      "Light a cow-ghee lamp, offer lotus or fragrant yellow flowers, and chant with heart-centered devotion.",
  },
  surya: {
    author: "అగస్త్య మహర్షి (వాల్మీకి రామాయణం - యుద్ధకాండ)",
    origin: "వాల్మీకి రామాయణం",
    idealTime: "ఉదయించే సూర్యుని అభిముఖంగా (సూర్యోదయ వేళ)",
    idealDays: "ఆదివారము, రథసప్తమి మరియు సంక్రాంతి పర్వదినములు",
    significanceTelugu:
      "శ్రీరామునికి యుద్ధ రంగంలో అగస్త్య మహర్షి ఉపదేశించిన మహత్తర ఆదిత్య హృదయం. సూర్య భగవానుని అనుగ్రహంతో సర్వ శత్రువులను, వ్యాధులను జయించవచ్చును.",
    significanceEnglish:
      "Sage Agastya imparted the solar hymn Aditya Hrudayam to Sri Rama to conquer sorrow and foes. The Sun is the visible divine light that imparts health, vitality, and brilliance.",
    benefitsTelugu: [
      "తీవ్రమైన అనారోగ్యాలు, నేత్ర బాధలు మరియు నిస్సత్తువ నివారణ",
      "కీర్తి, ప్రతిష్టలు, ఆత్మవిశ్వాసం మరియు నాయకత్వ లక్షణాలు పెంపు",
      "సర్వ శత్రు జయము మరియు కార్యానుకూలత",
    ],
    benefitsEnglish: [
      "Relief from physical lethargy, eye ailments, and chronic exhaustion.",
      "Boost to personal radiance, clarity of purpose, and leadership qualities.",
      "Triumph over adversities and renewed optimism.",
    ],
    methodTelugu:
      "సూర్యునికి రాగి పాత్రతో అర్ఘ్యమిచ్చి, సూర్యుని వైపు చూస్తూ మూడు సార్లు పఠించవలెను.",
    methodEnglish:
      "Offer Arghya (water from a copper vessel) facing the rising sun, and recite 3 times with sincere reverence.",
  },
};

export default function StotramEditorialContent({
  stotram,
  relatedStotrams = [],
}: StotramEditorialContentProps) {
  const categoryKey = stotram.category?.toLowerCase() || "";
  const editorial =
    DEITY_EDITORIAL[categoryKey] ||
    DEITY_EDITORIAL.shiva; // default fallback

  // First stanza sample meaning for deep context
  const sampleLines = (stotram.content_lines || []).slice(0, 4);
  const stanzaMeaning = getStanzaMeaning(stotram.slug || stotram.id, 0, sampleLines);

  return (
    <section className="stotram-editorial-block" aria-labelledby="editorial-heading">
      <div className="editorial-divider" />

      {/* 1. Overview & Significance */}
      <div className="editorial-section">
        <h3 id="editorial-heading" className="editorial-heading">
          <SparklesIcon size={20} style={{ color: "var(--accent)" }} />
          <span>పరిచయం &amp; ప్రాముఖ్యత · Meaning &amp; Spiritual Essence</span>
        </h3>
        <p className="editorial-paragraph">{editorial.significanceTelugu}</p>
        <p className="editorial-subtext">{editorial.significanceEnglish}</p>

        <div className="editorial-metadata-grid">
          <div className="editorial-meta-card">
            <span className="meta-label">రచయిత / దర్శకుడు (Author / Seer)</span>
            <strong className="meta-value">{editorial.author}</strong>
          </div>
          <div className="editorial-meta-card">
            <span className="meta-label">మూల గ్రంథం (Sacred Source)</span>
            <strong className="meta-value">{editorial.origin}</strong>
          </div>
          <div className="editorial-meta-card">
            <span className="meta-label">ఉత్తమ పఠన సమయం (Ideal Time)</span>
            <strong className="meta-value">{editorial.idealTime}</strong>
          </div>
          <div className="editorial-meta-card">
            <span className="meta-label">విశిష్ట పర్వదినాలు (Auspicious Days)</span>
            <strong className="meta-value">{editorial.idealDays}</strong>
          </div>
        </div>
      </div>

      {/* 2. When & How to Chant */}
      <div className="editorial-section">
        <h3 className="editorial-heading">
          <BookIcon size={19} style={{ color: "var(--accent)" }} />
          <span>పఠన విధానం &amp; నియమాలు · How &amp; When to Chant</span>
        </h3>
        <p className="editorial-paragraph">{editorial.methodTelugu}</p>
        <p className="editorial-subtext">{editorial.methodEnglish}</p>
      </div>

      {/* 3. Spiritual Benefits & Phalasruti */}
      <div className="editorial-section">
        <h3 className="editorial-heading">
          <StarIcon size={19} style={{ color: "var(--accent)" }} />
          <span>పఠన ఫలితాలు &amp; ఫలశ్రుతి · Spiritual Benefits (Phalasruti)</span>
        </h3>
        <ul className="editorial-benefits-list">
          {editorial.benefitsTelugu.map((ben, idx) => (
            <li key={idx}>
              <span className="benefit-bullet">✓</span>
              <div>
                <strong>{ben}</strong>
                <p className="benefit-en">{editorial.benefitsEnglish[idx]}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 4. Padaccheda & First Verse Tatparyam */}
      {stanzaMeaning && stanzaMeaning.padaccheda.length > 0 && (
        <div className="editorial-section">
          <h3 className="editorial-heading">
            <SparklesIcon size={19} style={{ color: "var(--accent)" }} />
            <span>ప్రథమ శ్లోక తాత్పర్యం · First Verse Word-by-Word Meaning</span>
          </h3>
          <div className="padaccheda-grid">
            {stanzaMeaning.padaccheda.slice(0, 6).map((item, idx) => (
              <div key={idx} className="padaccheda-item">
                <span className="padaccheda-word">{item.word}</span>
                <span className="padaccheda-meaning">{item.meaning}</span>
              </div>
            ))}
          </div>
          <div className="tatparyam-box">
            <p className="tatparyam-te">
              <strong>తాత్పర్యం:</strong> {stanzaMeaning.tatparyamTelugu}
            </p>
            <p className="tatparyam-en">
              <strong>Essence:</strong> {stanzaMeaning.bhavarthaEnglish}
            </p>
          </div>
        </div>
      )}

      {/* 5. Related Stotras with Canonical Internal Links */}
      {relatedStotrams.length > 0 && (
        <div className="editorial-section">
          <h3 className="editorial-heading">
            <SparklesIcon size={19} style={{ color: "var(--accent)" }} />
            <span>సంబంధిత పవిత్ర స్తోత్రాలు · Related Sacred Chants</span>
          </h3>
          <p className="editorial-subtext" style={{ marginBottom: "1rem" }}>
            Explore complementary hymns to deepen your daily prayer and spiritual contemplation.
          </p>

          <div className="related-stotrams-grid">
            {relatedStotrams.map((item) => (
              <Link
                key={item.id}
                href={stotramPath(item)}
                className="related-stotram-card"
                title={`Chant ${item.title_english}`}
              >
                <span className="related-cat">{item.category}</span>
                <h4 className="related-title-en">{item.title_english}</h4>
                <p className="related-title-te">{item.title_telugu}</p>
                <span className="related-link-action">పఠించండి / Read →</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
