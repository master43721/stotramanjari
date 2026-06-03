import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAllStotrams } from "@/data/loader";
import StotramReader from "@/components/StotramReader";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate dynamic metadata for advanced SEO indexing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const stotrams = getAllStotrams();
  
  const stotram = stotrams.find((s) => (s.slug || s.id) === slug);

  if (!stotram) {
    return {
      title: "Stotram Not Found | Stotra Manjari",
    };
  }

  return {
    title: `${stotram.title_english} - ${stotram.title_telugu} | Stotra Manjari`,
    description: `Read ${stotram.title_english} (${stotram.title_telugu}) online. Clean layout with adjustable typography and original PDF links.`,
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

// SSG Pre-render static paths during next build
export async function generateStaticParams() {
  const stotrams = getAllStotrams();
  
  return stotrams.map((stotram) => ({
    slug: stotram.slug || stotram.id,
  }));
}

export default async function ReadingsPage({ params }: PageProps) {
  const { slug } = await params;
  const stotrams = getAllStotrams();
  
  const stotram = stotrams.find((s) => (s.slug || s.id) === slug);

  if (!stotram) {
    notFound();
  }

  return <StotramReader stotram={stotram} />;
}
