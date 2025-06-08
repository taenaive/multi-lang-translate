# Multi-Language Translator

This is a [Next.js](https://nextjs.org) application that provides simultaneous multi-language translation with text-to-speech capabilities.

## Features

- **Multi-Language Translation:** Translate text into multiple languages at once.
- **Dynamic Language Panels:** Add and remove language panels dynamically.
- **Source Language Selection:** Change the source language for translation.
- **Automatic Language Swapping:** If a new source language is already a target language, the two are automatically swapped.
- **Text-to-Speech:** Listen to the pronunciation of the source text and the translated text.
- **Client-Side Caching:** Speech audio is cached on the client to prevent redundant API calls.

## Tech Stack

- [Next.js](https://nextjs.org) - React framework for server-side rendering and static site generation.
- [Tailwind CSS](https://tailwindcss.com) - A utility-first CSS framework for rapid UI development.
- [TypeScript](https://www.typescriptlang.org) - A typed superset of JavaScript that compiles to plain JavaScript.
- [translate](https://www.npmjs.com/package/translate) - A simple translation library.
- [Kokoro](https://github.com/remsky/Kokoro-FastAPI) - A local text-to-speech server.

## Getting Started

First, ensure you have the [Kokoro server](https://github.com/remsky/Kokoro-FastAPI) running on `http://localhost:8880`.

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app/api/`: Contains the API routes for translation and speech synthesis.
- `src/components/`: Contains the React components for the application.
- `src/lib/`: Contains shared libraries, such as the list of supported languages.
- `docs/`: Contains project documentation and objectives.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
