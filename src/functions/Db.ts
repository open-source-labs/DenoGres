import "https://deno.land/x/dotenv/load.ts";

import { Pool, PoolClient } from '../../deps.ts'

//import * as postgres from "https://deno.land/x/postgres/mod.ts";

const POOL_CONNECTIONS = 3;

export const ConnectDb = async () => {
  const dbUri = Deno.env.get('ENVIRONMENT')==='test' ? Deno.env.get('TEST_DB_URI') : Deno.env.get('DATABASE_URI')

  const pool = new Pool(dbUri, POOL_CONNECTIONS, true);
  const connection = await pool.connect();
  return connection;
}

export const DisconnectDb = async (connection: PoolClient) => {
  
  connection.release();
  await connection.end();

}