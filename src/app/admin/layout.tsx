import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Stotram Curation Console",
  description: "Administrative console for managing sacred stotram manuscripts and metadata.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // GitHub Pages is a static host: it cannot enforce authentication. Do not
  // publish the curation console until the site is moved behind real auth.
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <>{children}</>;
}
