# syntax=docker/dockerfile:1

# --- Stage 1: install all dependencies (incl. dev, needed for build) ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Stage 2: generate Prisma client and compile TypeScript ---
FROM node:20-alpine AS build
WORKDIR /app
# OpenSSL is required by Prisma engines on Alpine.
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npx prisma generate
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# --- Stage 3: runtime image ---
FROM node:20-alpine AS runner
WORKDIR /app
# OpenSSL is required by Prisma migrate/query engines at runtime.
RUN apk add --no-cache openssl
ENV NODE_ENV=production
# node_modules retains the Prisma CLI (migrate deploy) and tsx (optional seed),
# both required at container start; see docker-entrypoint.sh.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
# src is required because the seed script (tsx prisma/seed.ts) imports from src.
COPY --from=build /app/src ./src
COPY package.json ./package.json
COPY docker-entrypoint.sh ./docker-entrypoint.sh
# Normalize line endings (Windows checkouts) and make executable.
RUN sed -i 's/\r$//' ./docker-entrypoint.sh && chmod +x ./docker-entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
