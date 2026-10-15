import { Stotram } from "@/types";

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateStotramStructuredData(
  stotram: Stotram,
  canonicalUrl: string,
  categoryName?: string
) {
  const titleEn = stotram.title_english || "Sacred Stotram";
  const titleTe = stotram.title_telugu || "";
  const deity = stotram.deity || stotram.category || "Divine";
  const fullText = (stotram.content_lines || []).join("\n");

  // 1. CreativeWork Schema: Explicitly structured with raw text for Google Featured Snippets (#0 position)
  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${canonicalUrl}#creativework`,
    name: `${titleEn} - ${titleTe}`,
    headline: `${titleEn} (${titleTe}) Sacred Devotional Text & Chanting`,
    alternateName: [titleTe, titleEn],
    inLanguage: "te",
    about: `${deity} Sacred Hymn`,
    genre: "Devotional Stotram / Sacred Vedic Hymn",
    text: fullText,
    url: canonicalUrl,
    author: {
      "@type": "Person",
      name: "Sudheendra Sripada",
      url: "https://stotramani.app",
    },
    publisher: {
      "@type": "Organization",
      name: "Stotramani",
      url: "https://stotramani.app",
      logo: {
        "@type": "ImageObject",
        url: "https://stotramani.app/logo.png",
      },
    },
    mainEntityOfPage: canonicalUrl,
  };

  // 2. Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonicalUrl}#article`,
    isPartOf: {
      "@type": "WebSite",
      name: "Stotramani",
      url: "https://stotramani.app",
    },
    headline: `${titleEn} (${titleTe}) - Sacred Telugu & Sanskrit Text, Lyrics & Chanting`,
    name: `${titleEn} - ${titleTe}`,
    alternateName: [titleTe, titleEn],
    description: `Complete text, Telugu lyrics, and recitation guide for ${titleEn} (${titleTe}). Distraction-free chanting with word-by-word pronunciation support on Stotramani.`,
    inLanguage: ["te", "sa", "en"],
    genre: "Devotional Stotram / Sacred Vedic Hymn",
    articleBody: fullText,
    author: {
      "@type": "Person",
      name: "Sudheendra Sripada",
      url: "https://stotramani.app",
    },
    publisher: {
      "@type": "Organization",
      name: "Stotramani",
      url: "https://stotramani.app",
      logo: {
        "@type": "ImageObject",
        url: "https://stotramani.app/logo.png",
      },
    },
    about: {
      "@type": "Thing",
      name: deity,
      description: `Sacred devotional prayer dedicated to ${deity}`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    image: "https://stotramani.app/og-image.png",
  };

  // 3. BreadcrumbList Schema
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: "Home", url: "https://stotramani.app" },
  ];

  if (stotram.category) {
    breadcrumbItems.push({
      name: categoryName || stotram.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      url: `https://stotramani.app/${stotram.category}`,
    });
  }

  breadcrumbItems.push({
    name: titleEn,
    url: canonicalUrl,
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  // 4. High-Intent FAQPage Schema (Triggers Google Rich Snippet Accordions in Search Results)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is ${titleEn} (${titleTe})?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${titleEn} (${titleTe}) is an authentic devotional hymn dedicated to ${deity}. Preserved in pure Telugu and Sanskrit scripts on Stotramani, it is traditionally chanted for spiritual peace, focus, and divine blessings.`,
        },
      },
      {
        "@type": "Question",
        name: `How to chant ${titleEn} in Telugu with correct pronunciation?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `On Stotramani (https://stotramani.app), you can toggle the 'Word-by-Word' (Padaccheda) mode to recite ${titleEn} with clear compound-word splits. This eliminates pronunciation errors and helps devotees chant slowly and rhythmically.`,
        },
      },
      {
        "@type": "Question",
        name: `What are the traditional spiritual benefits of chanting ${titleEn}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Daily chanting of ${titleEn} cultivates mental tranquility, spiritual purity, and inner strength. Traditional acharyas recommend reciting it during morning prayers (Pratah Smaranam) or evening sandhya with sincere devotion.`,
        },
      },
      {
        "@type": "Question",
        name: `Can I read ${titleEn} offline on mobile?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. Stotramani is designed as an ultra-fast Progressive Web App (PWA). Once opened, ${titleEn} is cached locally so you can read and chant inside temples or puja rooms without cellular internet.`,
        },
      },
    ],
  };

  return {
    creativeWorkSchema,
    articleSchema,
    breadcrumbSchema,
    faqSchema,
  };
}
