import {
  afterAll,
  assert,
  assertEquals,
  assertExists,
  beforeAll,
  describe,
  it,
} from '../../deps.ts';
import { Pool, PoolClient } from '../../deps.ts';
import { createTablesQuery, dropTablesQuery } from './seed_testdb.ts';
import { Planet } from '../sample_model.ts';
import 'https://deno.land/x/dotenv@v3.2.0/load.ts';

describe('model methods', () => {
  let db: PoolClient;

  beforeAll(async () => {
    const pool = new Pool(Deno.env.get('TEST_DB_URI'), 1, true);
    try {
      db = await pool.connect();
      await db.queryObject(createTablesQuery);
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

  describe('save method', () => {
    it('adds a new row to the user\'s database when invoked on a new instance with valid properties', async () => {
      // create a new instance, add properties to it, and invoke save method on it
      const newPlanet = new Planet();
      newPlanet.name = 'Mars';
      newPlanet.climate = 'temperate';
      await newPlanet.save();

      // query the database for the newly added row
      const { rows } = await db.queryObject(
        `SELECT * FROM planets WHERE name = 'Mars'`,
      );

      // the query should return a single row
      assertExists(rows);
      assert(rows.length === 1);

      // the row should contain the added properties
      const addedPlanet = rows[0] as Planet;
      assertEquals(addedPlanet.name, newPlanet.name);
      assertEquals(addedPlanet.climate, newPlanet.climate);

      // the new planet instance should have the added row stored at its "record" property
      assertEquals(addedPlanet, newPlanet['record']);
    });
  });

  describe('update method', () => {
    it('updates a row represented by an instance previously saved to the database ', async () => {
      // create a new instance, add properties to it, and invoke save method on it
      const newPlanet = new Planet();
      newPlanet.name = 'Mercury';
      newPlanet.diameter = 86, 881;
      await newPlanet.save();

      // change or add properties on the instance and invoke the update method on it
      newPlanet.name = 'Jupiter';
      newPlanet.terrain = 'gas giant';
      await newPlanet.update();

      // query the database for the updated row
      const { rows } = await db.queryObject(
        `SELECT * FROM planets WHERE name = 'Jupiter'`,
      );

      // the query should return a single row
      assertExists(rows);
      assert(rows.length === 1);

      // the row should contain the updated and unchanged properties
      const updatedPlanet = rows[0] as Planet;
      assertEquals(updatedPlanet.name, newPlanet.name);
      assertEquals(updatedPlanet.terrain, newPlanet.terrain);
      assertEquals(updatedPlanet.diameter, newPlanet.diameter);

      // the new planet instance should have the added row stored at its "record" property
      assertEquals(updatedPlanet, newPlanet['record']);

      // there should no longer be a row with the old, un-updated properties
      const oldVersion = await db.queryObject(
        `SELECT * FROM planets WHERE name = 'Mercury'`,
      );
      assert(oldVersion.rows.length === 0);
    });
  });
});
