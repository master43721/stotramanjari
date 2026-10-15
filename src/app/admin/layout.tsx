import { Metadata } from "next";

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
  return <>{children}</>;
}
