# Todo List: Multi-Language Translation App

This document outlines the steps to build a language translator web app using Next.js, as per the requirements in `objective1.md`.

---

### Phase 1: Project Setup & Basic UI

-   [ ] **Initialize Next.js Project:**
    -   Set up a new Next.js application using `npx create-next-app@latest`.
    -   Choose TypeScript for type safety.
    -   Set up basic project structure (folders for components, services, etc.).

-   [ ] **Create Main Layout:**
    -   Design the main page (`app/page.tsx`) with a layout similar to Google Translate.
    -   This will include a main container for the source text and the target translation panels.

-   [ ] **Create Source Text Component:**
    -   Build the component for the user to input the text they want to translate.
    -   This will be a `textarea` element with a language selector.

-   [ ] **Create Target Language Panel Component:**
    -   Create a reusable React component for a single translation panel.
    -   Each panel should include:
        -   A display area for the translated text.
        -   The language code (e.g., "ES", "FR").
        -   A "remove" button.

---

### Phase 2: Core Translation Logic

-   [ ] **Choose and Set Up Translation Service:**
    -   **Recommendation:** Use the `translate` npm package. It's a simple wrapper that can use Google Translate, DeepL, etc., and is easy to implement for a prototype.
    -   Install the package: `npm install translate`.

-   [ ] **Create a Backend API Route for Translation:**
    -   In Next.js, create an API route (e.g., `app/api/translate/route.ts`).
    -   This route will receive the source text, source language, and target language.
    -   It will call the translation service and return the translated text. This keeps API keys or service logic off the client-side.

-   [ ] **Implement Translation Function:**
    -   Write the function inside the API route to perform the translation using the `translate` package.
    -   Handle basic error cases.

---

### Phase 3: Dynamic UI & State Management

-   [ ] **Implement State Management for Panels:**
    -   Use React's `useState` or `useReducer` to manage the list of active target language panels.
    -   The state will hold an array of objects, where each object represents a panel and its language.

-   [ ] **Implement Add/Remove Functionality:**
    -   Create a menu or button that allows the user to select and add new language panels to the UI.
    -   The "remove" button on each panel should remove it from the state.

-   [ ] **Connect UI to Translation API:**
    -   When the text in the source `textarea` changes, trigger a call to the backend API for each active target language panel.
    -   Use a debounce mechanism to avoid sending too many API requests while the user is typing.
    -   Update the state of each target panel with the translated text received from the API.

---

### Phase 4: Polishing and Refinements

-   [ ] **Add Language Selectors:**
    -   Add dropdown menus for the source language and for adding new target languages.
    -   Populate these dropdowns with a list of supported languages.

-   [ ] **Add Loading and Error States:**
    -   Show a loading indicator in each panel while the translation is in progress.
    -   Display a clear error message if a translation fails.

-   [ ] **Styling:**
    -   Use CSS (e.g., Tailwind CSS, CSS Modules) to style the components to look clean and professional, inspired by Google Translate.
    -   Ensure the layout is responsive and works well on different screen sizes.

-   [ ] **Final Review and Deployment:**
    -   Test all functionalities thoroughly.
    -   Prepare the application for deployment locally on docker container.