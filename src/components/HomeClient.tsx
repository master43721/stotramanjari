"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { StotramIndexItem } from "@/types";
import PanchangWidget from "@/components/PanchangWidget";
import { StotramGridSkeleton } from "@/components/SkeletonLoader";
import {
  CloseIcon,
  SearchIcon,
  SparklesIcon,
  ShieldIcon,
  LotusIcon,
  SunIcon,
  ScrollIcon,
  BookIcon,
  StarIcon,
} from "@/components/Icons";
import {
  executeSemanticSearch,
  SACRED_INTENTS,
  SemanticIntent,
} from "@/lib/semanticSearch";

// Defined Category list
const SACRED_CATEGORIES = [
  { "id": "nitya-parayana", "name": "Nitya Parayana Slokas / Daily Prayers" },
  { "id": "vedic-chants", "name": "Vedic Chants" },
  { "id": "upanishads", "name": "Upanishads" },
  { "id": "shiva", "name": "Shiva Stotrams" },
  { "id": "vishnu", "name": "Vishnu Stotrams" },
  { "id": "rama", "name": "Sri Rama Stotrams" },
  { "id": "krishna", "name": "Sri Krishna Stotrams" },
  { "id": "venkateshwara", "name": "Sri Venkateshwara Swami Stotrams" },
  { "id": "devi", "name": "Devi Stotrams" },
  { "id": "durga", "name": "Durga Stotrams" },
  { "id": "lakshmi", "name": "Lakshmi Stotrams" },
  { "id": "ganesha", "name": "Ganesha Stotrams" },
  { "id": "hanuman", "name": "Hanuman Stotrams" },
  { "id": "surya", "name": "Surya Bhagavan Stotrams" },
  { "id": "saraswati", "name": "Saraswati Stotrams" },
  { "id": "subrahmanya", "name": "Subrahmanya Swami Stotrams" },
  { "id": "ganga", "name": "Ganga Stotrams" },
  { "id": "dattatreya", "name": "Dattatreya Stotrams" },
  { "id": "navagraha", "name": "Navagraha Stotrams" },
  { "id": "venkateshwara-keerthanas", "name": "Sri Venkateshwara Swami Keerthanas" },
  { "id": "guru", "name": "Guru Stotrams" },
  { "id": "daily-prayers", "name": "Daily Prayers / Dainandika Prarthana" },
  { "id": "ashtottara-namavali", "name": "Ashtottara Sata Namavali" },
  { "id": "ashtottara-stotram", "name": "Ashtottara Sata Nama Stotram" },
  { "id": "kavacha-stotrams", "name": "Kavacha Stotrams" },
  { "id": "pancha-ratna", "name": "Pancha Ratna Stotrams" },
  { "id": "sahasra-nama", "name": "Sahasra Nama Stotrams" },
  { "id": "bhagavad-gita", "name": "Srimad Bhagavad Gita" },
  { "id": "uddhava-gita", "name": "Uddhava Gita" },
  { "id": "patanjali-yoga-sutras", "name": "Patanjali Yoga Sutras" },
  { "id": "taittiriya-upanishad", "name": "Taittiriya Upanishad" },
  { "id": "kena-upanishad", "name": "Kena Upanishad" },
  { "id": "mundaka-upanishad", "name": "Mundaka Upanishad" },
  { "id": "devi-mahatmyam", "name": "Devi Mahatmyam / Durga Saptashati" },
  { "id": "devi-bhagavata-purana", "name": "Devi Bhagavata Purana" },
  { "id": "manidweepa-varnanam", "name": "Manidweepa Varnanam" },
  { "id": "chanakya-neeti", "name": "Chanakya Neeti" },
  { "id": "vidura-neeti", "name": "Vidura Neeti" },
  { "id": "gita-govindam", "name": "Gita Govindam / Jayadeva-Ashtapadi" },
  { "id": "ramacharitamanas", "name": "Sri Ramacharitamanas" },
  { "id": "mooka-pancha-shati", "name": "Sri Mooka Pancha Shati" },
  { "id": "bhartruhari-shataka-trishati", "name": "Bhartruhari Shataka Trishati" },
  { "id": "shatakas", "name": "Shatakas (Telugu)" },
  { "id": "ashtakas", "name": "Ashtakas" },
  { "id": "adi-shankaracharya", "name": "Adi Shankaracharya Stotrams" },
  { "id": "rama-keerthanas", "name": "Sri Rama Keerthanas" },
  { "id": "annamayya-keerthanas", "name": "Annamayya Keerthanas" },
  { "id": "thyagaraja-keerthanas", "name": "Thyagaraja Keerthanas" },
  { "id": "ramadasu-keerthanas", "name": "Ramadasu Keerthanas" },
  { "id": "raghavendra-swami", "name": "Raghavendra Swami Stotrams" },
  { "id": "telugu-geethalu", "name": "Telugu Devotional / Songs" },
  { "id": "bharata-mata", "name": "Bharata Mata / Patriotic" },
  { "id": "carnatic-swarabhyasam", "name": "Carnatic Music Swarabhyasa" },
  { "id": "carnatic-geetham", "name": "Carnatic Music Geetham" },
  { "id": "carnatic-swarajathi", "name": "Carnatic Music Swarajathi" },
  { "id": "sanskrit-geethalu", "name": "Sanskrit Devotional Songs" },
  { "id": "karma-siddhanta", "name": "Karma Siddhanta" },
  { "id": "tattva-shastra", "name": "Tattva Shastra" },
  { "id": "yajurveda-samhita-1", "name": "Krishna Yajurveda Taittiriya Samhita - Kanda 1" },
  { "id": "yajurveda-samhita-2", "name": "Krishna Yajurveda Taittiriya Samhita - Kanda 2" },
  { "id": "yajurveda-samhita-3", "name": "Krishna Yajurveda Taittiriya Samhita - Kanda 3" },
  { "id": "yajurveda-samhita-4", "name": "Krishna Yajurveda Taittiriya Samhita - Kanda 4" },
  { "id": "yajurveda-samhita-5", "name": "Krishna Yajurveda Taittiriya Samhita - Kanda 5" },
  { "id": "yajurveda-samhita-6", "name": "Krishna Yajurveda Taittiriya Samhita - Kanda 6" },
  { "id": "yajurveda-samhita-7", "name": "Krishna Yajurveda Taittiriya Samhita - Kanda 7" }
];

// Helper to classify stotrams into categories using exact mappings
function matchesCategory(
  stotram: StotramIndexItem,
  catId: string,
  mappings: Record<string, string[]>,
): boolean {
  const slugs = mappings[catId];
  if (slugs && slugs.includes(stotram.slug || stotram.id)) return true;
  return stotram.category === catId;
}

interface HomeClientProps {
  stotrams: StotramIndexItem[];
  categoryMappings: Record<string, string[]>;
}

export default function HomeClient({
  stotrams,
  categoryMappings,
}: HomeClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const selectCategory = (catId: string) => {
    setIsFiltering(true);
    setActiveCategory(catId);
    setIsDropdownOpen(false);
    setTimeout(() => {
      setIsFiltering(false);
    }, 150);
  };

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClose = () => setIsDropdownOpen(false);
    window.addEventListener("click", handleClose);
    return () => window.removeEventListener("click", handleClose);
  }, [isDropdownOpen]);

  // Filter database to only include stotrams that belong to our target categories
  const targetStotrams = useMemo(() => {
    return stotrams.filter((s) =>
      SACRED_CATEGORIES.some((cat) => matchesCategory(s, cat.id, categoryMappings))
    );
  }, [stotrams, categoryMappings]);

  // Compute category counts based on target stotrams
  const categoryCounts = useMemo(() => {
    return SACRED_CATEGORIES.reduce((acc, cat) => {
      acc[cat.id] = targetStotrams.filter((s) => matchesCategory(s, cat.id, categoryMappings)).length;
      return acc;
    }, {} as Record<string, number>);
  }, [targetStotrams, categoryMappings]);

  // Execute Semantic Information Retrieval Engine
  const semanticResult = useMemo(() => {
    return executeSemanticSearch(searchQuery, targetStotrams, activeCategory);
  }, [searchQuery, targetStotrams, activeCategory]);

  const { scoredResults, analysis } = semanticResult;

  // Render SVG icons for semantic spiritual intent pills
  const renderIntentIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldIcon":
        return <ShieldIcon size={14} />;
      case "LotusIcon":
        return <LotusIcon size={14} />;
      case "SunIcon":
        return <SunIcon size={14} />;
      case "ScrollIcon":
        return <ScrollIcon size={14} />;
      case "BookIcon":
        return <BookIcon size={14} />;
      case "StarIcon":
        return <StarIcon size={14} />;
      default:
        return <SparklesIcon size={14} />;
    }
  };

  const handlePillClick = (intent: SemanticIntent) => {
    if (searchQuery.toLowerCase() === intent.label.toLowerCase()) {
      setSearchQuery("");
    } else {
      setSearchQuery(intent.label);
    }
  };

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
    <div
      style={{
        backgroundColor: "var(--bg-base)",
        color: "var(--text-primary)",
        minHeight: "100vh",
        paddingBlock: "clamp(2rem, 5vw, 5rem)",
        position: "relative",
        overflow: "hidden",
        transition: "background-color 0.8s cubic-bezier(0.16, 1, 0.3, 1), color 0.5s ease",
      }}
    >
      {/* Divine Backlight Ambient Orbs */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "50%",
          height: "60%",
          background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
          filter: "blur(120px)",
          pointerEvents: "none",
          zIndex: 0,
          transition: "var(--transition-cinematic)",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          right: "-10%",
          width: "60%",
          height: "60%",
          background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 75%)",
          filter: "blur(120px)",
          pointerEvents: "none",
          zIndex: 0,
          transition: "var(--transition-cinematic)",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Vedic Panchang & Routine Banner */}
        <PanchangWidget />

        {/* Massive Gold Hero */}
        <section
          className="hero"
          style={{ textAlign: "center", paddingBottom: "clamp(1.75rem, 3.5vw, 3rem)" }}
        >
          <h1
            style={{
              fontSize: "clamp(2.1rem, 7vw, 4rem)",
              fontWeight: "700",
              letterSpacing: "-0.04em",
              lineHeight: "1.1",
              marginInline: "auto",
              maxWidth: "900px",
              background: "linear-gradient(135deg, var(--text-primary) 30%, var(--accent) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 50px var(--accent-glow)",
            }}
          >
            STOTRAMANI
          </h1>
          <p
            className="hero-subtitle"
            style={{
              color: "var(--text-secondary)",
              fontSize: "clamp(0.95rem, 2.5vw, 1.25rem)",
              marginTop: "1.25rem",
              maxWidth: "640px",
              marginInline: "auto",
              lineHeight: "1.6",
            }}
          >
            A pure, distraction-free digital sanctuary for sacred Telugu & Sanskrit stotrams.
            Curated with devotion by Sudheendra Sripada on stotramani.app.
          </p>
        </section>

        {/* Semantic Search and Filters panel */}
        <div className="semantic-search-box">
          {/* Active Semantic Mode Indicator */}
          <div
            className="semantic-mode-indicator"
            title="Semantic search engine understands meaning, context, and spiritual intent behind your search"
          >
            <SparklesIcon size={14} />
            <span>Semantic Intent Search Active</span>
          </div>

          {/* Glowing Semantic Search Input */}
          <div className="semantic-input-wrapper">
            <div className="semantic-input-icon">
              <SearchIcon size={19} />
            </div>
            <input
              type="text"
              placeholder="Search by spiritual intent, deity, or title (e.g. 'wealth', 'protection', 'ఆరోగ్యం', 'హనుమాన్')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="semantic-input"
              aria-label="Search stotrams by meaning, context, or title"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="semantic-clear-btn"
                aria-label="Clear search query"
              >
                <CloseIcon size={16} />
              </button>
            )}
          </div>

          {/* Quick Spiritual Intent Pills */}
          <div className="semantic-pills-container">
            <div className="semantic-pills-label">
              Browse by Spiritual Need &amp; Intent:
            </div>
            <div
              className="semantic-pills-scroll"
              role="tablist"
              aria-label="Spiritual Intent Filters"
            >
              {SACRED_INTENTS.map((intent) => {
                const isActive = searchQuery.toLowerCase() === intent.label.toLowerCase();
                return (
                  <button
                    key={intent.id}
                    type="button"
                    onClick={() => handlePillClick(intent)}
                    className={`semantic-intent-pill ${isActive ? "active" : ""}`}
                    title={intent.description}
                  >
                    {renderIntentIcon(intent.iconName)}
                    <span>{intent.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Dropdown Selector for Collections */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "28rem",
              marginInline: "auto",
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.boxShadow = "0 0 15px var(--accent-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
              style={{
                width: "100%",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderRadius: "1rem",
                padding: "0.875rem 1.5rem",
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
                fontWeight: "500",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                outline: "none",
              }}
            >
              <span style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {activeCategory === "all"
                  ? "Select Sacred Chants / Collection"
                  : SACRED_CATEGORIES.find((c) => c.id === activeCategory)?.name || activeCategory}
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  transition: "transform 0.3s ease",
                  transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
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
                  backgroundColor: "var(--bg-card)",
                  backdropFilter: "blur(40px)",
                  WebkitBackdropFilter: "blur(40px)",
                  border: "1px solid var(--border)",
                  borderRadius: "1rem",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  overflowY: "auto",
                  maxHeight: "20rem",
                  marginTop: "0.5rem",
                  zIndex: 50,
                }}
              >
                <div
                  onClick={() => selectCategory("all")}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--accent-light)";
                    e.currentTarget.style.color = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color =
                      activeCategory === "all" ? "var(--accent)" : "var(--text-primary)";
                  }}
                  style={{
                    padding: "0.75rem 1.25rem",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "0.85rem",
                    fontWeight: activeCategory === "all" ? "600" : "400",
                    letterSpacing: "0.05em",
                    color: activeCategory === "all" ? "var(--accent)" : "var(--text-primary)",
                    backgroundColor: activeCategory === "all" ? "var(--accent-light)" : "transparent",
                    transition: "all 0.2s ease",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  ALL CHANTS ({targetStotrams.length})
                </div>
                {SACRED_CATEGORIES.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => selectCategory(category.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--accent-light)";
                      e.currentTarget.style.color = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color =
                        activeCategory === category.id ? "var(--accent)" : "var(--text-primary)";
                    }}
                    style={{
                      padding: "0.75rem 1.25rem",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: "0.85rem",
                      fontWeight: activeCategory === category.id ? "600" : "400",
                      letterSpacing: "0.05em",
                      color:
                        activeCategory === category.id ? "var(--accent)" : "var(--text-primary)",
                      backgroundColor:
                        activeCategory === category.id ? "var(--accent-light)" : "transparent",
                      transition: "all 0.2s ease",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {category.name.toUpperCase()} ({categoryCounts[category.id]})
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Semantic Insight Banner (Shown when semantic query is recognized) */}
        {analysis.isSemantic && searchQuery.trim().length > 0 && (
          <div className="semantic-insight-banner">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "var(--accent)",
                }}
              >
                <SparklesIcon size={18} />
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "0.86rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Semantic Intent Understood
                </span>
              </div>
              <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", opacity: 0.9 }}>
                {scoredResults.length} {scoredResults.length === 1 ? "chant" : "chants"} matched
              </span>
            </div>

            {analysis.summaryLabel && (
              <h2
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  marginTop: "0.45rem",
                  color: "var(--text-primary)",
                  letterSpacing: "-0.01em",
                }}
              >
                {analysis.summaryLabel}
              </h2>
            )}

            {analysis.summarySubtitle && (
              <p
                style={{
                  fontSize: "0.88rem",
                  color: "var(--text-secondary)",
                  marginTop: "0.25rem",
                  lineHeight: 1.5,
                }}
              >
                {analysis.summarySubtitle}
              </p>
            )}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.45rem",
                marginTop: "0.75rem",
              }}
            >
              {analysis.matchedIntents.map((intent) => (
                <span key={intent.id} className="semantic-pill-tag">
                  Intent: {intent.label} ({intent.labelTelugu})
                </span>
              ))}
              {analysis.matchedDeities.map((deity) => (
                <span key={deity.canonical} className="semantic-pill-tag">
                  Deity: {deity.name} ({deity.nameTelugu})
                </span>
              ))}
              {analysis.matchedForms.map((form) => (
                <span key={form.key} className="semantic-pill-tag">
                  Form: {form.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Responsive Grid of Glassmorphic Cards with Skeleton Shimmer */}
        {isFiltering ? (
          <StotramGridSkeleton count={6} />
        ) : scoredResults.length > 0 ? (
          <div className="grid">
            {scoredResults.map(({ item: stotram, primaryTag }) => (
              <div
                key={stotram.id}
                className="stotram-card"
                onMouseMove={handleMouseMove}
              >
                {/* Contextual Semantic Tag if matching an intent or deity */}
                {primaryTag && searchQuery.trim().length > 0 && (
                  <span className="stotram-semantic-badge">
                    <SparklesIcon size={12} />
                    <span>{primaryTag}</span>
                  </span>
                )}

                <span className="stotram-card-category">
                  {SACRED_CATEGORIES.find((c) => matchesCategory(stotram, c.id, categoryMappings))?.name ||
                    stotram.category}
                </span>
                <h2 className="stotram-card-title-english">{stotram.title_english}</h2>
                <h3 className="stotram-card-title-telugu">{stotram.title_telugu}</h3>

                <Link href={`/readings/${stotram.slug}`} className="stotram-card-link">
                  Read Stotram <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
              color: "var(--text-secondary)",
              backgroundColor: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              maxWidth: "640px",
              margin: "0 auto 4rem auto",
              boxShadow: "0 10px 40px var(--shadow)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                padding: "1rem",
                borderRadius: "50%",
                background: "rgba(212, 175, 55, 0.1)",
                color: "var(--accent)",
                marginBottom: "1rem",
              }}
            >
              <SearchIcon size={32} />
            </div>
            <p
              style={{
                fontSize: "1.35rem",
                fontWeight: "700",
                color: "var(--text-primary)",
              }}
            >
              No Stotrams Found for &ldquo;{searchQuery}&rdquo;
            </p>
            <p
              style={{
                fontSize: "0.92rem",
                marginTop: "0.6rem",
                opacity: 0.9,
                lineHeight: 1.6,
              }}
            >
              Try searching by spiritual intent like <em>wealth</em>, <em>health</em>,{" "}
              <em>protection</em>, or deities like <em>Lord Shiva</em>, <em>Hanuman</em>,{" "}
              <em>Sri Rama</em>.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "1.5rem",
              }}
            >
              <button
                type="button"
                onClick={() => setSearchQuery("Wealth & Prosperity")}
                className="semantic-intent-pill"
              >
                <LotusIcon size={14} /> Wealth &amp; Prosperity
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery("Health & Healing")}
                className="semantic-intent-pill"
              >
                <SunIcon size={14} /> Health &amp; Healing
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery("Protection & Courage")}
                className="semantic-intent-pill"
              >
                <ShieldIcon size={14} /> Protection &amp; Courage
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="btn"
                style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
