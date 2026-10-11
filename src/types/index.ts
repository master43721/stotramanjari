export interface StotramIndexItem {
  id: string;
  slug: string;
  title_telugu: string;
  title_english: string;
  category: string;
  deity?: string;
}

export interface PadacchedaWord {
  word: string;
  meaning: string;
}

export interface StanzaMeaning {
  verseIndex: number;
  padaccheda: PadacchedaWord[];
  tatparyamTelugu: string;
  bhavarthaEnglish: string;
}

export interface Stotram {
  id: string;
  slug?: string;
  title_telugu: string;
  title_english: string;
  category: string;
  content_lines: string[];
  pdfLink?: string | null;
  deity?: string;
  audioUrl?: string;
  timestamps?: number[];
  meanings?: StanzaMeaning[];
}

export interface DailyPujaItem {
  id: string;
  slug: string;
  title_english: string;
  title_telugu: string;
  category: string;
  addedAt: number;
}
