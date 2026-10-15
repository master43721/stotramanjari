import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CookieConsent from "@/components/CookieConsent";
import Link from "next/link";
import Script from "next/script";
import {
  Outfit,
  Noto_Sans_Telugu,
  Noto_Serif_Telugu,
  Tiro_Devanagari_Sanskrit,
  Noto_Sans_Kannada,
  Noto_Sans_Tamil,
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
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
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

const notoSansTelugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  weight: ["400", "700"],
  variable: "--font-noto-sans-telugu",
  display: "swap",
});

const notoSerifTelugu = Noto_Serif_Telugu({
  subsets: ["telugu"],
  weight: ["400", "700"],
  variable: "--font-noto-serif-telugu",
  display: "swap",
});

const tiroDevanagariSanskrit = Tiro_Devanagari_Sanskrit({
  subsets: ["devanagari"],
  weight: "400",
  variable: "--font-tiro-devanagari",
  display: "swap",
});

const notoSansKannada = Noto_Sans_Kannada({
  subsets: ["kannada"],
  weight: ["400", "700"],
  variable: "--font-noto-kannada",
  display: "swap",
});

const notoSansTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  weight: ["400", "700"],
  variable: "--font-noto-tamil",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const whatsappShareText =
    "🕉️ Namaste! Discover Stotramani (స్తోత్రమణి) – A sacred, distraction-free digital sanctuary for authentic Telugu & Sanskrit stotrams, Vedic chants, and daily puja slokas.\n\nExplore and recite here:\nhttps://stotramani.app";
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
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#070707" />
      </head>
      <body
        className={`${outfit.variable} ${notoSansTelugu.variable} ${notoSerifTelugu.variable} ${tiroDevanagariSanskrit.variable} ${notoSansKannada.variable} ${notoSansTamil.variable}`}
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
              <span style={{ fontSize: "1.4rem" }}>🕉️</span>
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
                style={{ color: "#25D366", textDecoration: "none", fontWeight: 600 }}
                title="Share Stotramani on WhatsApp"
              >
                Share on WhatsApp
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
      </body>
    </html>
  );
}
