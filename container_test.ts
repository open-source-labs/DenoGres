import { Pool, PoolClient, describe, beforeAll, afterAll, it, assert } from './deps.ts';

describe('Test db container connection', () => {
  let client: PoolClient;
  let pool: Pool;

  beforeAll(async () => {
    pool = new Pool(
      {
        database: 'postgres',
        user: 'postgres',
        password: 'example',
        hostname: 'localhost',
        port: 5432,
      },
      1
    );
    
    client = await pool.connect();
  })

  afterAll(async () => {
    await client.release();
    await pool.end();
  });

  describe('can retrieve data', () => {
    it('works', async () => {
      const { rows } = await client.queryObject('SELECT * FROM planets LIMIT 5');
      assert(rows.length > 0);
    });
  });
})
