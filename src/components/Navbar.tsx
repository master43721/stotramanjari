"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import StotramaniLogo from "./StotramaniLogo";
import {
  MoonIcon,
  SunIcon,
  ScrollIcon,
  MenuIcon,
  CloseIcon,
  ArrowUpIcon,
  BookIcon,
  MailIcon,
  ShieldIcon,
  CookieIcon,
} from "./Icons";

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
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on page transition
  useEffect(() => {
    requestAnimationFrame(() => setIsMobileMenuOpen(false));
  }, [pathname]);

  // Sync theme attribute to document on mount
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Detect scroll position to dynamically show dynamic Top button & elevated styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 120);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    { label: "Contact", href: "/contact" },
  ];

  const whatsappShareText =
    "Namaste! Discover Stotramani (స్తోత్రమణి) – A sacred, distraction-free digital sanctuary for authentic Telugu & Sanskrit stotrams, Vedic chants, and daily puja slokas.\n\nExplore and recite here:\nhttps://stotramani.app";
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappShareText)}`;

  return (
    <header
      className={`header ${isScrolled ? "header-scrolled" : ""} ${
        isMobileMenuOpen ? "header-menu-open" : ""
      }`}
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
            gap: "0.55rem",
            textDecoration: "none",
            minWidth: 0,
          }}
          aria-label="Stotramani Home"
        >
          <StotramaniLogo size={30} />
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
            gap: "1.25rem",
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
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share Stotramani on WhatsApp"
            className="whatsapp-nav-btn"
            title="Share Stotramani with friends & groups on WhatsApp"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              style={{ display: "inline-block", verticalAlign: "middle" }}
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.983zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>Share</span>
          </a>

          {/* Dynamic Scroll-to-Top Button */}
          {isScrolled && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="dynamic-top-btn"
              aria-label="Scroll to top of page"
              title="Scroll back to top"
            >
              <ArrowUpIcon size={14} />
              <span>Top</span>
            </button>
          )}

          {/* Theme Toggle Button with Real SVG Vector Icons */}
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
              cursor: "pointer",
            }}
          >
            {theme === "dark" ? (
              <MoonIcon size={18} />
            ) : theme === "sepia" ? (
              <ScrollIcon size={18} />
            ) : (
              <SunIcon size={18} />
            )}
          </button>
        </nav>

        {/* Mobile Action Buttons: Dynamic Top Button, WhatsApp Share, Theme Toggle & Hamburger */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
          className="mobile-header-actions"
        >
          {/* Dynamic Scroll-to-Top Button on Mobile */}
          {isScrolled && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="icon-btn dynamic-mobile-top-btn"
              aria-label="Scroll to top"
              title="Scroll back to top"
              style={{ width: "38px", height: "38px" }}
            >
              <ArrowUpIcon size={16} />
            </button>
          )}

          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-mobile-icon-btn"
            aria-label="Share Stotramani on WhatsApp"
            title="Share Stotramani on WhatsApp"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.983zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
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
            }`}
            style={{ width: "42px", height: "42px" }}
          >
            {theme === "dark" ? (
              <MoonIcon size={18} />
            ) : theme === "sepia" ? (
              <ScrollIcon size={18} />
            ) : (
              <SunIcon size={18} />
            )}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            className="icon-btn mobile-menu-toggle"
            style={{
              width: "42px",
              height: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isMobileMenuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
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
            borderBottomLeftRadius: "24px",
            borderBottomRightRadius: "24px",
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
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
              }}
            >
              <BookIcon size={18} />
              <span>Sacred Library (Home)</span>
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
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
              }}
            >
              <MailIcon size={18} />
              <span>Devotional Contact</span>
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
                display: "flex",
                alignItems: "center",
                gap: "0.55rem",
              }}
            >
              <ShieldIcon size={16} />
              <span>Privacy Policy & Data Minimization</span>
            </Link>

            <Link
              href="/terms"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                textDecoration: "none",
                padding: "0.25rem 0",
                display: "flex",
                alignItems: "center",
                gap: "0.55rem",
              }}
            >
              <ScrollIcon size={16} />
              <span>Terms of Service</span>
            </Link>

            <Link
              href="/cookies"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                textDecoration: "none",
                padding: "0.25rem 0",
                display: "flex",
                alignItems: "center",
                gap: "0.55rem",
              }}
            >
              <CookieIcon size={16} />
              <span>Cookie & Storage Policy</span>
            </Link>
          </div>

          <div style={{ paddingTop: "0.5rem" }}>
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-drawer-btn"
              title="Share Stotramani on WhatsApp"
              aria-label="Share Stotramani on WhatsApp"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                style={{ display: "inline-block", verticalAlign: "middle" }}
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.983zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Share Stotramani on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
