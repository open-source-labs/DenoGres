/*
CONNECTION
- Must have connection file with db connection string provided in specified format

INTROSPECTION
- Provided a database in the connection files when the CLI is run, we will introspect the database (run the queries)
create a typescript file which contains Model sub-classes of each of the database tables

INTROSPECT starwars db
- Creates a folder tables
- Create a Table.ts file

export class Film extends Model {
    static tablename = 'films'
    static fields = {
        _id: {type: 'serial', primaryKey: true},
        title: 'varchar',
        episode_id: 'int',
        opening_crawl: 'varchar',
        producer: 'varchar',
        release_date: 'date'
    }

    _id: number,
    title: string,
    episode_id: number,
    opening_crawl: string,
    producer: string,
    release_date: date
}

`export class ${Model_name} extends Model {
    static tablename = ${tablename}
    static fields = {
        ${columnList.forEach(createProperty)}
    }
}`

// USER CAN LEVERAGE INFORMATION AS A RESULT OF THE Model methods (ABSTRACTION)

// INSERT A ROW ON A TABLE
const film = new Film()
film.title = 'example film'
film.opening_crawl = 'lots of words'

film.save(); -> send to database INSERT films(title, opening_crawl) VALUES ('example film', 'lots of words')

Film.where({_id: 4}) -> send to db SELECT * FROM films WHERE _id = 4
*/