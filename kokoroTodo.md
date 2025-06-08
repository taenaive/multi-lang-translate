# Todo List: Kokoro Text-to-Speech Integration

This document outlines the steps to add text-to-speech functionality to the translator app using the Kokoro local server, as per the requirements in `docs/KokoroObjective.md`.

---

### Phase 1: Backend Setup

-   [ ] **Update Language Library with Voice Codes:**
    -   Modify the `src/lib/languages.ts` file.
    -   Add the corresponding Kokoro voice code to each language object.
    -   Example: `{ code: 'en', name: 'English', voice: 'af_nicole' }`.

-   [ ] **Create a Backend API Route for Speech Synthesis:**
    -   Create a new API route at `app/api/speech/route.ts`.
    -   This route will act as a proxy between our app and the Kokoro server.

-   [ ] **Implement the Speech API Route Logic:**
    -   The route will accept a `POST` request with `{ text: string, language: string }` in the body.
    -   It will look up the correct `voice` code from the `languages.ts` file based on the provided language name.
    -   It will then make a `POST` request to the Kokoro server endpoint: `http://localhost:8880/v1/audio/speech`.
    -   The payload will match the format specified in the requirements, including the input text and the looked-up voice code.
    -   The route will stream the `audio/mpeg` response from the Kokoro server directly back to the client.

---

### Phase 2: Frontend Integration

-   [ ] **Create a Reusable "Speak" Button Component:**
    -   Create a new component, e.g., `src/components/SpeakButton.tsx`.
    -   This button will take `text` and `language` as props.
    -   It will handle the logic for calling our `/api/speech` endpoint.
    -   It will manage its own state (e.g., `idle`, `loading`, `playing`) to provide visual feedback.

-   [ ] **Implement Audio Playback Logic:**
    -   Inside the `SpeakButton` component, when the button is clicked:
        -   Fetch the audio data from the `/api/speech` endpoint.
        -   Create a `Blob` from the response and generate an object URL using `URL.createObjectURL()`.
        -   Use the browser's `Audio` API to create a new audio element and play the sound.
        -   Handle loading and error states gracefully.

-   [ ] **Add Speak Button to the Source Text Panel:**
    -   Modify `src/components/SourceText.tsx`.
    -   Integrate the `SpeakButton` component, passing the source text and source language to it.

-   [ ] **Add Speak Button to the Target Language Panels:**
    -   Modify `src/components/TargetPanel.tsx`.
    -   Integrate the `SpeakButton` component, passing the translated text and the panel's language to it.
    -   The button should be disabled if there is no translated text.

---

### Phase 3: Final Touches

-   [ ] **Refine Styling and User Experience:**
    -   Ensure the speak buttons are styled consistently and look good within the panels.
    -   Add tooltips or other indicators to clarify the button's function.
    -   Test the complete workflow thoroughly.
