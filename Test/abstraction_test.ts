import { assert, assertEquals, assertStrictEquals, assertThrows, beforeAll, beforeEach, afterEach, afterAll, describe, it } from '../deps.ts'
import { ConnectDb, DisconnectDb } from '../src/functions/Db.ts';
import { Model } from '../src/class/Model.ts'

// test tables (beforeAll) https://dbschema.com/2019/04/14/postgresql-drop-all-tables/
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
  gender VARCHAR(50),
  PRIMARY KEY (id)  
  );
INSERT INTO users (firstName, points, gender) VALUES('user_one', 10, 'F');
INSERT INTO users (firstName, points, gender) VALUES('user_two', 20, 'M');
INSERT INTO users (firstName, points, gender) VALUES('user_three', 30, 'F');
INSERT INTO users (firstName, points, gender) VALUES('user_four', 40, 'M');
INSERT INTO users (firstName, points, gender) VALUES('user_five', 50, 'F');

CREATE TABLE teams (
  id serial,
  teamName  VARCHAR (50) NOT NULL,
  teamRole  VARCHAR (50),
  PRIMARY KEY (id)
  );
  INSERT INTO teams (teamName) VALUES('team A');
  INSERT INTO teams (teamName) VALUES('team B');

ALTER TABLE users ADD team_id INT;
  ALTER TABLE users ADD CONSTRAINT fk_team_id FOREIGN KEY (team_id) REFERENCES teams ON DELETE SET NULL ON UPDATE CASCADE
  ;

INSERT INTO users (firstName, points, team_id, gender) VALUES('user_six', 60, 1, 'F');
INSERT INTO users (firstName, points, team_id, gender) VALUES('user_seven', 70, 2, 'F');
INSERT INTO users (firstName, points, team_id, gender) VALUES('user_eight', 80, 1, 'M');
`
// drop tables (afterAll)
const after_all = `
DROP TABLE users CASCADE;
DROP TABLE teams CASCADE;
`

interface User {
  id:string;
  firstname:string;
  lastname?:string;
  points?: number;
  team_id:number;
}

class User extends Model {
  static table = 'users';
  static columns = {
    id: { type:'uuid', primaryKey: true },
    firstName: { type:'string', notNull: true },
    lastName: { type:'string', notNull: false },
    points: { type:'number', notNull: false },
    team_id: {type:'number', noNull: true}
  }
}
interface Team {
  id:number;
  teamname:string;
  teamrole?:string;
}
class Team extends Model {
  static table = 'teams';
  static columns = {
    id: { type:'number', primaryKey: true },
    teamname: { type:'string', notNull: true },
    teamrole: { type:'string', notNull: false },
  }
}
interface IObj { // work-around
  //firstName: unknown[];
  [key:string]:any
}


describe('Abstraction Test', () => {
  beforeAll(async () => {
    if(Deno.env.get('ENVIRONMENT')!=='test') throw new Error('Not in test environment')
    const db = await ConnectDb(); 
    await db.queryObject(before_all) // executes the query defined above to set up the test db
    await DisconnectDb(db)
  })

  afterAll(async () => {
    const db = await ConnectDb(); 
    await db.queryObject(after_all)
    await DisconnectDb(db)
  })

  // 1. saving 'Test' user
  it('save the record', async () => {
    const user0 = new User();
    user0.firstname = 'Test'
    const saved = await user0.save()
    assertStrictEquals(saved.firstname, user0.firstname)
  })

  // 2. saving a user 'Deno' and updating it to 'Deno updated'
  it('update the record', async () =>{
    let user0 = new User();
    user0.firstname = "Deno"
    const saved = await user0.save()
    assertStrictEquals(saved.firstname, user0.firstname)

    user0.firstname = 'Deno Updated'
    user0.lastname = 'Deno Land'

    const updatedModel = await user0.update()
    assertStrictEquals(updatedModel.firstname, user0.firstname)
    assertStrictEquals(updatedModel.lastname, user0.lastname)

    const db = await ConnectDb(); 
    const q1 = await db.queryObject(`SELECT * FROM users WHERE firstname = '${user0.firstname}'`)
    await DisconnectDb(db)

    const updatedConfrim = Object.assign(new User(), q1.rows[0])
    assertStrictEquals(updatedConfrim.firstname, user0.firstname)
    assertStrictEquals(updatedConfrim.lastname, user0.lastname)
  })

  // 3. inserting a new record 'temp'
  it('insert column/value to the record', async ()=>{
    await User.insert('firstname = temp', 'lastname = temp').query()

    // bring the saved record from db
    const db = await ConnectDb(); 
    const q1 = await db.queryObject(`SELECT * FROM users WHERE firstname = 'temp'`)
    await DisconnectDb(db)

    const inserted = Object.assign(new User(), q1.rows[0])
    assertStrictEquals(inserted.firstname, 'temp')
    assertStrictEquals(inserted.lastname, 'temp')
  })

  // 4. edit 'Test' --> 'Deno Land'
  it('edit the existing record', async () => {
    // edit must be used after where, otherwise it will update whole records in the table
    await User.edit('firstname = Deno', 'lastname = Land').where('firstname = Test').query()

    // bring the editted record from db
    const db = await ConnectDb(); 
    const q1 = await db.queryObject(`SELECT * FROM users WHERE firstname = 'Deno'`)
    await DisconnectDb(db)

    const editted = Object.assign(new User(), q1.rows[0])
    assertStrictEquals(editted.firstname, 'Deno')
    assertStrictEquals(editted.lastname, 'Land')   
  })

  // 5. deleting 'Temp'
  it('delete the record', async () => {
    await User.delete().where('firstname = temp').query()
    await User.delete().where('firstname = Deno').query()
    await User.delete().where('firstname = Deno Updated').query()
    

    // bring the editted record from db
    const db = await ConnectDb(); 
    const q1 = await db.queryObject(`SELECT * FROM users WHERE firstname = 'temp'`)
    await DisconnectDb(db)
    assertEquals(q1.rows[0], undefined)
  })

  // 6. selecting all / and part of existing users 
  it('select the record', async () =>{
    const selected = await User.select('firstname, lastname').query() as IObj
    assertEquals(selected.length, 8)
  })

  // 7. limit
  it('limit outcome of the record', async () => {
    const limit = await User.select('firstname, lastname').limit(3).query()
    assertEquals(limit.length, 3)
  })

  // 8. innerJoin
  it('selects records that have matching values from both tables', async()=>{
    const innerjoin = await User.select('users.*').innerJoin('team_id', 'id', 'teams').where('points = 60').query() as IObj
    assertEquals(innerjoin[0].points, 60);
  })

  // 9. leftJoin
  it('selects records from first table and matching values on second table', async()=>{
    const leftjoin = await User.select('users.*').leftJoin('team_id', 'id', 'teams').where('points = 60').query() as IObj
    assertEquals(leftjoin[0].points, 60);
  })

  // 10. rightJoin
  it('selects records from first table and matching values on second table', async()=>{
    const rightjoin = await User.select('users.*').rightJoin('team_id', 'id', 'teams').where('points = 60').query() as IObj
    assertEquals(rightjoin[0].points, 60);
  })

  // 11. fullJoin = outerJoin
  it('selects all records when a match exists in either table', async()=>{
    const fulljoin = await User.select('users.*').fullJoin('team_id', 'id', 'teams').where('points = 60').query() as IObj
    assertEquals(fulljoin[0].points, 60);
  })
  
  // 12. group is used with aggregation functions
  it('group rows with same values', async() =>{
    const group = await User.select('SUM(points), gender').group('gender').query()
    assertEquals(group[0], { sum: 140n, gender: "M" })
    assertEquals(group[1], { sum: 220n, gender: "F" }) 
  })

  // 13. order
  it('sort column(s) by ascending or descending order', async() =>{
    const order = await User.select('firstname, points').order('DESC', 'points').query() as IObj;
    assertEquals(order[0].points, 80)
    assertEquals(order[1].points, 70)
    assertEquals(order[2].points, 60)
  })

  // 14. count
  it('calculate aggregate functions - COUNT', async() =>{
    const count = await User.count('id').query();
    assertEquals(count[0], { count: 8n }) 
  })

  // 15. sum 
  it('calculate aggregate functions - SUM', async() =>{
    const sum = await User.sum('points').query();
    assertEquals(sum[0], { sum: 360n }) 
  })


  // 16. avg
  it('calculate aggregate functions - AVG', async() =>{
    const avg = await User.avg('points').query() as IObj
    assertEquals(Math.trunc(avg[0].avg), 45) 
  })
  // 17. min
  it('calculate aggregate functions - MIN', async() =>{
    const min = await User.min('points').query() as IObj
    assertEquals(min[0].min, 10) 
  })
  // // 18. max
  it('calculate aggregate functions - MAX', async() =>{
    const max = await User.max('points').query() as IObj
    assertEquals(max[0].max, 80) 
  })


  // *** Methods that cannot have stand-alone test ***
  // 'where', 'having', 'query','queryInstance'

})