"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DailyPujaItem } from "@/types";

interface DailyPujaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DailyPujaModal({ isOpen, onClose }: DailyPujaModalProps) {
  const [routine, setRoutine] = useState<DailyPujaItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("daily_puja_routine");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("Failed to read daily puja routine:", e);
    }
    return [
      {
        id: "ganesha-pancharatnam",
        slug: "ganesha-pancharatnam",
        title_english: "Sri Ganesha Pancharatnam",
        title_telugu: "శ్రీ గణేశ పంచరత్న స్తోత్రం",
        category: "ganesha",
        addedAt: 1,
      },
      {
        id: "shiva-panchakshari-stotram",
        slug: "shiva-panchakshari-stotram",
        title_english: "Shiva Panchakshari Stotram",
        title_telugu: "శ్రీ శివ పంచాక్షరీ స్తోత్రం",
        category: "shiva",
        addedAt: 2,
      },
    ];
  });
  const [activeStep, setActiveStep] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("daily_puja_routine");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Use requestAnimationFrame to avoid synchronous cascading render warning
            requestAnimationFrame(() => setRoutine(parsed));
          }
        }
      } catch (e) {
        console.warn("Syncing daily puja failed:", e);
      }
    }
  }, [isOpen]);

  const removeStotra = (id: string) => {
    const updated = routine.filter((item) => item.id !== id && item.slug !== id);
    setRoutine(updated);
    localStorage.setItem("daily_puja_routine", JSON.stringify(updated));
  };

  const startPujaMode = () => {
    if (routine.length > 0) {
      setActiveStep(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        zIndex: 150,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(0.5rem, 3vw, 1.5rem)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "var(--bg-base)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          maxWidth: "580px",
          width: "100%",
          padding: "clamp(1rem, 4vw, 2rem)",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.8), 0 0 30px var(--accent-glow)",
          color: "var(--text-primary)",
          position: "relative",
          maxHeight: "88vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", gap: "0.5rem" }}>
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Sacred Ritual Routine
            </span>
            <h2 style={{ fontSize: "clamp(1.2rem, 4vw, 1.75rem)", fontWeight: 700, marginTop: "0.2rem" }}>
              My Daily Puja (నిత్య పూజా విధము)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn"
            style={{ width: "36px", height: "36px", padding: 0, borderRadius: "50%" }}
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Puja Guide Sequence Mode */}
        {activeStep !== null && routine[activeStep] ? (
          <div
            style={{
              padding: "1.5rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--accent)",
              boxShadow: "0 0 20px var(--accent-glow)",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ fontSize: "0.85rem", color: "var(--accent)", fontWeight: 700 }}>
              STEP {activeStep + 1} OF {routine.length}
            </span>
            <h3 style={{ fontSize: "1.4rem", marginTop: "0.5rem" }}>
              {routine[activeStep].title_english}
            </h3>
            <p style={{ fontFamily: "var(--font-telugu)", fontSize: "1.2rem", color: "var(--text-secondary)", marginTop: "0.3rem" }}>
              {routine[activeStep].title_telugu}
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1.5rem" }}>
              <Link
                href={`/readings/${routine[activeStep].slug || routine[activeStep].id}`}
                className="btn"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "#060606",
                  padding: "0.6rem 1.4rem",
                  fontWeight: 700,
                  borderRadius: "24px",
                }}
              >
                Chant Now 📿
              </Link>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <button
                disabled={activeStep === 0}
                onClick={() => setActiveStep(activeStep - 1)}
                className="btn"
                style={{ opacity: activeStep === 0 ? 0.4 : 1, fontSize: "0.85rem" }}
              >
                ← Previous
              </button>
              <button
                onClick={() => setActiveStep(null)}
                className="btn"
                style={{ fontSize: "0.8rem", color: "var(--text-secondary)", borderColor: "var(--border)" }}
                title="Return to routine list"
              >
                📋 View Full Routine
              </button>
              <button
                disabled={activeStep >= routine.length - 1}
                onClick={() => setActiveStep(activeStep + 1)}
                className="btn"
                style={{ opacity: activeStep >= routine.length - 1 ? 0.4 : 1, fontSize: "0.85rem" }}
              >
                Next Chant →
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Add stotrams to your daily routine by clicking the sacred star ⭐ icon on any stotram.
              Follow this sequence daily in your prayer altar.
            </p>

            {routine.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {routine.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.85rem 1.1rem",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span
                        style={{
                          width: "26px",
                          height: "26px",
                          borderRadius: "50%",
                          backgroundColor: "var(--accent-light)",
                          color: "var(--accent)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                        }}
                      >
                        {idx + 1}
                      </span>
                      <div>
                        <Link
                          href={`/readings/${item.slug || item.id}`}
                          style={{
                            fontSize: "1rem",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            display: "block",
                          }}
                        >
                          {item.title_english}
                        </Link>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontFamily: "var(--font-telugu)" }}>
                          {item.title_telugu}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeStotra(item.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        padding: "0.4rem",
                      }}
                      title="Remove from routine"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--text-secondary)" }}>
                No stotrams in your routine yet.
              </div>
            )}

            {routine.length > 0 && (
              <button
                onClick={startPujaMode}
                className="btn"
                style={{
                  width: "100%",
                  backgroundColor: "var(--accent)",
                  color: "#060606",
                  padding: "0.85rem",
                  fontSize: "1rem",
                  fontWeight: 700,
                  borderRadius: "24px",
                  boxShadow: "0 0 20px var(--accent-glow)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                📿 Start Daily Puja Mode ({routine.length} Stotras)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
