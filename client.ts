import { Pool } from './deps.ts';

const pool = new Pool(
  'postgres://ynhufyow:cUTssLTW2NFX97XvQUjgX1r-OiUi924y@berry.db.elephantsql.com/ynhufyow',
  3,
  true,
);

const pgclient = await pool.connect();

const table =
  'CREATE TABLE student(id SERIAL PRIMARY KEY, firstName VARCHAR(40) NOT NULL, lastName VARCHAR(40) NOT NULL, age INT, address VARCHAR(80), email VARCHAR(40))';
const text =
  'INSERT INTO student(firstname, lastname, age, address, email) VALUES($1, $2, $3, $4, $5) RETURNING *';
const values = [
  'Mona the',
  'Octocat',
  9,
  '88 Colin P Kelly Jr St, San Francisco, CA 94107, United States',
  'octocat@github.com',
];

try {
  await pgclient.queryObject(table);
  await pgclient.queryObject(text, values);
  const result = await pgclient.queryObject('SELECT * FROM student');
  console.log(result.rows);
} catch (err) {
  throw err;
} finally {
  await pgclient.end();
}
