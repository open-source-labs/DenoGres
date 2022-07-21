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
console.log(profile_user)
//console.log(profile_user.getAccesorName)
//profile_user.syncAssociation() // db sync
const p = new Profile(); // p.getUser()...?
//p.getUser() // works but with type error