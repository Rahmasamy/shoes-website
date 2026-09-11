#!/usr/bin/env node
const { Client } = require('pg');
(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const total = await client.query('SELECT count(*) FROM products');
    const withTrans = await client.query("SELECT count(*) FROM products WHERE translations IS NOT NULL AND translations <> '{}'::jsonb");
    const sample = await client.query("SELECT id,name,translations FROM products WHERE translations IS NOT NULL AND translations <> '{}'::jsonb LIMIT 5");
    console.log('total_products:', total.rows[0].count);
    console.log('products_with_translations:', withTrans.rows[0].count);
    console.log('sample_rows:', JSON.stringify(sample.rows, null, 2));
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('Error checking translations:', err);
    try { await client.end(); } catch (e) {}
    process.exit(1);
  }
})();
