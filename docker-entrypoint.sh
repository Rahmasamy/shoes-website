#!/bin/sh
set -e

# Default flags: do migrations and seeding only if env vars set to "true"
RUN_MIGRATIONS=${RUN_MIGRATIONS:-false}
RUN_SEED=${RUN_SEED:-false}

echo "Entrypoint: RUN_MIGRATIONS=${RUN_MIGRATIONS}, RUN_SEED=${RUN_SEED}"

if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "Running migrations with drizzle-kit..."
  # attempt to run drizzle-kit; skip if core tables already exist to avoid duplicate CREATE errors
  if command -v node >/dev/null 2>&1; then
    echo "Checking for existing tables before running migrations..."
    node -e "(async()=>{try{const { Client }=require('pg');const c=new Client({connectionString:process.env.DATABASE_URL});await c.connect();const r=await c.query(\"SELECT to_regclass('public.cart_items') as t\");console.log(JSON.stringify(r.rows));await c.end();}catch(e){console.error(e);process.exit(2);}})()" >/tmp/table-check.json 2>/tmp/table-check.err || true
    if grep -q 'null' /tmp/table-check.json; then
      echo "No existing core tables found — running drizzle-kit push"
      if command -v npx >/dev/null 2>&1; then
        npx drizzle-kit push --config ./drizzle.config.ts || true
      else
        echo "npx not available; skipping drizzle-kit migrations"
      fi
    else
      echo "Core tables detected; skipping drizzle-kit push to avoid conflicts"
      cat /tmp/table-check.json || true
      cat /tmp/table-check.err || true
    fi
  else
    echo "node not available; attempting drizzle-kit push (may fail)"
    if command -v npx >/dev/null 2>&1; then
      npx drizzle-kit push --config ./drizzle.config.ts || true
    else
      echo "npx not available; skipping drizzle-kit migrations"
    fi
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
