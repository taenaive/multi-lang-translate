# Multi-Language Translator - Local Storage Integration Plan

## Overview
This plan outlines the implementation of local storage to persist user configurations (language panels) and maintain a translation history, allowing users to revisit past translations and their associated audio.

## 1. Panel Configuration Persistence

### 1.1. Save Panel Configuration to Local Storage
- **File**: `src/app/translate/page.tsx`
- **Action**: Implement a `useEffect` hook or similar mechanism to save the `targetPanels` state to local storage whenever it changes.
- **Key**: Use a consistent key, e.g., `'translatorPanels'`.
- **Details**: The `targetPanels` array (containing language, translatedText, loading state) should be serialized to JSON before saving.

### 1.2. Load Panel Configuration from Local Storage
- **File**: `src/app/translate/page.tsx`
- **Action**: When the `TranslatePage` component mounts, attempt to load the `targetPanels` state from local storage.
- **Details**: If data is found, parse it from JSON and use it to initialize the `targetPanels` state. If not found, use the default initial state.

## 2. Translation History Implementation

### 2.1. Define History Data Structure
- **Location**: Create a new type definition, e.g., in `src/types/index.ts` or directly in `src/lib/history.ts`.
- **Structure**: Each history entry should include:
    - `id`: Unique identifier (e.g., timestamp).
    - `sourceText`: The original text translated.
    - `sourceLanguage`: The original language of the text.
    - `targetPanels`: An array similar to the `targetPanels` state, but storing the final translated text and the voice used.
    - `timestamp`: Date/time of the translation.

### 2.2. Save Translation to History
- **File**: `src/app/translate/page.tsx`
- **Action**: After a successful translation (within the `handleTranslate` function), create a new history entry and add it to a history array stored in local storage.
- **Key**: Use a consistent key, e.g., `'translationHistory'`.
- **Details**: 
    - Retrieve existing history from local storage, or initialize an empty array.
    - Add the new entry to the beginning of the array (LIFO).
    - Implement a limit (e.g., 50 entries) to prevent local storage from growing indefinitely. Remove oldest entries if the limit is exceeded.
    - Audio files will NOT be stored directly in local storage. Instead, the `voice` name and `languageCode` will be stored, and audio will be re-synthesized on demand when a history item is reloaded.

### 2.3. Load Translation History
- **Location**: Create a new utility function, e.g., in `src/lib/history.ts`.
- **Action**: Load the entire translation history from local storage.

## 3. History Panel UI Component

### 3.1. Create HistoryPanel Component
- **File**: `src/components/HistoryPanel.tsx`
- **Functionality**:
    - Display a list of recent translation history entries.
    - Each entry should show a summary (e.g., source text snippet, source language, and target languages).
    - Implement a click handler for each history item.

### 3.2. Integrate HistoryPanel into Translator Page
- **File**: `src/app/translate/page.tsx`
- **Action**: Add the `HistoryPanel` component to the right side of the main translator layout.
- **Styling**: Adjust CSS (e.g., Tailwind CSS grid or flexbox) to accommodate the new panel.

### 3.3. Restore Functionality from History
- **File**: `src/app/translate/page.tsx` and `src/components/HistoryPanel.tsx`
- **Action**: When a history item is clicked in `HistoryPanel`:
    - Pass the selected history entry data back to `TranslatePage`.
    - Update the `sourceLanguage` state with the history item's source language.
    - Update the `targetPanels` state with the history item's target panels (including translated text).
    - The `SourceText` component should be updated with the historical source text.
    - Trigger re-synthesis of audio for the restored translation if needed (this will happen automatically when the `SpeakButton` is clicked on the restored panels).

## 4. Refinements and Testing

### 4.1. Clear History Functionality
- **Action**: Add a button or option within the `HistoryPanel` to clear all stored translation history from local storage.

### 4.2. Error Handling and Edge Cases
- **Action**: Add robust error handling for local storage operations (e.g., `try-catch` blocks).
- **Considerations**: What happens if local storage is full or disabled?

### 4.3. Testing
- **Action**: Thoroughly test:
    - Saving and loading panel configurations.
    - Saving, loading, and restoring translation history.
    - Clearing history.
    - UI responsiveness with the new history panel.

### 4.4. Documentation Updates
- **Action**: Update `README.md` to reflect the new local storage features and usage.
