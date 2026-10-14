import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Cookie Policy | Stotramani",
  description: "Learn how Stotramani uses essential local browser storage for reader preferences and anonymized analytics with full data minimization.",
  alternates: {
    canonical: "https://stotramani.app/cookies",
  },
  openGraph: {
    title: "Cookie Policy | Stotramani",
    description: "Detailed breakdown of browser storage and essential cookies used by Stotramani.",
    url: "https://stotramani.app/cookies",
    siteName: "Stotramani",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Stotramani Cookie Policy" }],
  },
};

export default function CookiesPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Cookie Policy" },
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
            Cookie & Local Storage Policy
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Last Updated: October 2026 &bull; Published by Sudheendra Sripada on stotramani.app
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
              1. What Are Cookies and Local Storage?
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Cookies and HTML5 <code>localStorage</code> are small text files or key-value entries stored in your browser by websites you visit. They allow websites to remember state, preferences, and display configurations.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.75rem", fontWeight: 600 }}>
              2. How Stotramani Uses Storage
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
              Unlike commercial sites, <strong>Stotramani does not use advertising cookies, tracking pixels, or cross-site tracking cookies</strong>. We rely almost entirely on client-side <code>localStorage</code> to personalize your spiritual recitation experience:
            </p>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.88rem",
                  color: "var(--text-secondary)",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left", color: "var(--accent)" }}>
                    <th style={{ padding: "0.75rem 0.5rem" }}>Key Name</th>
                    <th style={{ padding: "0.75rem 0.5rem" }}>Type</th>
                    <th style={{ padding: "0.75rem 0.5rem" }}>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "0.75rem 0.5rem", fontWeight: 600, color: "var(--text-primary)" }}>theme</td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>localStorage</td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>Remembers your chosen theme (dark, sepia, clean-light).</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "0.75rem 0.5rem", fontWeight: 600, color: "var(--text-primary)" }}>reader-script</td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>localStorage</td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>Remembers script selection (Telugu, Devanagari, Kannada, Tamil, IAST).</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "0.75rem 0.5rem", fontWeight: 600, color: "var(--text-primary)" }}>reader-font-scale</td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>localStorage</td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>Remembers your font zoom percentage (80% - 200%).</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "0.75rem 0.5rem", fontWeight: 600, color: "var(--text-primary)" }}>daily_puja_routine</td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>localStorage</td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>Persists your starred daily chanting sequence.</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.75rem 0.5rem", fontWeight: 600, color: "var(--text-primary)" }}>cookie-consent</td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>localStorage</td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>Remembers that you acknowledged our privacy notice.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.75rem", fontWeight: 600 }}>
              3. Analytics Cookies
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              We use standard Google Analytics cookies (<code>_ga</code>, <code>_ga_*</code>) exclusively to measure aggregated, non-identifying website traffic (such as overall page views and server latency) to keep the app blazing fast. All visitor IP addresses are masked and anonymized before processing.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.75rem", fontWeight: 600 }}>
              4. Managing & Deleting Storage
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              You have complete autonomy over your local data. You can clear cookies and site data at any time via your browser settings. Doing so simply resets your font scale and theme back to their defaults without impeding access to any sacred chants.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
