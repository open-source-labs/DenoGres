import { Model } from 'https://deno.land/x/denogres/mod.ts'
// user model definition comes here


export interface Species {
  average_height: string
  average_lifespan: string
  hair_colors: string
  skin_colors: string
  eye_colors: string
  _id: number
  name: string
  classification: string
}

export class Species extends Model {
  static table = 'species';
  static columns = {
    average_height: {
      type: 'varchar',
    },
    average_lifespan: {
      type: 'varchar',
    },
    hair_colors: {
      type: 'varchar',
    },
    skin_colors: {
      type: 'varchar',
    },
    eye_colors: {
      type: 'varchar',
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
    classification: {
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


export interface Animal {
  animal: string
  weight: number
  weight_measure: string
  species: string
  country: string
  habitat: string
}

export class Animal extends Model {
  static table = 'animals';
  static columns = {
    animal: {
      type: 'varchar',
      length: 100,
    },
    weight: {
      type: 'int2',
    },
    weight_measure: {
      type: 'varchar',
      length: 100,
    },
    species: {
      type: 'varchar',
      length: 100,
    },
    country: {
      type: 'varchar',
      length: 100,
    },
    habitat: {
      type: 'varchar',
      length: 100,
    }
  }
}

export enum Enum_test {
monday,
tuesday,
wednesday,
thursday,
friday,
}

export enum Genus_name {
aves,
canine,
feline,
insect,
}

