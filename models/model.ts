import { Model } from "https://deno.land/x/denogres/mod.ts";
// user model definition comes here

export interface Species {
  average_height: string;
  average_lifespan: string;
  hair_colors: string;
  _id: number;
  eye_colors: string;
  language: string;
  homeworld_id: bigint;
  skin_colors: string;
  name: string;
  classification: string;
}

export class Species extends Model {
  static table = "species";
  static columns = {
    average_height: {
      type: "varchar",
    },
    average_lifespan: {
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
    eye_colors: {
      type: "varchar",
    },
    language: {
      type: "varchar",
    },
    homeworld_id: {
      type: "int8",
    },
    skin_colors: {
      type: "varchar",
    },
    name: {
      type: "varchar",
      notNull: true,
    },
    classification: {
      type: "varchar",
    },
  };
}

export interface Person {
  _id: number;
  name: string;
  species_id: bigint;
}

export class Person extends Model {
  static table = "people";
  static columns = {
    _id: {
      type: "int4",
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
      association: {
        table: "species",
        mappedCol: "_id",
      },
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
  };
}
