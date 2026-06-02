import fs from "fs";
import path from "path";
import { Stotram } from "@/types";
import defaultStotrams from "./stotrams.json";

export function getAllStotrams(): Stotram[] {
  const stotrams: Stotram[] = [...defaultStotrams];

  try {
    const scrapedPath = path.join(process.cwd(), "src", "data", "stotrams-scraped.json");
    if (fs.existsSync(scrapedPath)) {
      const fileContent = fs.readFileSync(scrapedPath, "utf-8");
      const scrapedStotrams: Stotram[] = JSON.parse(fileContent);

      scrapedStotrams.forEach((stotram) => {
        // Prevent duplicate IDs
        if (!stotrams.some((s) => s.id === stotram.id)) {
          stotrams.push(stotram);
        }
      });
    }
  } catch (error) {
    console.warn("[Loader] No scraped stotrams file found or error parsing it. Using default stotrams.");
  }

  return stotrams;
}
