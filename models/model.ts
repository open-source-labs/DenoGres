import { Model } from 'https://raw.githubusercontent.com/oslabs-beta/DenoGres/dev/mod.ts'
// user model definition comes here


export interface Planet {
  _id: number
  surface_water: string
  population: bigint
  gravity: string
  diameter: number
  orbital_period: number
  rotation_period: number
  name: string
  climate: string
  terrain: string
}

export class Planet extends Model {
  static table: 'planets';
  static columns: {
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
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
    climate: {
      type: 'varchar',
    },
    terrain: {
      type: 'varchar',
    },
  }
}

export interface Species {
  average_height: string
  classification: string
  name: string
  eye_colors: string
  homeworld_id: bigint
  average_lifespan: string
  hair_colors: string
  language: string
  _id: number
  skin_colors: string
}

export class Species extends Model {
  static table: 'species';
  static columns: {
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
    eye_colors: {
      type: 'varchar',
    },
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
    hair_colors: {
      type: 'varchar',
    },
    language: {
      type: 'varchar',
    },
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    skin_colors: {
      type: 'varchar',
    },
  }
}

export interface Invoice {
  invoice_id: number
  customer_id: number
  store_id: number
}

export class Invoice extends Model {
  static table: 'invoice';
  static columns: {
    invoice_id: {
      type: 'int4',
      notNull: true,
      autoIncrement: true,
    },
    customer_id: {
      type: 'int4',
      notNull: true,
      autoIncrement: true,
    },
    store_id: {
      type: 'int4',
      notNull: true,
      autoIncrement: true,
    },
  }
  static primaryKey: ["invoice_id","store_id"]
}

export interface Person {
  height: number
  name: string
  mass: string
  hair_color: string
  skin_color: string
  eye_color: string
  birth_year: string
  gender: string
  species_id: bigint
  _id: number
  homeworld_id: bigint
}

export class Person extends Model {
  static table: 'people';
  static columns: {
    height: {
      type: 'int4',
    },
    name: {
      type: 'varchar',
      notNull: true,
    },
    mass: {
      type: 'varchar',
    },
    hair_color: {
      type: 'varchar',
    },
    skin_color: {
      type: 'varchar',
    },
    eye_color: {
      type: 'varchar',
    },
    birth_year: {
      type: 'varchar',
    },
    gender: {
      type: 'varchar',
    },
    species_id: {
      type: 'int8',
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
    homeworld_id: {
      type: 'int8',
      association: {
        table: 'planets',
        mappedCol: '_id',
      }
    },
  }
}

export interface Vessel {
  max_atmosphering_speed: string
  vessel_class: string
  name: string
  length: string
  cost_in_credits: bigint
  consumables: string
  cargo_capacity: string
  passengers: number
  _id: number
  manufacturer: string
  model: string
  vessel_type: string
  crew: number
}

export class Vessel extends Model {
  static table: 'vessels';
  static columns: {
    max_atmosphering_speed: {
      type: 'varchar',
    },
    vessel_class: {
      type: 'varchar',
      notNull: true,
    },
    name: {
      type: 'varchar',
      notNull: true,
    },
    length: {
      type: 'varchar',
    },
    cost_in_credits: {
      type: 'int8',
    },
    consumables: {
      type: 'varchar',
    },
    cargo_capacity: {
      type: 'varchar',
    },
    passengers: {
      type: 'int4',
    },
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    manufacturer: {
      type: 'varchar',
    },
    model: {
      type: 'varchar',
    },
    vessel_type: {
      type: 'varchar',
      notNull: true,
    },
    crew: {
      type: 'int4',
    },
  }
}

export interface Products5 {
  price: number
  product_no: number
  name: string
}

export class Products5 extends Model {
  static table: 'products5';
  static columns: {
    price: {
      type: 'numeric',
      unique: true,
    },
    product_no: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
    },
    name: {
      type: 'text',
    },
  }
}

export interface Film {
  _id: number
  title: string
  episode_id: number
  opening_crawl: string
  director: string
  producer: string
  release_date: undefined
}

export class Film extends Model {
  static table: 'films';
  static columns: {
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
    episode_id: {
      type: 'int4',
      notNull: true,
    },
    opening_crawl: {
      type: 'varchar',
      notNull: true,
    },
    director: {
      type: 'varchar',
      notNull: true,
    },
    producer: {
      type: 'varchar',
      notNull: true,
    },
    release_date: {
      type: 'date',
      notNull: true,
    },
  }
}

export interface Test123 {
  price: number
  name: string
  discounted_price: number
  product_no: number
}

export class Test123 extends Model {
  static table: 'test123';
  static columns: {
    price: {
      type: 'numeric',
    },
    name: {
      type: 'text',
    },
    discounted_price: {
      type: 'numeric',
    },
    product_no: {
      type: 'int4',
    },
  }
  static checks: ["(price > (0::numeric))","(discounted_price > (0::numeric))","(price > discounted_price)"]
}

export interface PlanetsInFilm {
  film_id: bigint
  planet_id: bigint
  _id: number
}

export class PlanetsInFilm extends Model {
  static table: 'planets_in_films';
  static columns: {
    film_id: {
      type: 'int8',
      notNull: true,
      association: {
        table: 'films',
        mappedCol: '_id',
      }
    },
    planet_id: {
      type: 'int8',
      notNull: true,
      association: {
        table: 'planets',
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

export interface PeopleInFilm {
  film_id: bigint
  person_id: bigint
  _id: number
}

export class PeopleInFilm extends Model {
  static table: 'people_in_films';
  static columns: {
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
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
  }
}

export interface Test729 {
  price: number
  product_no: number
  name: string
}

export class Test729 extends Model {
  static table: 'test729';
  static columns: {
    price: {
      type: 'numeric',
    },
    product_no: {
      type: 'int4',
      notNull: true,
    },
    name: {
      type: 'text',
    },
  }
}

export interface Test1234 {
  discounted_price: number
  price: number
  product_no: number
  name: string
}

export class Test1234 extends Model {
  static table: 'test1234';
  static columns: {
    discounted_price: {
      type: 'numeric',
    },
    price: {
      type: 'numeric',
      notNull: true,
    },
    product_no: {
      type: 'int4',
      notNull: true,
    },
    name: {
      type: 'text',
    },
  }
  static primaryKey: ["product_no","price"]
}

export interface SpeciesInFilm {
  film_id: bigint
  species_id: bigint
  _id: number
}

export class SpeciesInFilm extends Model {
  static table: 'species_in_films';
  static columns: {
    film_id: {
      type: 'int8',
      notNull: true,
      association: {
        table: 'films',
        mappedCol: '_id',
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
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
  }
}

export interface Pilot {
  vessel_id: bigint
  _id: number
  person_id: bigint
}

export class Pilot extends Model {
  static table: 'pilots';
  static columns: {
    vessel_id: {
      type: 'int8',
      notNull: true,
      association: {
        table: 'vessels',
        mappedCol: '_id',
      }
    },
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
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

export interface Payment {
  store_id: number
  payment_date: string
  invoice_id: number
  payment_id: number
  payment_amount: bigint
}

export class Payment extends Model {
  static table: 'payment';
  static columns: {
    store_id: {
      type: 'int4',
    },
    payment_date: {
      type: 'timestamp',
    },
    invoice_id: {
      type: 'int4',
    },
    payment_id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
    },
    payment_amount: {
      type: 'float8',
    },
  }
  static foreignKey: [
    {columns: ["invoice_id","store_id"], mappedColumns: ["invoice_id","store_id"], table: 'invoice'},
    {columns: ["invoice_id","store_id"], mappedColumns: ["invoice_id","store_id"], table: 'invoice'}]
}

export interface StarshipSpec {
  _id: number
  hyperdrive_rating: string
  vessel_id: bigint
  mglt: string
}

export class StarshipSpec extends Model {
  static table: 'starship_specs';
  static columns: {
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    hyperdrive_rating: {
      type: 'varchar',
    },
    vessel_id: {
      type: 'int8',
      notNull: true,
      association: {
        table: 'vessels',
        mappedCol: '_id',
      }
    },
    mglt: {
      type: 'varchar',
    },
  }
}

export interface VesselsInFilm {
  _id: number
  film_id: bigint
  vessel_id: bigint
}

export class VesselsInFilm extends Model {
  static table: 'vessels_in_films';
  static columns: {
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

export interface Test123567 {
  discounted_price: number
  price: number
  name: string
  product_no: number
}

export class Test123567 extends Model {
  static table: 'test123567';
  static columns: {
    discounted_price: {
      type: 'numeric',
    },
    price: {
      type: 'numeric',
    },
    name: {
      type: 'text',
    },
    product_no: {
      type: 'int4',
    },
  }
  static unique: [["product_no","price"]]
}

export interface OrderItems5 {
  product_no: number
  order_id: number
  quantity: number
}

export class OrderItems5 extends Model {
  static table: 'order_items5';
  static columns: {
    product_no: {
      type: 'int4',
      notNull: true,
    },
    order_id: {
      type: 'int4',
      notNull: true,
      association: {
        table: 'products5',
        mappedCol: 'product_no',
      }
    },
    quantity: {
      type: 'int4',
    },
  }
  static primaryKey: ["product_no","order_id"]
}
