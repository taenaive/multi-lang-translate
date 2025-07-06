# Multi-Language Translator

This is a [Next.js](https://nextjs.org) application that provides simultaneous multi-language translation with text-to-speech capabilities, now integrated with Firebase for authentication and Google Cloud services for translation and speech.

## Features

- **User Authentication:** Secure login and signup using Firebase Authentication.
- **Multi-Language Translation:** Translate text into multiple languages at once using Google Cloud Translation API.
- **Dynamic Language Panels:** Add and remove language panels dynamically.
- **Source Language Selection:** Change the source language for translation.
- **Automatic Language Swapping:** If a new source language is already a target language, the two are automatically swapped.
- **Text-to-Speech:** Listen to the pronunciation of the source text and the translated text using Google Cloud Text-to-Speech API.
- **Client-Side Caching:** Speech audio is cached on the client to prevent redundant API calls.

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The application now features a landing page with login/signup options, and the translator functionality is accessible at `/translate` after authentication.

## Project Structure

- `src/app/api/`: Contains the API routes for translation and speech synthesis.
- `src/components/`: Contains the React components for the application, including new authentication components in `src/components/auth/`.
- `src/lib/`: Contains shared libraries, such as the list of supported languages and Firebase initialization.
- `docs/`: Contains project documentation and objectives.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.