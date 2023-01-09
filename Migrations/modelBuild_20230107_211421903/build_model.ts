import { Model } from 'https://deno.land/x/denogres/mod.ts';
// user model definition comes here

export interface SpeciesInFilm {
  _id: number;
  film_id: bigint;
  species_id: bigint;
}

export class SpeciesInFilm extends Model {
  static table = 'species_in_films';
  static columns = {
    _id: {
      type: 'int4',
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    film_id: {
      type: 'int8',
      notNull: true,
      association: {
        name: 'species_in_films_fk0',
        mappedTable: 'films',
        mappedColumn: '_id',
      },
    },
    species_id: {
      type: 'int8',
      notNull: true,
      association: {
        name: 'species_in_films_fk1',
        mappedTable: 'species',
        mappedColumn: '_id',
      },
    },
  };
}

export interface PeopleInFilm {
  film_id: bigint;
  _id: number;
  person_id: bigint;
}

export class PeopleInFilm extends Model {
  static table = 'people_in_films';
  static columns = {
    film_id: {
      type: 'int8',
      notNull: true,
      association: {
        name: 'people_in_films_fk1',
        mappedTable: 'films',
        mappedColumn: '_id',
      },
    },
    _id: {
      type: 'int4',
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    person_id: {
      type: 'int8',
      notNull: true,
      association: {
        name: 'people_in_films_fk0',
        mappedTable: 'people',
        mappedColumn: '_id',
      },
    },
  };
}

export interface Film {
  release_date: undefined;
  opening_crawl: string;
  _id: number;
  episode_id: number;
  director: string;
  title: string;
  producer: string;
}

export class Film extends Model {
  static table = 'films';
  static columns = {
    release_date: {
      type: 'date',
      notNull: true,
    },
    opening_crawl: {
      type: 'varchar',
      notNull: true,
    },
    _id: {
      type: 'int4',
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    episode_id: {
      type: 'int4',
      notNull: true,
    },
    director: {
      type: 'varchar',
      notNull: true,
    },
    title: {
      type: 'varchar',
      notNull: true,
    },
    producer: {
      type: 'varchar',
      notNull: true,
    },
  };
}

export interface VesselsInFilm {
  film_id: bigint;
  vessel_id: bigint;
  _id: number;
}

export class VesselsInFilm extends Model {
  static table = 'vessels_in_films';
  static columns = {
    film_id: {
      type: 'int8',
      notNull: true,
      association: {
        name: 'vessels_in_films_fk1',
        mappedTable: 'films',
        mappedColumn: '_id',
      },
    },
    vessel_id: {
      type: 'int8',
      notNull: true,
      association: {
        name: 'vessels_in_films_fk0',
        mappedTable: 'vessels',
        mappedColumn: '_id',
      },
    },
    _id: {
      type: 'int4',
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
  };
}

export interface PlanetsInFilm {
  film_id: bigint;
  _id: number;
  planet_id: bigint;
}

export class PlanetsInFilm extends Model {
  static table = 'planets_in_films';
  static columns = {
    film_id: {
      type: 'int8',
      notNull: true,
      association: {
        name: 'planets_in_films_fk0',
        mappedTable: 'films',
        mappedColumn: '_id',
      },
    },
    _id: {
      type: 'int4',
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    planet_id: {
      type: 'int8',
      notNull: true,
      association: {
        name: 'planets_in_films_fk1',
        mappedTable: 'planets',
        mappedColumn: '_id',
      },
    },
  };
}

export interface Pilot {
  _id: number;
  vessel_id: bigint;
  person_id: bigint;
}

export class Pilot extends Model {
  static table = 'pilots';
  static columns = {
    _id: {
      type: 'int4',
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    vessel_id: {
      type: 'int8',
      notNull: true,
      association: {
        name: 'pilots_fk1',
        mappedTable: 'vessels',
        mappedColumn: '_id',
      },
    },
    person_id: {
      type: 'int8',
      notNull: true,
      association: {
        name: 'pilots_fk0',
        mappedTable: 'people',
        mappedColumn: '_id',
      },
    },
  };
}

export interface Vessel {
  passengers: number;
  cost_in_credits: bigint;
  length: string;
  vessel_class: string;
  crew: number;
  _id: number;
  model: string;
  max_atmosphering_speed: string;
  manufacturer: string;
  consumables: string;
  vessel_type: string;
  cargo_capacity: string;
  name: string;
}

export class Vessel extends Model {
  static table = 'vessels';
  static columns = {
    passengers: {
      type: 'int4',
      notNull: false,
    },
    cost_in_credits: {
      type: 'int8',
      notNull: false,
    },
    length: {
      type: 'varchar',
      notNull: false,
    },
    vessel_class: {
      type: 'varchar',
      notNull: true,
    },
    crew: {
      type: 'int4',
      notNull: false,
    },
    _id: {
      type: 'int4',
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    model: {
      type: 'varchar',
      notNull: false,
    },
    max_atmosphering_speed: {
      type: 'varchar',
      notNull: false,
    },
    manufacturer: {
      type: 'varchar',
      notNull: false,
    },
    consumables: {
      type: 'varchar',
      notNull: false,
    },
    vessel_type: {
      type: 'varchar',
      notNull: true,
    },
    cargo_capacity: {
      type: 'varchar',
      notNull: false,
    },
    name: {
      type: 'varchar',
      notNull: true,
    },
  };
}

export interface Species {
  name: string;
  homeworld_id: bigint;
  average_height: string;
  eye_colors: string;
  skin_colors: string;
  _id: number;
  hair_colors: string;
  classification: string;
  average_lifespan: string;
  language: string;
}

export class Species extends Model {
  static table = 'species';
  static columns = {
    name: {
      type: 'varchar',
      notNull: true,
    },
    homeworld_id: {
      type: 'int8',
      notNull: false,
      association: {
        name: 'species_fk0',
        mappedTable: 'planets',
        mappedColumn: '_id',
      },
    },
    average_height: {
      type: 'varchar',
      notNull: false,
    },
    eye_colors: {
      type: 'varchar',
      notNull: false,
    },
    skin_colors: {
      type: 'varchar',
      notNull: false,
    },
    _id: {
      type: 'int4',
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    hair_colors: {
      type: 'varchar',
      notNull: false,
    },
    classification: {
      type: 'varchar',
      notNull: false,
    },
    average_lifespan: {
      type: 'varchar',
      notNull: false,
    },
    language: {
      type: 'varchar',
      notNull: false,
    },
  };
}

export interface Person {
  eye_color: string;
  skin_color: string;
  species_id: bigint;
  mass: string;
  name: string;
  _id: number;
  hair_color: string;
  homeworld_id: bigint;
  height: number;
  birth_year: string;
  gender: string;
}

export class Person extends Model {
  static table = 'people';
  static columns = {
    eye_color: {
      type: 'varchar',
      notNull: false,
    },
    skin_color: {
      type: 'varchar',
      notNull: false,
    },
    species_id: {
      type: 'int8',
      notNull: false,
      association: {
        name: 'people_fk0',
        mappedTable: 'species',
        mappedColumn: '_id',
      },
    },
    mass: {
      type: 'varchar',
      notNull: false,
    },
    name: {
      type: 'varchar',
      notNull: true,
    },
    _id: {
      type: 'int4',
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    hair_color: {
      type: 'varchar',
      notNull: false,
    },
    homeworld_id: {
      type: 'int8',
      notNull: false,
      association: {
        name: 'people_fk1',
        mappedTable: 'planets',
        mappedColumn: '_id',
      },
    },
    height: {
      type: 'int4',
      notNull: false,
    },
    birth_year: {
      type: 'varchar',
      notNull: false,
    },
    gender: {
      type: 'varchar',
      notNull: false,
    },
  };
}

export interface StarshipSpec {
  hyperdrive_rating: string;
  vessel_id: bigint;
  _id: number;
  MGLT: string;
}

export class StarshipSpec extends Model {
  static table = 'starship_specs';
  static columns = {
    hyperdrive_rating: {
      type: 'varchar',
      notNull: false,
    },
    vessel_id: {
      type: 'int8',
      notNull: true,
      association: {
        name: 'starship_specs_fk0',
        mappedTable: 'vessels',
        mappedColumn: '_id',
      },
    },
    _id: {
      type: 'int4',
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    MGLT: {
      type: 'varchar',
      notNull: false,
    },
  };
}

export interface Planet {
  orbital_period: number;
  _id: number;
  rotation_period: number;
  surface_water: string;
  name: string;
  diameter: number;
  climate: string;
  terrain: string;
  gravity: string;
  population: bigint;
}

export class Planet extends Model {
  static table = 'planets';
  static columns = {
    orbital_period: {
      type: 'int4',
      notNull: false,
    },
    _id: {
      type: 'int4',
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    rotation_period: {
      type: 'int4',
      notNull: false,
    },
    surface_water: {
      type: 'varchar',
      notNull: false,
    },
    name: {
      type: 'varchar',
      notNull: false,
    },
    diameter: {
      type: 'int4',
      notNull: false,
    },
    climate: {
      type: 'varchar',
      notNull: false,
    },
    terrain: {
      type: 'varchar',
      notNull: false,
    },
    gravity: {
      type: 'varchar',
      notNull: false,
    },
    population: {
      type: 'int8',
      notNull: false,
    },
  };
}

export interface Testtable {
  name: string;
  test_id: number;
}

export class Testtable extends Model {
  static table = 'testtable';
  static columns = {
    name: {
      type: 'varchar',
      notNull: false,
    },
    test_id: {
      type: 'int4',
      notNull: false,
    },
  };
}

export interface Turtle {
  name: string;
  age: number;
}

export class Turtle extends Model {
  static table = 'turtle';
  static columns = {
    name: {
      type: 'varchar',
      notNull: false,
      length: 255,
    },
    age: {
      type: 'int4',
      notNull: false,
    },
  };
}

export interface World {
  rotation_period: number;
  population: bigint;
  _id: number;
  climate: string;
  diameter: number;
  surface_water: string;
  terrain: string;
  orbital_period: number;
  gravity: string;
  name: string;
}

export class World extends Model {
  static table = 'worlds';
  static columns = {
    rotation_period: {
      type: 'int4',
      notNull: false,
    },
    population: {
      type: 'int8',
      notNull: false,
    },
    _id: {
      type: 'int4',
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    climate: {
      type: 'varchar',
      notNull: false,
    },
    diameter: {
      type: 'int4',
      notNull: false,
    },
    surface_water: {
      type: 'varchar',
      notNull: false,
    },
    terrain: {
      type: 'varchar',
      notNull: false,
    },
    orbital_period: {
      type: 'int4',
      notNull: false,
    },
    gravity: {
      type: 'varchar',
      notNull: false,
    },
    name: {
      type: 'varchar',
      notNull: false,
    },
  };
}
