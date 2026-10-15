import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Stotramani privacy policy. Learn how we adhere to strict data minimization, zero tracking cookies, no selling of personal data, and complete privacy by design.",
  alternates: {
    canonical: "https://stotramani.app/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Stotramani",
    description: "Strict data minimization, zero ads, zero data sale, and client-side privacy on Stotramani.",
    url: "https://stotramani.app/privacy",
    siteName: "Stotramani",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Stotramani Privacy Policy" }],
  },
};

export default function PrivacyPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Privacy Policy", href: "/privacy" },
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
            Privacy Policy
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Effective Date: October 2026 &bull; Curated by Sudheendra Sripada on stotramani.app
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
              1. Devotional Privacy & Data Minimization
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              At <strong>Stotramani (స్తోత్రమణి)</strong>, accessible from <a href="https://stotramani.app" style={{ color: "var(--accent)" }}>stotramani.app</a>, our core philosophy is reverence and distraction-free devotion. We believe your prayer and recitation practices are profoundly personal. In full compliance with global privacy regulations and data minimization principles, we only process the absolute minimum information necessary to deliver this service.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.75rem", fontWeight: 600 }}>
              2. What We Collect (And What We Do Not)
            </h2>
            <ul style={{ color: "var(--text-secondary)", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <li><strong>No User Accounts Required:</strong> You never need to create an account, register, or provide personal credentials to read or search any stotram.</li>
              <li><strong>No Sensitive Personal Data:</strong> We do not ask for or collect financial data, biometric information, precise GPS locations, or social profiles.</li>
              <li><strong>Inquiries via Contact Form:</strong> If you voluntarily reach out via our contact form or email, we collect your name, email address, and message solely to respond to your devotional inquiry. We never share, rent, or sell this information.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.75rem", fontWeight: 600 }}>
              3. Client-Side Browser Storage (`localStorage`)
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
              To ensure your preferences remain consistent across visits without server-side tracking, we store minimal configuration values locally on your device:
            </p>
            <ul style={{ color: "var(--text-secondary)", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <li><code>theme</code>: Remembers your display theme (Midnight Gold, Aged Sepia, or Clean Light).</li>
              <li><code>reader-script</code>: Remembers your preferred chanting script (Telugu, Devanagari, Kannada, Tamil, or IAST).</li>
              <li><code>reader-font-scale</code>: Remembers your preferred reading font magnification.</li>
              <li><code>daily_puja_routine</code>: Stores the identifiers of your starred hymns for quick access during daily archana.</li>
              <li><code>cookie-consent</code>: Records your consent choice.</li>
            </ul>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              These values never leave your web browser and can be wiped instantly by clearing your browser site data.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.75rem", fontWeight: 600 }}>
              4. Analytics & Third-Party SDK Auditing
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              We have audited all client libraries to eliminate unnecessary third-party tracking SDKs, ad networks, and hidden analytics trackers. We use Google Analytics (G-D1RV3K86RW) configured strictly with IP anonymization (<code>anonymize_ip: true</code>) and disabled advertising signals to monitor aggregate website availability and performance.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.75rem", fontWeight: 600 }}>
              5. No Dark Patterns & No Commercial Traps
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Stotramani is a non-commercial, sacred initiative. We do not use dark patterns, countdown pressure timers, hidden fees, subscriptions, or deceptive consent notices. Our content is 100% open and freely accessible.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.75rem", fontWeight: 600 }}>
              6. Contact & Data Rights
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              If you have any questions regarding this Privacy Policy or wish to request deletion of any correspondence sent to us, please contact curator <strong>Sudheendra Sripada</strong> via our <Link href="/contact" style={{ color: "var(--accent)" }}>Devotional Contact Page</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
