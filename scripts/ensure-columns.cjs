#!/usr/bin/env node
const { Client } = require('pg');
(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const queries = [
      "ALTER TABLE products ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;",
      "ALTER TABLE reviews ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;",
      "ALTER TABLE contacts ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;"
    ];
    for (const q of queries) {
      await client.query(q);
      console.log('OK:', q.split(' ')[2]);
    }
    console.log('All columns ensured.');
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('Error ensuring columns:', err);
    try { await client.end(); } catch (e) {}
    process.exit(1);
  }
})();
