import { Client } from './deps.ts';

const pgclient = new Client({
  hostname: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'postgres',
});

pgclient.connect();

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

pgclient.queryObject(table, (err) => {
  if (err) throw err;
});

pgclient.queryObject(text, values, (err) => {
  if (err) throw err;
});

pgclient.queryObject('SELECT * FROM student', (err, res) => {
  if (err) throw err;
  console.log(err, res.rows); // Print the data in student table
  pgclient.end();
});
