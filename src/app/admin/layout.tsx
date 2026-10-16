import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hasValidAdminSession } from "@/lib/adminAuth";

export const metadata: Metadata = {
  title: "Stotram Curation Console",
  description: "Administrative console for managing sacred stotram manuscripts and metadata.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  if (!hasValidAdminSession(cookieStore.get("stotramani_admin_session")?.value)) {
    redirect("/admin-login");
  }

  return <>{children}</>;
}
