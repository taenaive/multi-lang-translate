# Multi-Language Translator

A secure, multi-language translation application with user authentication, built with Next.js. Features real-time translation between multiple languages with text-to-speech capabilities and user session management.

## Features

### 🔐 Authentication & Security
- **Multiple Authentication Methods:**
  - Google OAuth integration
  - Email/Password registration and login
- **Protected Routes:** Translation functionality requires authentication
- **Session Management:** Secure JWT-based sessions with NextAuth.js
- **Password Security:** Bcrypt hashing for user passwords

### 🌐 Translation & Language Features
- **Multi-Language Translation:** Translate text into multiple languages simultaneously
- **Dynamic Language Panels:** Add and remove target language panels on demand
- **Source Language Selection:** Change the source language for translation
- **Automatic Language Swapping:** Smart language management prevents conflicts
- **Real-time Translation:** Debounced auto-translation as you type

### 🔊 Text-to-Speech
- **Audio Playback:** Listen to pronunciation of source and translated text
- **Client-Side Caching:** Audio files cached to prevent redundant API calls
- **Kokoro TTS Integration:** High-quality speech synthesis

### 🎨 User Experience
- **Responsive Design:** Works seamlessly on desktop and mobile
- **Dark Mode Support:** Automatic theme detection and switching
- **Loading States:** Clear feedback during translation and authentication
- **Error Handling:** Comprehensive error messages and validation

## Tech Stack

### Frontend
- [Next.js 15](https://nextjs.org) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org) - Type-safe development
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [NextAuth.js](https://next-auth.js.org) - Authentication library

### Backend & Database
- [Prisma ORM](https://prisma.io) - Database toolkit and query builder
- [PostgreSQL](https://postgresql.org) - Relational database
- [bcryptjs](https://github.com/kelektiv/node.bcrypt.js) - Password hashing

### APIs & Services
- [Google Translate API](https://www.npmjs.com/package/translate) - Translation service
- [Kokoro TTS](https://github.com/remsky/Kokoro-FastAPI) - Text-to-speech server
- [Google OAuth](https://developers.google.com/identity/protocols/oauth2) - Social authentication

## Getting Started

### Prerequisites

1. **PostgreSQL Database** - Ensure you have a PostgreSQL database running
2. **Kokoro TTS Server** - Set up the [Kokoro server](https://github.com/remsky/Kokoro-FastAPI)
3. **Google OAuth Credentials** - Create OAuth credentials in Google Cloud Console

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/translator_db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Text-to-Speech Service
KOKORO_API_URL="http://localhost:8880/v1/audio/speech"

# Google Translate API (optional, for API key usage)
API_KEY="your-google-translate-api-key"
```

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd multi-lang-translate
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up the database:**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev
```

4. **Start the development server:**
```bash
npm run dev
```

5. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## Application Architecture

### Route Structure
```
/ (page.tsx)                 → Landing page with authentication
/translate (page.tsx)        → Protected translator interface
/api/auth/[...nextauth]      → NextAuth.js authentication
/api/auth/register           → User registration endpoint
/api/translate               → Translation service
/api/speech                  → Text-to-speech proxy
```

### Database Schema
```prisma
User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  image         String?
  password      String?   // For email/password auth
  accounts      Account[] // OAuth accounts
  sessions      Session[] // User sessions
}
```

### Project Structure
```
src/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── translate/      # Translation service
│   │   └── speech/         # Text-to-speech proxy
│   ├── translate/          # Protected translator page
│   ├── page.tsx           # Landing page
│   └── layout.tsx         # Root layout with session provider
├── components/            # React components
│   ├── SourceText.tsx    # Text input component
│   ├── TargetPanel.tsx   # Translation result panels
│   ├── SpeakButton.tsx   # Audio playback
│   └── LanguageSelector.tsx
├── lib/                  # Utilities and configuration
│   ├── auth.ts          # NextAuth.js configuration
│   └── languages.ts     # Language definitions
└── middleware.ts        # Route protection middleware
```

## Docker Deployment

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t multi-lang-translate .

# Run with environment variables
docker run -p 3000:3000 --env-file .env.docker multi-lang-translate
```

### Docker Compose (with PostgreSQL)

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/translator_db
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=translator_db
      - POSTGRES_PASSWORD=password
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma database browser
- `npx prisma migrate dev` - Run database migrations

## Configuration

### Authentication Providers

To add additional OAuth providers, update `src/lib/auth.ts`:

```typescript
providers: [
  GoogleProvider({ /* config */ }),
  GitHubProvider({ /* config */ }),
  // Add more providers
]
```

### Language Support

Add new languages in `src/lib/languages.ts`:

```typescript
{
  code: 'language-code',
  name: 'Language Name',
  voice: 'kokoro-voice-code'
}
```

## Security Features

- **Route Protection:** Middleware prevents unauthorized access
- **Password Hashing:** Bcrypt with 12 rounds for secure storage
- **Session Security:** JWT tokens with secure configuration
- **Input Validation:** Server-side validation for all inputs
- **CSRF Protection:** Built-in NextAuth.js CSRF protection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
