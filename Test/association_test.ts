import 'https://deno.land/x/dotenv/load.ts';
import {
  afterAll,
  afterEach,
  assert,
  assertEquals,
  assertStrictEquals,
  assertThrows,
  beforeAll,
  beforeEach,
  describe,
  it,
} from '../deps.ts';

import { ConnectDb, DisconnectDb } from '../src/functions/Db.ts';
import { getMappingKeys, manyToMany, Model } from '../src/class/Model.ts';

// test tables (beforeAll)
const before_all = `
DO $$ DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
    EXECUTE 'DROP TABLE ' || quote_ident(r.tablename) || ' CASCADE';
  END LOOP;
END $$;

-- users table
CREATE TABLE users (
  id uuid DEFAULT uuid_generate_v4 (),
  firstName  VARCHAR (50) NOT NULL,
  lastName  VARCHAR (50),
  points INT,
  PRIMARY KEY (id)  
  );
INSERT INTO users (firstName) VALUES('user_one');
INSERT INTO users (firstName) VALUES('user_two');

-- teams table
CREATE TABLE teams (
  id serial,
  teamName  VARCHAR (50) NOT NULL,
  teamRole  VARCHAR (50),
  PRIMARY KEY (id)
  );
  INSERT INTO teams (teamName) VALUES('team A');
  INSERT INTO teams (teamName) VALUES('team B');


  -- clubs table
  CREATE TABLE clubs (
  id serial,
  clubname  VARCHAR (50) NOT NULL,
  description  VARCHAR (50),
  PRIMARY KEY (id)
  );
  INSERT INTO clubs (clubName) VALUES('Book Club');
  INSERT INTO clubs (clubName) VALUES('Tennis Club');
  INSERT INTO clubs (clubName) VALUES('Running Club');
  
  -- members table
  CREATE TABLE members (
  id uuid DEFAULT uuid_generate_v4 (),
  name  VARCHAR (50) NOT NULL,
  points  INT,
  PRIMARY KEY (id)  
  );
  INSERT INTO members (name) VALUES('member_one');
  INSERT INTO members (name) VALUES('member_two');
  INSERT INTO members (name) VALUES('member_three');
  
  -- cross table with members and clubs
  CREATE TABLE IF NOT EXISTS "clubs_members" (
    "member_id" uuid REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "club_id" INT REFERENCES "clubs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("member_id","club_id")
  );
  
  INSERT INTO clubs_members (member_id, club_id) 
  VALUES ((SELECT id FROM members WHERE name='member_one'), (SELECT id FROM clubs WHERE clubname='Book Club'));
  
  INSERT INTO clubs_members (member_id, club_id) 
  VALUES ((SELECT id FROM members WHERE name='member_one'), (SELECT id FROM clubs WHERE clubname='Tennis Club'));
  
  INSERT INTO clubs_members (member_id, club_id) 
  VALUES ((SELECT id FROM members WHERE name='member_two'), (SELECT id FROM clubs WHERE clubname='Tennis Club'));
  
  INSERT INTO clubs_members (member_id, club_id) 
  VALUES ((SELECT id FROM members WHERE name='member_two'), (SELECT id FROM clubs WHERE clubname='Running Club'));
`;
// drop tables (afterAll)
const after_all = `
DROP TABLE users CASCADE;
DROP TABLE teams CASCADE;
DROP TABLE clubs CASCADE; 
DROP TABLE members CASCADE;
DROP TABLE clubs_members CASCADE;
`;

interface User {
  id: string;
  firstname: string;
  lastname?: string;
  points?: number;
}
class User extends Model {
  static table = 'users';
  static columns = {
    id: { type: 'uuid', primaryKey: true },
    firstname: { type: 'string', notNull: true },
    lastname: { type: 'string', notNull: false },
    points: { type: 'number', notNull: false },
  };
}
interface Team {
  id: number;
  teamname: string;
  teamrole?: string;
}
class Team extends Model {
  static table = 'teams';
  static columns = {
    id: { type: 'number', primaryKey: true },
    teamname: { type: 'string', notNull: true },
    teamrole: { type: 'string', notNull: false },
  };
}
interface Member {
  id: string;
  name: string;
  points?: number;
}
class Member extends Model {
  static table = 'members';
  static columns = {
    id: { type: 'uuid', primaryKey: true },
    name: { type: 'string', notNull: true },
    points: { type: 'number', notNull: false },
  };
}

interface Club {
  id: number;
  clubname: string;
  description?: string;
}
class Club extends Model {
  static table = 'clubs';
  static columns = {
    id: { type: 'number', primaryKey: true },
    clubname: { type: 'string', notNull: true },
    description: { type: 'string', notNull: false },
  };
}
interface Clubs_Members {
  member_id: string;
  club_id: number;
}
class Member_Club extends Model {
  static table = 'clubs_members';
  static columns = {
    member_id: { type: 'uuid', primaryKey: true },
    club_id: { type: 'number', primaryKey: true },
  };
}

describe('Testing Associations and Methods ', () => {
  beforeAll(async () => {
    if (Deno.env.get('ENVIRONMENT') !== 'test') {
      throw new Error('Not in test environment');
    }

    console.log('reseting the DB and creating new tables');
    const db = await ConnectDb();
    await db.queryObject(before_all);
    await DisconnectDb(db);
  });

  afterAll(async () => {
    console.log('Deleting the table in DB');
    const db = await ConnectDb();
    await db.queryObject(after_all);
    await DisconnectDb(db);
  });

  it('creates new belongsTo association if doesn\'t exist', async () => {
    const userTeamAssociation = await User.belongsTo(Team);
    await userTeamAssociation.syncAssociation();
    // check to see if the users table has foreign key field referencing teams table
    const mappingKeys = await getMappingKeys(User.table, Team.table);
    //console.log('mappingKeys', mappingKeys)
    assertStrictEquals(mappingKeys!.source_table, User.table);
    assertStrictEquals(
      mappingKeys!.source_keyname,
      `${Team.name.toLowerCase()}_id`,
    );
  });

  it('returns associated data for existing belongsTo association', async () => {
    // fill in some test data in the database
    const db = await ConnectDb();
    let q1 = await db.queryObject(
      `SELECT * FROM users WHERE firstname='user_one';`,
    );
    let q2 = await db.queryObject(
      `SELECT * FROM users WHERE firstname='user_two';`,
    );
    let user1 = Object.assign(new User(), q1.rows[0]);
    let user2 = Object.assign(new User(), q2.rows[0]);
    await db.queryObject(
      `UPDATE users SET team_id=1 WHERE id='${user1.id}'; UPDATE users SET team_id=1 WHERE id='${user2.id}';`,
    );
    q1 = await db.queryObject(
      `SELECT * FROM users WHERE firstname='user_one';`,
    );
    q2 = await db.queryObject(
      `SELECT * FROM users WHERE firstname='user_two';`,
    );

    user1 = Object.assign(new User(), q1.rows[0]);
    user2 = Object.assign(new User(), q2.rows[0]);

    await DisconnectDb(db);

    // test
    const user1Team = await user1.getTeam();
    assertEquals(user1Team[0].teamname, 'team A');
  });

  it('forms hasMany association based on existing belongsTo relationship, then returns associated data', async () => {
    // getting instances for test
    const db = await ConnectDb();
    const t1 = await db.queryObject(
      `SELECT * FROM teams WHERE teamname='team A';`,
    );
    const team1 = Object.assign(new Team(), t1.rows[0]);
    await DisconnectDb(db);

    // actual test
    await Team.hasMany(User);
    const teamA_users = await team1.getUsers();
    //console.log("=========TEAM USERS=========", teamA_users)
    const user1name = teamA_users[0].firstname;
    const user2name = teamA_users[1].firstname;
    assertEquals(user1name, 'user_one');
    assertEquals(user2name, 'user_two');
  });

  it('returns associated data based on existing Many-To-Many association', async () => {
    const db = await ConnectDb();
    const m1 = await db.queryObject(
      `SELECT * FROM members WHERE name='member_one';`,
    );
    const c1 = await db.queryObject(
      `SELECT * FROM clubs WHERE clubname='Tennis Club';`,
    );
    const member1 = Object.assign(new Member(), m1.rows[0]);
    const club1 = Object.assign(new Club(), c1.rows[0]);
    await DisconnectDb(db);

    // actual test
    await manyToMany(Member, Club, { through: Member_Club });
    const member1Clubs = await member1.getClubs();
    const club1Members = await club1.getMembers();
    //console.log("====member1Clubs=====",member1Clubs)
    //console.log("====club1Members=====",club1Members)
    assertEquals(member1Clubs[0].clubname, 'Book Club');
    assertEquals(member1Clubs[1].clubname, 'Tennis Club');
    assert(
      club1Members[0].name === 'member_one' ||
        club1Members[0].name === 'member_two',
    );
  });
});
