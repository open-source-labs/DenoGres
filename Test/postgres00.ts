
import "https://deno.land/x/dotenv/load.ts";
import { Pool, PoolClient } from "https://deno.land/x/postgres@v0.16.1/mod.ts";
import { assertEquals } from "https://deno.land/std@0.150.0/testing/asserts.ts";


const POOL_CONNECTIONS = 3;
const dbUri = Deno.env.get('ENVIRONMENT')==='test' ? Deno.env.get('TEST_DB_URI') : Deno.env.get('DATABASE_URI')
const pool = new Pool(dbUri, POOL_CONNECTIONS, true);

async function ping (db:PoolClient) {
  try {
    const output = (await db.queryObject('SELECT 1 + 1 as result')).rows as [{result:unknown}]
    const result = output[0].result
    //console.log('environment: ', Deno.env.get('ENVIRONMENT')==='test')
    return result === 2;
  } catch (error) {
    console.error(error)
    return false
  }
}


Deno.test("Postgres Connection", async () => {
  const db = await pool.connect();
  const pingResult = await ping(db);
  db.release()
  await db.end()

  assertEquals(pingResult, true);  

  //console.log("Deno.resources(): ", Deno.resources())
  //Deno.close(4) // workaround for tlsStream error
})
