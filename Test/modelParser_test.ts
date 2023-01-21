import { parse } from "../src/functions/modelParser.ts";
import { assertEquals } from '../deps.ts';

const sampleModelFile = `
  import { Model } from '../src/class/Model.ts';
  // user model definition comes here

  export interface Planet {
    climate: string;
    terrain: string;
    surface_water: string;
    rotation_period: number;
    _id: number;
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
    };
  }
`

Deno.test('modelParser converts a model.ts file into an object representing the database schema', () => {
  const expectedOutput = {
    planets: {
      climate: { type: "varchar", notNull: false },
      terrain: { type: "varchar", notNull: false },
      surface_water: { type: "varchar", notNull: false },
      rotation_period: { type: "int4", notNull: false },
      _id: { type: "int4", notNull: true, autoIncrement: true, primaryKey: true },
    }
  }

  const actualOutput = parse(sampleModelFile);
  assertEquals(expectedOutput, actualOutput);
});
