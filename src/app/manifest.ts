import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stotra Manjari | స్తోత్ర మంజరి",
    short_name: "StotraManjari",
    description: "Ultra-fast devotional library for sacred Telugu and Sanskrit stotrams with offline chanting",
    start_url: "/stotramanjari/",
    scope: "/stotramanjari/",
    display: "standalone",
    background_color: "#070707",
    theme_color: "#070707",
    orientation: "portrait",
    icons: [
      {
        src: "/stotramanjari/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/stotramanjari/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
