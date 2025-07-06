'use client';
import withAuth from '@/components/auth/withAuth';
import { useState, useCallback, useEffect } from 'react';
import SourceText from "@/components/SourceText";
import TargetPanel from "@/components/TargetPanel";
import LanguageSelector from '@/components/LanguageSelector';
import HistoryPanel from '@/components/HistoryPanel';
import { savePanelConfiguration, loadPanelConfiguration, saveHistoryEntry, createHistoryEntry } from '@/lib/history';
import { SavedPanelConfig, HistoryEntry } from '@/types/history';

interface LanguagePanel {
  language: string;
  translatedText: string;
  loading: boolean;
  voice?: string;
  languageCode: string;
}

function TranslatePage() {
  const [sourceLanguage, setSourceLanguage] = useState('English');
  const [sourceText, setSourceText] = useState('');
  const [targetPanels, setTargetPanels] = useState<LanguagePanel[]>([
    { language: 'Spanish', translatedText: '', loading: false, languageCode: 'es' },
    { language: 'French', translatedText: '', loading: false, languageCode: 'fr' },
    { language: 'Italian', translatedText: '', loading: false, languageCode: 'it' },
    { language: 'Portuguese', translatedText: '', loading: false, languageCode: 'pt' },
  ]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [checkpointLabel, setCheckpointLabel] = useState('');
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [skipAutoTranslate, setSkipAutoTranslate] = useState(false);

  const handleSourceLanguageChange = (newSourceLanguage: string) => {
    const previousSourceLanguage = sourceLanguage;
    setSourceLanguage(newSourceLanguage);

    const conflictingPanel = targetPanels.find(panel => panel.language === newSourceLanguage);
    if (conflictingPanel) {
      setTargetPanels(
        targetPanels.map(panel =>
          panel.language === newSourceLanguage
            ? { ...panel, language: previousSourceLanguage, translatedText: '' }
            : panel
        )
      );
    }
  };

  const handleRemovePanel = (language: string) => {
    setTargetPanels(targetPanels.filter(panel => panel.language !== language));
  };

  const handleAddLanguage = (language: string) => {
    if (!targetPanels.find(panel => panel.language === language)) {
      const languageCode = language.toLowerCase().slice(0, 2);
      setTargetPanels([...targetPanels, { language, translatedText: '', loading: false, languageCode }]);
      setHasUnsavedChanges(true);
    }
  };

  const handleSaveConfiguration = () => {
    const panelConfig: SavedPanelConfig[] = targetPanels.map(panel => ({
      language: panel.language,
      translatedText: panel.translatedText,
      loading: false,
      voice: panel.voice,
      languageCode: panel.languageCode
    }));
    savePanelConfiguration(panelConfig);
    setHasUnsavedChanges(false);
  };

  const handleSaveCheckpoint = () => {
    setShowSaveDialog(true);
  };

  const handleConfirmSaveCheckpoint = () => {
    if (sourceText.trim()) {
      const historyEntry = createHistoryEntry(
        sourceText,
        sourceLanguage,
        targetPanels,
        checkpointLabel.trim() || undefined,
        true
      );
      saveHistoryEntry(historyEntry);
      setHasUnsavedChanges(false);
      setHistoryRefresh(prev => prev + 1);
    }
    setShowSaveDialog(false);
    setCheckpointLabel('');
  };

  const handleRestoreHistory = (entry: HistoryEntry) => {
    // Set skip flag first to prevent any translation attempts
    setSkipAutoTranslate(true);
    
    // Restore all state
    setSourceText(entry.sourceText);
    setSourceLanguage(entry.sourceLanguage);
    setTargetPanels(entry.targetPanels.map(panel => ({
      language: panel.language,
      translatedText: panel.translatedText,
      loading: false,
      voice: panel.voice,
      languageCode: panel.languageCode
    })));
    setHasUnsavedChanges(false);
    
    // Re-enable auto-translate after a longer delay to ensure restoration is complete
    setTimeout(() => {
      setSkipAutoTranslate(false);
    }, 3000);
  };

  useEffect(() => {
    const savedPanels = loadPanelConfiguration();
    if (savedPanels.length > 0) {
      setTargetPanels(savedPanels.map(panel => ({ ...panel, loading: false })));
    }
  }, []);

  const handleTranslate = useCallback(async (text: string) => {
    setSourceText(text);
    setTargetPanels(panels => panels.map(p => ({ ...p, loading: true })));
    setHasUnsavedChanges(true);

    const newTargetPanels = await Promise.all(
      targetPanels.map(async (panel) => {
        try {
          const response = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, from: sourceLanguage, to: panel.language }),
          });
          if (!response.ok) {
            return { ...panel, translatedText: 'Error', loading: false };
          }
          const data = await response.json();
          return { ...panel, translatedText: data.translatedText, loading: false };
        } catch {
          return { ...panel, translatedText: 'Error', loading: false };
        }
      })
    );
    setTargetPanels(newTargetPanels);
  }, [targetPanels, sourceLanguage]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="p-4 border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Multi-Language Translator
        </h1>
      </header>
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-8">
              <SourceText
                onTranslate={handleTranslate}
                sourceLanguage={sourceLanguage}
                onSourceLanguageChange={handleSourceLanguageChange}
                initialText={sourceText}
                skipAutoTranslate={skipAutoTranslate}
              />
              <div className="flex justify-center items-center gap-4">
                <LanguageSelector
                  onAddLanguage={handleAddLanguage}
                  activeLanguages={[sourceLanguage, ...targetPanels.map(p => p.language)]}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveConfiguration}
                    className="p-3 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:cursor-pointer transition-colors relative group"
                    disabled={!hasUnsavedChanges}
                    title="Save panel configuration"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      Save panel configuration
                    </div>
                  </button>
                </div>
                {hasUnsavedChanges && (
                  <span className="text-sm text-orange-600 dark:text-orange-400">
                    Unsaved changes
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {targetPanels.map(panel => (
                  <TargetPanel
                    key={panel.language}
                    language={panel.language}
                    translatedText={panel.translatedText}
                    onRemove={handleRemovePanel}
                    loading={panel.loading}
                  />
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <HistoryPanel 
                onRestoreHistory={handleRestoreHistory} 
                refreshTrigger={historyRefresh}
                onSaveCheckpoint={handleSaveCheckpoint}
                canSaveCheckpoint={sourceText.trim() !== '' && targetPanels.some(p => p.translatedText)}
                onHistoryChange={() => setHistoryRefresh(prev => prev + 1)}
              />
            </div>
          </div>
        </div>
      </main>
      <footer className="p-4 border-t dark:border-gray-700">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Powered by Next.js
        </p>
      </footer>
      
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Save as Checkpoint
            </h3>
            <input
              type="text"
              value={checkpointLabel}
              onChange={(e) => setCheckpointLabel(e.target.value)}
              placeholder="Optional label for this checkpoint"
              className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors cursor-pointer hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSaveCheckpoint}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors cursor-pointer hover:cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(TranslatePage);
