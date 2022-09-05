<<<<<<< HEAD
    
import { Model } from 'https://deno.land/x/denogres/mod.ts'
// user model definition comes here    
    
=======
import { Model } from 'https://deno.land/x/denogres/mod.ts'
// user model definition comes here


export interface Species {
  homeworld_id: bigint
  _id: number
  language: string
  eye_colors: string
  skin_colors: string
  hair_colors: string
  average_lifespan: string
  average_height: string
  classification: string
  name: string
}

export class Species extends Model {
  static table = 'species';
  static columns = {
    homeworld_id: {
      type: 'int8',
    },
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    language: {
      type: 'varchar',
      notNull: true,
    },
    eye_colors: {
      type: 'varchar',
      notNull: true,
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
    nameID: {
      type: 'varchar',
      notNull: false,
    }
  }
}


export interface Person {
  name: string
  _id: number
  species_id: bigint
}

export class Person extends Model {
  static table = 'people';
  static columns = {
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
  }
}


export interface Dog {
  _id: number
  name: string
  name2: string
  species_id: bigint
}

export class Dog extends Model {
  static table = 'dog';
  static columns = {
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: 'varchar',
      notNull: true,
      unique: true,
      defaultVal: 'Kevin',
    },
    name2: {
      type: 'varchar',
      defaultVal: 'Kevin',
      association: {
        table: 'species',
        mappedCol: 'nameID',
      }
    },
    species_id: {
      type: 'int8',
      notNull: true,
      association: {
        table: 'species',
        mappedCol: '_id',
      }
    },
  }
}

>>>>>>> f4d0bfca1da4e3fd71ae92eb83b35a8a9fe958a6
