import { afterAll, beforeAll, describe } from '../../deps.ts';
import { Pool, PoolClient } from '../../deps.ts';
import { createTablesQuery, dropTablesQuery } from './queries.ts';
import 'https://deno.land/x/dotenv@v3.2.0/load.ts';

describe('model methods', () => {
  let db: PoolClient;

  beforeAll(async () => {
    const pool = new Pool(Deno.env.get('TEST_DB_URI'), 1, true);
    try {
      db = await pool.connect();
      await db.queryObject(createTablesQuery);
      const temp_test = await db.queryObject('SELECT * FROM users');
      console.log(temp_test.rows);
    } catch (err) {
      console.log(err);
      await db.queryObject(dropTablesQuery);
      await db.end();
    }
  });

  afterAll(async () => {
    await db.queryObject(dropTablesQuery);
    await db.end();
  });
});
