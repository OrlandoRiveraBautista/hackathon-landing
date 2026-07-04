import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { config } from "dotenv";
import { getPool } from "../lib/db";

config({ path: ".env.local" });
config();

async function migrate() {
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  const migrationsDir = join(process.cwd(), "db", "migrations");
  const files = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const id = file;
    const existing = await pool.query(
      "SELECT id FROM schema_migrations WHERE id = $1",
      [id],
    );

    if (existing.rowCount && existing.rowCount > 0) {
      console.log(`skip ${id}`);
      continue;
    }

    const sql = readFileSync(join(migrationsDir, file), "utf8");
    console.log(`apply ${id}`);
    await pool.query("BEGIN");

    try {
      await pool.query(sql);
      await pool.query("INSERT INTO schema_migrations (id) VALUES ($1)", [id]);
      await pool.query("COMMIT");
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  }

  await pool.end();
  console.log("done");
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
