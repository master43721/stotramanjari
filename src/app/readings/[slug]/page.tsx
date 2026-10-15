import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getStotramBySlug, getStotramsIndex } from "@/data/loader";
import StotramReader from "@/components/StotramReader";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate dynamic metadata for advanced SEO indexing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const stotram = getStotramBySlug(slug);
  
  if (!stotram) {
    return {
      title: "Stotram Not Found",
    };
  }

  return {
    title: `${stotram.title_english} - ${stotram.title_telugu}`,
    description: `Read and chant ${stotram.title_english} (${stotram.title_telugu}) online. Clean layout with multi-script support (Telugu, Sanskrit, Kannada, Tamil, IAST), adjustable typography, and offline support on stotramani.app.`,
    alternates: {
      canonical: `https://stotramani.app/readings/${slug}`,
    },
    openGraph: {
      title: `${stotram.title_english} (${stotram.title_telugu}) | Stotramani`,
      description: `Sacred recitation of ${stotram.title_english} with multi-script support and distraction-free mode on Stotramani.`,
      url: `https://stotramani.app/readings/${slug}`,
      siteName: "Stotramani",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${stotram.title_english} - Sacred Telugu & Sanskrit Devotional Library`,
        },
      ],
      locale: "te_IN",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${stotram.title_english} (${stotram.title_telugu}) | Stotramani`,
      description: `Read and chant ${stotram.title_english} distraction-free on Stotramani.`,
      images: ["/og-image.png"],
    },
    keywords: [
      stotram.id, 
      stotram.category, 
      stotram.title_english.toLowerCase(), 
      "telugu stotram", 
      "stotram lyrics", 
      "sanskrit hymns",
      "stotramani",
      "sudheendra sripada"
    ],
  };
}

import { generateStotramStructuredData } from "@/lib/schemaGenerator";

// SSG Pre-render static paths during next build
export async function generateStaticParams() {
  const index = getStotramsIndex();
  
  return index.map((stotram) => ({
    slug: stotram.slug || stotram.id,
  }));
}

export default async function ReadingsPage({ params }: PageProps) {
  const { slug } = await params;
  const stotram = getStotramBySlug(slug);

  if (!stotram) {
    notFound();
  }

  const canonicalUrl = `https://stotramani.app/readings/${slug}`;
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

      <StotramReader stotram={stotram} />
    </>
  );
}

