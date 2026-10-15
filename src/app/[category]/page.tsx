import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStotramsIndex } from "@/data/loader";
import Breadcrumbs from "@/components/Breadcrumbs";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

function formatCategoryName(category: string): string {
  return category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateStaticParams() {
  const index = getStotramsIndex();
  const categories = Array.from(new Set(index.map((s) => s.category).filter(Boolean)));
  return categories.map((category) => ({
    category,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const formatted = formatCategoryName(category);

  return {
    title: formatted,
    description: `Browse and recite sacred ${formatted} in authentic Telugu and Sanskrit scripts with multi-script transliteration and offline support on Stotramani.`,
    alternates: {
      canonical: `https://stotramani.app/${category}`,
    },
    openGraph: {
      title: `${formatted} | Sacred Stotram Library`,
      description: `Read authentic ${formatted} with distraction-free layout on Stotramani. Curated by Sudheendra Sripada.`,
      url: `https://stotramani.app/${category}`,
      siteName: "Stotramani",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${formatted} - Stotramani`,
        },
      ],
      locale: "te_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${formatted} | Stotramani`,
      description: `Read ${formatted} on Stotramani.`,
      images: ["/og-image.png"],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const index = getStotramsIndex();
  const stotrams = index.filter((s) => s.category === category);

  if (stotrams.length === 0) {
    notFound();
  }

  const formattedName = formatCategoryName(category);
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: formattedName, href: `/${category}` },
  ];

  return (
    <div
      style={{
        backgroundColor: "var(--bg-base)",
        color: "var(--text-primary)",
        minHeight: "100vh",
        paddingBlock: "clamp(2rem, 5vw, 5rem)",
        position: "relative",
      }}
    >
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Breadcrumbs items={breadcrumbs} />

        <header style={{ textAlign: "center", marginBottom: "clamp(2rem, 4vw, 3.5rem)" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🕉️</div>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, var(--text-primary) 30%, var(--accent) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "0.5rem",
            }}
          >
            {formattedName}
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            A sacred collection of {stotrams.length} stotram{stotrams.length === 1 ? "" : "s"} and hymns for devotional recitation.
          </p>
        </header>

        <div className="grid">
          {stotrams.map((stotram) => (
            <div key={stotram.id} className="stotram-card">
              <span className="stotram-card-category">{formattedName}</span>
              <h2 className="stotram-card-title-english">{stotram.title_english}</h2>
              <h3 className="stotram-card-title-telugu">{stotram.title_telugu}</h3>
              <Link
                href={`/readings/${stotram.slug || stotram.id}`}
                className="stotram-card-link"
                aria-label={`Read ${stotram.title_english}`}
              >
                Read Stotram <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
