import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Devotional Contact & Chanting Support | Stotramani",
  description: "Connect with Sudheendra Sripada and the Stotramani team. Get chanting guidance, suggest stotrams, or report textual corrections. Direct email and WhatsApp support available.",
  alternates: {
    canonical: "https://stotramani.app/contact",
  },
  openGraph: {
    title: "Devotional Contact & Chanting Support | Stotramani",
    description: "Get in touch with Stotramani curator Sudheendra Sripada for devotional chanting support and corrections.",
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
    title: "Devotional Contact & Chanting Support | Stotramani",
    description: "Connect with Stotramani curator Sudheendra Sripada.",
    images: ["/og-image.png"],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
