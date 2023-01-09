import 'https://deno.land/x/dotenv@v3.2.0/load.ts';

import { Pool, PoolClient } from '../../deps.ts';

const POOL_CONNECTIONS = 3;

/** connects to the postgres db with an input uri, if given
 * or with the test db uri (if the environment is set to test)
 * or with the dev db uri (if the environment is set to dev)
 * NOTE: these three environment variables should be set
 * by the user in the .env file created by the '--init' command
 */
export const ConnectDb = async (inputUri?: string) => {
  let dbUri: string | undefined;
  if (inputUri) {
    dbUri = inputUri;
  } else if (Deno.env.get('ENVIRONMENT') === 'test') {
    dbUri = Deno.env.get('TEST_DB_URI');
  } else if (Deno.env.get('ENVIRONMENT') === 'development') {
    dbUri = Deno.env.get('DATABASE_URI');
  }

  const pool = new Pool(dbUri, POOL_CONNECTIONS, true);
  const connection = await pool.connect();
  return connection;
};

export const DisconnectDb = async (connection: PoolClient) => {
  connection.release();
  await connection.end();
  connection.release();
};
