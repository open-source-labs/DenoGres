import { assert, assertEquals } from './deps.ts'
import { Pool, PoolClient } from '../deps.ts'
import { ConnectDb, DisconnectDb } from '../src/functions/Db.ts';

// Deno.test("Test Assert", () => {
//   assert(1);
//   assert("Hello");
//   assert(true);
// });


async function ping (db:PoolClient) {
  try {
    //const db = await ConnectDb();
    const output = (await db.queryObject('SELECT 1 + 1 as result')).rows as [{result:any}]
    const result = output[0].result
    console.log('result: ', result)
    //DisconnectDb(db)
    return result === 2;
  } catch (error) {
    console.error(error)
    return false
  }
}

Deno.test("Postgres Connection", async () => {

  const db = await ConnectDb();

  const pingResult = await ping(db);
  console.log('pingResult: ', pingResult)
  DisconnectDb(db)
  assertEquals(pingResult, true);  

  //console.log("Deno.resources(): ", Deno.resources())
  Deno.close(4) // workaround for tlsStream error

})

// error :  AssertionError: Test case is leaking 1 resource. A TLS connection (rid 4) was opened/accepted during the test, but not closed during the test. Close the TLS connection by calling `tlsConn.close()`.
// Deno.resources():  { "0": "stdin", "1": "stdout", "2": "stderr", "4": "tlsStream" }

// https://deno.land/manual/testing/sanitizers