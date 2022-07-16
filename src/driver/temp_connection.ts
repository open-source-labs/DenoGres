import { serve } from "https://deno.land/std/http/server.ts";
import * as postgres from "https://deno.land/x/postgres/mod.ts";

const dbURI="";

const POOL_CONNECTIONS = 3; // number of connections

// Create a database pool with three connections that are lazily established
const pool = new postgres.Pool(dbURI, POOL_CONNECTIONS, true);

// Connect to the DB
//const connection = await pool.connect(); //...not here though


// table name query
const tableListQuery = `
  SELECT class.relname AS table_name
    FROM pg_class class
    INNER JOIN pg_tables tables on class.relname = tables.tablename
    WHERE tables.schemaname = 'public'`;

const tableConstQuery = `
  SELECT tables.schemaname, class.relname AS table_name, 
    pg_get_constraintdef(pg_constraint.oid) AS conname
    FROM pg_class class

    INNER JOIN pg_tables tables on class.relname = tables.tablename
    LEFT JOIN pg_constraint ON class.oid = pg_constraint.conrelid
    WHERE tables.schemaname = 'public'
  ;
`

const columnInfoQuery = `
  SELECT tables.schemaname, 
  class.relname AS table_name,
  attname AS column_name,
  pg_type.typname AS column_type, 
  pg_get_expr(pg_attrdef.adbin, pg_attrdef.adrelid) col_default, --convert from nodeToString rep to SQL expr
  attr.attnotnull AS not_null               

  FROM pg_attribute attr 
  INNER JOIN pg_class class on attr.attrelid = class.oid
  INNER JOIN pg_tables tables on class.relname = tables.tablename
  INNER JOIN pg_type ON attr.atttypid = pg_type.oid
  LEFT JOIN pg_attrdef ON attr.attrelid = pg_attrdef.adrelid AND attr.attnum = pg_attrdef.adnum -- Column default vaules


  WHERE tables.schemaname NOT IN (‘pg_catalog’, ‘information_schema’)
  AND attr.attnum > -1
`

serve(async (req) => {
  const url = new URL(req.url);
  if(url.pathname !== '/db') return new Response("Not Found", { status: 404 });
  // Grab a connection from the database pool
  const connection = await pool.connect();

  try {
    if(req.method === 'GET') {
      const query = tableConstQuery
      const result = await connection.queryObject(query)
        console.log('result?: ', result.rows)
    }
  } catch (error) {
      console.error(error)
  } finally {
    connection.release();
  }
})
