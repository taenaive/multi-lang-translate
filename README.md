# Multi-Language Translator

This is a [Next.js](https://nextjs.org) application that provides simultaneous multi-language translation with text-to-speech capabilities, integrated with Firebase for authentication, Google Cloud services for translation and speech, and local storage for persistent history and configuration management.

## Features

### Core Translation Features
- **User Authentication:** Secure login and signup using Firebase Authentication.
- **Multi-Language Translation:** Translate text into multiple languages at once using Google Cloud Translation API.
- **Dynamic Language Panels:** Add and remove language panels dynamically.
- **Source Language Selection:** Change the source language for translation.
- **Automatic Language Swapping:** If a new source language is already a target language, the two are automatically swapped.
- **Text-to-Speech:** Listen to the pronunciation of the source text and the translated text using Google Cloud Text-to-Speech API.
- **Client-Side Caching:** Speech audio is cached on the client to prevent redundant API calls.

### Local Storage & History Management
- **Manual Save System:** User-controlled saving with visual indicators for unsaved changes.
- **Panel Configuration Persistence:** Save and restore language panel configurations between sessions.
- **Translation History:** Comprehensive history tracking with timestamp and source information.
- **Checkpoint System:** Create labeled checkpoints for important translations.
- **History Restoration:** One-click restoration of previous translations without API calls.
- **Individual History Management:** Delete specific history entries or clear all history.
- **Smart Auto-Translation:** Prevents unnecessary API calls during history restoration.

### Enhanced UI/UX
- **Icon Button Interface:** Intuitive icon buttons with tooltips for key actions.
- **History Sidebar:** Dedicated panel for browsing and managing translation history.
- **Responsive Design:** Optimized layout that adapts to different screen sizes.
- **Dark Mode Support:** Full dark mode compatibility with proper contrast.
- **Interactive Feedback:** Pointer cursors and hover effects on all interactive elements.

## Tech Stack

- [Next.js](https://nextjs.org) - React framework for server-side rendering and static site generation.
- [Tailwind CSS](https://tailwindcss.com) - A utility-first CSS framework for rapid UI development.
- [TypeScript](https://www.typescriptlang.org) - A typed superset of JavaScript that compiles to plain JavaScript.
- [Firebase](https://firebase.google.com/) - For user authentication.
- [Google Cloud Translation API](https://cloud.google.com/translate) - For text translation.
- [Google Cloud Text-to-Speech API](https://cloud.google.com/text-to-speech) - For speech synthesis.

## Getting Started

### 1. Environment Variables
Create a `.env` file in the root of your project and add the following environment variables:

```env
# Google Cloud
GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
GOOGLE_PROJECT_ID="YOUR_GOOGLE_CLOUD_PROJECT_ID"

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
```

Replace the placeholder values with your actual Google Cloud and Firebase project credentials.

### 2. Google Cloud CLI Setup
Ensure you have the Google Cloud CLI installed and configured for your project. If not, follow these steps:

1.  **Install gcloud CLI (if not already installed):**
    ```bash
    brew install --cask google-cloud-sdk # For macOS with Homebrew
    # Or refer to Google Cloud documentation for other OS:
    # https://cloud.google.com/sdk/docs/install
    ```

2.  **Authenticate your local environment:**
    ```bash
    gcloud auth application-default login
    ```
    This will open a browser window for you to log in and authorize the CLI. This sets up Application Default Credentials (ADC).

3.  **Set your Google Cloud project:**
    ```bash
    gcloud config set project YOUR_GOOGLE_CLOUD_PROJECT_ID
    ```
    Replace `YOUR_GOOGLE_CLOUD_PROJECT_ID` with your actual project ID (e.g., `fire-base-prototype`).

4.  **Set the quota project for ADC:**
    ```bash
    gcloud auth application-default set-quota-project YOUR_GOOGLE_CLOUD_PROJECT_ID
    ```

5.  **Enable necessary APIs:**
    ```bash
    gcloud services enable translate.googleapis.com texttospeech.googleapis.com
    ```
    **Important:** If you encounter billing errors, ensure a billing account is linked to your Google Cloud project in the [Google Cloud Console](https://console.cloud.google.com/billing).

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The application features a landing page with login/signup options, and the full translator functionality with history management is accessible at `/translate` after authentication.

## User Guide

### Getting Started
1. **Sign Up/Login:** Create an account or log in with existing credentials.
2. **Enter Text:** Type or paste text in the source text area.
3. **Add Languages:** Use the language selector to add target languages.
4. **Auto-Translate:** Text is automatically translated after a short delay.
5. **Listen:** Click speaker icons to hear pronunciations.

### Managing History
- **Save Configuration:** Click the green gear icon to save your current panel setup.
- **Create Checkpoint:** Click the green checkmark in the history panel to save translations with optional labels.
- **Restore History:** Click any item in the history sidebar to restore previous translations.
- **Delete Entries:** Hover over history items and click the X to delete individual entries.
- **Clear All:** Use the "Clear All" button to remove all history (with confirmation).

### Tips
- Saved translations are restored instantly without making new API calls.
- Panel configurations persist between browser sessions.
- History is limited to 50 entries to optimize performance.
- Checkpoints can be labeled for easy identification.

## Project Structure

- `src/app/api/`: Contains the API routes for translation and speech synthesis.
- `src/components/`: React components including authentication (`auth/`) and core UI components.
- `src/lib/`: Shared libraries including language definitions, Firebase config, and history utilities.
- `src/types/`: TypeScript type definitions for history and configuration data structures.
- `docs/`: Project documentation and development objectives.

### Key Files
- `src/app/translate/page.tsx`: Main translator interface with localStorage integration.
- `src/components/HistoryPanel.tsx`: History management sidebar component.
- `src/lib/history.ts`: localStorage utilities for history and configuration management.
- `src/types/history.ts`: TypeScript interfaces for history data structures.
- `CLAUDE.md`: Comprehensive development documentation and architecture guide.

## Development

### Available Scripts
- `npm run dev`: Start development server with Turbopack
- `npm run build`: Build production application
- `npm run start`: Start production server
- `npm run lint`: Run ESLint with Next.js configuration

### Code Conventions
- TypeScript with strict configuration
- Tailwind CSS for styling with dark mode support
- Functional React components with hooks
- Client components marked with `'use client'`
- Comprehensive error handling for localStorage operations

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Firebase Documentation](https://firebase.google.com/docs) - authentication and hosting.
- [Google Cloud Translation](https://cloud.google.com/translate/docs) - translation API documentation.
- [Google Cloud Text-to-Speech](https://cloud.google.com/text-to-speech/docs) - speech synthesis API.
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.