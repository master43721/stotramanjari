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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on page transition
  useEffect(() => {
    requestAnimationFrame(() => setIsMobileMenuOpen(false));
  }, [pathname]);

  // Sync theme attribute to document on mount
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  const toggleTheme = () => {
    let nextTheme: ThemeType = "dark";
    if (theme === "dark") nextTheme = "sepia";
    else if (theme === "sepia") nextTheme = "clean-light";
    else nextTheme = "dark";

    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const navLinks = [
    { label: "Library", href: "/" },
    { label: "Contact & Support", href: "/contact" },
  ];

  const whatsappMessage = encodeURIComponent(
    "Namaste Sudheendra ji! Reaching out from Stotramani (stotramani.app) for sacred chanting support."
  );

  return (
    <header
      className="header"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "var(--bg-nav)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
        transition: "var(--transition-smooth)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: "60px",
          paddingBlock: "0.5rem",
        }}
      >
        {/* Brand / Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            minWidth: 0,
          }}
          aria-label="Stotramani Home"
        >
          <span
            style={{
              fontSize: "1.25rem",
              lineHeight: 1,
            }}
          >
            🕉️
          </span>
          <span
            style={{
              fontSize: "clamp(1.2rem, 4vw, 1.5rem)",
              fontWeight: "700",
              color: "var(--accent)",
              letterSpacing: "-0.03em",
              fontFamily: "var(--font-sans)",
              textShadow: "0 0 15px rgba(212, 175, 55, 0.25)",
              whiteSpace: "nowrap",
            }}
          >
            Stotramani
          </span>
          <span
            className="navbar-subtitle"
            style={{
              color: "var(--text-secondary)",
              fontFamily: "var(--font-telugu)",
              fontSize: "0.95rem",
              opacity: 0.9,
            }}
          >
            (స్తోత్రమణి)
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          style={{
            display: "none",
            alignItems: "center",
            gap: "1.5rem",
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: isActive ? "var(--accent)" : "var(--text-primary)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                  textShadow: isActive ? "0 0 10px rgba(212, 175, 55, 0.35)" : "none",
                }}
              >
                {link.label}
              </Link>
            );
          })}

          <a
            href={`https://wa.me/919886012345?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Chanting Support"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.35rem 0.85rem",
              borderRadius: "20px",
              backgroundColor: "rgba(37, 211, 102, 0.15)",
              border: "1px solid rgba(37, 211, 102, 0.4)",
              color: "#25D366",
              fontSize: "0.82rem",
              fontWeight: 700,
              textDecoration: "none",
              transition: "transform 0.2s ease, background-color 0.2s ease",
            }}
            title="Chat on WhatsApp with Sudheendra Sripada"
          >
            <span>💬</span> WhatsApp
          </a>

          <button
            onClick={toggleTheme}
            className="icon-btn"
            aria-label="Toggle Theme"
            title={`Current Theme: ${
              theme === "dark"
                ? "Midnight Gold"
                : theme === "sepia"
                ? "Aged Sepia"
                : "Clean Light"
            } (Click to cycle)`}
            style={{
              width: "42px",
              height: "42px",
              fontSize: "1.1rem",
              cursor: "pointer",
            }}
          >
            {theme === "dark" ? "🌙" : theme === "sepia" ? "📜" : "☀️"}
          </button>
        </nav>

        {/* Mobile Action Buttons: Theme Toggle & Hamburger */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
          className="mobile-header-actions"
        >
          <button
            onClick={toggleTheme}
            className="icon-btn"
            aria-label="Toggle Theme"
            title={`Current Theme: ${
              theme === "dark"
                ? "Midnight Gold"
                : theme === "sepia"
                ? "Aged Sepia"
                : "Clean Light"
            }`}
            style={{ width: "42px", height: "42px", fontSize: "1rem" }}
          >
            {theme === "dark" ? "🌙" : theme === "sepia" ? "📜" : "☀️"}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            className="icon-btn mobile-menu-toggle"
            style={{
              width: "42px",
              height: "42px",
              fontSize: "1.2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-drawer"
          style={{
            backgroundColor: "var(--bg-card)",
            borderBottom: "1px solid var(--border)",
            boxShadow: "0 20px 40px var(--shadow)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
            padding: "1.25rem 1.5rem 1.75rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                fontSize: "1.05rem",
                fontWeight: 600,
                color: pathname === "/" ? "var(--accent)" : "var(--text-primary)",
                textDecoration: "none",
                padding: "0.4rem 0",
              }}
            >
              📖 Sacred Library (Home)
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                fontSize: "1.05rem",
                fontWeight: 600,
                color: pathname === "/contact" ? "var(--accent)" : "var(--text-primary)",
                textDecoration: "none",
                padding: "0.4rem 0",
              }}
            >
              💬 Contact & Chanting Support
            </Link>

            <div style={{ height: "1px", backgroundColor: "var(--border)", margin: "0.25rem 0" }} />

            <Link
              href="/privacy"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                textDecoration: "none",
                padding: "0.25rem 0",
              }}
            >
              🛡️ Privacy Policy & Data Minimization
            </Link>

            <Link
              href="/terms"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                textDecoration: "none",
                padding: "0.25rem 0",
              }}
            >
              📜 Terms of Service
            </Link>

            <Link
              href="/cookies"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                textDecoration: "none",
                padding: "0.25rem 0",
              }}
            >
              🍪 Cookie & Storage Policy
            </Link>
          </div>

          <div style={{ paddingTop: "0.5rem" }}>
            <a
              href={`https://wa.me/919886012345?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.25rem",
                borderRadius: "24px",
                backgroundColor: "#25D366",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
                boxShadow: "0 4px 15px rgba(37, 211, 102, 0.35)",
              }}
            >
              <span>💬</span> WhatsApp Devotional Support
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
