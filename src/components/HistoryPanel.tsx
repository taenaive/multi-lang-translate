'use client';
import { useState, useEffect } from 'react';
import { HistoryEntry } from '@/types/history';
import { getTranslationHistory, clearTranslationHistory, deleteHistoryEntry } from '@/lib/history';

interface HistoryPanelProps {
  onRestoreHistory: (entry: HistoryEntry) => void;
  refreshTrigger?: number;
  onSaveCheckpoint?: () => void;
  canSaveCheckpoint?: boolean;
  onHistoryChange?: () => void;
}

export default function HistoryPanel({ onRestoreHistory, refreshTrigger, onSaveCheckpoint, canSaveCheckpoint = false, onHistoryChange }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [refreshTrigger]);

  const loadHistory = () => {
    const savedHistory = getTranslationHistory();
    setHistory(savedHistory);
  };

  const handleClearHistory = () => {
    clearTranslationHistory();
    setHistory([]);
    setShowClearConfirm(false);
    onHistoryChange?.();
  };

  const handleDeleteEntry = (entryId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    deleteHistoryEntry(entryId);
    const updatedHistory = history.filter(entry => entry.id !== entryId);
    setHistory(updatedHistory);
    onHistoryChange?.();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Translation History
        </h3>
        <div className="flex items-center gap-2">
          {onSaveCheckpoint && (
            <button
              onClick={onSaveCheckpoint}
              disabled={!canSaveCheckpoint}
              className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:cursor-pointer transition-colors relative group"
              title="Save current translation as checkpoint"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                Save current translation as checkpoint
              </div>
            </button>
          )}
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 cursor-pointer hover:cursor-pointer disabled:cursor-not-allowed"
            disabled={history.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {history.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
            No translation history yet
          </p>
        ) : (
          history.map((entry) => (
            <div
              key={entry.id}
              className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors dark:border-gray-600 group"
              onClick={() => onRestoreHistory(entry)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  {entry.label && (
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                      {entry.label}
                    </div>
                  )}
                  {entry.isCheckpoint && (
                    <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full mb-1">
                      Checkpoint
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(entry.timestamp)}
                  </div>
                  <button
                    onClick={(e) => handleDeleteEntry(entry.id, e)}
                    className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Delete this entry"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong>{entry.sourceLanguage}:</strong> {truncateText(entry.sourceText)}
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                → {entry.targetPanels.map(p => p.language).join(', ')}
              </div>
            </div>
          ))
        )}
      </div>

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Clear Translation History
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to clear all translation history? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors cursor-pointer hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer hover:cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}