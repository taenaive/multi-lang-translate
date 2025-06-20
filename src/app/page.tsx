'use client';

import { useState, useCallback } from 'react';
import SourceText from "@/components/SourceText";
import TargetPanel from "@/components/TargetPanel";
import LanguageSelector from '@/components/LanguageSelector';

interface LanguagePanel {
  language: string;
  translatedText: string;
  loading: boolean;
}

export default function Home() {
  const [sourceLanguage, setSourceLanguage] = useState('English');
  const [targetPanels, setTargetPanels] = useState<LanguagePanel[]>([
    { language: 'Spanish', translatedText: '', loading: false },
    { language: 'French', translatedText: '', loading: false },
    { language: 'Italian', translatedText: '', loading: false },
    { language: 'Portuguese', translatedText: '', loading: false },
  ]);

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
      setTargetPanels([...targetPanels, { language, translatedText: '', loading: false }]);
    }
  };

  const handleTranslate = useCallback(async (text: string) => {
    setTargetPanels(panels => panels.map(p => ({ ...p, loading: true })));

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
  }, [targetPanels]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="p-4 border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Multi-Language Translator
        </h1>
      </header>
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto w-full space-y-8">
          <SourceText
            onTranslate={handleTranslate}
            sourceLanguage={sourceLanguage}
            onSourceLanguageChange={handleSourceLanguageChange}
          />
          <div className="flex justify-center">
            <LanguageSelector
              onAddLanguage={handleAddLanguage}
              activeLanguages={[sourceLanguage, ...targetPanels.map(p => p.language)]}
            />
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
      </main>
      <footer className="p-4 border-t dark:border-gray-700">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Powered by Next.js
        </p>
      </footer>
    </div>
  );
}
