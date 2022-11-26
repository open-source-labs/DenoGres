import { Pool, PoolClient } from "pg/mod.ts";

// function to connect to external postgres db
export default async (): Promise<PoolClient> => {
  const POOL_CONNECTIONS = 3;
  const pool = new Pool(Deno.env.get("DB_URI"), POOL_CONNECTIONS, true);
  const connection = await pool.connect();
  return connection;
}