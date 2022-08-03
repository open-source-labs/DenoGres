import { assert, assertEquals, assertStrictEquals, assertThrows, beforeAll, beforeEach, afterEach, afterAll, describe, it } from './deps.ts'
import { Pool, PoolClient } from '../deps.ts'
import { ConnectDb, DisconnectDb } from '../src/functions/Db.ts';
import { Model } from '../src/class/Model.ts'

// test tables (beforeAll)
const before_all = `
DO $$ DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
    EXECUTE 'DROP TABLE ' || quote_ident(r.tablename) || ' CASCADE';
  END LOOP;
END $$;

CREATE TABLE users (
  id uuid DEFAULT uuid_generate_v4 (),
  firstName  VARCHAR (50) NOT NULL,
  lastName  VARCHAR (50),
  points INT,
  PRIMARY KEY (id)  
  );
INSERT INTO users (firstName) VALUES('user_one');
INSERT INTO users (firstName) VALUES('user_two');

`
// drop tables (afterAll)
const after_all = `
--DROP TABLE users;
INSERT INTO users (firstName) VALUES('user_three');
`

interface User {
  id:string;
  firstname:string;
  lastname?:string;
  points?: number;
}
class User extends Model {
  static table = 'users';
  static columns = {
    id: { type:'uuid', primaryKey: true },
    firstName: { type:'string', notNull: true },
    lastName: { type:'string', notNull: false },
    points: { type:'number', notNull: false }
  }
}



describe('New Record Creation and Save Test', () => {

  beforeAll(async () => {
    const db = await ConnectDb(); 
    console.log('reset the DB and creating a new table')
    await db.queryObject(before_all)
    await DisconnectDb(db)
  })

  afterAll(async () => {
    console.log('Deleting the table in DB')
    const db = await ConnectDb(); 
    await db.queryObject(after_all)
    await DisconnectDb(db)
  })

  it('save the record', async () => {
    const user0 = new User();
    user0.firstName = 'Test'
    const saved = await user0.save()
    //assertThrows(async () => await user0.save())
    console.log("saved?:", saved)
    assertStrictEquals(saved!.firstname, user0.firstname)
  })

})


