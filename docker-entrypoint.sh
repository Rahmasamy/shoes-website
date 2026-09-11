#!/bin/sh
set -e

# Default flags: do migrations and seeding only if env vars set to "true"
RUN_MIGRATIONS=${RUN_MIGRATIONS:-false}
RUN_SEED=${RUN_SEED:-false}

echo "Entrypoint: RUN_MIGRATIONS=${RUN_MIGRATIONS}, RUN_SEED=${RUN_SEED}"

if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "Running migrations with drizzle-kit..."
  # attempt to run drizzle-kit; tolerate failures to avoid crashing the container
  if command -v npx >/dev/null 2>&1; then
    npx drizzle-kit push --config ./drizzle.config.ts || true
  else
    echo "npx not available; skipping drizzle-kit migrations"
  fi
fi

if [ "$RUN_SEED" = "true" ]; then
  echo "Running seeder..."
  if [ -f ./dist/seed.cjs ]; then
    node ./dist/seed.cjs || true
  elif command -v npx >/dev/null 2>&1; then
    npx tsx server/seed.ts || true
  else
    echo "No compiled seeder and tsx not available; skipping seeder"
  fi
fi

# Exec original command
exec "$@"
