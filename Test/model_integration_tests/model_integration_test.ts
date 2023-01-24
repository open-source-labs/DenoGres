import {
  afterAll,
  assert,
  assertEquals,
  assertExists,
  assertInstanceOf,
  assertRejects,
  beforeAll,
  describe,
  it,
} from '../../deps.ts';
import { Pool, PoolClient } from '../../deps.ts';
import { createTablesQuery, dropTablesQuery } from './seed_testdb.ts';
import { Person, Planet } from '../sample_model.ts';
import 'https://deno.land/x/dotenv@v3.2.0/load.ts';

describe('model methods', () => {
  let pool: Pool;
  let db: PoolClient;

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
      newPlanet.diameter = 86;
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

  describe('transaction', () => {
    it('it should commit single query to the database upon successful transaction for single table', async () => {
      await Planet.insert('name = turtle').transaction();
      await Planet.endTransaction();
      const planet = await db.queryObject(
        `SELECT name FROM planets WHERE name = 'turtle'`,
      );
      assertEquals(planet.rows, [{ name: 'turtle' }]);
    });
    // double check transaction works with multiple queries
    it('it should commit multiple queries to the database upon successful transaction for a single table', async () => {
      await Planet.insert('name = Alex').transaction();
      await Planet.insert('name = Jacob').transaction();
      await Planet.insert('name = Mia').transaction();
      await Planet.insert('name = Rachel').transaction();
      await Planet.endTransaction();
      const planetAlex = await db.queryObject(
        `SELECT name FROM planets WHERE name = 'Alex'`,
      );
      const planetJacob = await db.queryObject(
        `SELECT name FROM planets WHERE name = 'Jacob'`,
      );
      const planetMia = await db.queryObject(
        `SELECT name FROM planets WHERE name = 'Mia'`,
      );
      const planetRachel = await db.queryObject(
        `SELECT name FROM planets WHERE name = 'Rachel'`,
      );

      assertEquals(planetAlex.rows, [{ name: 'Alex' }]);
      assertEquals(planetJacob.rows, [{ name: 'Jacob' }]);
      assertEquals(planetMia.rows, [{ name: 'Mia' }]);
      assertEquals(planetRachel.rows, [{ name: 'Rachel' }]);
    });

    it('it should commit a single query per table to the database upon successful transaction for two table', async () => {
      await Planet.insert('name = turtle1').transaction();
      await Person.insert('name = turtle1').transaction();
      await Planet.endTransaction();
      const planet = await db.queryObject(
        `SELECT planets.name FROM planets INNER JOIN people ON planets.name = people.name`,
      );
      assertEquals(planet.rows, [{ name: 'turtle1' }]);
    });

    it('it should commit multiple queries to the database upon successful transaction for multiple tables', async () => {
      await Planet.insert('name = Hyperion').transaction();
      await Planet.insert('name = Endymion').transaction();
      await Person.insert('name = Shrike').transaction();
      await Person.insert('name = The Consul').endTransaction();
      const Hyperion = await db.queryObject(
        `SELECT name FROM planets WHERE name = 'Hyperion'`,
      );
      const Endymion = await db.queryObject(
        `SELECT name FROM planets WHERE name = 'Endymion'`,
      );
      const Shrike = await db.queryObject(
        `SELECT name FROM people WHERE name = 'Shrike'`,
      );
      const Consul = await db.queryObject(
        `SELECT name FROM people WHERE name = 'The Consul'`,
      );
      assertEquals(Hyperion.rows, [{ name: 'Hyperion' }]);
      assertEquals(Endymion.rows, [{ name: 'Endymion' }]);
      assertEquals(Shrike.rows, [{ name: 'Shrike' }]);
      assertEquals(Consul.rows, [{ name: 'The Consul' }]);
    });

    it('The transaction should throw an error if a single query in the transaction fails', async () => {
      await assertRejects(async () => {
        await Planet.insert('name = planet1').transaction();
        await Planet.insert('name= planet2').transaction();
        await Person.insert('name = planet3').transaction();
        await Person.insert('name = planet4').endTransaction();
      }, Error);
    });

    it('If a transaction query fails, the transaction should not commit any queries to the database', async () => {
      try {
        await Person.delete().where('name = Yoda').transaction();
        await Person.select().endTransaction();
      } catch (_e) {
        const yoda = await db.queryObject(
          `SELECT name from people WHERE name = 'Yoda'`,
        );
        assertEquals(yoda.rows, [{ name: 'Yoda' }]);
      }
    });

    it('An invalid transaction query should not commit any well-formed queries in the transaction to the database', async () => {
      try {
        await Person.insert('name = Luke').transaction();
        await Person.delete().where('name1 = Han Solo').transaction();
        await Person.delete().where('name = Yoda').transaction();
        await Planet.delete().where('name = Luke Skywalker').endTransaction();
      } catch (_e) {
        const yoda = await db.queryObject(
          `SELECT name from people WHERE name = 'Yoda'`,
        );
        const han = await db.queryObject(
          `SELECT name from people WHERE name = 'Han Solo'`,
        );
        const luke = await db.queryObject(
          `SELECT name from people WHERE name = 'Luke Skywalker'`,
        );
        let lukeInserted;
        try {
          lukeInserted = await db.queryObject(
            `SELECT name from people WHERE name = Luke`,
          );
        } catch (e) {
          console.log('ERROR', e);
          assertEquals(lukeInserted, undefined);
        }
        assertEquals(yoda.rows, [{ name: 'Yoda' }]);
        assertEquals(han.rows, [{ name: 'Han Solo' }]);
        assertEquals(luke.rows, [{ name: 'Luke Skywalker' }]);
      }
    });
  });
  describe('query method', (): void => {
    it('should clear the sql string on the model after a successful query to the db', async (): void => {
      Person['sql'] = 'SELECT * FROM people';
      await Person.query();
      assertEquals(Person['sql'], '');
    });

    it('should clear the sql string on the model after an unsuccessful query to the db', async () => {
      Person['sql'] = 'SELECT namee1 FROM people';
      try {
        await Person.query();
      } catch {
        assertEquals(Person['sql'], '');
      }
    });

    it('should throw an error on a malformed query', async () => {
      Person['sql'] = 'SELECT namee1 FROM people';
      await assertRejects(async () => await Person.query(), Error);
    });

    it('should successfully query the database with a properly formed query string and return result', async () => {
      Person['sql'] = `SELECT name FROM people WHERE name = 'Luke Skywalker'`;
      const luke = await Person.query();
      assertEquals(luke, [{ name: 'Luke Skywalker' }]);
    });
  });

  describe('queryInstance method', () => {
    it('should create a new instance of the model with property value pairs representing the first row returned from the query', async () => {
      Person['sql'] =
        `SELECT name, mass, hair_color FROM people WHERE name = 'Luke Skywalker'`;
      const luke = await Person.queryInstance();
      assert(luke.name = 'Luke Skywalker');
      assert(luke.mass = '77');
      assert(luke.hair_color = 'blond');
      assertInstanceOf(luke, Person);
    });

    it('should throw an error on a malformed query', async () => {
      Person['sql'] =
        `SELECT name, weight, hair_color FROM people WHERE name = 'Luke Skywalker'`;
      await assertRejects(async () => await Person.queryInstance(), Error);
    });

    it('should reset the "sql" property on the model to an empty string', async () => {
      Person['sql'] =
        `SELECT name, mass, hair_color FROM people WHERE name = 'Luke Skywalker'`;
      await Person.queryInstance();
      assertEquals(Person['sql'], '');
    });
  });
});
