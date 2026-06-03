export interface Stotram {
  id: string;
  slug?: string;
  title_telugu: string;
  title_english: string;
  category: string;
  content_lines: string[];
  pdfLink?: string | null;
}
