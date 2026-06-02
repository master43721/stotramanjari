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

  return (
    <div className="container" style={{ paddingBlock: "3rem" }}>
      {/* Hero section */}
      <section className="hero">
        <h1 style={{ fontSize: "2.8rem", fontWeight: "700", letterSpacing: "-0.02em" }}>
          Sacred Stotram Library
        </h1>
        <p className="hero-subtitle">
          Read stotrams in Telugu with translation, with premium distraction-free reading controls.
        </p>
      </section>

      {/* Filter and Search Panel */}
      <div style={{
        maxWidth: "600px",
        margin: "0 auto 3rem auto",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem"
      }}>
        {/* Search input */}
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search stotrams by title (English or తెలుగు)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.9rem 1.25rem",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
              fontSize: "1rem",
              fontFamily: "var(--font-sans)",
              outline: "none",
              transition: "var(--transition-smooth)",
              boxShadow: "0 2px 4px var(--shadow)"
            }}
            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontSize: "1rem"
              }}
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
          gap: "0.5rem"
        }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className="btn"
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                backgroundColor: activeCategory === category ? "var(--accent)" : "var(--bg-card)",
                color: activeCategory === category ? "var(--bg-base)" : "var(--text-secondary)",
                borderColor: activeCategory === category ? "var(--accent)" : "var(--border)",
                borderWidth: "1px",
                borderStyle: "solid"
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid displaying filtered stotrams */}
      {filteredStotrams.length > 0 ? (
        <div className="grid">
          {filteredStotrams.map((stotram) => (
            <div key={stotram.id} className="stotram-card">
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
          padding: "4rem 2rem",
          color: "var(--text-secondary)",
          backgroundColor: "var(--bg-card)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)",
          maxWidth: "600px",
          margin: "0 auto 5rem auto"
        }}>
          <p style={{ fontSize: "1.2rem", fontWeight: "500" }}>No stotrams found</p>
          <p style={{ fontSize: "0.9rem", marginTop: "0.5rem", opacity: 0.8 }}>
            Try adjusting your search criteria or select another category.
          </p>
        </div>
      )}
    </div>
  );
}
