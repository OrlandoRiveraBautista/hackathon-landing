import { Pool } from "pg";

const globalForDb = globalThis as unknown as { pool: Pool | undefined };

export function getPool() {
  if (!globalForDb.pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL is not set. Add your Neon Postgres connection string to .env",
      );
    }

    globalForDb.pool = new Pool({
      connectionString,
      connectionTimeoutMillis: 10_000,
    });
  }

  return globalForDb.pool;
}

