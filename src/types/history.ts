export interface HistoryEntry {
  id: string;
  sourceText: string;
  sourceLanguage: string;
  targetPanels: HistoryTargetPanel[];
  timestamp: Date;
  label?: string;
  isCheckpoint: boolean;
}

export interface HistoryTargetPanel {
  language: string;
  translatedText: string;
  voice?: string;
  languageCode: string;
}

export interface SavedPanelConfig {
  language: string;
  translatedText: string;
  loading: boolean;
  voice?: string;
  languageCode: string;
}