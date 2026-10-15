import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getStotramBySlug, getStotramsIndex } from "@/data/loader";
import StotramReader from "@/components/StotramReader";

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

// Generate dynamic metadata for search engine optimization (SEO)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const stotram = getStotramBySlug(slug);
  
  if (!stotram || stotram.category !== category) {
    return {
      title: "Stotram Not Found",
    };
  }

  return {
    title: `${stotram.title_english} - ${stotram.title_telugu}`,
    description: `Read ${stotram.title_english} (${stotram.title_telugu}) in clean Telugu script on stotramani.app. Features comfortable off-white aged paper theme, scaling fonts, and distraction-free mode.`,
    alternates: {
      canonical: `https://stotramani.app/${category}/${slug}`,
    },
    openGraph: {
      title: `${stotram.title_english} (${stotram.title_telugu}) | Stotramani`,
      description: `Read ${stotram.title_english} with adjustable sacred typography and distraction-free chanting on Stotramani.`,
      url: `https://stotramani.app/${category}/${slug}`,
      siteName: "Stotramani",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${stotram.title_english} - Stotramani`,
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
      "stotramani",
      "sudheendra sripada"
    ],
  };
}

import { generateStotramStructuredData } from "@/lib/schemaGenerator";

// Pre-render static paths during building (Static Site Generation - SSG)
export async function generateStaticParams() {
  const index = getStotramsIndex();
  
  return index.map((stotram) => ({
    category: stotram.category,
    slug: stotram.slug || stotram.id,
  }));
}

export default async function StotramPage({ params }: PageProps) {
  const { category, slug } = await params;
  const stotram = getStotramBySlug(slug);

  if (!stotram || stotram.category !== category) {
    notFound();
  }

  const canonicalUrl = `https://stotramani.app/${category}/${slug}`;
  const { creativeWorkSchema, articleSchema, breadcrumbSchema, faqSchema } = generateStotramStructuredData(
    stotram,
    canonicalUrl,
    category
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

