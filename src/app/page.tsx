"use client";

import { useState } from "react";
import Link from "next/link";
import vignanamData from "@/data/vignanam-data.json";

// Define the stotram data structure
interface ScrapedStotram {
  id: string;
  slug: string;
  title: string;
  title_telugu: string;
  category: string;
  contentLines: string[];
  pdfLink: string | null;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const stotrams: ScrapedStotram[] = vignanamData as ScrapedStotram[];
  const categories = ["all", ...Array.from(new Set(stotrams.map((s) => s.category)))];

  const filteredStotrams = stotrams.filter((stotram) => {
    const matchesCategory = activeCategory === "all" || stotram.category === activeCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      stotram.title.toLowerCase().includes(searchLower) ||
      stotram.title_telugu.includes(searchQuery) ||
      stotram.category.toLowerCase().includes(searchLower);
    
    return matchesCategory && matchesSearch;
  });

  // Coordinates-based mouse tracking for card radial glow halos
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
  };

  return (
    <div style={{
      backgroundColor: "#050505",
      color: "#f4f0e6",
      minHeight: "100vh",
      paddingBlock: "6rem",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Divine Backlight Ambient Orbs */}
      <div style={{
        position: "absolute",
        top: "-10%",
        left: "-10%",
        width: "50%",
        height: "60%",
        background: "radial-gradient(circle, rgba(212, 175, 55, 0.09) 0%, transparent 70%)",
        filter: "blur(120px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <div style={{
        position: "absolute",
        bottom: "-10%",
        right: "-10%",
        width: "60%",
        height: "60%",
        background: "radial-gradient(circle, rgba(255, 176, 58, 0.06) 0%, transparent 75%)",
        filter: "blur(120px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Massive Gold Hero */}
        <section className="hero" style={{ textAlign: "center", paddingBottom: "4rem" }}>
          <h1 style={{ 
            fontSize: "4rem", 
            fontWeight: "700", 
            letterSpacing: "-0.04em",
            lineHeight: "1.1",
            marginInline: "auto",
            maxWidth: "900px",
            background: "linear-gradient(135deg, #f4f0e6 30%, #D4AF37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 50px rgba(212, 175, 55, 0.1)"
          }}>
            STOTRA MANJARI
          </h1>
          <p className="hero-subtitle" style={{ 
            color: "var(--text-secondary)", 
            fontSize: "1.25rem", 
            marginTop: "1.25rem", 
            maxWidth: "640px", 
            marginInline: "auto",
            lineHeight: "1.6"
          }}>
            An ultra-premium, distraction-free digital library for sacred Telugu stotrams. 
            Pre-rendered for lightning-fast reading.
          </p>
        </section>

        {/* Search and Filters panel */}
        <div style={{
          maxWidth: "640px",
          margin: "0 auto 4.5rem auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.75rem"
        }}>
          {/* Glowing input */}
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search stotrams by title (English or తెలుగు)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "1.1rem 1.5rem",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-primary)",
                fontSize: "1.05rem",
                fontFamily: "var(--font-sans)",
                outline: "none",
                transition: "var(--transition-cinematic)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--accent)";
                e.target.style.boxShadow = "0 0 25px rgba(212, 175, 55, 0.18), 0 10px 30px rgba(0, 0, 0, 0.6)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border)";
                e.target.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.6)";
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  transition: "var(--transition-fast)"
                }}
                onMouseOver={(e) => e.currentTarget.style.color = "var(--accent)"}
                onMouseOut={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "0.6rem"
          }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className="btn"
                style={{
                  padding: "0.45rem 1.35rem",
                  borderRadius: "24px",
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  backgroundColor: activeCategory === category ? "var(--accent)" : "var(--bg-card)",
                  color: activeCategory === category ? "#050505" : "var(--text-secondary)",
                  borderColor: activeCategory === category ? "var(--accent)" : "var(--border)",
                  boxShadow: activeCategory === category ? "0 0 15px var(--accent-glow)" : "none"
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Grid of Glassmorphic Cards */}
        {filteredStotrams.length > 0 ? (
          <div className="grid">
            {filteredStotrams.map((stotram) => (
              <div 
                key={stotram.id} 
                className="stotram-card"
                onMouseMove={handleMouseMove}
              >
                <span className="stotram-card-category">{stotram.category}</span>
                <h2 className="stotram-card-title-english">{stotram.title}</h2>
                <h3 className="stotram-card-title-telugu">{stotram.title_telugu}</h3>
                
                {/* 
                  Next.js <Link> handles the configured basePath (/stotramanjari) 
                  automatically for clean static routing.
                */}
                <Link href={`/readings/${stotram.slug}`} className="stotram-card-link">
                  Read Stotram <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center",
            padding: "6rem 2rem",
            color: "var(--text-secondary)",
            backgroundColor: "var(--bg-card)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            maxWidth: "600px",
            margin: "0 auto 6rem auto",
            boxShadow: "0 10px 40px var(--shadow)"
          }}>
            <p style={{ fontSize: "1.4rem", fontWeight: "600", color: "var(--text-primary)" }}>
              No stotrams found
            </p>
            <p style={{ fontSize: "0.95rem", marginTop: "0.6rem", opacity: 0.85 }}>
              Check your search keywords or filter pills.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
