import { Model } from 'https://deno.land/x/denogres/mod.ts'
// user model definition comes here


export interface Planet {
  climate: string
  diameter: number
  orbital_period: number
  rotation_period: number
  _id: number
  population: bigint
  surface_water: string
  terrain: string
  gravity: string
  name: string
}

export class Planet extends Model {
  static table = 'planets';
  static columns = {
    climate: {
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
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    population: {
      type: 'int8',
    },
    surface_water: {
      type: 'varchar',
    },
    terrain: {
      type: 'varchar',
    },
    gravity: {
      type: 'varchar',
    },
    name: {
      type: 'varchar',
    },
  }
}


export interface Species {
  homeworld_id: bigint
  average_lifespan: string
  average_height: string
  classification: string
  name: string
  _id: number
  language: string
  eye_colors: string
  skin_colors: string
  hair_colors: string
}

export class Species extends Model {
  static table = 'species';
  static columns = {
    homeworld_id: {
      type: 'int8',
      association: {
        table: 'planets',
        mappedCol: '_id',
      }
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
  }
}


export interface Vessel {
  cost_in_credits: bigint
  model: string
  manufacturer: string
  name: string
  consumables: string
  _id: number
  crew: number
  passengers: number
  cargo_capacity: string
  max_atmosphering_speed: string
  length: string
  vessel_class: string
  vessel_type: string
}

export class Vessel extends Model {
  static table = 'vessels';
  static columns = {
    cost_in_credits: {
      type: 'int8',
    },
    model: {
      type: 'varchar',
    },
    manufacturer: {
      type: 'varchar',
    },
    name: {
      type: 'varchar',
      notNull: true,
    },
    consumables: {
      type: 'varchar',
    },
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    crew: {
      type: 'int4',
    },
    passengers: {
      type: 'int4',
    },
    cargo_capacity: {
      type: 'varchar',
    },
    max_atmosphering_speed: {
      type: 'varchar',
    },
    length: {
      type: 'varchar',
    },
    vessel_class: {
      type: 'varchar',
      notNull: true,
    },
    vessel_type: {
      type: 'varchar',
      notNull: true,
    },
  }
}


export interface Film {
  opening_crawl: string
  release_date: undefined
  producer: string
  director: string
  episode_id: number
  _id: number
  title: string
}

export class Film extends Model {
  static table = 'films';
  static columns = {
    opening_crawl: {
      type: 'varchar',
      notNull: true,
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
    episode_id: {
      type: 'int4',
      notNull: true,
    },
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: 'varchar',
      notNull: true,
    },
  }
}


export interface Person {
  skin_color: string
  height: number
  _id: number
  gender: string
  mass: string
  species_id: bigint
  homeworld_id: bigint
  eye_color: string
  birth_year: string
  name: string
  hair_color: string
}

export class Person extends Model {
  static table = 'people';
  static columns = {
    skin_color: {
      type: 'varchar',
    },
    height: {
      type: 'int4',
    },
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    gender: {
      type: 'varchar',
    },
    mass: {
      type: 'varchar',
    },
    species_id: {
      type: 'int8',
      association: {
        table: 'species',
        mappedCol: '_id',
      }
    },
    homeworld_id: {
      type: 'int8',
      association: {
        table: 'planets',
        mappedCol: '_id',
      }
    },
    eye_color: {
      type: 'varchar',
    },
    birth_year: {
      type: 'varchar',
    },
    name: {
      type: 'varchar',
      notNull: true,
    },
    hair_color: {
      type: 'varchar',
    },
  }
}


export interface PeopleInFilm {
  _id: number
  film_id: bigint
  person_id: bigint
}

export class PeopleInFilm extends Model {
  static table = 'people_in_films';
  static columns = {
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    film_id: {
      type: 'int8',
      notNull: true,
      association: {
        table: 'films',
        mappedCol: '_id',
      }
    },
    person_id: {
      type: 'int8',
      notNull: true,
      association: {
        table: 'people',
        mappedCol: '_id',
      }
    },
  }
}


export interface SpeciesInFilm {
  film_id: bigint
  _id: number
  species_id: bigint
}

export class SpeciesInFilm extends Model {
  static table = 'species_in_films';
  static columns = {
    film_id: {
      type: 'int8',
      notNull: true,
      association: {
        table: 'films',
        mappedCol: '_id',
      }
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


export interface StarshipSpec {
  hyperdrive_rating: string
  MGLT: string
  _id: number
  vessel_id: bigint
}

export class StarshipSpec extends Model {
  static table = 'starship_specs';
  static columns = {
    hyperdrive_rating: {
      type: 'varchar',
    },
    MGLT: {
      type: 'varchar',
    },
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    vessel_id: {
      type: 'int8',
      notNull: true,
      association: {
        table: 'vessels',
        mappedCol: '_id',
      }
    },
  }
}


export interface PlanetsInFilm {
  _id: number
  planet_id: bigint
  film_id: bigint
}

export class PlanetsInFilm extends Model {
  static table = 'planets_in_films';
  static columns = {
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    planet_id: {
      type: 'int8',
      notNull: true,
      association: {
        table: 'planets',
        mappedCol: '_id',
      }
    },
    film_id: {
      type: 'int8',
      notNull: true,
      association: {
        table: 'films',
        mappedCol: '_id',
      }
    },
  }
}


export interface VesselsInFilm {
  _id: number
  film_id: bigint
  vessel_id: bigint
}

export class VesselsInFilm extends Model {
  static table = 'vessels_in_films';
  static columns = {
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    film_id: {
      type: 'int8',
      notNull: true,
      association: {
        table: 'films',
        mappedCol: '_id',
      }
    },
    vessel_id: {
      type: 'int8',
      notNull: true,
      association: {
        table: 'vessels',
        mappedCol: '_id',
      }
    },
  }
}


export interface Pilot {
  _id: number
  vessel_id: bigint
  person_id: bigint
}

export class Pilot extends Model {
  static table = 'pilots';
  static columns = {
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    vessel_id: {
      type: 'int8',
      notNull: true,
      association: {
        table: 'vessels',
        mappedCol: '_id',
      }
    },
    person_id: {
      type: 'int8',
      notNull: true,
      association: {
        table: 'people',
        mappedCol: '_id',
      }
    },
  }
}

