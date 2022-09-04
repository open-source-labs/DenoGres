import "https://deno.land/x/dotenv/load.ts";

import { Pool, PoolClient } from '../../deps.ts'

//import * as postgres from "https://deno.land/x/postgres/mod.ts";

// const POOL_CONNECTIONS = 3;
const POOL_CONNECTIONS = 10; // ? changed this to 10

export const ConnectDb = async () => {
  let dbUri;
  if(Deno.env.get('ENVIRONMENT')==='test') {
    dbUri = Deno.env.get('TEST_DB_URI')
  } else if(Deno.env.get('ENVIRONMENT')==='development') {
    dbUri = Deno.env.get('DATABASE_URI')
  }
  //Deno.env.get('ENVIRONMENT')==='test' ? Deno.env.get('TEST_DB_URI') : Deno.env.get('DATABASE_URI')

  const pool = new Pool(dbUri, POOL_CONNECTIONS, true);
  const connection = await pool.connect();
  return connection;
}

export const DisconnectDb = async (connection: PoolClient) => {
  
  connection.release();
  await connection.end();
  connection.release();
}