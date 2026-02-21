import { Pool } from "pg";

const globalForPool = globalThis as unknown as {
  pgPool?: Pool;
};

function getPool(): Pool {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!url) {
    throw new Error("Neither POSTGRES_URL nor DATABASE_URL is set.");
  }

  if (!globalForPool.pgPool) {
    globalForPool.pgPool = new Pool({
      connectionString: url,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    });
  }
  return globalForPool.pgPool;
}

export async function getTextByCode(code: string) {
  const result = await getPool().query(
    "SELECT code, content, updated_at FROM rooms WHERE code = $1",
    [code],
  );
  return result.rows[0] as
    | { code: string; content: string | null; updated_at: Date }
    | undefined;
}

export async function saveTextWithCode(code: string, content: string) {
  const result = await getPool().query(
    `
    INSERT INTO rooms (code, content)
    VALUES ($1, $2)
    ON CONFLICT (code) DO NOTHING
    RETURNING code, content, updated_at
  `,
    [code, content],
  );

  return result.rows[0] as
    | {
      code: string;
      content: string | null;
      updated_at: Date;
    }
    | undefined;
}
