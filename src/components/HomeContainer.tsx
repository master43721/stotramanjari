"use client";

import { useState } from "react";
import Link from "next/link";
import { Stotram } from "@/types";

interface HomeContainerProps {
  initialStotrams: Stotram[];
}

export default function HomeContainer({ initialStotrams }: HomeContainerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(initialStotrams.map((s) => s.category)))];

  const filteredStotrams = initialStotrams.filter((stotram) => {
    const matchesCategory = activeCategory === "all" || stotram.category === activeCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      stotram.title_english.toLowerCase().includes(searchLower) ||
      stotram.title_telugu.includes(searchQuery) ||
      stotram.category.toLowerCase().includes(searchLower);
    
    return matchesCategory && matchesSearch;
  });

  // Awwwards-winning mouse-coordinate tracking for glowing border cards
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
  };

  return (
    <div className="container" style={{ paddingBlock: "4rem" }}>
      {/* Cinematic Hero */}
      <section className="hero">
        <h1 style={{ 
          fontSize: "3.5rem", 
          fontWeight: "700", 
          letterSpacing: "-0.03em",
          lineHeight: "1.15",
          marginInline: "auto",
          maxWidth: "800px"
        }}>
          Sacred Stotram Library
        </h1>
        <p className="hero-subtitle">
          Read high-legibility sacred texts in clean Telugu script on top of an immersive aged-paper or charcoal dark-mode backdrop.
        </p>
      </section>

      {/* Glassmorphic Search & Filters Panel */}
      <div style={{
        maxWidth: "640px",
        margin: "0 auto 4rem auto",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
      }}>
        {/* Glowing Search Bar */}
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search stotrams by title (English or తెలుగు)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "1rem 1.4rem",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
              fontSize: "1.05rem",
              fontFamily: "var(--font-sans)",
              outline: "none",
              transition: "var(--transition-cinematic)",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent)";
              e.target.style.boxShadow = "0 0 20px rgba(212, 175, 55, 0.15), 0 10px 25px rgba(0, 0, 0, 0.4)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--border)";
              e.target.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.4)";
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "18px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontSize: "1.1rem",
                transition: "var(--transition-fast)"
              }}
              onMouseOver={(e) => e.currentTarget.style.color = "var(--accent)"}
              onMouseOut={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
            >
              ✕
            </button>
          )}
        </div>

        {/* Categories badging list */}
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
                padding: "0.45rem 1.25rem",
                borderRadius: "24px",
                fontSize: "0.85rem",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                backgroundColor: activeCategory === category ? "var(--accent)" : "var(--bg-card)",
                color: activeCategory === category ? "#060606" : "var(--text-secondary)",
                borderColor: activeCategory === category ? "var(--accent)" : "var(--border)",
                boxShadow: activeCategory === category ? "0 0 15px var(--accent-glow)" : "none"
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid displaying stotrams */}
      {filteredStotrams.length > 0 ? (
        <div className="grid">
          {filteredStotrams.map((stotram) => (
            <div 
              key={stotram.id} 
              className="stotram-card"
              onMouseMove={handleMouseMove}
            >
              <span className="stotram-card-category">{stotram.category}</span>
              <h2 className="stotram-card-title-english">{stotram.title_english}</h2>
              <h3 className="stotram-card-title-telugu">{stotram.title_telugu}</h3>
              <Link href={`/${stotram.category}/${stotram.id}`} className="stotram-card-link">
                Read Stotram <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: "center",
          padding: "5rem 2rem",
          color: "var(--text-secondary)",
          backgroundColor: "var(--bg-card)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)",
          backdropFilter: "blur(12px)",
          maxWidth: "600px",
          margin: "0 auto 6rem auto",
          boxShadow: "0 10px 30px var(--shadow)"
        }}>
          <p style={{ fontSize: "1.3rem", fontWeight: "600", color: "var(--text-primary)" }}>
            No stotrams found
          </p>
          <p style={{ fontSize: "0.95rem", marginTop: "0.6rem", opacity: 0.8 }}>
            Try adjusting your search criteria or select another category filter.
          </p>
        </div>
      )}
    </div>
  );
}
