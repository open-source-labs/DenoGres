import { Model } from 'https://deno.land/x/denogres/mod.ts'
// user model definition comes here


export interface Species {
  _id: number
  average_lifespan: string
  name: string
  skin_colors: string
  hair_colors: string
  eye_colors: string
  classification: string
  homeworld_id: bigint
  language: string
  average_height: string
}

export class Species extends Model {
  static table = 'species';
  static columns = {
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
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
    hair_colors: {
      type: 'varchar',
    },
    eye_colors: {
      type: 'varchar',
    },
    classification: {
      type: 'varchar',
    },
    average_height: {
      type: 'varchar',
    },
  }
}


export interface Person {
  species_id: bigint
  _id: number
  name: string
}

export class Person extends Model {
  static table = 'people';
  static columns = {
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
    name: {
      type: 'varchar',
      notNull: true,
    },
  }
}

