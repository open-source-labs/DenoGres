import { Model } from './src/class/Model.ts'
// user model definition comes here 
export interface Planet {
  surface_water: string
  population: bigint
  gravity: string
  diameter: number
  orbital_period: number
  rotation_period: number
  name: string
  _id: number
  terrain: string
  climate: string
}

export class Planet extends Model {
  static table_name = 'planets';
  static columns = {
  surface_water: {
    type: 'varchar',
  },
  population: {
    type: 'int8',
  },
  gravity: {
    type: 'varchar',
  },
  diameter: {
    type: 'int4',
  },
  orbital_period: {
    type: 'int4',
  },
  rotation_period: {
    type: 'int4',
  },
  name: {
    type: 'varchar',
  },
  _id: {
    type: 'int4',
    notNull: true
  },
  terrain: {
    type: 'varchar',
  },
  climate: {
    type: 'varchar',
  },
  }
}

export interface SpeciesInFilm {
  species_id: bigint
  _id: number
  film_id: bigint
}

export class SpeciesInFilm extends Model {
  static table_name = 'species_in_films';
  static columns = {
  species_id: {
    type: 'int8',
    notNull: true,
  },
  _id: {
    type: 'int4',
    notNull: true
  },
  film_id: {
    type: 'int8',
    notNull: true,
  },
  }
}

export interface PeopleInFilm {
  film_id: bigint
  person_id: bigint
  _id: number
}

export class PeopleInFilm extends Model {
  static table_name = 'people_in_films';
  static columns = {
  film_id: {
    type: 'int8',
    notNull: true,
  },
  person_id: {
    type: 'int8',
    notNull: true,
  },
  _id: {
    type: 'int4',
    notNull: true
  },
  }
}

export interface Film {
  _id: number
  release_date: undefined
  producer: string
  director: string
  opening_crawl: string
  episode_id: number
  title: string
}

export class Film extends Model {
  static table_name = 'films';
  static columns = {
  _id: {
    type: 'int4',
    notNull: true
  },
  release_date: {
    type: 'date',
    notNull: true,
  },
  producer: {
    type: 'varchar',
    notNull: true,
  },
  director: {
    type: 'varchar',
    notNull: true,
  },
  opening_crawl: {
    type: 'varchar',
    notNull: true,
  },
  episode_id: {
    type: 'int4',
    notNull: true,
  },
  title: {
    type: 'varchar',
    notNull: true,
  },
  }
}

export interface VesselsInFilm {
  film_id: bigint
  _id: number
  vessel_id: bigint
}

export class VesselsInFilm extends Model {
  static table_name = 'vessels_in_films';
  static columns = {
  film_id: {
    type: 'int8',
    notNull: true,
  },
  _id: {
    type: 'int4',
    notNull: true
  },
  vessel_id: {
    type: 'int8',
    notNull: true,
  },
  }
}

export interface PlanetsInFilm {
  _id: number
  planet_id: bigint
  film_id: bigint
}

export class PlanetsInFilm extends Model {
  static table_name = 'planets_in_films';
  static columns = {
  _id: {
    type: 'int4',
    notNull: true
  },
  planet_id: {
    type: 'int8',
    notNull: true,
  },
  film_id: {
    type: 'int8',
    notNull: true,
  },
  }
}

export interface Pilot {
  vessel_id: bigint
  person_id: bigint
  _id: number
}

export class Pilot extends Model {
  static table_name = 'pilots';
  static columns = {
  vessel_id: {
    type: 'int8',
    notNull: true,
  },
  person_id: {
    type: 'int8',
    notNull: true,
  },
  _id: {
    type: 'int4',
    notNull: true
  },
  }
}

export interface Vessel {
  name: string
  vessel_class: string
  vessel_type: string
  model: string
  manufacturer: string
  _id: number
  passengers: number
  cargo_capacity: string
  consumables: string
  cost_in_credits: bigint
  length: string
  max_atmosphering_speed: string
  crew: number
}

export class Vessel extends Model {
  static table_name = 'vessels';
  static columns = {
  name: {
    type: 'varchar',
    notNull: true,
  },
  vessel_class: {
    type: 'varchar',
    notNull: true,
  },
  vessel_type: {
    type: 'varchar',
    notNull: true,
  },
  model: {
    type: 'varchar',
  },
  manufacturer: {
    type: 'varchar',
  },
  _id: {
    type: 'int4',
    notNull: true
  },
  passengers: {
    type: 'int4',
  },
  cargo_capacity: {
    type: 'varchar',
  },
  consumables: {
    type: 'varchar',
  },
  cost_in_credits: {
    type: 'int8',
  },
  length: {
    type: 'varchar',
  },
  max_atmosphering_speed: {
    type: 'varchar',
  },
  crew: {
    type: 'int4',
  },
  }
}

export interface Species {
  language: string
  _id: number
  name: string
  classification: string
  average_height: string
  average_lifespan: string
  hair_colors: string
  skin_colors: string
  eye_colors: string
  homeworld_id: bigint
}

export class Species extends Model {
  static table_name = 'species';
  static columns = {
  language: {
    type: 'varchar',
  },
  _id: {
    type: 'int4',
    notNull: true
  },
  name: {
    type: 'varchar',
    notNull: true,
  },
  classification: {
    type: 'varchar',
  },
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
  homeworld_id: {
    type: 'int8',
  },
  }
}

export interface Person {
  _id: number
  height: number
  homeworld_id: bigint
  species_id: bigint
  gender: string
  birth_year: string
  eye_color: string
  skin_color: string
  hair_color: string
  mass: string
  name: string
}

export class Person extends Model {
  static table_name = 'people';
  static columns = {
  _id: {
    type: 'int4',
    notNull: true
  },
  height: {
    type: 'int4',
  },
  homeworld_id: {
    type: 'int8',
  },
  species_id: {
    type: 'int8',
  },
  gender: {
    type: 'varchar',
  },
  birth_year: {
    type: 'varchar',
  },
  eye_color: {
    type: 'varchar',
  },
  skin_color: {
    type: 'varchar',
  },
  hair_color: {
    type: 'varchar',
  },
  mass: {
    type: 'varchar',
  },
  name: {
    type: 'varchar',
    notNull: true,
  },
  }
}

export interface StarshipSpec {
  MGLT: string
  hyperdrive_rating: string
  _id: number
  vessel_id: bigint
}

export class StarshipSpec extends Model {
  static table_name = 'starship_specs';
  static columns = {
  MGLT: {
    type: 'varchar',
  },
  hyperdrive_rating: {
    type: 'varchar',
  },
  _id: {
    type: 'int4',
    notNull: true
  },
  vessel_id: {
    type: 'int8',
    notNull: true,
  },
  }
}

export interface Test {
  MGLT: string
  hyperdrive_rating: string
  _id: number
  vessel_id: bigint
}

export class Test extends Model {
  static table_name = 'test';
  static columns = {
  MGLT: {
    type: 'varchar',
  },
  hyperdrive_rating: {
    type: 'varchar',
  },
  _id: {
    type: 'int4',
    notNull: true
  },
  vessel_id: {
    type: 'int8',
    notNull: true,
  },
  }
}

export interface Test2 {
  MGLT: string
  hyperdrive_rating: string
  _id: number
  vessel_id: bigint
}

export class Test2 extends Model {
  static table_name = 'test2';
  static columns = {
  MGLT: {
    type: 'varchar',
  },
  hyperdrive_rating: {
    type: 'varchar',
  },
  _id: {
    type: 'int4',
    notNull: true
  },
  vessel_id: {
    type: 'int8',
    notNull: true,
  },
  }
}
