import { assertEquals } from '../deps.ts';
import { PoolClient } from '../deps.ts';
import { ConnectDb, DisconnectDb } from '../src/functions/Db.ts';

async function ping(db: PoolClient) {
  try {
    // queries the database to check if it is connected, expected result is 2
    const output = (await db.queryObject('SELECT 1 + 1 as result')).rows as [
      { result: number }
    ];
    const result = output[0].result;
    return result === 2;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// Tests ConnectDB and DisconnectDb
Deno.test('Postgres Connection', async () => {
  const db = await ConnectDb();
  const pingResult = await ping(db);
  await DisconnectDb(db);
  assertEquals(pingResult, true);
});
