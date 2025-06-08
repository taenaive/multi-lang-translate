'use client';

import { useState, useEffect } from 'react';
import { supportedLanguages } from '@/lib/languages';

interface LanguageSelectorProps {
  onAddLanguage: (language: string) => void;
  activeLanguages: string[];
}

const LanguageSelector = ({ onAddLanguage, activeLanguages }: LanguageSelectorProps) => {
  const availableLanguages = supportedLanguages.filter(
    (lang) => !activeLanguages.includes(lang.name)
  );

  const [selectedLanguage, setSelectedLanguage] = useState(
    availableLanguages.length > 0 ? availableLanguages[0].name : ''
  );

  useEffect(() => {
    if (availableLanguages.length > 0 && !availableLanguages.find(l => l.name === selectedLanguage)) {
      setSelectedLanguage(availableLanguages[0].name);
    } else if (availableLanguages.length === 0) {
      setSelectedLanguage('');
    }
  }, [availableLanguages, selectedLanguage]);

  const handleAdd = () => {
    if (selectedLanguage) {
      onAddLanguage(selectedLanguage);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <select
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        className="p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        disabled={availableLanguages.length === 0}
      >
        {availableLanguages.map((lang) => (
          <option key={lang.code} value={lang.name}>
            {lang.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleAdd}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        disabled={!selectedLanguage}
      >
        Add Panel
      </button>
    </div>
  );
};

export default LanguageSelector;
