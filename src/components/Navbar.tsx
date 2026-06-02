"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const pathname = usePathname();

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      document.documentElement.setAttribute("data-theme", initialTheme);
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
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "60px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ 
            fontSize: "1.5rem", 
            fontWeight: "700", 
            color: "var(--accent)", 
            letterSpacing: "-0.02em",
            fontFamily: "var(--font-sans)" 
          }}>
            Stotra Manjari
          </span>
          <span style={{ 
            fontSize: "1rem", 
            fontWeight: "500", 
            color: "var(--text-secondary)", 
            fontFamily: "var(--font-telugu)",
            opacity: 0.8
          }}>
            (స్తోత్ర మంజరి)
          </span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link 
            href="/" 
            style={{ 
              fontSize: "0.95rem", 
              fontWeight: "500",
              color: pathname === "/" ? "var(--accent)" : "var(--text-primary)" 
            }}
          >
            Home
          </Link>
          
          <button 
            onClick={toggleTheme} 
            className="icon-btn" 
            aria-label="Toggle Theme"
            style={{ fontSize: "1.2rem" }}
          >
            {theme === "light" ? "🌙" : "📄"}
          </button>
        </nav>
      </div>
    </header>
  );
}
