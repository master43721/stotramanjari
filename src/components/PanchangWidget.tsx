"use client";

import Link from "next/link";
import { useState } from "react";
import { PANCHANG_CITIES, PanchangSnapshot, todayInIndia } from "@/lib/panchangService";
import DailyPujaModal from "./DailyPujaModal";
import { LotusIcon, SparklesIcon } from "./Icons";

interface PanchangWidgetProps {
  initialData: PanchangSnapshot | null;
  cityId?: keyof typeof PANCHANG_CITIES;
  date?: string;
}

const facts = (panchang: PanchangSnapshot) => [
  ["తిథి / Tithi", panchang.tithi, ""],
  ["నక్షత్రం / Nakshatra", panchang.nakshatra, ""],
  ["యోగం / Yoga", panchang.yoga || "—", ""],
  ["కరణం / Karana", panchang.karana || "—", ""],
  ["రాహు కాలం / Rahu Kalam", panchang.rahuKalam || "Not available", "warning"],
  ["అభిజిత్ ముహూర్తం", panchang.abhijitMuhurtam || "Not available", "success"],
];

export default function PanchangWidget({
  initialData,
  cityId = "hyderabad",
  date = todayInIndia(),
}: PanchangWidgetProps) {
  const [isPujaModalOpen, setIsPujaModalOpen] = useState(false);
  const panchangUrl = `/panchang/${cityId}/${date}`;

  if (!initialData) {
    return (
      <section className="panchang-banner" aria-label="Daily Panchang">
        <p className="panchang-eyebrow">నేటి పంచాంగం · Today&apos;s Panchang</p>
        <h2>Plan today&apos;s prayer with a location-aware Panchang.</h2>
        <p className="panchang-copy">
          Choose your city to view Tithi, Nakshatra, Rahu Kalam, sunrise, and daily observances.
        </p>
        <Link href={panchangUrl} className="panchang-link">
          Open today&apos;s Panchang →
        </Link>
      </section>
    );
  }

  const panchang = initialData;

  return (
    <>
      <section className="panchang-banner" aria-labelledby="panchang-heading">
        <div className="panchang-heading-row">
          <div>
            <p className="panchang-eyebrow">నేటి పంచాంగం · Daily Panchang</p>
            <h2 id="panchang-heading">
              {panchang.cityNameTelugu} ({panchang.cityName}) · {panchang.dateLabel}
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              {panchang.todayFestival} · అధిష్టాన దైవం: {panchang.presidingDeity}
            </p>
          </div>
          <div className="panchang-actions">
            <Link href={panchangUrl} className="panchang-link" title="Change city or date">
              నగరం / తేదీ మార్చండి →
            </Link>
            <button
              onClick={() => setIsPujaModalOpen(true)}
              className="panchang-puja-button"
              type="button"
              aria-label="Open My Daily Puja Routine"
            >
              <LotusIcon size={16} /> My Puja
            </button>
          </div>
        </div>

        {/* 6 Astronomical Panchang Facts */}
        <div className="panchang-facts">
          {facts(panchang).map(([label, value, tone]) => (
            <div className="panchang-fact" key={label}>
              <span>{label}</span>
              <strong data-tone={tone}>{value}</strong>
            </div>
          ))}
        </div>

        {/* Recommended Stotra of the Day connected to day/deity/festival */}
        {panchang.recommendedStotra && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.75rem",
              padding: "0.85rem 1rem",
              borderRadius: "var(--radius-sm)",
              background: "linear-gradient(135deg, var(--accent-light) 0%, var(--bg-card) 100%)",
              border: "1px solid var(--border)",
              margin: "0.75rem 0",
            }}
          >
            <div style={{ flex: "1 1 260px" }}>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <SparklesIcon size={12} /> నేటి విశిష్ట స్తోత్రం · Recommended Stotra ({panchang.recommendedStotra.deity})
              </span>
              <div style={{ fontSize: "0.98rem", fontWeight: 600, marginTop: "0.2rem" }}>
                {panchang.recommendedStotra.titleEnglish} —{" "}
                <span style={{ fontFamily: "var(--font-telugu)", color: "var(--text-secondary)" }}>
                  {panchang.recommendedStotra.titleTelugu}
                </span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.2rem", lineHeight: 1.4 }}>
                {panchang.recommendedStotra.description}
              </p>
            </div>

            <Link
              href={panchang.recommendedStotra.url}
              className="btn"
              style={{
                backgroundColor: "var(--accent)",
                color: "#060606",
                padding: "0.45rem 1rem",
                borderRadius: "20px",
                fontWeight: 700,
                fontSize: "0.82rem",
                boxShadow: "0 0 15px var(--accent-glow)",
                whiteSpace: "nowrap",
                textDecoration: "none",
              }}
            >
              పఠించండి / Chant Now →
            </Link>
          </div>
        )}

        <div className="panchang-footer">
          <span>
            సూర్యోదయం (Sunrise) {panchang.sunrise || "—"} · సూర్యాస్తమయం (Sunset) {panchang.sunset || "—"}
          </span>
          <Link href={panchangUrl}>సంపూర్ణ పంచాంగ వివరాలు &amp; రాబోవు పర్వదినాలు →</Link>
        </div>
      </section>
      <DailyPujaModal isOpen={isPujaModalOpen} onClose={() => setIsPujaModalOpen(false)} />
    </>
  );
}
