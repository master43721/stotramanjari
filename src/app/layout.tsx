import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CookieConsent from "@/components/CookieConsent";
import StotramaniLogo from "@/components/StotramaniLogo";
import Link from "next/link";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import localFont from "next/font/local";
import {
  Outfit,
} from "next/font/google";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#070707",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://stotramani.app"),
  title: {
    default: "Stotramani (స్తోత్రమణి) | Sacred Telugu & Sanskrit Stotrams",
    template: "%s | Stotramani",
  },
  description: "A pure, distraction-free digital sanctuary for sacred Telugu and Sanskrit stotrams, Vedic chants, and devotional literature. Created and curated with devotion by Sudheendra Sripada.",
  keywords: [
    "stotram",
    "telugu stotram",
    "stotrams",
    "devotional chants",
    "shiva stotram",
    "ganesha stotram",
    "vishnu sahasranamam",
    "vedic hymns",
    "stotramani",
    "stotra mani",
    "sudheendra sripada"
  ],
  authors: [{ name: "Sudheendra Sripada", url: "https://stotramani.app" }],
  creator: "Sudheendra Sripada",
  publisher: "Sudheendra Sripada",
  alternates: {
    canonical: "https://stotramani.app",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Stotramani (స్తోత్రమణి) | Sacred Telugu & Sanskrit Stotrams",
    description: "Distraction-free, lightning-fast devotional library by Sudheendra Sripada. Authentic Telugu & Sanskrit stotras, Vedic chants, and daily puja routines.",
    url: "https://stotramani.app",
    siteName: "Stotramani",
    locale: "te_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Stotramani - Sacred Devotional Sanctuary by Sudheendra Sripada",
      },
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Stotramani - Devotional Stotrams & Hymns",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stotramani (స్తోత్రమణి) | Sacred Telugu & Sanskrit Stotrams",
    description: "Distraction-free, lightning-fast devotional library by Sudheendra Sripada.",
    images: ["/og-image.png"],
  },
};

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const notoSansTelugu = localFont({
  src: [
    { path: "./fonts/NotoSansTelugu-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/NotoSansTelugu-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-noto-sans-telugu",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const whatsappShareText =
    "Namaste! Discover Stotramani (స్తోత్రమణి) – A sacred, distraction-free digital sanctuary for authentic Telugu & Sanskrit stotrams, Vedic chants, and daily puja slokas.\n\nExplore and recite here:\nhttps://stotramani.app";
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappShareText)}`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-flicker script to apply saved theme before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var theme = saved || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(e) {});
                });
              }
            `,
          }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#070707" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </head>
      <body
        className={`${outfit.variable} ${notoSansTelugu.variable}`}
      >
        {/* JSON-LD Structured Data: WebSite & Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://stotramani.app/#website",
                  "url": "https://stotramani.app",
                  "name": "Stotramani",
                  "alternateName": ["స్తోత్రమణి", "Stotramani App"],
                  "description": "Distraction-free digital sanctuary for sacred Telugu & Sanskrit stotrams, Vedic chants, and daily puja routines.",
                  "inLanguage": ["te", "sa", "en"],
                  "publisher": {
                    "@id": "https://stotramani.app/#organization"
                  }
                },
                {
                  "@type": "Organization",
                  "@id": "https://stotramani.app/#organization",
                  "name": "Stotramani",
                  "url": "https://stotramani.app",
                  "logo": "https://stotramani.app/icon-512.png",
                  "founder": {
                    "@type": "Person",
                    "name": "Sudheendra Sripada",
                    "jobTitle": "Founder & Sacred Texts Curator",
                    "url": "https://stotramani.app"
                  },
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "url": "https://stotramani.app/contact",
                    "contactType": "Devotional Inquiries",
                    "availableLanguage": ["Telugu", "Sanskrit", "English", "Hindi"]
                  }
                },
                {
                  "@type": "LocalBusiness",
                  "@id": "https://stotramani.app/#localbusiness",
                  "name": "Stotramani Devotional Sanctuary",
                  "alternateName": "స్తోత్రమణి",
                  "url": "https://stotramani.app",
                  "logo": "https://stotramani.app/icon-512.png",
                  "image": "https://stotramani.app/og-image.png",
                  "description": "Distraction-free digital sanctuary for sacred Telugu & Sanskrit stotrams, Vedic chants, and daily puja guidance curated by Sudheendra Sripada.",
                  "priceRange": "Free / Seva",
                  "currenciesAccepted": "INR",
                  "paymentAccepted": "Free",
                  "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "IN"
                  }
                }
              ]
            })
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-D1RV3K86RW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-D1RV3K86RW', {
              'anonymize_ip': true,
              'allow_google_signals': false
            });
          `}
        </Script>
        <Navbar />
        <main style={{ flex: 1, minHeight: "calc(100vh - 120px)" }}>{children}</main>
        <footer style={{ 
          borderTop: "1px solid var(--border)", 
          padding: "3.5rem 0 2.5rem 0", 
          backgroundColor: "var(--bg-card)",
          color: "var(--text-secondary)",
          fontSize: "0.9rem",
          transition: "var(--transition-smooth)"
        }}>
          <div className="container" style={{ maxWidth: "1000px", textAlign: "center" }}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
                textDecoration: "none",
              }}
              aria-label="Stotramani Homepage"
            >
              <StotramaniLogo size={32} />
              <span style={{ fontWeight: 700, fontSize: "1.2rem", color: "var(--accent)", letterSpacing: "0.02em" }}>
                స్తోత్రమణి &bull; Stotramani
              </span>
            </Link>
            <p style={{ fontSize: "0.92rem", opacity: 0.9, maxWidth: "560px", margin: "0 auto 1.75rem auto", lineHeight: 1.6 }}>
              A sacred, distraction-free digital sanctuary dedicated to the pure recitation of authentic Telugu and Sanskrit hymns.
            </p>

            {/* Comprehensive Footer Navigation Links */}
            <nav
              aria-label="Footer Navigation"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: "clamp(0.75rem, 3vw, 1.75rem)",
                marginBottom: "2rem",
                paddingBottom: "1.5rem",
                borderBottom: "1px solid var(--border)"
              }}
            >
              <Link href="/" style={{ color: "var(--text-primary)", textDecoration: "none", fontWeight: 500, transition: "color 0.2s ease" }}>
                Sacred Library
              </Link>
              <Link href="/contact" style={{ color: "var(--text-primary)", textDecoration: "none", fontWeight: 500, transition: "color 0.2s ease" }}>
                Devotional Contact
              </Link>
              <Link href="/privacy" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s ease" }}>
                Privacy Policy
              </Link>
              <Link href="/terms" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s ease" }}>
                Terms of Service
              </Link>
              <Link href="/cookies" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s ease" }}>
                Cookie Policy
              </Link>
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-footer-btn"
                title="Share Stotramani on WhatsApp"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.983zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Share on WhatsApp</span>
              </a>
            </nav>

            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <p>
                Curated and handcrafted with devotion by{" "}
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Sudheendra Sripada</span>
              </p>
              <p style={{ opacity: 0.8 }}>
                &copy; {new Date().getFullYear()} Stotramani. All sacred stotrams belong to the timeless spiritual heritage of Sanatana Dharma.
              </p>
            </div>
          </div>
        </footer>
        <CookieConsent />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
