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
import {
  getDbData,
  introspectTables,
  DbData
} from '../src/functions/introspect.ts';
import { createTablesQuery, dropTablesQuery } from './model_integration_tests/seed_testdb.ts';

describe('introspect function and helper functions', () => {
  let pool: Pool;
  let db: PoolClient;
  let dbData: DbData;

  beforeAll(async () => {
    pool = new Pool(Deno.env.get('TEST_DB_URI'), 1);
    db = await pool.connect();
    await db.queryObject(createTablesQuery);
  });

  afterAll(async () => {
    await db.queryObject(dropTablesQuery);
    await db.release();
    await pool.end();
  });

  it('getDbData returns object with lists of tables, columns, constraints, and enums in db', async () => {
    dbData = await getDbData(Deno.env.get('TEST_DB_URI'));
    const { tableList, columnList, constraintList, enumList } = dbData;

    const tableNames = tableList.map(obj => obj.table_name);
    assertEquals(tableNames.length, 11);
    assert(tableNames.includes('species'));

    const columnNames = columnList.map(obj => obj.column_name);
    assertEquals(columnNames.length, 70);
    assert(columnNames.includes('height'));

    const constraintNames = constraintList.map(obj => obj.conname);
    assertEquals(constraintNames.length, 25);
    assert(constraintNames.includes('planets_in_films_pk'));

    assertEquals(enumList.length, 0);
  });

  it('introspectTables returns an object representing the db schema when invoked with lists of tables, columns, and constraints', () => {
    const { tableList, columnList, constraintList } = dbData;
    const tableListObj = introspectTables(tableList, columnList, constraintList);
    
    // each key in the tableListObj should correspond to a table from the tableList
    const tableNames = tableList.map(obj => obj.table_name);
    assertEquals(Object.keys(tableListObj).length, tableNames.length);
    assertEquals(Object.keys(tableListObj), tableNames);

    // each key in the tableListObj should have as its value an object with keys representing that table's columns
    for (const table in tableListObj) {
      const columns = tableListObj[table];
      const actualColumnNames = Object.keys(columns);
      const expectedColumnNames = columnList.filter(col => col.table_name === table).map(col => col.column_name);
      assertEquals(actualColumnNames, expectedColumnNames);

      // each column should have properties "type" and "notNull"
      assert(Object.values(columns).every(col => 'type' in col && 'notNull' in col));

      /**
       * not currently testing these column attributes:
       * - that columns have a max length property when not null
       * - that columns have an autoincrement property (when appropriate)
       * - that columns have a default value (when not null)
       * - constraints (primary and foreign keys)
       * - associations (which should have a name, mappedTable, and mappedColumn)
       */
    }
  });
});

/**
 * not currently testing:
 * - details of the introspectTables function (see above)
 * - the introspectEnums function
 */