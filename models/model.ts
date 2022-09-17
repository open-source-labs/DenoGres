import { Model } from "https://deno.land/x/denogresdev/mod.ts";
// user model definition comes here

export interface Species {
  average_lifespan: string;
  hair_colors: string;
  skin_colors: string;
  _id: number;
  language: string;
  homeworld_id: bigint;
  eye_colors: string;
  name: string;
  classification: string;
  average_height: string;
}

export class Species extends Model {
  static table = "species";
  static columns = {
    average_lifespan: {
      type: "varchar",
    },
    hair_colors: {
      type: "varchar",
    },
    skin_colors: {
      type: "varchar",
    },
    _id: {
      type: "int4",
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    language: {
      type: "varchar",
    },
    homeworld_id: {
      type: "int8",
    },
    eye_colors: {
      type: "varchar",
    },
    name: {
      type: "varchar",
      notNull: true,
    },
    classification: {
      type: "varchar",
    },
    average_height: {
      type: "varchar",
    },
  };
}

export interface Person {
  _id: number;
  name: string;
  species_id: bigint;
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
    name: {
      type: "varchar",
      notNull: true,
    },
    species_id: {
      type: "int8",
      notNull: true,
      association: {
        table: "species",
        mappedCol: "_id",
      },
    },
    current_mood: {
      type: "enum",
      enumName: "mood",
    },
    current_mood2: {
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
