import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
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
  title: "Stotramani (స్తోత్రమణి) | Sacred Telugu & Sanskrit Stotrams",
  description: "A beautiful, distraction-free reading interface for sacred Telugu and Sanskrit stotrams. Blazing fast, SEO optimized, created and curated by Sudheendra Sripada.",
  keywords: ["stotram", "telugu stotram", "stotrams", "devotional", "shiva stotram", "ganesha stotram", "stotramani", "stotra mani", "sudheendra sripada"],
  authors: [{ name: "Sudheendra Sripada" }],
  creator: "Sudheendra Sripada",
  publisher: "Sudheendra Sripada",
  alternates: {
    canonical: "https://stotramani.app",
  },
  openGraph: {
    title: "Stotramani (స్తోత్రమణి) | Sacred Telugu Stotrams",
    description: "Distraction-free, lightning-fast devotional library by Sudheendra Sripada.",
    url: "https://stotramani.app",
    siteName: "Stotramani",
    locale: "te_IN",
    type: "website",
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-D1RV3K86RW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-D1RV3K86RW');
          `}
        </Script>
        <Navbar />
        <main style={{ flex: 1, minHeight: "calc(100vh - 120px)" }}>{children}</main>
        <footer style={{ 
          borderTop: "1px solid var(--border)", 
          padding: "2.5rem 0", 
          textAlign: "center",
          backgroundColor: "var(--bg-card)",
          color: "var(--text-secondary)",
          fontSize: "0.9rem",
          transition: "var(--transition-smooth)"
        }}>
          <div className="container">
            <p style={{ fontWeight: 600, fontSize: "1.05rem", color: "var(--accent)", letterSpacing: "0.02em" }}>
              స్తోత్రమణి — Stotramani
            </p>
            <p style={{ marginTop: "0.4rem", fontSize: "0.85rem", opacity: 0.9 }}>
              Dedicated to pure, distraction-free devotional chanting.
            </p>
            <p style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--text-secondary)", opacity: 0.85 }}>
              Created with devotion by <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Sudheendra Sripada</span> &bull; <a href="https://stotramani.app" style={{ color: "var(--accent)", textDecoration: "none" }}>stotramani.app</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
