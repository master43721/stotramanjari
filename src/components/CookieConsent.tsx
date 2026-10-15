"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CookieIcon } from "./Icons";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("cookie-consent");
      if (!consent) {
        requestAnimationFrame(() => setIsVisible(true));
      }
    } catch {}
  }, []);

  const handleConsent = (level: "accepted" | "essential") => {
    try {
      localStorage.setItem("cookie-consent", level);
      if (level === "essential" && typeof window !== "undefined" && (window as unknown as { [key: string]: unknown })["dataLayer"]) {
        // Disable ad/analytics personalization
        ((window as unknown as { [key: string]: unknown })["dataLayer"] as unknown[]).push({
          event: "consent_update",
          analytics_storage: "denied",
        });
      }
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Privacy and Cookie Notice"
      style={{
        position: "fixed",
        bottom: "1rem",
        left: "1rem",
        right: "1rem",
        margin: "0 auto",
        maxWidth: "680px",
        zIndex: 9999,
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: "1rem 1.25rem",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.8), 0 0 25px var(--accent-glow)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem",
        animation: "fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
        <CookieIcon size={20} style={{ color: "var(--accent)", flexShrink: 0, marginTop: "2px" }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "0.86rem", color: "var(--text-primary)", lineHeight: 1.5 }}>
            <strong>Devotional Privacy & Data Minimization:</strong> Stotramani uses local browser storage solely to remember your chanting script, font size, and visual theme. We never sell your data or serve commercial advertisements.
          </p>
          <div style={{ marginTop: "0.35rem", fontSize: "0.78rem" }}>
            <Link href="/privacy" style={{ color: "var(--accent)", textDecoration: "underline", marginRight: "0.75rem" }}>
              Privacy Policy
            </Link>
            <Link href="/cookies" style={{ color: "var(--accent)", textDecoration: "underline" }}>
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "0.65rem",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => handleConsent("essential")}
          className="btn"
          style={{
            padding: "0.4rem 0.9rem",
            borderRadius: "20px",
            fontSize: "0.8rem",
            fontWeight: 600,
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
            backgroundColor: "transparent",
            cursor: "pointer",
          }}
        >
          Essential Only
        </button>

        <button
          onClick={() => handleConsent("accepted")}
          className="btn btn-primary"
          style={{
            padding: "0.4rem 1.1rem",
            borderRadius: "20px",
            fontSize: "0.8rem",
            fontWeight: 700,
            backgroundColor: "var(--accent)",
            color: "#070707",
            borderColor: "var(--accent)",
            cursor: "pointer",
            boxShadow: "0 0 15px var(--accent-glow)",
          }}
        >
          Accept & Continue
        </button>
      </div>
    </aside>
  );
}
