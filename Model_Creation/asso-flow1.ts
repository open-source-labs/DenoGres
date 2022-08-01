import { Model } from '../src/class/Model.ts'
//import { ConnectDb, DisconnectDb } from '../src/functions/Db.ts';
//import { BelongsTo } from '../src/class/Association.ts'

// sample test
interface User {
  id:string;
  firstName:string;
  lastName?:string;
}
class User extends Model {
  static table = 'users';
  static columns = {
    id: { type:'uuid', primaryKey: true },
    firstName: { type:'string', notNull: true },
    lastName: { type:'string', notNull: false },
    //profile_id: { type:'number'}
  }
  //static foreignKey = []
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
    address: { type:'string', notNull: false },
    //user_id: {type:'number'}
  };
  //static foreignKey = []
}

// belongsTo test...

const userProfileAssociation = await Profile.belongsTo(User)

await userProfileAssociation.syncAssociation();


await User.hasOne(Profile)
// console.log(User)
// console.log(Profile)


const user1 = await User.where('firstname = user_one').queryInstance()
console.log("user 1 from db", user1)
const p = new Profile();
p.email = '111@111.com'
p.address = 'abc Main St'
// await user1.addProfile(p) // adding instance, this will save record in profiles table 
// should be able to check "if not exist" though... 
// const user1Profile = await user1.getProfile()
// console.log(user1Profile)

//user1.addProfile({ id:1 }) // for existing profile id

// more flow draft (tbd)
// user0.deleteProfile({ id:1 })
// user0.updateProfile({ id:1 }, { address: 'Main St.' })




