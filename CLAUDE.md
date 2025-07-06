# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with Next.js configuration

### Testing
No specific test commands are configured in this project. Tests should be added using a framework like Jest or Vitest.

## Architecture Overview

### Project Structure
This is a Next.js 15 application with TypeScript that provides multi-language translation with text-to-speech capabilities.

**Key directories:**
- `src/app/` - App Router pages and API routes
- `src/components/` - Reusable React components
- `src/lib/` - Shared utilities and configurations
- `docs/` - Project documentation

### Authentication System
- Firebase Authentication is used for user management
- `withAuth` HOC in `src/components/auth/withAuth.tsx` protects routes
- Authentication components are in `src/components/auth/`
- Main app requires authentication to access `/translate`

### Translation & Speech Architecture
- **Translation API:** `src/app/api/translate/route.ts` uses Google Cloud Translation API
- **Speech API:** `src/app/api/speech/route.ts` uses Google Cloud Text-to-Speech API
- **Language Support:** Defined in `src/lib/languages.ts` with voice configurations
- **State Management:** Component-level state in `src/app/translate/page.tsx`

### Core Components
- `TranslatePage` - Main translation interface with dynamic language panels
- `TargetPanel` - Individual translation output with speech playback
- `SourceText` - Input area with source language selection
- `LanguageSelector` - Add new target languages
- `SpeakButton` - Text-to-speech functionality with client-side caching

## Environment Configuration

### Required Environment Variables
Create `.env.local` with:
```
GOOGLE_API_KEY=your_google_api_key
GOOGLE_PROJECT_ID=your_google_cloud_project_id
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

### Google Cloud Setup
- Requires Google Cloud CLI authentication: `gcloud auth application-default login`
- Enable Translation API and Text-to-Speech API
- Set quota project: `gcloud auth application-default set-quota-project PROJECT_ID`

## Current Development Status

### Implemented Features
- Firebase authentication system
- Dynamic language panel management
- Google Cloud Translation API integration
- Google Cloud Text-to-Speech with client-side caching
- Responsive design with Tailwind CSS
- Language conflict resolution (source/target swapping)

### Planned Features (from PLAN.md)
- Local storage for panel configurations
- Translation history persistence
- History panel UI component
- Clear history functionality

## Code Conventions

### TypeScript
- Strict TypeScript configuration
- Interface definitions for component props
- Path aliases configured (`@/*` maps to `src/*`)

### Styling
- Tailwind CSS for styling
- Dark mode support classes
- Responsive design patterns

### Component Patterns
- Functional components with hooks
- Props interfaces defined inline or separately
- Client components marked with `'use client'`
- HOC pattern for authentication (`withAuth`)

## API Integration Notes

### Translation Flow
1. User enters text in source language
2. `handleTranslate` in `TranslatePage` calls `/api/translate` for each target panel
3. API validates languages against `supportedLanguages`
4. Google Cloud Translation API performs translation
5. Results update component state

### Speech Synthesis
1. `SpeakButton` requests audio from `/api/speech`
2. API synthesizes speech using Google Cloud Text-to-Speech
3. Audio is cached client-side to prevent redundant API calls
4. Audio playback uses HTML5 audio element

### Error Handling
- API routes return appropriate HTTP status codes
- Client-side error handling displays "Error" in panels
- Console logging for debugging API failures