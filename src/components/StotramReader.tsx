"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Stotram } from "@/types";

interface StotramReaderProps {
  stotram: Stotram;
}

export default function StotramReader({ stotram }: StotramReaderProps) {
  const [fontSizeScale, setFontSizeScale] = useState(1.1); // Base scaled slightly larger for cinematic readability
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle distraction-free body class
  useEffect(() => {
    if (isDistractionFree) {
      document.body.classList.add("distraction-free");
    } else {
      document.body.classList.remove("distraction-free");
    }
    return () => document.body.classList.remove("distraction-free");
  }, [isDistractionFree]);

  const decreaseFont = () => {
    setFontSizeScale((prev) => Math.max(0.8, prev - 0.1));
  };

  const increaseFont = () => {
    setFontSizeScale((prev) => Math.min(1.8, prev + 0.1));
  };

  const toggleDistractionFree = () => {
    setIsDistractionFree((prev) => !prev);
  };

  // Base font size in rem for stotram reading text
  const currentFontSize = `${1.3 * fontSizeScale}rem`;

  return (
    <div className="reader-wrapper">
      {/* Scroll Progress Bar */}
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="reader-container">
        {/* Sacred Header */}
        <header className="reader-header">
          <div style={{ marginBottom: "1.25rem" }}>
            <Link 
              href="/" 
              style={{ 
                fontSize: "0.85rem", 
                fontWeight: "700", 
                textTransform: "uppercase", 
                letterSpacing: "0.1em",
                color: "var(--accent)",
                transition: "var(--transition-cinematic)"
              }}
              onMouseOver={(e) => e.currentTarget.style.letterSpacing = "0.15em"}
              onMouseOut={(e) => e.currentTarget.style.letterSpacing = "0.1em"}
            >
              ← Back to library
            </Link>
          </div>
          <h1 className="reader-title-telugu">{stotram.title_telugu}</h1>
          <h2 className="reader-title-english">{stotram.title_english}</h2>
        </header>

        {/* Text Area */}
        <article className="stotram-content-body">
          {stotram.content_lines.map((line, index) => {
            // Smart layout line splitting: Stotrams usually demarcate verses with || (double pipe)
            // If the line contains a verse ending indicator (e.g. || 1 ||, or ||), add extra spacing
            const isEndOfVerse = line.includes("॥") || line.includes("||") || line.trim().endsWith("1") || line.trim().endsWith("2") || line.trim().endsWith("3") || line.trim().endsWith("4") || line.trim().endsWith("5") || line.trim().endsWith("6") || line.trim().endsWith("7") || line.trim().endsWith("8");
            
            return (
              <p 
                key={index} 
                className="stotram-line"
                style={{ 
                  fontSize: currentFontSize,
                  marginBottom: isEndOfVerse ? "1.8rem" : "0.3rem",
                  fontWeight: "400",
                  color: isEndOfVerse ? "var(--text-primary)" : "rgba(244, 240, 230, 0.9)"
                }}
              >
                {line}
              </p>
            );
          })}
        </article>
      </div>

      {/* Floating Control Toolbar */}
      <div className="floating-controls">
        {/* Back Link */}
        <Link 
          href="/" 
          className="btn" 
          style={{ 
            padding: "0", 
            borderRadius: "50%", 
            width: "36px", 
            height: "36px",
            fontSize: "1rem" 
          }} 
          title="Return to Library"
        >
          🏠
        </Link>
        
        <div className="control-divider" />
        
        {/* Font size adjustment */}
        <div className="font-size-controls">
          <button 
            onClick={decreaseFont} 
            className="btn" 
            style={{ 
              padding: "0", 
              borderRadius: "50%", 
              width: "32px", 
              height: "32px", 
              fontSize: "0.85rem",
              fontWeight: "600" 
            }}
            title="Decrease Font Size"
          >
            A-
          </button>
          <span className="size-label">
            {Math.round(fontSizeScale * 100)}%
          </span>
          <button 
            onClick={increaseFont} 
            className="btn" 
            style={{ 
              padding: "0", 
              borderRadius: "50%", 
              width: "32px", 
              height: "32px", 
              fontSize: "0.95rem",
              fontWeight: "600" 
            }}
            title="Increase Font Size"
          >
            A+
          </button>
        </div>

        <div className="control-divider" />

        {/* Distraction Free Toggle */}
        <button 
          onClick={toggleDistractionFree} 
          className="btn" 
          style={{ 
            padding: "0.4rem 1rem", 
            borderRadius: "20px", 
            fontSize: "0.85rem",
            fontWeight: "700",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            backgroundColor: isDistractionFree ? "var(--accent)" : "transparent",
            color: isDistractionFree ? "#060606" : "var(--text-primary)",
            borderColor: isDistractionFree ? "var(--accent)" : "var(--border)",
            boxShadow: isDistractionFree ? "0 0 15px var(--accent-glow)" : "none"
          }}
          title={isDistractionFree ? "Exit Focus Mode" : "Enter Focus Mode"}
        >
          {isDistractionFree ? "Focused" : "Focus"}
        </button>
      </div>
    </div>
  );
}
