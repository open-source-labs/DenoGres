import {
  assertAlmostEquals,
  assertEquals,
  assertNotEquals,
  assertStrictEquals,
  assertThrows,
} from 'https://deno.land/std@0.171.0/testing/asserts.ts';
import { Model } from '../src/class/Model.ts';
import { ConnectDb, DisconnectDb } from '../src/functions/Db.ts';
import { sqlDataTypes } from '../src/constants/sqlDataTypes.ts';
// import { resolve } from 'https://deno.land/std@0.141.0/path/mod.ts';

// import { Model } from 'https://deno.land/x/denogresdev/mod.ts'
const sampleModelTS = `
// import { Model } from 'https://deno.land/x/denogres/mod.ts'
import { Model } from "../src/class/Model.ts";
// user model definition comes here

export interface Species {
  average_lifespan: string;
  name: string;
  skin_colors: string;
  eye_colors: string;
  hair_colors: string;
  _id: number;
  homeworld_id: bigint;
  average_height: string;
  language: string;
  classification: string;
}

export class Species extends Model {
  static table = "species";
  static columns = {
    average_lifespan: {
      type: "varchar",
    },
    name: {
      type: "varchar",
      notNull: true,
    },
    skin_colors: {
      type: "varchar",
    },
    eye_colors: {
      type: "varchar",
    },
    hair_colors: {
      type: "varchar",
    },
    _id: {
      type: "int4",
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    homeworld_id: {
      type: "int8",
    },
    average_height: {
      type: "varchar",
    },
    language: {
      type: "varchar",
    },
    classification: {
      type: "varchar",
    },
  };
}

export interface Person {
  _id: number;
  species_id: bigint;
  name: string;
  current_mood: keyof typeof Mood;
}

export class Person extends Model {
  static table = "people";
  static columns = {
    _id: {
      type: "int4",
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    species_id: {
      type: "int8",
      notNull: true,
      association: {
        table: "species",
        mappedCol: "_id",
      },
    },
    name: {
      type: "varchar",
      notNull: true,
    },
    current_mood: {
      type: "enum",
      enumName: "mood",
    },
  };
}

export enum Mood {
  sad,
  ok,
  happy,
}
`;

Deno.test(
  function modelParserSingle() {
    const expectedOutput = {
      species: {
        average_lifespan: {
          type: 'varchar',
        },
        name: {
          type: 'varchar',
          notNull: true,
        },
        skin_colors: {
          type: 'varchar',
        },
        eye_colors: {
          type: 'varchar',
        },
        hair_colors: {
          type: 'varchar',
        },
        _id: {
          type: 'int4',
          notNull: true,
          primaryKey: true,
          autoIncrement: true,
        },
        homeworld_id: {
          type: 'int8',
        },
        average_height: {
          type: 'varchar',
        },
        language: {
          type: 'varchar',
        },
        classification: {
          type: 'varchar',
        },
      },
    };

    // * Code Start
    const output: any = {};

    const whitespaces = /\s/g;

    let data = sampleModelTS.replace(whitespaces, '');

    data = data.replace(/export/g, '\n');

    const classes: any = data.match(/class\w+extendsModel.*\s/g);

    const currentClass: any = classes[0];

    const tableName = currentClass.replace(/.*statictable=\"(\w+)\".*\n/, '$1');
    let tableColumns = currentClass.replace(
      /.*staticcolumns=(\{.*\}\,\}\;).*/,
      '$1',
    );
    tableColumns = tableColumns.replace(/\,\}/g, '}');
    tableColumns = tableColumns.slice(0, tableColumns.length - 2);
    tableColumns = tableColumns.replace(/([\w\_]+)\:/g, '"$1":');

    tableColumns = JSON.parse(tableColumns);
    output[tableName] = tableColumns;

    // console.log(output);
    // console.log(expectedOutput);
    assertEquals(JSON.stringify(output), JSON.stringify(expectedOutput));
  },
);

Deno.test(
  function modelParserMultiple() {
    const expectedOutput = {
      species: {
        average_lifespan: {
          type: 'varchar',
        },
        name: {
          type: 'varchar',
          notNull: true,
        },
        skin_colors: {
          type: 'varchar',
        },
        eye_colors: {
          type: 'varchar',
        },
        hair_colors: {
          type: 'varchar',
        },
        _id: {
          type: 'int4',
          notNull: true,
          primaryKey: true,
          autoIncrement: true,
        },
        homeworld_id: {
          type: 'int8',
        },
        average_height: {
          type: 'varchar',
        },
        language: {
          type: 'varchar',
        },
        classification: {
          type: 'varchar',
        },
      },
      people: {
        _id: {
          type: 'int4',
          notNull: true,
          primaryKey: true,
          autoIncrement: true,
        },
        species_id: {
          type: 'int8',
          notNull: true,
          association: {
            table: 'species',
            mappedCol: '_id',
          },
        },
        name: {
          type: 'varchar',
          notNull: true,
        },
        current_mood: {
          type: 'enum',
          enumName: 'mood',
        },
      },
    };

    const output: any = {};

    const whitespaces = /\s/g;

    let data = sampleModelTS.replace(whitespaces, '');
    data = data.replace(/export/g, '\n');

    const classes: any = data.match(/class\w+extendsModel.*\s/g);

    console.log(classes);

    for (const currentClass of classes) {
      const tableName = currentClass.replace(
        /.*statictable=\"(\w+)\".*\n/,
        '$1',
      );
      let tableColumns = currentClass.replace(
        /.*staticcolumns=(\{.*\}\,\}\;).*/,
        '$1',
      );
      tableColumns = tableColumns.replace(/\,\}/g, '}');
      tableColumns = tableColumns.slice(0, tableColumns.length - 2);
      tableColumns = tableColumns.replace(/([\w\_]+)\:/g, '"$1":');

      tableColumns = JSON.parse(tableColumns);
      output[tableName] = tableColumns;
    }

    console.log(output);
    assertEquals(JSON.stringify(output), JSON.stringify(expectedOutput));
  },
);
