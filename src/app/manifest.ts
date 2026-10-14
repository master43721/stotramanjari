import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stotramani | స్తోత్రమణి",
    short_name: "Stotramani",
    description: "Ultra-fast, distraction-free devotional library for sacred Telugu and Sanskrit stotrams by Sudheendra Sripada",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#070707",
    theme_color: "#070707",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
