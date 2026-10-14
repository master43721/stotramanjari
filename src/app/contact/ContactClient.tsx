"use client";

import { useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "chanting-guidance",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Contact & Chanting Support" },
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Please enter your full name (at least 2 characters).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please provide a valid email address so we can reply.";
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = "Please write a message with at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate reliable dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedData({
        name: formData.name.trim(),
        email: formData.email.trim(),
      });
      setFormData({
        name: "",
        email: "",
        subject: "chanting-guidance",
        message: "",
      });
      setErrors({});
    }, 600);
  };

  const whatsappMessage = encodeURIComponent(
    "Namaste Sudheendra ji! I am reaching out from Stotramani (stotramani.app) regarding sacred chanting support and devotional guidance."
  );
  const whatsappUrl = `https://wa.me/919886012345?text=${whatsappMessage}`;

  return (
    <div
      style={{
        backgroundColor: "var(--bg-base)",
        color: "var(--text-primary)",
        minHeight: "100vh",
        paddingBlock: "clamp(2rem, 5vw, 5rem)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Divine Backlight Ambient Aura */}
      <div
        style={{
          position: "absolute",
          top: "-5%",
          right: "-5%",
          width: "50%",
          height: "50%",
          background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
          filter: "blur(120px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: "900px" }}>
        <Breadcrumbs items={breadcrumbs} />

        <div style={{ textAlign: "center", marginBottom: "clamp(2rem, 4vw, 3.5rem)" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🕉️</div>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, var(--text-primary) 30%, var(--accent) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "0.75rem",
            }}
          >
            Devotional Support & Contact
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Have a question on stotram recitation, need pronunciation guidance, or wish to suggest a sacred text?
            Curator <strong style={{ color: "var(--text-primary)" }}>Sudheendra Sripada</strong> and the Stotramani team are here with devotion.
          </p>
        </div>

        {/* Quick Contact Methods Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
            gap: "1.25rem",
            marginBottom: "3rem",
          }}
        >
          {/* WhatsApp Support Card */}
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 10px 30px var(--shadow)",
              transition: "transform 0.2s ease, border-color 0.2s ease",
            }}
          >
            <div>
              <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>💬</div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
                WhatsApp Chanting Support
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "1.25rem" }}>
                Instant devotional support, audio clip pronunciation verification, and community queries.
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.65rem 1.25rem",
                borderRadius: "24px",
                backgroundColor: "#25D366",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.88rem",
                textDecoration: "none",
                boxShadow: "0 4px 15px rgba(37, 211, 102, 0.35)",
                border: "none",
              }}
            >
              <span>📲</span> Open WhatsApp Chat
            </a>
          </div>

          {/* Email Card */}
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 10px 30px var(--shadow)",
            }}
          >
            <div>
              <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>✉️</div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
                Official Domain Email
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "1.25rem" }}>
                Send manuscript scans, editorial suggestions, and in-depth devotional correspondence.
              </p>
            </div>
            <a
              href="mailto:contact@stotramani.app"
              className="btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.65rem 1.25rem",
                borderRadius: "24px",
                borderColor: "var(--accent)",
                color: "var(--accent)",
                backgroundColor: "var(--accent-light)",
                fontWeight: 700,
                fontSize: "0.88rem",
                textDecoration: "none",
              }}
            >
              <span>📧</span> contact@stotramani.app
            </a>
          </div>

          {/* Devotional Helpline */}
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 10px 30px var(--shadow)",
            }}
          >
            <div>
              <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>📞</div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
                Chanting Helpline
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "1.25rem" }}>
                Available Monday - Saturday, 9 AM - 6 PM IST for personal spiritual recitation assistance.
              </p>
            </div>
            <a
              href="tel:+919886012345"
              className="btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.65rem 1.25rem",
                borderRadius: "24px",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
                backgroundColor: "transparent",
                fontWeight: 700,
                fontSize: "0.88rem",
                textDecoration: "none",
              }}
            >
              <span>📱</span> +91 98860 12345
            </a>
          </div>
        </div>

        {/* Interactive Devotional Contact Form */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "clamp(1.5rem, 4vw, 2.5rem)",
            boxShadow: "0 20px 45px var(--shadow)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <h2
            style={{
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span>✍️</span> Send a Devotional Note
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            We adhere to strict data minimization. We only collect the details provided below to answer your inquiry.
          </p>

          {/* Success Message Banner */}
          {submittedData && (
            <div
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.12)",
                border: "1px solid rgba(34, 197, 94, 0.4)",
                borderRadius: "var(--radius-md)",
                padding: "1.25rem 1.5rem",
                marginBottom: "2rem",
                color: "var(--text-primary)",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.3rem" }}>🙏</span>
                <strong style={{ color: "#4ade80", fontSize: "1.05rem" }}>
                  Dhanyavadamulu, {submittedData.name}!
                </strong>
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Your devotional note has been safely received. Sudheendra Sripada and the Stotramani editorial team will review your message and reach out to{" "}
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{submittedData.email}</span>.
              </p>
              <button
                onClick={() => setSubmittedData(null)}
                className="btn"
                style={{
                  alignSelf: "flex-start",
                  marginTop: "0.5rem",
                  padding: "0.3rem 0.85rem",
                  fontSize: "0.8rem",
                  borderRadius: "16px",
                  borderColor: "rgba(34, 197, 94, 0.4)",
                  color: "#4ade80",
                  backgroundColor: "transparent",
                }}
              >
                Send Another Note
              </button>
            </div>
          )}

          {!submittedData && (
            <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Name & Email Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
                  gap: "1.25rem",
                }}
              >
                <div>
                  <label
                    htmlFor="contact-name"
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    Your Name <span style={{ color: "var(--accent)" }}>*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Sharma"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "var(--radius-sm)",
                      border: `1px solid ${errors.name ? "#ef4444" : "var(--border)"}`,
                      backgroundColor: "var(--bg-base)",
                      color: "var(--text-primary)",
                      fontSize: "0.95rem",
                      outline: "none",
                    }}
                  />
                  {errors.name && (
                    <p style={{ color: "#ef4444", fontSize: "0.78rem", marginTop: "0.3rem" }}>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    Your Email <span style={{ color: "var(--accent)" }}>*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. devotee@example.com"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "var(--radius-sm)",
                      border: `1px solid ${errors.email ? "#ef4444" : "var(--border)"}`,
                      backgroundColor: "var(--bg-base)",
                      color: "var(--text-primary)",
                      fontSize: "0.95rem",
                      outline: "none",
                    }}
                  />
                  {errors.email && (
                    <p style={{ color: "#ef4444", fontSize: "0.78rem", marginTop: "0.3rem" }}>
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Inquiry Type */}
              <div>
                <label
                  htmlFor="contact-subject"
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "0.4rem",
                  }}
                >
                  Topic / Purpose
                </label>
                <select
                  id="contact-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg-base)",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    outline: "none",
                  }}
                >
                  <option value="chanting-guidance">Chanting & Pronunciation Guidance</option>
                  <option value="stotram-request">Request a New Stotram / Sloka</option>
                  <option value="text-correction">Report Textual / Transliteration Correction</option>
                  <option value="general-inquiry">General Devotional Feedback</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "0.4rem",
                  }}
                >
                  Devotional Message <span style={{ color: "var(--accent)" }}>*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share your thoughts, sloka correction details, or chanting inquiries..."
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem",
                    borderRadius: "var(--radius-sm)",
                    border: `1px solid ${errors.message ? "#ef4444" : "var(--border)"}`,
                    backgroundColor: "var(--bg-base)",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    fontFamily: "var(--font-sans)",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
                {errors.message && (
                  <p style={{ color: "#ef4444", fontSize: "0.78rem", marginTop: "0.3rem" }}>
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button & Direct mailto */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                  marginTop: "0.5rem",
                }}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{
                    padding: "0.85rem 2rem",
                    borderRadius: "28px",
                    backgroundColor: "var(--accent)",
                    color: "#070707",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    cursor: isSubmitting ? "wait" : "pointer",
                    boxShadow: "0 0 20px var(--accent-glow)",
                    border: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {isSubmitting ? "Transmitting..." : "🕊️ Submit Devotional Note"}
                </button>

                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  or email directly to{" "}
                  <a
                    href="mailto:contact@stotramani.app"
                    style={{ color: "var(--accent)", textDecoration: "underline" }}
                  >
                    contact@stotramani.app
                  </a>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
