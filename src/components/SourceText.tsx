'use client';

import { useState, useEffect } from 'react';
import { supportedLanguages } from '@/lib/languages';
import SpeakButton from './SpeakButton';

interface SourceTextProps {
  onTranslate: (text: string) => void;
  sourceLanguage: string;
  onSourceLanguageChange: (language: string) => void;
}

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const SourceText = ({ onTranslate, sourceLanguage, onSourceLanguageChange }: SourceTextProps) => {
  const [text, setText] = useState('');
  const debouncedText = useDebounce(text, 1000);

  useEffect(() => {
    if (debouncedText) {
      onTranslate(debouncedText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedText]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
      <select
        value={sourceLanguage}
        onChange={(e) => onSourceLanguageChange(e.target.value)}
        className="p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      >
        {supportedLanguages.map((lang) => (
        <option key={lang.code} value={lang.name}>
          {lang.name}
        </option>
        ))}
      </select>
      <SpeakButton text={text} language={sourceLanguage} />
      </div>
      <textarea
      className="w-full h-40 p-4 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white text-xl"
      placeholder="Enter text to translate..."
      value={text}
      onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
};

export default SourceText;
