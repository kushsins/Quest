#!/bin/sh
set -e

echo "[entrypoint] Applying database migrations (prisma migrate deploy)..."
npx prisma migrate deploy

if [ "$SEED_ON_START" = "true" ]; then
  echo "[entrypoint] SEED_ON_START=true -> seeding database (prisma db seed)..."
  npx prisma db seed
else
  echo "[entrypoint] SEED_ON_START not 'true' -> skipping seed."
fi

echo "[entrypoint] Starting Quest API..."
exec node dist/index.js
