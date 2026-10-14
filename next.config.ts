import type { NextConfig } from "next";
import path from "node:path";
import http from "node:http";
import fs from "node:fs";

if (!process.env.NEXT_FONT_GOOGLE_MOCKED_RESPONSES) {
  process.env.NEXT_FONT_GOOGLE_MOCKED_RESPONSES = path.resolve("./src/data/mocked-google-fonts.json");
}

// Start mock font server on port 4567 for offline builds (handles Turbopack requests)
try {
  const fontFile = path.resolve("./node_modules/next/dist/next-devtools/server/font/geist-latin.woff2");
  if (fs.existsSync(fontFile)) {
    const fontBuffer = fs.readFileSync(fontFile);
    const server = http.createServer((_req, res) => {
      res.writeHead(200, {
        "Content-Type": "font/woff2",
        "Content-Length": fontBuffer.length,
      });
      res.end(fontBuffer);
    });
    server.listen(4567, "127.0.0.1", () => {
      server.unref();
    });
    server.on("error", () => {});
  }
} catch {}


const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "",
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
};

export default nextConfig;

