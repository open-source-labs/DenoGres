import { Model, manyToMany } from '../src/class/Model.ts'

// EXISTING Many-To-Many Association Flow

interface Film {
  _id: number
  release_date: undefined
  producer: string
  director: string
  opening_crawl: string
  episode_id: number
  title: string
}

class Film extends Model {
  static table = 'films';
  static columns = {
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
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


interface PeopleInFilm {
  film_id: bigint
  person_id: bigint
  _id: number
}

class PeopleInFilm extends Model {
  static table = 'people_in_films';
  static columns = {
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

interface Person {
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

class Person extends Model {
  static table = 'people';
  static columns = {
    _id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    height: {
      type: 'int4',
    },
    homeworld_id: {
      type: 'int8',
      association: {
        table: 'planets',
        mappedCol: '_id',
      }
    },
    species_id: {
      type: 'int8',
      association: {
        table: 'species',
        mappedCol: '_id',
      }
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


// need to check cross table exist, which is 'people_in_films' table here
// only the user knows such info


// // manyToMany flow
// // for existing one
// manyToMany(Person, Film, { through: PeopleInFilm }) // for existing association
// // for making new association?
// manyToMany(Person, Film, { createThrough: 'ModelName', createXTable: 'tableName' })

await manyToMany(Person, Film, { through: PeopleInFilm })

const luke = await Person.where('name = Luke Skywalker').queryInstance()
// const lukeFilms = await luke.getFilms()
// console.log(lukeFilms)

const newHope = await Film.where('title = A New Hope').queryInstance()
const newHopeCharacters = await newHope.getPersons()
console.log(newHopeCharacters)