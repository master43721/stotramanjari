"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  type ThemeType = "dark" | "sepia" | "clean-light";
  const [theme, setTheme] = useState<ThemeType>(() => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "sepia") return "sepia";
    if (saved === "clean-light") return "clean-light";
    return "dark";
  });
  const pathname = usePathname();

  // Sync theme attribute to document on mount
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    let nextTheme: ThemeType = "dark";
    if (theme === "dark") nextTheme = "sepia";
    else if (theme === "sepia") nextTheme = "clean-light";
    else nextTheme = "dark";

    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  return (
    <header className="header">
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "56px", height: "auto", paddingBlock: "0.5rem" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.4rem", minWidth: 0 }}>
          <span style={{ 
            fontSize: "clamp(1.15rem, 3.8vw, 1.45rem)", 
            fontWeight: "700", 
            color: "var(--accent)", 
            letterSpacing: "-0.03em",
            fontFamily: "var(--font-sans)",
            textShadow: "0 0 15px rgba(212, 175, 55, 0.25)",
            whiteSpace: "nowrap"
          }}>
            Stotramani
          </span>
          <span className="navbar-subtitle" style={{ 
            color: "var(--text-secondary)", 
            fontFamily: "var(--font-telugu)",
            opacity: 0.85
          }}>
            (స్తోత్రమణి)
          </span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "clamp(0.75rem, 2vw, 1.5rem)", flexShrink: 0 }}>
          <Link 
            href="/" 
            style={{ 
              fontSize: "clamp(0.85rem, 2vw, 0.95rem)", 
              fontWeight: "600",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: pathname === "/" ? "var(--accent)" : "var(--text-primary)",
              textShadow: pathname === "/" ? "0 0 10px rgba(212, 175, 55, 0.3)" : "none"
            }}
          >
            Library
          </Link>
          
          <button 
            onClick={toggleTheme} 
            className="icon-btn" 
            aria-label="Toggle Theme"
            title={`Current Theme: ${theme === "dark" ? "Midnight Gold" : theme === "sepia" ? "Aged Sepia" : "Clean Light"} (Click to cycle)`}
            style={{ width: "38px", height: "38px", fontSize: "1rem" }}
          >
            {theme === "dark" ? "🌙" : theme === "sepia" ? "📜" : "☀️"}
          </button>
        </nav>
      </div>
    </header>
  );
}
