import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service | Stotramani",
  description: "Terms of service and sacred usage guidelines for Stotramani devotional library by Sudheendra Sripada.",
  alternates: {
    canonical: "https://stotramani.app/terms",
  },
  openGraph: {
    title: "Terms of Service | Stotramani",
    description: "Guidelines and terms of devotional use for Stotramani.",
    url: "https://stotramani.app/terms",
    siteName: "Stotramani",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Stotramani Terms of Service" }],
  },
};

export default function TermsPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Terms of Service" },
  ];

  return (
    <div
      style={{
        backgroundColor: "var(--bg-base)",
        color: "var(--text-primary)",
        minHeight: "100vh",
        paddingBlock: "clamp(2rem, 5vw, 5rem)",
      }}
    >
      <div className="container" style={{ maxWidth: "800px" }}>
        <Breadcrumbs items={breadcrumbs} />

        <header style={{ marginBottom: "2.5rem" }}>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--accent)",
              marginBottom: "0.5rem",
            }}
          >
            Terms of Service
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Last Updated: October 2026 &bull; Published by Sudheendra Sripada
          </p>
        </header>

        <div
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "clamp(1.5rem, 4vw, 2.5rem)",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            lineHeight: 1.7,
            fontSize: "0.98rem",
            boxShadow: "0 10px 40px var(--shadow)",
          }}
        >
          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.75rem", fontWeight: 600 }}>
              1. Acceptance of Terms
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              By accessing or using <strong>Stotramani (stotramani.app)</strong>, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, you may discontinue use of the site.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.75rem", fontWeight: 600 }}>
              2. Sacred & Educational Purpose
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Stotramani is created and maintained by <strong>Sudheendra Sripada</strong> as a public digital seva. The sacred hymns, stotras, suktams, and slokas belong to the timeless spiritual heritage of Sanatana Dharma. They are presented here for personal devotion, spiritual study, daily worship, and academic recitation.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.75rem", fontWeight: 600 }}>
              3. Fair Devotional Use & Permitted Conduct
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
              You are welcome to:
            </p>
            <ul style={{ color: "var(--text-secondary)", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <li>Read, chant, print, and study any stotram for personal and family prayer routines.</li>
              <li>Share links to Stotramani pages with fellow devotees and temple communities.</li>
              <li>Bookmark hymns locally on your personal devices.</li>
            </ul>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              You agree not to engage in malicious scraping, denial-of-service attacks, automated resource harvesting, or commercial resale of the website codebase or curated assets.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.75rem", fontWeight: 600 }}>
              4. Accuracy & Devotional Disclaimers
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              While extreme diligence is exercised in verifying Sanskrit and Telugu manuscripts, regional variations and grammatical nuances may exist in different traditions. Content is provided &ldquo;as is&rdquo; without warranties of any kind. If you spot a typographical or transliteration oversight, we eagerly invite you to notify us via our <Link href="/contact" style={{ color: "var(--accent)" }}>Devotional Contact Page</Link>.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.75rem", fontWeight: 600 }}>
              5. Intellectual Property & Open Licensing
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              The software application, user interface designs, custom CSS styling, and algorithmic panchang calculations are intellectual property of Sudheendra Sripada. All open-source fonts (Noto Sans Telugu, Tiro Devanagari Sanskrit, Outfit) are licensed under their respective SIL Open Font Licenses.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
