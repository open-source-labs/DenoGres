import {
  afterAll,
  assert,
  assertEquals,
  beforeAll,
  describe,
  it,
} from '../deps.ts';
import { Pool, PoolClient } from '../deps.ts';
import {
  createTablesQuery,
  dropTablesQuery,
} from './model_integration_tests/seed_testdb.ts';
import {
  Person,
  Pilot,
  Planet,
  Species,
  StarshipSpec,
  Vessel,
} from './sample_model.ts';
import { getMappingKeys } from '../src/class/Model.ts';
import 'https://deno.land/x/dotenv@v3.2.0/load.ts';

describe('association methods', () => {
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
  describe('getMappingKeys helper function', () => {
    it('returns the corresponding mapped keys between two tables', async () => {
      const mappedKeys = await getMappingKeys(Person.table, Species.table);
      const expectedKeys = {
        source_table: 'people',
        source_keyname: 'species_id',
        target_table: 'species',
        target_keyname: '_id',
      };
      assertEquals(mappedKeys, expectedKeys);
    });
    it('returns undefined if there is no established relationship between the tables', async () => {
      const mappedKeys = await getMappingKeys(Person.table, Vessel.table);
      assert(mappedKeys === undefined);
    });
  });
  describe('belongsTo method', () => {
    // reset the database to be able to make new associations
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
    it('Adds a getter method with the appropriate name to the existing association', async () => {
      // NOTE: This will also console.log 'No association query exists.'
      // This is from the syncAssociation function in the Association.ts file
      const personSpecies = await Person.belongsTo(Species);
      await personSpecies.syncAssociation();
      const luke = await Person.select()
        .where('name = Luke Skywalker')
        .queryInstance();
      assert(luke.getSpecies);
    });
    it('Adds getter method functionality to retrieve the associated row in the associated table', async () => {
      const luke = await Person.select()
        .where('name = Luke Skywalker')
        .queryInstance();
      const lukeSpecies = await luke.getSpecies();
      // at [0] because lukeSpecies is an array of a single object
      assert(lukeSpecies[0].name === 'Human');
    });
    it('Does not build a query string for existing associations', async () => {
      // NOTE: This will also console.log 'No association query exists.'
      // This is from the syncAssociation function in the Association.ts file
      const personPlanet = await Person.belongsTo(Planet);
      await personPlanet.syncAssociation();
      assert(personPlanet.associationQuery.length === 0);
    });
    it('Creates a new belongsTo association if it does not exist', async () => {
      const vesselPersonAssociation = await Person.belongsTo(Vessel);
      await vesselPersonAssociation.syncAssociation();
      const mappedKeys = await getMappingKeys(Person.table, Vessel.table);
      const expectedKeys = {
        source_table: 'people',
        source_keyname: 'vessel_id',
        target_table: 'vessels',
        target_keyname: '_id',
      };
      assertEquals(mappedKeys, expectedKeys);
    });
  });
  describe('hasOne method', () => {
    // reset the database to be able to make new associations
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

    it('Adds getter method with the appropriate name on a new association', async () => {
      const vesselSpecs = await Vessel.hasOne(StarshipSpec);
      await vesselSpecs.syncAssociation();
      const millenniumFalcon = await Vessel.select()
        .where('name = Millennium Falcon')
        .queryInstance();
      assert(millenniumFalcon.getStarshipSpec);
    });
    it('Adds getter functionality to retrieve the associated row', async () => {
      const millenniumFalcon = await Vessel.select()
        .where('name = Millennium Falcon')
        .queryInstance();
      const millenniumSpecs = await millenniumFalcon.getStarshipSpec();
      const expectedSpecs = {
        _id: 4,
        hyperdrive_rating: '0.5',
        MGLT: '75',
        vessel_id: 10n,
      };
      assertEquals(millenniumSpecs[0], expectedSpecs);
    });
  });
});

// Future Methods to test

// hasMany

// getprimaryKey

// manyToMany
