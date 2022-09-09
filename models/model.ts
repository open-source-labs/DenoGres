import { Model } from 'https://deno.land/x/denogresdev/mod.ts'
// user model definition comes here


export interface Species {
  average_lifespan: string
  name: string
  skin_colors: string
  eye_colors: string
  hair_colors: string
  _id: number
  homeworld_id: bigint
  average_height: string
  language: string
  classification: string
}

export class Species extends Model {
  static table = 'species';
  static columns = {
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
  }
}


export interface Person {
  _id: number
  species_id: bigint
  name: string
  current_mood: keyof typeof Mood
}

export class Person extends Model {
  static table = 'people';
  static columns = {
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
    name: {
      type: 'varchar',
      notNull: true,
    },
    current_mood: {
      type: 'enum',
      enumName: 'mood'
    },
  }
}

export enum Mood {
sad,
ok,
happy,
}

