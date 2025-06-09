'use client';

import SpeakButton from './SpeakButton';

interface TargetPanelProps {
  language: string;
  translatedText: string;
  onRemove: (language: string) => void;
  loading: boolean;
}

const TargetPanel = ({ language, translatedText, onRemove, loading }: TargetPanelProps) => {
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {language}
        </h2>
        <div className="flex items-center gap-4">
          <SpeakButton text={translatedText} language={language} />
          <button
            onClick={() => onRemove(language)}
            className="text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      </div>
      <div className="w-full h-40 p-4 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-white text-xl overflow-y-auto">
        {loading ? 'Translating...' : (translatedText || "Translation will appear here...")}
      </div>
    </div>
  );
};

export default TargetPanel;
