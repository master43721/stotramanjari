import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import vignanamData from "@/data/vignanam-data.json";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate dynamic metadata for advanced SEO indexing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const stotrams = vignanamData as any[];
  
  const stotram = stotrams.find((s) => (s.slug || s.id) === slug);

  if (!stotram) {
    return {
      title: "Stotram Not Found | Stotra Manjari",
    };
  }

  return {
    title: `${stotram.title || stotram.title_english} - ${stotram.title_telugu} | Stotra Manjari`,
    description: `Read ${stotram.title || stotram.title_english} (${stotram.title_telugu}) online. Divine dark-mode layout with custom large typography and original PDF links.`,
    keywords: [
      stotram.id, 
      stotram.category, 
      (stotram.title || stotram.title_english).toLowerCase(), 
      "telugu stotram", 
      "stotram lyrics", 
      "stotra manjari"
    ],
  };
}

// SSG Pre-render static paths during next build
export async function generateStaticParams() {
  const stotrams = vignanamData as any[];
  
  return stotrams.map((stotram) => ({
    slug: stotram.slug || stotram.id,
  }));
}

export default async function ReadingsPage({ params }: PageProps) {
  const { slug } = await params;
  const stotrams = vignanamData as any[];
  
  const stotram = stotrams.find((s) => (s.slug || s.id) === slug);

  if (!stotram) {
    notFound();
  }

  const contentLines = stotram.contentLines || stotram.content_lines || [];

  return (
    <div style={{
      backgroundColor: "#050505",
      minHeight: "100vh",
      color: "#f4f0e6",
      position: "relative",
      paddingBottom: "8rem",
      overflow: "hidden"
    }}>
      {/* 
        Divinely Premium Ethereal Glowing Aura:
        Absolute-positioned, low-opacity radial gold gradient with a 120px blur behind the text 
      */}
      <div style={{
        position: "absolute",
        top: "30%",
        left: "50%",
        transform: "translate(-50%, -30%)",
        width: "80%",
        maxWidth: "900px",
        height: "550px",
        background: "radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)",
        filter: "blur(120px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      {/* Glassmorphic Navigation Header at top of reading view */}
      <nav style={{
        position: "sticky",
        top: "1.5rem",
        zIndex: 50,
        backgroundColor: "rgba(255, 255, 255, 0.02)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(212, 175, 55, 0.12)",
        borderRadius: "30px",
        maxWidth: "680px",
        margin: "1.5rem auto 0 auto",
        padding: "0.75rem 1.75rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)"
      }}>
        <Link href="/" style={{
          fontSize: "0.85rem",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "#D4AF37",
          transition: "all 0.3s ease"
        }}>
          ← Back to Library
        </Link>
        <span style={{
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "rgba(244, 240, 230, 0.5)",
          fontWeight: "600"
        }}>
          {stotram.category}
        </span>
      </nav>

      <div style={{
        position: "relative",
        zIndex: 1,
        maxWidth: "680px", // constrain width to prevent wide eye scanning
        margin: "0 auto",
        padding: "5rem 2rem 0 2rem",
        textAlign: "center"
      }}>
        {/* Readings Title */}
        <header style={{ marginBottom: "5rem" }}>
          <h1 style={{
            fontSize: "2.8rem",
            fontWeight: "700",
            lineHeight: "1.25",
            marginBottom: "1rem",
            background: "linear-gradient(135deg, #f4f0e6 40%, #D4AF37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "var(--font-sans)"
          }}>
            {stotram.title || stotram.title_english}
          </h1>
          <h2 style={{
            fontFamily: "var(--font-telugu)",
            fontSize: "1.8rem",
            color: "rgba(244, 240, 230, 0.7)",
            fontWeight: "400",
            lineHeight: "1.4",
            marginTop: "0.5rem"
          }}>
            {stotram.title_telugu}
          </h2>

          {/* If Google Drive PDF link exists, render button */}
          {stotram.pdfLink && (
            <div style={{ marginTop: "2rem" }}>
              <a
                href={stotram.pdfLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  borderColor: "#D4AF37",
                  color: "#D4AF37",
                  backgroundColor: "rgba(212, 175, 55, 0.05)",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "0.5rem 1.25rem",
                  borderRadius: "20px"
                }}
              >
                📄 View Original PDF
              </a>
            </div>
          )}
        </header>

        {/* Sacred Telugu text content lines */}
        <article style={{
          display: "flex",
          flexDirection: "column",
          gap: "2.5rem", /* space between verses */
          fontFamily: "var(--font-telugu)"
        }}>
          {contentLines.map((line: string, index: number) => {
            const isEndOfVerse = line.includes("॥") || line.includes("||") || line.trim().endsWith("1") || line.trim().endsWith("2") || line.trim().endsWith("3") || line.trim().endsWith("4") || line.trim().endsWith("5") || line.trim().endsWith("6") || line.trim().endsWith("7") || line.trim().endsWith("8");
            
            return (
              <p
                key={index}
                style={{
                  fontSize: "1.75rem", /* text-xl md:text-3xl equivalent */
                  lineHeight: "2.5",   /* leading-[2.5] crucial for Telugu script vowel markers */
                  letterSpacing: "0.03em", /* tracking-wide */
                  color: isEndOfVerse ? "#ffffff" : "rgba(244, 240, 230, 0.9)",
                  fontWeight: "400",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  textShadow: "0 0 15px rgba(212, 175, 55, 0.05)"
                }}
              >
                {line}
              </p>
            );
          })}
        </article>
      </div>
    </div>
  );
}
