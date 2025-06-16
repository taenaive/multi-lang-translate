Based on your Next.js translation application, here's your complete containerization strategy:

## 🐳 Dockerfile Structure

You'll need a multi-stage Dockerfile optimized for Next.js:

```dockerfile
# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

## 📝 Required Configuration Changes

1. **Update next.config.ts** to enable standalone output:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
};

export default nextConfig;
```

2. **Create .dockerignore**:
```
node_modules
.next
.git
.gitignore
README.md
Dockerfile
.dockerignore
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.env.local
.env.development.local
.env.test.local
.env.production.local
```

3. **Create .env.docker** for secure environment variables:
```bash
API_KEY=your_api_key_here
KOKORO_API_URL=http://kokoro.tabom.org/v1/audio/speech
```

## 🧪 Local Testing Commands

1. **Build the image**:
```bash
docker build -t multi-lang-translate .
```

2. **Run the container**:
```bash
docker run -p 3000:3000 --env-file .env.docker multi-lang-translate
```

3. **Test the application**:
- Navigate to `http://localhost:3000`
- Test translation functionality
- Verify API connections

## 🔧 Alternative: Docker Compose

Create docker-compose.yml for easier management:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.docker
    restart: unless-stopped
```

Run with: `docker-compose up --build` or `docker compose up -d --build`

## ⚠️ Security Notes

- Use .env.docker for container environment variables
- The Dockerfile runs as non-root user for security

## 🚀 Next Steps

```sh
docker tag your-app-name ghcr.io/YOUR_GITHUB_USERNAME/your-app-name:latest
docker push ghcr.io/YOUR_GITHUB_USERNAME/your-app-name:latest

```