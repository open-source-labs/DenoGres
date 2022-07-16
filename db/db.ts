import "https://deno.land/x/dotenv/load.ts";

import { serve } from "https://deno.land/std/http/server.ts";
import * as postgres from "https://deno.land/x/postgres/mod.ts";
const dbURI = Deno.env.get('DATABASE_URI');
//const dbURI=Deno.env.get('DATABASE_URI')// fetching from .env file's DATABASE_URI
const POOL_CONNECTIONS = 3; // number of connections (user can define this)
// e.g. Create a database pool with three connections that are lazily established
export const pool = new postgres.Pool(dbURI, POOL_CONNECTIONS, true);

export const createConnection = async (pool: postgres.Pool) => {
    return await pool.connect();
}


const connection = await pool.connect();
