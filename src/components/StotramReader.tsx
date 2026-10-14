"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Stotram, DailyPujaItem } from "@/types";
import { SupportedScript, transliterate } from "@/lib/sanscript";
import Breadcrumbs from "@/components/Breadcrumbs";

interface StotramReaderProps {
  stotram: Stotram;
}

export default function StotramReader({ stotram }: StotramReaderProps) {
  // Font scale (0.8x to 2.0x), persisted in localStorage
  const [fontSizeScale, setFontSizeScale] = useState<number>(() => {
    if (typeof window === "undefined") return 1.1;
    const savedScale = localStorage.getItem("reader-font-scale");
    if (savedScale) {
      const parsed = parseFloat(savedScale);
      if (!isNaN(parsed) && parsed >= 0.8 && parsed <= 2.0) return parsed;
    }
    return 1.1;
  });
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Script selection (Telugu, Devanagari, Kannada, Tamil, IAST)
  const [script, setScript] = useState<SupportedScript>(() => {
    if (typeof window === "undefined") return "telugu";
    const savedScript = localStorage.getItem("reader-script") as SupportedScript | null;
    if (savedScript && ["telugu", "devanagari", "kannada", "tamil", "iast"].includes(savedScript)) {
      return savedScript;
    }
    return "telugu";
  });

  // Daily Puja bookmark state
  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const raw = localStorage.getItem("daily_puja_routine");
      const routine: DailyPujaItem[] = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(routine)) return false;
      const targetSlug = stotram.slug || stotram.id;
      return routine.some((item) => item.id === stotram.id || item.slug === targetSlug);
    } catch {
      return false;
    }
  });

  // Active theme state
  const [currentTheme, setCurrentTheme] = useState<"dark" | "sepia" | "clean-light">(() => {
    if (typeof window === "undefined") return "dark";
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "clean-light" || savedTheme === "sepia" || savedTheme === "dark") {
      return savedTheme;
    }
    return "dark";
  });

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
    setFontSizeScale((prev) => {
      const next = Math.max(0.8, Math.round((prev - 0.1) * 10) / 10);
      localStorage.setItem("reader-font-scale", next.toString());
      return next;
    });
  };

  const increaseFont = () => {
    setFontSizeScale((prev) => {
      const next = Math.min(2.0, Math.round((prev + 0.1) * 10) / 10);
      localStorage.setItem("reader-font-scale", next.toString());
      return next;
    });
  };

  const handleScriptChange = (newScript: SupportedScript) => {
    setScript(newScript);
    localStorage.setItem("reader-script", newScript);
  };

  const cycleTheme = () => {
    let next: "dark" | "sepia" | "clean-light" = "dark";
    if (currentTheme === "dark") next = "sepia";
    else if (currentTheme === "sepia") next = "clean-light";
    else next = "dark";

    setCurrentTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const toggleBookmark = () => {
    try {
      const raw = localStorage.getItem("daily_puja_routine");
      const routine: DailyPujaItem[] = raw ? JSON.parse(raw) : [];
      const currentList = Array.isArray(routine) ? routine : [];
      let updated: DailyPujaItem[];
      const targetSlug = stotram.slug || stotram.id;
      if (isBookmarked) {
        updated = currentList.filter((i) => i.id !== stotram.id && i.slug !== targetSlug);
        setIsBookmarked(false);
      } else {
        updated = [
          ...currentList,
          {
            id: stotram.id,
            slug: targetSlug,
            title_english: stotram.title_english,
            title_telugu: stotram.title_telugu,
            category: stotram.category,
            addedAt: Date.now(),
          },
        ];
        setIsBookmarked(true);
      }
      localStorage.setItem("daily_puja_routine", JSON.stringify(updated));
    } catch {}
  };

  // Group lines into stanzas
  const stanzas = useMemo(() => {
    const list: { index: number; lines: string[] }[] = [];
    let current: string[] = [];

    (stotram.content_lines || []).forEach((line) => {
      current.push(line);
      const isEnd = line.includes("॥") || line.includes("||") || /\d\s*$/.test(line.trim());
      if (isEnd || current.length >= 4) {
        list.push({ index: list.length, lines: [...current] });
        current = [];
      }
    });

    if (current.length > 0) {
      list.push({ index: list.length, lines: current });
    }

    return list;
  }, [stotram.content_lines]);

  // Dynamic font family for active script
  const scriptFontFamily =
    script === "devanagari"
      ? "var(--font-devanagari)"
      : script === "kannada"
      ? "var(--font-kannada)"
      : script === "tamil"
      ? "var(--font-tamil)"
      : script === "iast"
      ? "var(--font-iast)"
      : "var(--font-telugu)";

  const categoryLabel = stotram.category
    ? stotram.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Sacred Chants";

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: categoryLabel, href: `/${stotram.category}/${stotram.slug || stotram.id}` },
    { label: stotram.title_english },
  ];

  return (
    <div
      className="reader-wrapper"
      style={{
        paddingBottom: "4.5rem",
        "--reader-font-scale": fontSizeScale,
      } as React.CSSProperties}
    >
      {/* Scroll Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />
      </div>

      <div className="reader-container">
        {/* Sacred Header */}
        <header className="reader-header">
          <Breadcrumbs items={breadcrumbs} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <Link
              href="/"
              style={{
                fontSize: "0.85rem",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--accent)",
                transition: "var(--transition-cinematic)",
              }}
              onMouseOver={(e) => (e.currentTarget.style.letterSpacing = "0.15em")}
              onMouseOut={(e) => (e.currentTarget.style.letterSpacing = "0.1em")}
            >
              ← Back to library
            </Link>

            {/* Bookmark in Daily Puja */}
            <button
              onClick={toggleBookmark}
              className="btn"
              style={{
                padding: "0.35rem 0.85rem",
                borderRadius: "20px",
                fontSize: "0.85rem",
                borderColor: isBookmarked ? "var(--accent)" : "var(--border)",
                color: isBookmarked ? "var(--accent)" : "var(--text-secondary)",
                backgroundColor: isBookmarked ? "var(--accent-light)" : "transparent",
              }}
              title={isBookmarked ? "Starred in My Daily Puja" : "Add to My Daily Puja routine"}
            >
              {isBookmarked ? "⭐ Starred in Daily Puja" : "☆ Add to Daily Puja"}
            </button>
          </div>

          <h1 className="reader-title-telugu" style={{ fontFamily: scriptFontFamily }}>
            {transliterate(stotram.title_telugu, script)}
          </h1>
          <h2 className="reader-title-english">{stotram.title_english}</h2>

          {stotram.pdfLink && (
            <div style={{ marginTop: "1.5rem" }}>
              <a
                href={stotram.pdfLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  borderColor: "var(--accent)",
                  color: "var(--accent)",
                  backgroundColor: "var(--accent-light)",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "0.5rem 1.25rem",
                  borderRadius: "20px",
                }}
              >
                📄 View Original PDF
              </a>
            </div>
          )}
        </header>

        {/* Text Area with Stanzas */}
        <article className="stotram-content-body" style={{ fontFamily: scriptFontFamily }}>
          {stanzas.map((stanza) => {
            return (
              <div
                key={stanza.index}
                id={`verse-${stanza.index}`}
                className="stotram-verse-block"
              >
                {/* Verse Lines */}
                {stanza.lines.map((line, lIdx) => {
                  const isEndOfVerse =
                    line.includes("॥") ||
                    line.includes("||") ||
                    /\d\s*$/.test(line.trim());

                  return (
                    <p
                      key={lIdx}
                      className="stotram-line"
                      style={{
                        marginBottom: isEndOfVerse ? "0.9rem" : "0.35rem",
                        fontWeight: "400",
                        color: isEndOfVerse ? "var(--text-primary)" : "var(--text-secondary)",
                      }}
                    >
                      {transliterate(line, script)}
                    </p>
                  );
                })}
              </div>
            );
          })}
        </article>
      </div>

      {/* Floating Control Toolbar */}
      <div className="floating-controls" style={{ bottom: "2rem" }}>
        {/* Back Link */}
        <Link
          href="/"
          className="btn"
          style={{
            padding: "0",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            fontSize: "1rem",
          }}
          title="Return to Library"
        >
          🏠
        </Link>

        <div className="control-divider" />

        {/* Multi-Script Selector Dropdown */}
        <select
          value={script}
          onChange={(e) => handleScriptChange(e.target.value as SupportedScript)}
          style={{
            backgroundColor: "transparent",
            color: "var(--accent)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "0.3rem 0.6rem",
            fontSize: "0.82rem",
            fontWeight: 700,
            cursor: "pointer",
            outline: "none",
          }}
          title="Select Chanting Script (Transliteration)"
        >
          <option value="telugu" style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}>తెలుగు (Telugu)</option>
          <option value="devanagari" style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}>देवनागरी (Devanagari)</option>
          <option value="kannada" style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}>ಕನ್ನಡ (Kannada)</option>
          <option value="tamil" style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}>தமிழ் (Tamil)</option>
          <option value="iast" style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}>English (IAST Roman)</option>
        </select>

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
              fontWeight: "600",
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
              fontWeight: "600",
            }}
            title="Increase Font Size"
          >
            A+
          </button>
        </div>

        <div className="control-divider" />

        {/* Devotional Theme Switcher */}
        <button
          onClick={cycleTheme}
          className="btn"
          style={{
            padding: "0",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            fontSize: "0.9rem",
          }}
          title={`Theme: ${currentTheme === "dark" ? "Midnight Gold" : currentTheme === "sepia" ? "Aged Sepia" : "Clean Light"} (Click to cycle)`}
        >
          {currentTheme === "dark" ? "🌙" : currentTheme === "sepia" ? "📜" : "☀️"}
        </button>

        <div className="control-divider" />

        {/* Distraction Free Toggle */}
        <button
          onClick={() => setIsDistractionFree(!isDistractionFree)}
          className="btn"
          style={{
            padding: "0.4rem 0.9rem",
            borderRadius: "20px",
            fontSize: "0.82rem",
            fontWeight: "700",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            backgroundColor: isDistractionFree ? "var(--accent)" : "transparent",
            color: isDistractionFree ? "#060606" : "var(--text-primary)",
            borderColor: isDistractionFree ? "var(--accent)" : "var(--border)",
            boxShadow: isDistractionFree ? "0 0 15px var(--accent-glow)" : "none",
          }}
          title={isDistractionFree ? "Exit Focus Mode" : "Enter Focus Mode"}
        >
          {isDistractionFree ? "Focused" : "Focus"}
        </button>
      </div>
    </div>
  );
}
