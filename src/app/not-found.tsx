import Link from "next/link";
import { Metadata } from "next";
import StotramaniLogo from "@/components/StotramaniLogo";

export const metadata: Metadata = {
  title: "404 - Stotram Not Found",
  description: "The requested devotional hymn or page could not be located. Explore over 1,600 sacred Telugu and Sanskrit stotrams on Stotramani.",
};

export default function NotFound() {
  const quickLinks = [
    { title: "Sri Ganesha Stotrams", href: "/ganesha/ganesha-pancharatnam" },
    { title: "Shiva Panchakshari", href: "/shiva/shiva-panchakshari-stotram" },
    { title: "Sri Rudram Namakam", href: "/shiva/sri-rudram-namakam" },
    { title: "Vishnu Sahasranamam", href: "/vishnu/sree-vishnu-sahasra-nama-stotram" },
    { title: "Hanuman Chalisa", href: "/hanuman/hanuman-chalisa" },
  ];

  return (
    <div
      style={{
        backgroundColor: "var(--bg-base)",
        color: "var(--text-primary)",
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(2rem, 5vw, 4rem) 1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Divine Backlight Ambient Aura */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(90vw, 500px)",
          height: "min(90vw, 500px)",
          background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
          filter: "blur(100px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "680px",
          textAlign: "center",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 4vw, 2.5rem)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px var(--accent-glow)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div
          style={{
            fontSize: "clamp(3.5rem, 10vw, 5.5rem)",
            fontWeight: 800,
            lineHeight: 1,
            background: "linear-gradient(135deg, var(--text-primary) 30%, var(--accent) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.04em",
            marginBottom: "0.5rem",
          }}
        >
          404
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <StotramaniLogo size={48} />
        </div>

        <h1
          style={{
            fontSize: "clamp(1.4rem, 4vw, 2rem)",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
            letterSpacing: "-0.02em",
          }}
        >
          Stotram Not Found &bull; స్తోత్రం లభించలేదు
        </h1>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
            lineHeight: 1.6,
            maxWidth: "520px",
            margin: "0 auto 2rem auto",
          }}
        >
          The sacred verse or page you seek may have been moved or renamed.
          May your chanting practice continue uninterrupted in our digital sanctuary.
        </p>

        <div style={{ marginBottom: "2.5rem" }}>
          <Link
            href="/"
            className="btn btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.85rem 1.8rem",
              fontSize: "0.95rem",
              fontWeight: 700,
              borderRadius: "30px",
              backgroundColor: "var(--accent)",
              color: "#070707",
              textDecoration: "none",
              boxShadow: "0 0 25px var(--accent-glow)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            <span>←</span> Return to Sacred Library (1,600+ Chants)
          </Link>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "1.5rem",
          }}
        >
          <p
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--accent)",
              marginBottom: "1rem",
            }}
          >
            Popular Daily Hymns
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              justifyContent: "center",
            }}
          >
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="btn"
                style={{
                  fontSize: "0.82rem",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "16px",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                  backgroundColor: "rgba(212, 175, 55, 0.05)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
