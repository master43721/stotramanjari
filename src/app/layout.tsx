import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Stotra Manjari | Distraction-Free Stotram Reading",
  description: "A beautiful, distraction-free, ultra-minimalist reading interface for sacred stotrams in Telugu and English. Blazing fast, SEO optimized, and premium designed.",
  keywords: ["stotram", "telugu stotram", "stotrams", "devotional", "shiva stotram", "ganesha stotram", "stotra manjari"],
};

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
                  var basePath = window.location.pathname.startsWith('/stotramanjari') ? '/stotramanjari' : '';
                  navigator.serviceWorker.register(basePath + '/sw.js').catch(function(e) {});
                });
              }
            `,
          }}
        />
        <link rel="apple-touch-icon" href="/stotramanjari/icon-192.png" />
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
          padding: "2rem 0", 
          textAlign: "center",
          backgroundColor: "var(--bg-card)",
          color: "var(--text-secondary)",
          fontSize: "0.9rem",
          transition: "var(--transition-smooth)"
        }}>
          <div className="container">
            <p style={{ fontWeight: 500 }}>స్తోత్ర మంజరి — Stotra Manjari</p>
            <p style={{ marginTop: "0.5rem", fontSize: "0.85rem", opacity: 0.8 }}>
              Built for a pure, distraction-free reading experience.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
