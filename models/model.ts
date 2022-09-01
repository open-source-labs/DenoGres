import { Model } from 'https://deno.land/x/denogres/mod.ts'
// user model definition comes here


export interface Species {
  language: string
  eye_colors: string
  skin_colors: string
  hair_colors: string
  average_lifespan: string
  average_height: string
  classification: string
  name: string
  _id: number
  homeworld_id: bigint
}

export class Species extends Model {
  static table = 'species';
  static columns = {
    language: {
      type: 'varchar',
    },
    eye_colors: {
      type: 'varchar',
    },
    skin_colors: {
      type: 'varchar',
    },
    hair_colors: {
      type: 'varchar',
    },
    average_lifespan: {
      type: 'varchar',
    },
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
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    homeworld_id: {
      type: 'int8',
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

