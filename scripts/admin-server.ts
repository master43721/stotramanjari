import * as http from "http";
import * as fs from "fs";
import * as path from "path";

const PORT = 3001;
const DATA_FILE = path.join(process.cwd(), "src", "data", "vignanam-data.json");

const server = http.createServer((req, res) => {
  // Set CORS headers so local Next.js client (port 3000) can make requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle Save Endpoint
  if (req.method === "POST" && req.url === "/api/stotrams/save") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const payload = JSON.parse(body);
        
        if (!Array.isArray(payload)) {
          throw new Error("Payload must be a JSON array of stotrams.");
        }

        // Save to disk
        fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), "utf-8");
        console.log(`[Admin Server] SUCCESS: Wrote ${payload.length} stotrams to ${DATA_FILE}`);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: `Successfully saved ${payload.length} items.` }));
      } catch (err: any) {
        console.error("[Admin Server] Error processing payload:", err.message || err);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: err.message || "Invalid payload format." }));
      }
    });
  } else {
    // 404 for other endpoints
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Endpoint not found." }));
  }
});

server.listen(PORT, () => {
  console.log("====================================================================");
  console.log(`[Admin Server] Running on http://localhost:${PORT}`);
  console.log(`[Admin Server] Listening for save requests to write back to local file:`);
  console.log(`               ${DATA_FILE}`);
  console.log("====================================================================");
});
