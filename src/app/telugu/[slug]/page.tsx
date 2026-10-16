import { notFound, permanentRedirect } from "next/navigation";
import { getStotramBySlug, getStotramsIndex } from "@/data/loader";
import { stotramPath } from "@/lib/stotramRoutes";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// SSG Pre-render static paths during next build
export async function generateStaticParams() {
  const index = getStotramsIndex();
  return index.map((stotram) => ({
    slug: stotram.slug || stotram.id,
  }));
}

/**
 * 301/308 Permanent Redirect to consolidate duplicate Telugu URLs into canonical /[category]/[slug].
 * Stops keyword cannibalization and concentrates search rank authority.
 */
export default async function TeluguStotramPage({ params }: PageProps) {
  const { slug } = await params;
  const stotram = getStotramBySlug(slug);

  if (!stotram) {
    notFound();
  }

  permanentRedirect(stotramPath(stotram));
}
