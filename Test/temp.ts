
import { ConnectDb, DisconnectDb } from '../src/functions/Db.ts';
import { Model, getMappingKeys, getprimaryKey, manyToMany } from '../src/class/Model.ts'



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
    firstname: { type:'string', notNull: true },
    lastname: { type:'string', notNull: false },
    points: { type:'number', notNull: false }
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


interface Member {
  id:string;
  name:string;
  points?: number;
}
class Member extends Model {
  static table = 'members';
  static columns = {
    id: { type:'uuid', primaryKey: true },
    name: { type:'string', notNull: true },
    points: { type:'number', notNull: false }
  }
}

interface Club {
  id:number;
  clubname:string;
  description?:string;
}
class Club extends Model {
  static table = 'clubs';
  static columns = {
    id: { type:'number', primaryKey: true },
    clubname: { type:'string', notNull: true },
    description: { type:'string', notNull: false },
  }
}
interface Clubs_Members {
  member_id: string;
  club_id: number;
}
class Member_Club extends Model {
  static table = 'clubs_members';
  static columns = {
    member_id: { type:'uuid', primaryKey: true },
    club_id: { type:'number', primaryKey: true },
  }
}


//const db = await ConnectDb(); 

//DisconnectDb(db)

const mapp = await getMappingKeys(Member_Club.table, User.table)
console.log(mapp)
/*
{
  source_table: "users_and_clubs",
  source_keyname: "user_id",
  target_table: "users",
  target_keyname: "id"
}
*/


//const pk = await getprimaryKey(Users_Clubs.table)
//console.log(pk) // only user_id printed

// await manyToMany(User, Club, { createThrough: 'Users_Clubs', createXTable: 'users_and_clubs' })
