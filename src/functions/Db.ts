import "https://deno.land/x/dotenv/load.ts";

import { Pool, PoolClient } from '../../deps.ts'

//import * as postgres from "https://deno.land/x/postgres/mod.ts";

const POOL_CONNECTIONS = 3;

export const ConnectDb = async () => {
    const pool = new Pool(Deno.env.get('DATABASE_URI'), POOL_CONNECTIONS, true);
    const connection = await pool.connect();
    return connection;
}

export const DisconnectDb = (connection: PoolClient) => {
   connection.release();
}