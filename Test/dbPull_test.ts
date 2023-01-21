import { assertEquals } from '../deps.ts';
import { generateModelFile } from '../src/functions/dbPull.ts';

Deno.test('generateModelFile creates appropriate model.ts file for a given table object', () => {
  const exampleTableListObj = {
    planets: {
      climate: { type: "varchar", notNull: false },
      terrain: { type: "varchar", notNull: false },
      surface_water: { type: "varchar", notNull: false },
      rotation_period: { type: "int4", notNull: false },
      _id: { type: "int4", notNull: true, autoIncrement: true, primaryKey: true },
    }
  };

  const expectedOutput =
`import { Model } from 'https://deno.land/x/denogres/mod.ts'
// user model definition comes here


export interface Planet {
  climate: string
  terrain: string
  surface_water: string
  rotation_period: number
  _id: number
}

export class Planet extends Model {
  static table = 'planets';
  static columns = {
    climate: {
      type: 'varchar',
      notNull: false,
    },
    terrain: {
      type: 'varchar',
      notNull: false,
    },
    surface_water: {
      type: 'varchar',
      notNull: false,
    },
    rotation_period: {
      type: 'int4',
      notNull: false,
    },
    _id: {
      type: 'int4',
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
  }
}

`
  const actualOutput = generateModelFile(exampleTableListObj, {});
  assertEquals(expectedOutput, actualOutput);
});

/**
 * not tested:
 * - that generateModelFile works with a non-empty enum object
 */
