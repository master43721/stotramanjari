import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Devotional Contact | Stotramani",
  description: "Connect with Sudheendra Sripada and the Stotramani team. Get chanting guidance, suggest stotrams, or report textual corrections.",
  alternates: {
    canonical: "https://stotramani.app/contact",
  },
  openGraph: {
    title: "Devotional Contact | Stotramani",
    description: "Get in touch with Stotramani curator Sudheendra Sripada for devotional guidance and textual corrections.",
    url: "https://stotramani.app/contact",
    siteName: "Stotramani",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Contact Stotramani & Sudheendra Sripada",
      },
    ],
    locale: "te_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Devotional Contact | Stotramani",
    description: "Connect with Stotramani curator Sudheendra Sripada.",
    images: ["/og-image.png"],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
