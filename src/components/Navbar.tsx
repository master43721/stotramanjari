"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [theme, setTheme] = useState<"light" | "dark">("light"); // Default to light
  const pathname = usePathname();

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      // Default to light mode if no preference saved
      setTheme("light");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <header className="header">
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "64px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ 
            fontSize: "1.45rem", 
            fontWeight: "700", 
            color: "var(--accent)", 
            letterSpacing: "-0.03em",
            fontFamily: "var(--font-sans)",
            textShadow: "0 0 15px rgba(212, 175, 55, 0.25)"
          }}>
            Stotra Manjari
          </span>
          <span style={{ 
            fontSize: "0.95rem", 
            fontWeight: "500", 
            color: "var(--text-secondary)", 
            fontFamily: "var(--font-telugu)",
            opacity: 0.85
          }}>
            (స్తోత్ర మంజరి)
          </span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link 
            href="/" 
            style={{ 
              fontSize: "0.95rem", 
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
            style={{ fontSize: "1.1rem" }}
          >
            {theme === "light" ? "🌙" : "📄"}
          </button>
        </nav>
      </div>
    </header>
  );
}
