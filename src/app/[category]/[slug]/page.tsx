import { notFound } from "next/navigation";
import { Metadata } from "next";
import stotramsData from "@/data/stotrams.json";
import { Stotram } from "@/types";
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
  const stotrams: Stotram[] = stotramsData;
  
  const stotram = stotrams.find(
    (s) => s.category === category && s.id === slug
  );

  if (!stotram) {
    return {
      title: "Stotram Not Found | Stotra Manjari",
    };
  }

  return {
    title: `${stotram.title_english} - ${stotram.title_telugu} | Stotra Manjari`,
    description: `Read ${stotram.title_english} (${stotram.title_telugu}) in clean Telugu script. Features comfortable off-white aged paper theme, scaling fonts, and distraction-free mode.`,
    keywords: [
      stotram.id, 
      stotram.category, 
      stotram.title_english.toLowerCase(), 
      "telugu stotram", 
      "stotram lyrics", 
      "stotra manjari"
    ],
  };
}

// Pre-render static paths during building (Static Site Generation - SSG)
export async function generateStaticParams() {
  const stotrams: Stotram[] = stotramsData;
  
  return stotrams.map((stotram) => ({
    category: stotram.category,
    slug: stotram.id,
  }));
}

export default async function StotramPage({ params }: PageProps) {
  const { category, slug } = await params;
  const stotrams: Stotram[] = stotramsData;
  
  const stotram = stotrams.find(
    (s) => s.category === category && s.id === slug
  );

  if (!stotram) {
    notFound();
  }

  return <StotramReader stotram={stotram} />;
}
