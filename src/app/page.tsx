"use client";

import { useState, useEffect } from "react";
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClose = () => setIsDropdownOpen(false);
    window.addEventListener("click", handleClose);
    return () => window.removeEventListener("click", handleClose);
  }, [isDropdownOpen]);

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

          {/* Custom Dropdown Selector */}
          <div style={{ position: "relative", width: "100%", maxWidth: "28rem", marginInline: "auto" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.3)";
                e.currentTarget.style.boxShadow = "0 0 15px rgba(212, 175, 55, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
              style={{
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderRadius: "1rem",
                padding: "0.875rem 1.5rem",
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "0.95rem",
                fontWeight: "500",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                outline: "none"
              }}
            >
              <span style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {activeCategory === "all" ? "Select Sacred Chants / Text" : activeCategory.replace(/-/g, " ")}
              </span>
              <span style={{ 
                fontSize: "0.75rem", 
                transition: "transform 0.3s ease",
                transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)"
              }}>
                ▼
              </span>
            </button>

            {isDropdownOpen && (
              <div 
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: "rgba(10, 10, 10, 0.95)",
                  backdropFilter: "blur(40px)",
                  WebkitBackdropFilter: "blur(40px)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "1rem",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  overflowY: "auto",
                  maxHeight: "20rem",
                  marginTop: "0.5rem",
                  zIndex: 50
                }}
              >
                {categories.map((category) => (
                  <div
                    key={category}
                    onClick={() => {
                      setActiveCategory(category);
                      setIsDropdownOpen(false);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
                      e.currentTarget.style.color = "#D4AF37";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = activeCategory === category ? "#D4AF37" : "rgba(255, 255, 255, 0.8)";
                    }}
                    style={{
                      padding: "0.75rem 1.25rem",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: "0.85rem",
                      fontWeight: activeCategory === category ? "600" : "400",
                      letterSpacing: "0.05em",
                      color: activeCategory === category ? "#D4AF37" : "rgba(255, 255, 255, 0.8)",
                      backgroundColor: activeCategory === category ? "rgba(255, 255, 255, 0.02)" : "transparent",
                      transition: "all 0.2s ease",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.02)"
                    }}
                  >
                    {category === "all" ? "ALL CHANTS" : category.replace(/-/g, " ").toUpperCase()}
                  </div>
                ))}
              </div>
            )}
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
