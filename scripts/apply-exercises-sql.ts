/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Apply the exercises SQL file to the database via Neon HTTP.
 * Run: npx tsx scripts/apply-exercises-sql.ts
 */
const { neon } = require("@neondatabase/serverless");
const fs = require("fs");
const path = require("path");

function loadEnvFile() {
  for (const name of [".env.local", ".env"]) {
    const envPath = path.join(__dirname, "..", name);
    if (!fs.existsSync(envPath)) continue;
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
    break;
  }
}
loadEnvFile();

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL not set.");
    process.exit(1);
  }

  const sql = neon(url);
  const sqlPath = path.join(__dirname, "exercises-unit-1-to-5.sql");
  const raw = fs.readFileSync(sqlPath, "utf-8");

  // Strip SQL comments and split into statements
  const statements = raw
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n")
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Found ${statements.length} SQL statements to execute.\n`);

  let succeeded = 0;
  let failed = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const slugMatch = stmt.match(/'([^']+)'/g);
    const tag = slugMatch && slugMatch.length >= 3 ? slugMatch[2] : `Statement ${i + 1}`;
    try {
      // Use tagged template for raw SQL
      await sql.query(stmt + ";");
      console.log(`  OK  ${tag}`);
      succeeded++;
    } catch (err) {
      console.error(`  FAIL ${tag}: ${err.message}`);
      failed++;
    }
    if (i < statements.length - 1) await sleep(200);
  }

  console.log(`\nDone: ${succeeded} succeeded, ${failed} failed.`);

  // Verify count
  const result = await sql.query("SELECT count(*)::int AS cnt FROM exercises");
  console.log(`Total exercises in database: ${result.rows[0].cnt}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
