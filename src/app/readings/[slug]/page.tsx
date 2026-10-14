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
      title: "Stotram Not Found | Stotramani",
    };
  }

  return {
    title: `${stotram.title_english} - ${stotram.title_telugu} | Stotramani`,
    description: `Read ${stotram.title_english} (${stotram.title_telugu}) online. Clean layout with adjustable typography and original PDF links on stotramani.app.`,
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

  return <StotramReader stotram={stotram} />;
}
