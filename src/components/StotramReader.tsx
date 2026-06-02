"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Stotram } from "@/types";

interface StotramReaderProps {
  stotram: Stotram;
}

export default function StotramReader({ stotram }: StotramReaderProps) {
  const [fontSizeScale, setFontSizeScale] = useState(1.0); // 1.0 = base (1.4rem)
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
    setFontSizeScale((prev) => Math.max(0.75, prev - 0.1));
  };

  const increaseFont = () => {
    setFontSizeScale((prev) => Math.min(1.75, prev + 0.1));
  };

  const toggleDistractionFree = () => {
    setIsDistractionFree((prev) => !prev);
  };

  // Base font size in rem for stotram reading text
  const currentFontSize = `${1.4 * fontSizeScale}rem`;

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
          <div style={{ marginBottom: "1rem" }}>
            <Link 
              href="/" 
              style={{ 
                fontSize: "0.85rem", 
                fontWeight: "600", 
                textTransform: "uppercase", 
                letterSpacing: "0.08em",
                color: "var(--accent)"
              }}
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
            // Group verses roughly: two lines form a normal verse structure
            const isSecondLineOfVerse = index % 2 === 1 || line.includes("||") || line.includes("||");
            const isEndOfVerse = line.trim().endsWith("||") || line.trim().endsWith("|| 1 ||") || line.trim().endsWith("|| 2 ||") || line.trim().endsWith("|| 3 ||") || line.trim().endsWith("|| 4 ||") || line.trim().endsWith("|| 5 ||");
            
            return (
              <p 
                key={index} 
                className="stotram-line"
                style={{ 
                  fontSize: currentFontSize,
                  marginBottom: isEndOfVerse ? "1.5rem" : "0.25rem",
                  fontWeight: "400"
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
        <Link href="/" className="btn" style={{ padding: "0.4rem 0.6rem", borderRadius: "50%" }} title="Home">
          🏠
        </Link>
        
        <div className="control-divider" />
        
        {/* Font size adjustment */}
        <div className="font-size-controls">
          <button 
            onClick={decreaseFont} 
            className="btn" 
            style={{ padding: "0.2rem 0.5rem", minWidth: "32px", fontSize: "0.9rem" }}
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
            style={{ padding: "0.2rem 0.5rem", minWidth: "32px", fontSize: "1rem" }}
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
            padding: "0.4rem 0.8rem", 
            borderRadius: "20px", 
            fontSize: "0.85rem",
            backgroundColor: isDistractionFree ? "var(--accent)" : "transparent",
            color: isDistractionFree ? "var(--bg-base)" : "var(--text-primary)",
            borderColor: isDistractionFree ? "var(--accent)" : "transparent"
          }}
          title={isDistractionFree ? "Exit Focus Mode" : "Enter Focus Mode"}
        >
          {isDistractionFree ? "👓 Focused" : "👁️ Focus"}
        </button>
      </div>
    </div>
  );
}
