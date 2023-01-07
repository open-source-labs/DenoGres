import { Model } from "https://deno.land/x/denogres/mod.ts";
// user model definition comes here

export interface Planet {
  climate: string;
  terrain: string;
  surface_water: string;
  rotation_period: number;
  _id: number;
  orbital_period: number;
  diameter: number;
  name: string;
  population: bigint;
  gravity: string;
}

export class Planet extends Model {
  static table = "planets";
  static columns = {
    climate: {
      type: "varchar",
      notNull: false,
    },
    terrain: {
      type: "varchar",
      notNull: false,
    },
    surface_water: {
      type: "varchar",
      notNull: false,
    },
    rotation_period: {
      type: "int4",
      notNull: false,
    },
    _id: {
      type: "int4",
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    orbital_period: {
      type: "int4",
      notNull: false,
    },
    diameter: {
      type: "int4",
      notNull: false,
    },
    name: {
      type: "varchar",
      notNull: false,
    },
    population: {
      type: "int8",
      notNull: false,
    },
    gravity: {
      type: "varchar",
      notNull: false,
    },
  };
}

export interface PlanetsInFilm {
  film_id: bigint;
  _id: number;
  planet_id: bigint;
}

export class PlanetsInFilm extends Model {
  static table = "planets_in_films";
  static columns = {
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
    planet_id: {
      type: "int8",
      notNull: true,
      association: {
        name: "planets_in_films_fk1",
        mappedTable: "planets",
        mappedColumn: "_id",
      },
    },
  };
}

export interface PeopleInFilm {
  person_id: bigint;
  _id: number;
  film_id: bigint;
}

export class PeopleInFilm extends Model {
  static table = "people_in_films";
  static columns = {
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
    film_id: {
      type: "int8",
      notNull: true,
      association: {
        name: "people_in_films_fk1",
        mappedTable: "films",
        mappedColumn: "_id",
      },
    },
  };
}

export interface Film {
  opening_crawl: string;
  episode_id: number;
  _id: number;
  director: string;
  producer: string;
  title: string;
  release_date: undefined;
}

export class Film extends Model {
  static table = "films";
  static columns = {
    opening_crawl: {
      type: "varchar",
      notNull: true,
    },
    episode_id: {
      type: "int4",
      notNull: true,
    },
    _id: {
      type: "int4",
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    director: {
      type: "varchar",
      notNull: true,
    },
    producer: {
      type: "varchar",
      notNull: true,
    },
    title: {
      type: "varchar",
      notNull: true,
    },
    release_date: {
      type: "date",
      notNull: true,
    },
  };
}

export interface VesselsInFilm {
  _id: number;
  film_id: bigint;
  vessel_id: bigint;
}

export class VesselsInFilm extends Model {
  static table = "vessels_in_films";
  static columns = {
    _id: {
      type: "int4",
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
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
  };
}

export interface Pilot {
  _id: number;
  person_id: bigint;
  vessel_id: bigint;
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
    person_id: {
      type: "int8",
      notNull: true,
      association: {
        name: "pilots_fk0",
        mappedTable: "people",
        mappedColumn: "_id",
      },
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
  };
}

export interface Vessel {
  crew: number;
  manufacturer: string;
  name: string;
  model: string;
  _id: number;
  cargo_capacity: string;
  passengers: number;
  vessel_type: string;
  consumables: string;
  length: string;
  vessel_class: string;
  cost_in_credits: bigint;
  max_atmosphering_speed: string;
}

export class Vessel extends Model {
  static table = "vessels";
  static columns = {
    crew: {
      type: "int4",
      notNull: false,
    },
    manufacturer: {
      type: "varchar",
      notNull: false,
    },
    name: {
      type: "varchar",
      notNull: true,
    },
    model: {
      type: "varchar",
      notNull: false,
    },
    _id: {
      type: "int4",
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    cargo_capacity: {
      type: "varchar",
      notNull: false,
    },
    passengers: {
      type: "int4",
      notNull: false,
    },
    vessel_type: {
      type: "varchar",
      notNull: true,
    },
    consumables: {
      type: "varchar",
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
    cost_in_credits: {
      type: "int8",
      notNull: false,
    },
    max_atmosphering_speed: {
      type: "varchar",
      notNull: false,
    },
  };
}

export interface Species {
  eye_colors: string;
  _id: number;
  average_height: string;
  classification: string;
  skin_colors: string;
  language: string;
  hair_colors: string;
  homeworld_id: bigint;
  name: string;
  average_lifespan: string;
}

export class Species extends Model {
  static table = "species";
  static columns = {
    eye_colors: {
      type: "varchar",
      notNull: false,
    },
    _id: {
      type: "int4",
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    average_height: {
      type: "varchar",
      notNull: false,
    },
    classification: {
      type: "varchar",
      notNull: false,
    },
    skin_colors: {
      type: "varchar",
      notNull: false,
    },
    language: {
      type: "varchar",
      notNull: false,
    },
    hair_colors: {
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
    name: {
      type: "varchar",
      notNull: true,
    },
    average_lifespan: {
      type: "varchar",
      notNull: false,
    },
  };
}

export interface Person {
  eye_color: string;
  skin_color: string;
  gender: string;
  homeworld_id: bigint;
  mass: string;
  birth_year: string;
  species_id: bigint;
  name: string;
  _id: number;
  height: number;
  hair_color: string;
}

export class Person extends Model {
  static table = "people";
  static columns = {
    eye_color: {
      type: "varchar",
      notNull: false,
    },
    skin_color: {
      type: "varchar",
      notNull: false,
    },
    gender: {
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
    mass: {
      type: "varchar",
      notNull: false,
    },
    birth_year: {
      type: "varchar",
      notNull: false,
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
    name: {
      type: "varchar",
      notNull: true,
    },
    _id: {
      type: "int4",
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    height: {
      type: "int4",
      notNull: false,
    },
    hair_color: {
      type: "varchar",
      notNull: false,
    },
  };
}

export interface SpeciesInFilm {
  species_id: bigint;
  _id: number;
  film_id: bigint;
}

export class SpeciesInFilm extends Model {
  static table = "species_in_films";
  static columns = {
    species_id: {
      type: "int8",
      notNull: true,
      association: {
        name: "species_in_films_fk1",
        mappedTable: "species",
        mappedColumn: "_id",
      },
    },
    _id: {
      type: "int4",
      notNull: true,
      autoIncrement: true,
      primaryKey: true,
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

export interface StarshipSpec {
  hyperdrive_rating: string;
  vessel_id: bigint;
  _id: number;
  MGLT: string;
}

export class StarshipSpec extends Model {
  static table = "starship_specs";
  static columns = {
    hyperdrive_rating: {
      type: "varchar",
      notNull: false,
    },
    vessel_id: {
      type: "int8",
      notNull: true,
      association: {
        name: "starship_specs_fk0",
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
    MGLT: {
      type: "varchar",
      notNull: false,
    },
  };
}
