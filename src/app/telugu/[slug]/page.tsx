import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getStotramBySlug, getStotramsIndex } from "@/data/loader";
import StotramReader from "@/components/StotramReader";
import { generateStotramStructuredData } from "@/lib/schemaGenerator";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate dynamic metadata for Google Search: [User searches: "Sri Suktam Telugu text"]
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const stotram = getStotramBySlug(slug);

  if (!stotram) {
    return {
      title: "Stotram Not Found",
    };
  }

  const titleEn = stotram.title_english;
  const titleTe = stotram.title_telugu;
  const canonicalUrl = `https://stotramani.app/telugu/${slug}`;

  return {
    title: `${titleEn} Telugu Text & Lyrics - ${titleTe} | Stotramani`,
    description: `Read authentic ${titleEn} (${titleTe}) in pristine Telugu script. Features word-by-word pronunciation split, adjustable sacred typography, and distraction-free daily chanting on stotramani.app.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${titleEn} (${titleTe}) - Telugu Text & Chanting | Stotramani`,
      description: `Complete ${titleEn} sacred verses in authentic Telugu script with word-by-word chanting mode on Stotramani.`,
      url: canonicalUrl,
      siteName: "Stotramani",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${titleEn} - Sacred Telugu & Sanskrit Devotional Library`,
        },
      ],
      locale: "te_IN",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${titleEn} (${titleTe}) - Telugu Lyrics | Stotramani`,
      description: `Read and recite ${titleEn} in Telugu with word-by-word chanting on Stotramani.`,
      images: ["/og-image.png"],
    },
    keywords: [
      `${titleEn.toLowerCase()} telugu text`,
      `${titleEn.toLowerCase()} telugu lyrics`,
      `${titleEn.toLowerCase()} slokas`,
      titleTe,
      stotram.id,
      stotram.category,
      "telugu stotram",
      "sanskrit hymns",
      "stotramani",
      "sudheendra sripada",
    ],
  };
}

// SSG Pre-render static paths during next build
export async function generateStaticParams() {
  const index = getStotramsIndex();

  return index.map((stotram) => ({
    slug: stotram.slug || stotram.id,
  }));
}

export default async function TeluguStotramPage({ params }: PageProps) {
  const { slug } = await params;
  const stotram = getStotramBySlug(slug);

  if (!stotram) {
    notFound();
  }

  const canonicalUrl = `https://stotramani.app/telugu/${slug}`;
  const { creativeWorkSchema, articleSchema, breadcrumbSchema, faqSchema } = generateStotramStructuredData(
    stotram,
    canonicalUrl
  );

  return (
    <>
      {/* Hyper-Structured Semantic Schema (JSON-LD) for Google Rich Snippets & Featured Snippet (#0 Position) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <StotramReader stotram={stotram} initialScript="telugu" />
    </>
  );
}
