import { Model } from "https://deno.land/x/denogres/mod.ts";
// user model definition comes here

export interface SpeciesInFilm {
  _id: number;
  species_id: bigint;
  film_id: bigint;
}

export class SpeciesInFilm extends Model {
  static table = "species_in_films";
  static columns = {
    _id: {
      type: "int4",
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    species_id: {
      type: "int8",
      notNull: true,
      association: {
        name: "species_in_films_fk1",
        mappedTable: "species",
        mappedColumn: "_id",
      },
    },
    film_id: {
      type: "int8",
      notNull: true,
      association: {
        name: "species_in_films_fk0",
        mappedTable: "films",
        mappedColumn: "_id",
      },
    },
  };
}

export interface PeopleInFilm {
  film_id: bigint;
  person_id: bigint;
  _id: number;
}

export class PeopleInFilm extends Model {
  static table = "people_in_films";
  static columns = {
    film_id: {
      type: "int8",
      notNull: true,
      association: {
        name: "people_in_films_fk1",
        mappedTable: "films",
        mappedColumn: "_id",
      },
    },
    person_id: {
      type: "int8",
      notNull: true,
      association: {
        name: "people_in_films_fk0",
        mappedTable: "people",
        mappedColumn: "_id",
      },
    },
    _id: {
      type: "int4",
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
  };
}

export interface Film {
  producer: string;
  opening_crawl: string;
  _id: number;
  episode_id: number;
  release_date: undefined;
  director: string;
  title: string;
}

export class Film extends Model {
  static table = "films";
  static columns = {
    producer: {
      type: "varchar",
      notNull: true,
    },
    opening_crawl: {
      type: "varchar",
      notNull: true,
    },
    _id: {
      type: "int4",
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    episode_id: {
      type: "int4",
      notNull: true,
    },
    release_date: {
      type: "date",
      notNull: true,
    },
    director: {
      type: "varchar",
      notNull: true,
    },
    title: {
      type: "varchar",
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
  static table = "vessels_in_films";
  static columns = {
    film_id: {
      type: "int8",
      notNull: true,
      association: {
        name: "vessels_in_films_fk1",
        mappedTable: "films",
        mappedColumn: "_id",
      },
    },
    vessel_id: {
      type: "int8",
      notNull: true,
      association: {
        name: "vessels_in_films_fk0",
        mappedTable: "vessels",
        mappedColumn: "_id",
      },
    },
    _id: {
      type: "int4",
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
  };
}

export interface PlanetsInFilm {
  planet_id: bigint;
  film_id: bigint;
  _id: number;
}

export class PlanetsInFilm extends Model {
  static table = "planets_in_films";
  static columns = {
    planet_id: {
      type: "int8",
      notNull: true,
      association: {
        name: "planets_in_films_fk1",
        mappedTable: "planets",
        mappedColumn: "_id",
      },
    },
    film_id: {
      type: "int8",
      notNull: true,
      association: {
        name: "planets_in_films_fk0",
        mappedTable: "films",
        mappedColumn: "_id",
      },
    },
    _id: {
      type: "int4",
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
  };
}

export interface Pilot {
  _id: number;
  vessel_id: bigint;
  person_id: bigint;
}

export class Pilot extends Model {
  static table = "pilots";
  static columns = {
    _id: {
      type: "int4",
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    vessel_id: {
      type: "int8",
      notNull: true,
      association: {
        name: "pilots_fk1",
        mappedTable: "vessels",
        mappedColumn: "_id",
      },
    },
    person_id: {
      type: "int8",
      notNull: true,
      association: {
        name: "pilots_fk0",
        mappedTable: "people",
        mappedColumn: "_id",
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
  static table = "vessels";
  static columns = {
    passengers: {
      type: "int4",
      notNull: false,
    },
    cost_in_credits: {
      type: "int8",
      notNull: false,
    },
    length: {
      type: "varchar",
      notNull: false,
    },
    vessel_class: {
      type: "varchar",
      notNull: true,
    },
    crew: {
      type: "int4",
      notNull: false,
    },
    _id: {
      type: "int4",
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    model: {
      type: "varchar",
      notNull: false,
    },
    max_atmosphering_speed: {
      type: "varchar",
      notNull: false,
    },
    manufacturer: {
      type: "varchar",
      notNull: false,
    },
    consumables: {
      type: "varchar",
      notNull: false,
    },
    vessel_type: {
      type: "varchar",
      notNull: true,
    },
    cargo_capacity: {
      type: "varchar",
      notNull: false,
    },
    name: {
      type: "varchar",
      notNull: true,
    },
  };
}

export interface Species {
  average_height: string;
  hair_colors: string;
  name: string;
  language: string;
  skin_colors: string;
  average_lifespan: string;
  classification: string;
  _id: number;
  eye_colors: string;
  homeworld_id: bigint;
}

export class Species extends Model {
  static table = "species";
  static columns = {
    average_height: {
      type: "varchar",
      notNull: false,
    },
    hair_colors: {
      type: "varchar",
      notNull: false,
    },
    name: {
      type: "varchar",
      notNull: true,
    },
    language: {
      type: "varchar",
      notNull: false,
    },
    skin_colors: {
      type: "varchar",
      notNull: false,
    },
    average_lifespan: {
      type: "varchar",
      notNull: false,
    },
    classification: {
      type: "varchar",
      notNull: false,
    },
    _id: {
      type: "int4",
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    eye_colors: {
      type: "varchar",
      notNull: false,
    },
    homeworld_id: {
      type: "int8",
      notNull: false,
      association: {
        name: "species_fk0",
        mappedTable: "planets",
        mappedColumn: "_id",
      },
    },
  };
}

export interface Person {
  mass: string;
  skin_color: string;
  birth_year: string;
  height: number;
  eye_color: string;
  homeworld_id: bigint;
  gender: string;
  _id: number;
  name: string;
  species_id: bigint;
  hair_color: string;
}

export class Person extends Model {
  static table = "people";
  static columns = {
    mass: {
      type: "varchar",
      notNull: false,
    },
    skin_color: {
      type: "varchar",
      notNull: false,
    },
    birth_year: {
      type: "varchar",
      notNull: false,
    },
    height: {
      type: "int4",
      notNull: false,
    },
    eye_color: {
      type: "varchar",
      notNull: false,
    },
    homeworld_id: {
      type: "int8",
      notNull: false,
      association: {
        name: "people_fk1",
        mappedTable: "planets",
        mappedColumn: "_id",
      },
    },
    gender: {
      type: "varchar",
      notNull: false,
    },
    _id: {
      type: "int4",
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: "varchar",
      notNull: true,
    },
    species_id: {
      type: "int8",
      notNull: false,
      association: {
        name: "people_fk0",
        mappedTable: "species",
        mappedColumn: "_id",
      },
    },
    hair_color: {
      type: "varchar",
      notNull: false,
    },
  };
}

export interface StarshipSpec {
  vessel_id: bigint;
  MGLT: string;
  hyperdrive_rating: string;
  _id: number;
}

export class StarshipSpec extends Model {
  static table = "starship_specs";
  static columns = {
    vessel_id: {
      type: "int8",
      notNull: true,
      association: {
        name: "starship_specs_fk0",
        mappedTable: "vessels",
        mappedColumn: "_id",
      },
    },
    MGLT: {
      type: "varchar",
      notNull: false,
    },
    hyperdrive_rating: {
      type: "varchar",
      notNull: false,
    },
    _id: {
      type: "int4",
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
  };
}

export interface Planet {
  terrain: string;
  rotation_period: number;
  surface_water: string;
  population: bigint;
  name: string;
  climate: string;
  _id: number;
  diameter: number;
  gravity: string;
  orbital_period: number;
}

export class Planet extends Model {
  static table = "planets";
  static columns = {
    terrain: {
      type: "varchar",
      notNull: false,
    },
    rotation_period: {
      type: "int4",
      notNull: false,
    },
    surface_water: {
      type: "varchar",
      notNull: false,
    },
    population: {
      type: "int8",
      notNull: false,
    },
    name: {
      type: "varchar",
      notNull: false,
    },
    climate: {
      type: "varchar",
      notNull: false,
    },
    _id: {
      type: "int4",
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    diameter: {
      type: "int4",
      notNull: false,
    },
    gravity: {
      type: "varchar",
      notNull: false,
    },
    orbital_period: {
      type: "int4",
      notNull: false,
    },
  };
}

export interface Testtable {
  test_id: number;
  name: string;
}

export class Testtable extends Model {
  static table = "testtable";
  static columns = {
    test_id: {
      type: "int4",
      notNull: false,
    },
    name: {
      type: "varchar",
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
  static table = "worlds";
  static columns = {
    rotation_period: {
      type: "int4",
      notNull: false,
    },
    population: {
      type: "int8",
      notNull: false,
    },
    _id: {
      type: "int4",
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    climate: {
      type: "varchar",
      notNull: false,
    },
    diameter: {
      type: "int4",
      notNull: false,
    },
    surface_water: {
      type: "varchar",
      notNull: false,
    },
    terrain: {
      type: "varchar",
      notNull: false,
    },
    orbital_period: {
      type: "int4",
      notNull: false,
    },
    gravity: {
      type: "varchar",
      notNull: false,
    },
    name: {
      type: "varchar",
      notNull: false,
    },
  };
}
