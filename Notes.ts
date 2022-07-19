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



MODEL LAYOUT AND INSTANCE CREATION FLOW
(look into making this an abstract class in stretch features (if appropraite))
class Model {
    static table_name: string;
    static columns: Record<string, Record<string, unknown>>;

    // STATIC METHODS: allow for querying

    // NON STATIC METHODS: allow for updates on records of instances (like create/save/delete)
}

// USER Implementation: create interface with the class name of the columns and types 

e.g. for User table
interface User {
    id: number,
    first_name: string
}

// Create a datatypes file for allowable SQL datatypes as constants that the user can leverage


class User extends Model {
    static table_name = 'users';
    static columns = {
    id: {
        type: FIELD_TYPE.number
    },
    first_name: {
        type: FIELD_TYPE.string
    }
   }
}
// filed type definition (file)
export const FIELD_TYPE = {
    number: 'INT',
    string: 'VARCHAR(225)'
    ...
}

CONSTRAINT TYPES
Not null constraint: column can't be NULL (COLUMN CONSTRAINT)
Character Length: how many characters in field (COLUMN CONSTRAINT)
Default Values: what the column should default to (COLUMN CONSTRAINT)

Unique constraint: whether values need to be unique (multiple columns) (BOTH)
Primary Key Constraint: can have more than one (BOTH)
Check constraints: (BOTH)
    - comparison
    - column comparison


Foreign Key Constraint: Moonhee working on implementation

---- STRETCH ----
Exclusion Constraints (Need to implement Indexing): ensure that if any two rows are compared on a specified 
    column or expressions using specified operators at least one returns false or null
    (Adding an exclusion constraint will automatically create an index of the type specified in the constraint declaration)
    
    ex. 
    CREATE TABLE circles (
    c circle,
    EXCLUDE USING gist (c WITH &&)

Indices - implementing and unique index constraint

Null constraint: questionable
);

What is the difference between a table and column constraint? 
*/