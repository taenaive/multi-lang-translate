'use client';

import { useState } from 'react';

const audioCache = new Map<string, Blob>();

interface SpeakButtonProps {
  text: string;
  language: string;
}

const SpeakButton = ({ text, language }: SpeakButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const playAudio = (blob: Blob) => {
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    audio.play();
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
  };

  const handleSpeak = async () => {
    if (!text) return;

    const cacheKey = `${language}:${text}`;
    if (audioCache.has(cacheKey)) {
      playAudio(audioCache.get(cacheKey)!);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, language }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        audioCache.set(cacheKey, audioBlob);
        playAudio(audioBlob);
      } else {
        console.error('Failed to generate speech');
      }
    } catch (error) {
      console.error('Error generating speech:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSpeak}
      disabled={isLoading || !text}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
    >
      {isLoading ? '...' : 'Speak'}
    </button>
  );
};

export default SpeakButton;
