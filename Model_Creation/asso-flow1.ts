import { Model } from '../src/class/Model.ts'

import { ConnectDb, DisconnectDb } from '../src/functions/Db.ts';
//import { BelongsTo } from '../src/class/Association.ts'

// sample test
class User extends Model {
  static table = 'users';
  static columns = {
    id: { type:'uuid', primaryKey: true },
    firstName: { type:'string', notNull: true },
    lastName: { type:'string', notNull: false }
  }
}

interface Profile {
  id:number;
  email:string;
  address?:string;
}
class Profile extends Model {
  static table = 'profiles';
  static columns = {
    id: { type:'number', primaryKey: true, autoIncrement:true },
    email: { type:'string', notNull: true },
    address: { type:'string', notNull: false }
  }
}

// belongsTo test...
const profile_user = Profile.belongsTo(User)
//console.log("Asso-Query:", profile_user.associationQuery)
console.log("Profile Model:", Profile)
//console.log(profile_user.getAccesorName)
//profile_user.syncAssociation() // db sync
const p = new Profile(); // p.getUser()...?
p.email = '111@111.com'
p.user_id = '70b02ed2-c110-40eb-96fe-e0daf8a04132'
p.getUser() // works but with type error

