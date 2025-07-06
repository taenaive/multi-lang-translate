# Multi-Language Translator - Restructuring and Google Cloud Integration Plan

## 1. Foundational Setup

### 1.1. Install Dependencies
- Install Firebase for authentication and Google Cloud Translate for the translation API.
```bash
npm install firebase @google-cloud/translate
```

### 1.2. Environment Variable Setup
- Update your `.env` file in the root of the project. Ensure the following variables are present.

```env
# Google Cloud
GOOGLE_API_KEY="your-google-api-key" # You may already have this as API_KEY
GOOGLE_PROJECT_ID="your-google-project-id"

# Firebase - These should already be in your file
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-firebase-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-firebase-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-firebase-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-firebase-messaging-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-firebase-app-id"
```

### 1.3. Firebase Initialization
- Create a new file `src/lib/firebase.ts` to initialize the Firebase app. This will be used by all authentication components.

## 2. Backend API Migration

### 2.1. Migrate Translation API to Google Translate
- **File**: `src/app/api/translate/route.ts`
- **Action**: Replace the existing `translate` library with the `@google-cloud/translate` SDK.
- **Details**:
    - Use the `TranslationServiceClient` to interact with the Google Translate API.
    - The API key and project ID will be read from the environment variables.
    - Ensure the new implementation can handle the language codes from the frontend.

### 2.2. Migrate Speech API to Google Cloud Text-to-Speech
- **File**: `src/app/api/speech/route.ts`
- **Action**: Replace the Kokoro API with Google Cloud Text-to-Speech.
- **Details**:
    - You will need to install the `@google-cloud/text-to-speech` package.
    ```bash
    npm install @google-cloud/text-to-speech
    ```
    - Use the `TextToSpeechClient` to synthesize speech from text.
    - The API will receive text and a language code, and return an audio stream.
    - You will need to map the language names to the appropriate Google Cloud voice names. For Portuguese (Portugal), you can use a voice like `pt-PT-Wavenet-A`.

## 3. Frontend Restructuring and Authentication

### 3.1. Create New Home Page
- **File**: `src/app/page.tsx`
- **Action**: Convert the existing translator page into a landing page.
- **Details**:
    - Add a welcome message and a brief description of the application.
    - Include "Login" and "Sign Up" buttons.
    - Add a button or link to the translator page that will be protected.

### 3.2. Move Translator to a Separate Route
- **File**: `src/app/translate/page.tsx`
- **Action**: Create a new page for the translator.
- **Details**:
    - Move the existing translator component code from `src/app/page.tsx` to this new file.
    - This page will be protected, and only accessible to authenticated users.

### 3.3. Implement Authentication Components
- **Action**: Create the following new components in `src/components/auth`:
    - `LoginForm.tsx`: A form for users to log in with email and password.
    - `SignupForm.tsx`: A form for new users to create an account.
    - `AuthButton.tsx`: A button that shows "Login" or "Logout" based on the user's authentication state.
    - `withAuth.tsx`: A Higher-Order Component (HOC) to protect pages and redirect unauthenticated users.

### 3.4. Protect the Translator Route
- **File**: `src/app/translate/page.tsx`
- **Action**: Wrap the translator page with the `withAuth` HOC to ensure only authenticated users can access it.

## 4. Finalizing and Testing

### 4.1. Update Navigation
- **Action**: Update the main layout or header to include links to the home page, translator page, and the `AuthButton`.

### 4.2. Testing
- **Action**: Thoroughly test the following:
    - User registration and login flows.
    - That the `/translate` route is properly protected.
    - The new Google-powered translation and speech synthesis functionality.
    - The overall user experience.

### 4.3. Documentation
- **Action**: Update the `README.md` and any other relevant documentation to reflect the new architecture, environment variables, and setup instructions.
