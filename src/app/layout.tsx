import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Stotra Manjari | Distraction-Free Stotram Reading",
  description: "A beautiful, distraction-free, ultra-minimalist reading interface for sacred stotrams in Telugu and English. Blazing fast, SEO optimized, and premium designed.",
  keywords: ["stotram", "telugu stotram", "stotrams", "devotional", "vignanam", "shiva stotram", "ganesha stotram", "stotra manjari"],
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
                  var theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body>
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
