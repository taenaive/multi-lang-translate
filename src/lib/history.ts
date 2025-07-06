import { HistoryEntry, SavedPanelConfig, HistoryTargetPanel } from '@/types/history';

const HISTORY_KEY = 'translationHistory';
const PANELS_KEY = 'translatorPanels';
const MAX_HISTORY_ENTRIES = 50;

export function saveHistoryEntry(entry: HistoryEntry): void {
  try {
    const existingHistory = getTranslationHistory();
    const updatedHistory = [entry, ...existingHistory];
    
    if (updatedHistory.length > MAX_HISTORY_ENTRIES) {
      updatedHistory.splice(MAX_HISTORY_ENTRIES);
    }
    
    const serializedHistory = JSON.stringify(updatedHistory, (key, value) => {
      if (key === 'timestamp' && value instanceof Date) {
        return value.toISOString();
      }
      return value;
    });
    
    localStorage.setItem(HISTORY_KEY, serializedHistory);
  } catch (error) {
    console.error('Failed to save history entry:', error);
  }
}

export function getTranslationHistory(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((entry: HistoryEntry) => ({
      ...entry,
      timestamp: new Date(entry.timestamp)
    }));
  } catch (error) {
    console.error('Failed to load translation history:', error);
    return [];
  }
}

export function clearTranslationHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear translation history:', error);
  }
}

export function deleteHistoryEntry(entryId: string): void {
  try {
    const history = getTranslationHistory();
    const updatedHistory = history.filter(entry => entry.id !== entryId);
    
    const serializedHistory = JSON.stringify(updatedHistory, (key, value) => {
      if (key === 'timestamp' && value instanceof Date) {
        return value.toISOString();
      }
      return value;
    });
    
    localStorage.setItem(HISTORY_KEY, serializedHistory);
  } catch (error) {
    console.error('Failed to delete history entry:', error);
  }
}

export function savePanelConfiguration(panels: SavedPanelConfig[]): void {
  try {
    localStorage.setItem(PANELS_KEY, JSON.stringify(panels));
  } catch (error) {
    console.error('Failed to save panel configuration:', error);
  }
}

export function loadPanelConfiguration(): SavedPanelConfig[] {
  try {
    const stored = localStorage.getItem(PANELS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load panel configuration:', error);
    return [];
  }
}

export function clearPanelConfiguration(): void {
  try {
    localStorage.removeItem(PANELS_KEY);
  } catch (error) {
    console.error('Failed to clear panel configuration:', error);
  }
}

export function createHistoryEntry(
  sourceText: string,
  sourceLanguage: string,
  targetPanels: HistoryTargetPanel[],
  label?: string,
  isCheckpoint: boolean = false
): HistoryEntry {
  return {
    id: Date.now().toString(),
    sourceText,
    sourceLanguage,
    targetPanels: targetPanels.map(panel => ({
      language: panel.language,
      translatedText: panel.translatedText,
      voice: panel.voice,
      languageCode: panel.languageCode
    })),
    timestamp: new Date(),
    label,
    isCheckpoint
  };
}