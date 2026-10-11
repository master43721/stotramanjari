"use client";

import { useState } from "react";
import Link from "next/link";
import { calculatePanchang, PanchangInfo } from "@/lib/panchang";
import DailyPujaModal from "./DailyPujaModal";

export default function PanchangWidget() {
  const [panchang] = useState<PanchangInfo>(() => calculatePanchang());
  const [isPujaModalOpen, setIsPujaModalOpen] = useState(false);

  return (
    <>
      <div className="panchang-banner">
        {/* Top details row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.25rem",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.2rem" }}>🕉️</span>
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--accent)",
                }}
              >
                Vedic Panchang & Daily Nitya Archana
              </span>
            </div>
            <h3 style={{ fontSize: "1.35rem", fontWeight: 700, marginTop: "0.25rem" }}>
              {panchang.dayTelugu} ({panchang.dayName}) — {panchang.presidingDeity}
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
              {panchang.date}
            </p>
          </div>

          {/* Daily Puja Routine trigger button */}
          <button
            onClick={() => setIsPujaModalOpen(true)}
            className="btn"
            style={{
              padding: "0.55rem 1.2rem",
              borderRadius: "24px",
              borderColor: "var(--accent)",
              color: "var(--accent)",
              backgroundColor: "var(--accent-light)",
              fontSize: "0.85rem",
              fontWeight: 700,
              boxShadow: "0 0 15px var(--accent-glow)",
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
            }}
          >
            <span>📿</span> My Daily Puja Routine
          </button>
        </div>

        {/* Panchang Astronomical Elements Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "0.75rem",
            marginBottom: "1.25rem",
          }}
        >
          {/* Tithi */}
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              padding: "0.65rem 0.9rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
            }}
          >
            <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>
              తిథి / Tithi
            </span>
            <div style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--text-primary)", marginTop: "0.2rem" }}>
              {panchang.tithi.telugu}
            </div>
          </div>

          {/* Nakshatra */}
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              padding: "0.65rem 0.9rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
            }}
          >
            <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>
              నక్షత్రం / Nakshatra
            </span>
            <div style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--text-primary)", marginTop: "0.2rem" }}>
              {panchang.nakshatra.telugu}
            </div>
          </div>

          {/* Rahu Kalam */}
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              padding: "0.65rem 0.9rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
            }}
          >
            <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>
              రాహు కాలం / Rahu Kalam
            </span>
            <div style={{ fontSize: "0.92rem", fontWeight: 600, color: "#f87171", marginTop: "0.2rem" }}>
              {panchang.rahuKalam}
            </div>
          </div>

          {/* Abhijit Muhurtam */}
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              padding: "0.65rem 0.9rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
            }}
          >
            <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>
              అభిజిత్ ముహూర్తం
            </span>
            <div style={{ fontSize: "0.92rem", fontWeight: 600, color: "#34d399", marginTop: "0.2rem" }}>
              {panchang.abhijitMuhurtam}
            </div>
          </div>
        </div>

        {/* Stotra of the Day recommendation banner */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            padding: "0.9rem 1.2rem",
            borderRadius: "var(--radius-md)",
            background: "linear-gradient(135deg, var(--accent-light) 0%, var(--bg-card) 100%)",
            border: "1px solid var(--border)",
          }}
        >
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase" }}>
              ⭐ Recommended Stotra of the Day ({panchang.presidingDeity})
            </span>
            <div style={{ fontSize: "1.05rem", fontWeight: 600, marginTop: "0.2rem" }}>
              {panchang.recommendedStotra.titleEnglish} —{" "}
              <span style={{ fontFamily: "var(--font-telugu)", color: "var(--text-secondary)" }}>
                {panchang.recommendedStotra.titleTelugu}
              </span>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
              {panchang.recommendedStotra.description}
            </p>
          </div>

          <Link
            href={`/readings/${panchang.recommendedStotra.slug}`}
            className="btn"
            style={{
              backgroundColor: "var(--accent)",
              color: "#060606",
              padding: "0.5rem 1.15rem",
              borderRadius: "20px",
              fontWeight: 700,
              fontSize: "0.85rem",
              boxShadow: "0 0 15px var(--accent-glow)",
              whiteSpace: "nowrap",
            }}
          >
            Chant Today&apos;s Stotra →
          </Link>
        </div>
      </div>

      <DailyPujaModal isOpen={isPujaModalOpen} onClose={() => setIsPujaModalOpen(false)} />
    </>
  );
}
