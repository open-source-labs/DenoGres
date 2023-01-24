import {
  afterAll,
  assert,
  assertEquals,
  beforeAll,
  describe,
  it,
  Pool,
  PoolClient,
} from '../deps.ts';
import { dropTablesQuery } from './model_integration_tests/seed_testdb.ts';
import { tableSync } from '../src/functions/sync.ts';
import { enumSync } from '../src/functions/enumSync.ts';
import 'https://deno.land/x/dotenv@v3.2.0/load.ts';

interface ColumnQueryResult {
  column_name: string;
  data_type: string;
  column_default: string | null;
  is_nullable: string;
  character_maximum_length: string | null;
}

describe('sync function and helper functions', () => {
  let pool: Pool;
  let db: PoolClient;

  beforeAll(async () => {
    pool = new Pool(Deno.env.get('TEST_DB_URI'), 1);
    db = await pool.connect();
  });

  afterAll(async () => {
    await Deno.remove('./Test/temp_model.ts');
    await db.queryObject(dropTablesQuery);
    await db.release();
    await pool.end();
  });

  it('the tableSync function adds a new table to the database when added to the model.ts file', async () => {
    const newTable = `
      export interface Planet {
        name: string;
        _id: number;
      }
      
      export class Planet extends Model {
        static table = 'planets';
        static columns = {
          name: {
            type: 'varchar',
            notNull: false,
          },
          _id: {
            type: 'int4',
            notNull: true,
            autoIncrement: true,
            primaryKey: true,
          },
        };
      }
    `;

    // add new table interfaces/models to the model.ts file and sync to db
    await Deno.writeTextFile('./Test/temp_model.ts', newTable);
    await tableSync('./Test/temp_model.ts', true);

    // make sure the table exists in the database
    const addedTable = await db.queryObject(
      `SELECT * FROM pg_tables WHERE tablename = 'planets'`,
    );
    assertEquals(addedTable.rows.length, 1);

    // get db info about the columns on the new table
    const addedColumns = await db.queryObject<ColumnQueryResult>(`
      SELECT 
        column_name, 
        data_type,
        column_default,
        is_nullable,
        character_maximum_length 
      FROM information_schema.columns
      WHERE table_name = 'planets';
    `);

    // the table should have two columns: _id and name
    assertEquals(addedColumns.rows.length, 2);

    const idColumn = addedColumns.rows.find((col) => col.column_name === '_id');
    const nameColumn = addedColumns.rows.find((col) =>
      col.column_name === 'name'
    );

    // the id column should have the expected properties
    assertEquals(idColumn!.data_type, 'integer');
    assertEquals(idColumn!.is_nullable, 'NO');
    assert(idColumn!.column_default!.includes('nextval'));

    // the name column should have the expected properties
    assertEquals(nameColumn!.data_type, 'character varying');
    assertEquals(nameColumn!.is_nullable, 'YES');

    // make sure the table has the desired primary key
    const primaryKey = await db.queryObject<{ column_name: string }>(`
      SELECT column_name
      FROM information_schema.key_column_usage
      WHERE table_name = 'planets';
    `);

    assertEquals(primaryKey.rows[0].column_name, '_id');
  });

  it('the tableSync function drops a table when removed from (or not in) the model.ts file', async () => {
    // manually add a table to the database and sync WITHOUT adding table to the model.ts file
    await db.queryObject(
      'CREATE TABLE people ("_id" serial NOT NULL, "name" varchar NOT NULL)',
    );
    await tableSync('./Test/temp_model.ts', true);

    // the table should no longer exist in the database
    const deletedTable = await db.queryObject(
      `SELECT * FROM pg_tables WHERE tablename = 'people'`,
    );
    assertEquals(deletedTable.rows.length, 0);
  });

  it('the tableSync function adds a column to an existing table when added in the model.ts file', async () => {
    // manually add a table to the database
    await db.queryObject(`
      CREATE TABLE IF NOT EXISTS people (
        "_id" serial NOT NULL,
        "name" varchar NOT NULL,
        CONSTRAINT "people_pk" PRIMARY KEY ("_id")
      ) WITH (
        OIDS=FALSE
      );
    `);

    // add the table model to the model.ts file with added 'birth year' column
    const tableWithNewCol = `
      export class Person extends Model {
        static table = 'people';
        static columns = {
          _id: {
            type: 'int4',
            notNull: true,
            autoIncrement: true,
            primaryKey: true,
          },
          name: {
            type: 'varchar',
            notNull: true,
          },
          birth_year: {
            type: 'varchar',
            notNull: false,
          },
        };
      }
    `;

    await Deno.writeTextFile('./Test/temp_model.ts', tableWithNewCol);
    await tableSync('./Test/temp_model.ts', true);

    const columns = await db.queryArray<[string]>(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'people';`,
    );

    // the new column should be included in the table schema
    assertEquals(columns.rows.length, 3);
    assert(columns.rows.some((row) => row.includes('birth_year')));
  });

  it('the tableSync function removes a column when deleted from (or not in) the model.ts file', async () => {
    // manually add a table to the database
    await db.queryObject(`
      CREATE TABLE IF NOT EXISTS people (
        "_id" serial NOT NULL,
        "name" varchar NOT NULL,
        CONSTRAINT "people_pk" PRIMARY KEY ("_id")
      ) WITH (
        OIDS=FALSE
      );
    `);

    // add the table model to the model.ts file without the 'name' column
    const tableWithoutCol = `
      export class Person extends Model {
        static table = 'people';
        static columns = {
          _id: {
            type: 'int4',
            notNull: true,
            autoIncrement: true,
            primaryKey: true,
          }
        };
      }
    `;

    await Deno.writeTextFile('./Test/temp_model.ts', tableWithoutCol);

    await tableSync('./Test/temp_model.ts', true);
    const columns = await db.queryArray<[string]>(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'people';`,
    );

    // the name column should not longer be in the table schema
    assertEquals(columns.rows.length, 1);
    assert(!columns.rows[0].includes('name'));
  });

  it('the tableSync function updates a column with new constraints if added to the model.ts file', async () => {
    // manually add a table to the database
    await db.queryObject(
      'CREATE TABLE pecies ("_id" serial NOT NULL, "name" varchar NOT NULL) WITH (OIDS=FALSE);',
    );

    const tableWithPKConstraint = `
      export class Species extends Model {
        static table = 'species';
        static columns = {
          _id: {
            type: 'int4',
            notNull: true,
            autoIncrement: true,
            primaryKey: true,
          },
          name: {
            type: 'varchar',
            notNull: true,
          },
        };
      }
    `;

    // add table model with primary key constraint added to it
    await Deno.writeTextFile('./Test/temp_model.ts', tableWithPKConstraint);
    await tableSync('./Test/temp_model.ts', true);

    // make sure the table has the desired primary key
    const primaryKey = await db.queryObject<{ column_name: string }>(`
      SELECT column_name
      FROM information_schema.key_column_usage
      WHERE table_name = 'species';
    `);

    assertEquals(primaryKey.rows[0].column_name, '_id');
  });

  it('the enumSync function adds a new enum to the database when added to the model.ts file', async () => {
    // add a new enum to a temporary model.ts file
    await Deno.writeTextFile(
      './Test/temp_model.ts',
      'export enum Weather {sunny,cloudy,rainy}',
    );

    // attempt to sync new enum to the db
    await enumSync('./Test/temp_model.ts');

    const addedEnum = await db.queryObject(
      `WITH enum_table AS (
        SELECT
          n.nspname AS enum_schema,
          t.typname AS enum_name,
          string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) AS enum_value
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        GROUP BY enum_schema, enum_name
      )
      SELECT * FROM enum_table WHERE enum_name = 'weather';`,
    );

    await db.queryObject('DROP type weather;'); // remove new enum from database

    // make sure the enum in the db matches the one added to the model.ts file
    assertEquals(addedEnum.rows.length, 1);
    assert(typeof addedEnum.rows[0] === 'object' && addedEnum.rows[0] !== null);
    assert(
      'enum_schema' in addedEnum.rows[0] &&
        'enum_name' in addedEnum.rows[0] &&
        'enum_value' in addedEnum.rows[0],
    );
    assertEquals(addedEnum.rows[0].enum_name, 'weather');
    assertEquals(addedEnum.rows[0].enum_value, 'sunny, cloudy, rainy');
  });
});
