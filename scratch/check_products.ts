import pg from "pg";

async function checkDb(port: number) {
  const connectionString = `postgresql://user:password@localhost:${port}/sole_haven`;
  const pool = new pg.Pool({ connectionString });
  try {
    const res = await pool.query("SELECT * FROM products");
    console.log(`Port ${port} has ${res.rows.length} products:`);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (error: any) {
    console.log(`Port ${port} failed:`, error.message);
  } finally {
    await pool.end();
  }
}

async function main() {
  await checkDb(5433);
  await checkDb(5434);
}

main().catch(console.error);
