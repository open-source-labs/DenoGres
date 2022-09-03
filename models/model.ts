import { Model } from 'https://deno.land/x/denogres/mod.ts'
// user model definition comes here


export interface Species {
  average_height: string
  classification: string
  name: string
  skin_colors: string
  homeworld_id: bigint
  nameid: string
  language: string
  eye_colors: string
  _id: number
  hair_colors: string
  average_lifespan: string
}

export class Species extends Model {
  static table = 'species';
  static columns = {
    average_height: {
      type: 'varchar',
    },
    classification: {
      type: 'varchar',
    },
    name: {
      type: 'varchar',
      notNull: true,
    },
    skin_colors: {
      type: 'varchar',
    },
    homeworld_id: {
      type: 'int8',
    },
    nameid: {
      type: 'varchar',
    },
    language: {
      type: 'varchar',
      notNull: true,
    },
    eye_colors: {
      type: 'varchar',
      notNull: true,
    },
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    hair_colors: {
      type: 'varchar',
    },
    average_lifespan: {
      type: 'varchar',
    },
  }
}


export interface Person {
  name: string
  species_id: bigint
  _id: number
}

export class Person extends Model {
  static table = 'people';
  static columns = {
    name: {
      type: 'varchar',
      notNull: true,
      unique: true,
    },
    species_id: {
      type: 'int8',
      notNull: true,
      association: {
        table: 'species',
        mappedCol: '_id',
      }
    },
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
  }
}


export interface Dog {
  name_three: string
  name_two: string
  name: string
  _id: number
  species_id: bigint
}

export class Dog extends Model {
  static table = 'dog';
  static columns = {
    name_three: {
      type: 'varchar',
      notNull: true,
      unique: true,
      defaultVal: 'hello',
    },
    name_two: {
      type: 'varchar',
      unique: true,
    },
    name: {
      type: 'varchar',
      notNull: true,
      unique: true,
    },
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
      }
    },
    species_id2: {
      type: 'int8',
      notNull: true,
      association: {
        table: 'species',
        mappedCol: '_id',
      }
    },
  }
}

