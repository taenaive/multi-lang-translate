# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (with turbopack enabled)
- **Build**: `npm run build`
- **Production server**: `npm start`
- **Linting**: `npm run lint`
- **Database commands**:
  - `npx prisma generate`: Generate Prisma client
  - `npx prisma migrate dev`: Run database migrations
  - `npx prisma studio`: Open database browser
  - `npx prisma db push`: Push schema changes to database

## Architecture Overview

This is a Next.js 15 multi-language translator application with **user authentication**, **role-based access control**, and **subscription management**. The application uses a client-server architecture with protected routes, admin dashboard, database persistence, and API routes for translation and speech synthesis.

### Authentication Architecture

The application implements a complete authentication system:

**Route Structure**:
- `/` - Landing page with login/signup forms (public)
- `/translate` - Protected translator interface (requires authentication)
- `/admin` - Protected admin dashboard (requires authentication)
- `/api/auth/[...nextauth]` - NextAuth.js authentication handler
- `/api/auth/register` - User registration endpoint
- `/api/users` - User management API (requires authentication)
- `/api/users/[id]` - Individual user API (requires authentication)

**Authentication Methods**:
- **Google OAuth**: Social login via Google provider
- **Email/Password**: Traditional credentials with bcrypt hashing
- **Session Management**: JWT-based sessions with NextAuth.js

**Security Features**:
- Middleware protection for `/translate` and `/admin` routes
- Role-based access control (USER, ADMIN, MODERATOR)
- Subscription tier management (FREE, PRO, ULTRA, ENTERPRISE)
- Password hashing with bcrypt (12 rounds)
- Session-based route protection
- Automatic redirects for authenticated/unauthenticated users
- Admin-only access to user management features

### Database Schema (Prisma + PostgreSQL)

```prisma
enum UserRole {
  USER
  ADMIN
  MODERATOR
}

enum SubscriptionTier {
  FREE
  PRO
  ULTRA
  ENTERPRISE
}

User {
  id               String           @id @default(cuid())
  email            String           @unique
  emailVerified    DateTime?
  name             String?
  image            String?
  password         String?          // For credentials auth
  role             UserRole         @default(USER)
  subscriptionTier SubscriptionTier @default(FREE)
  subscriptionEnds DateTime?        // Subscription expiration
  accounts         Account[]        // OAuth accounts
  sessions         Session[]        // User sessions
}
```

**Key Models**:
- `User`: Core user data with roles, subscriptions, and authentication support
- `Account`: OAuth provider accounts (Google, etc.)
- `Session`: User session management
- `VerificationToken`: Email verification tokens

**Role System**:
- `USER`: Standard access to translation features (default)
- `ADMIN`: Full system access including admin dashboard and user management
- `MODERATOR`: Enhanced permissions for content moderation

**Subscription Tiers**:
- `FREE`: Basic translation features (default)
- `PRO`: Enhanced features and higher usage limits
- `ULTRA`: Premium features and priority support
- `ENTERPRISE`: Full feature set for business use

### Core Components Structure

- **Landing Page** (`src/app/page.tsx`): Authentication interface with login/signup forms
- **Protected Translator** (`src/app/translate/page.tsx`): Main translation interface (auth required)
- **Admin Dashboard** (`src/app/admin/page.tsx`): User management interface (auth required)
- **API Routes** (`src/app/api/`):
  - `/auth/[...nextauth]/route.ts`: NextAuth.js handler
  - `/auth/register/route.ts`: User registration with password hashing
  - `/users/route.ts`: User management API (list all users, get count)
  - `/users/[id]/route.ts`: Individual user API (get user by ID)
  - `/translate/route.ts`: Translation service using the `translate` npm package
  - `/speech/route.ts`: Text-to-speech proxy to Kokoro server
- **Authentication Components** (`src/lib/auth.ts`): NextAuth.js configuration
- **User Management** (`src/lib/`):
  - `users.ts`: User data utilities and safe user fetching
  - `userManagement.ts`: Role and subscription management utilities
- **Component Library** (`src/components/`):
  - `SessionProvider.tsx`: NextAuth session context provider
  - `UsersList.tsx`: Admin user management interface with statistics
  - `SourceText.tsx`: Input text area with debounced auto-translation
  - `TargetPanel.tsx`: Individual translation result panels with remove functionality
  - `SpeakButton.tsx`: Audio playback component with client-side caching
  - `LanguageSelector.tsx`: Add new language panels

### Key Technical Details

**Authentication Flow**:
1. User visits `/` and sees login/signup options
2. Can authenticate via Google OAuth or email/password
3. Successful auth redirects to `/translate`
4. Middleware protects `/translate` and `/admin` routes
5. Admin dashboard accessible only to authenticated users
6. Session persists across browser sessions

**Admin Dashboard Features**:
1. **User Management**: View all users with roles and subscription details
2. **Real-time Statistics**: Live metrics for users, admins, subscriptions
3. **Role Administration**: Visual display of user roles with color coding
4. **Subscription Tracking**: Monitor subscription tiers and expiration dates
5. **Authentication Analytics**: Track login methods and verification status

**User Management API**:
1. **GET /api/users**: Fetch all users with safe data (no passwords)
2. **GET /api/users?action=count**: Get total user count
3. **GET /api/users/[id]**: Get specific user details
4. **Role Updates**: `updateUserRole(userId, role)` utility function
5. **Subscription Management**: `updateUserSubscription(userId, tier, expires)` utility

**Language Configuration** (`src/lib/languages.ts`):
Each language has `code` (ISO), `name` (display), and `voice` (Kokoro TTS voice code).

**Translation Flow** (Protected Route):
1. User must be authenticated to access translator
2. User types in source text (debounced by 1000ms)
3. Auto-translation triggered to all target panels simultaneously
4. API calls to `/api/translate` with source/target language pairs
5. Results populated in respective panels

**Speech Synthesis**:
- Integrates with Kokoro FastAPI server via `KOKORO_API_URL` environment variable
- Client-side audio caching using Map to prevent redundant API calls
- Uses `URL.createObjectURL()` and browser Audio API for playback

**Language Panel Management**:
- Dynamic add/remove of target language panels
- Automatic language swapping when source conflicts with existing target
- State management prevents duplicate languages

## Environment Variables

Required environment variables for development:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/translator_db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# External Services
KOKORO_API_URL="http://localhost:8880/v1/audio/speech"
API_KEY="your-google-translate-api-key"
```

## Docker Configuration

The application is containerized with multi-stage builds:
- Uses standalone Next.js output mode (`output: 'standalone'`)
- Environment variables managed via `.env.docker`
- Production image runs on port 3000 as non-root user
- **Database**: Requires PostgreSQL connection for authentication
- **External Services**: Kokoro TTS server for speech functionality

## External Dependencies

- **PostgreSQL Database**: Required for user authentication and session storage
- **Kokoro TTS Server**: Required at runtime for speech functionality
- **Google OAuth**: Required for social authentication (optional, can use email/password only)
- **translate package**: Powers the translation API
- **Tailwind CSS**: Styling with dark mode support

## Development Setup

1. **Set up PostgreSQL database**
2. **Configure environment variables** in `.env`
3. **Run database migrations**: `npx prisma migrate dev`
4. **Generate Prisma client**: `npx prisma generate`
5. **Start development server**: `npm run dev`
6. **Ensure Kokoro TTS server is running** for speech functionality

## User Management & Administration

### Role Management
- **Default Role**: All new users start as `USER`
- **Admin Promotion**: Admins can be promoted via database or utility functions
- **Role Checking**: Use `isUserAdmin(userId)` to check admin privileges

### Subscription Management
- **Default Tier**: All new users start with `FREE` subscription
- **Expiration Handling**: System automatically downgrades expired subscriptions
- **Subscription Updates**: Use `updateUserSubscription(userId, tier, expires)` utility

### Admin Dashboard Access
- **Route**: `/admin` (protected by middleware)
- **Requirements**: Must be authenticated (any user can access currently)
- **Features**: User list, statistics, role/subscription display
- **Navigation**: Accessible from translator page via "Admin" button

### Debug Utilities
- **Database Inspection**: Run `node debug-db.js` to view current database state
- **User Management**: Use functions in `src/lib/userManagement.ts`
- **API Testing**: User management endpoints at `/api/users`

## Important Notes for AI Assistants

- **Authentication is required** for accessing translation and admin features
- **Role-based system** with USER, ADMIN, MODERATOR roles
- **Subscription tiers** with FREE, PRO, ULTRA, ENTERPRISE levels
- **Database operations** use Prisma ORM with PostgreSQL
- **Route protection** is handled by NextAuth.js middleware for `/translate` and `/admin`
- **Admin dashboard** provides comprehensive user management capabilities
- **Password security** uses bcrypt hashing
- **Session management** is JWT-based with NextAuth.js
- **User management utilities** available in `src/lib/userManagement.ts`
- **Safe data exposure** - passwords never returned in API responses
- **TypeScript strict mode** is enabled with comprehensive type checking
- **Debug script** available at `debug-db.js` for database inspection
- **Automatic subscription expiration** handling built into the system