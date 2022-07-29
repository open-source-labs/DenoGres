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
//console.log("Profile Model:", Profile)
userProfileAssociation.syncAssociation();
const p = new Profile();
p.email = '111@111.com'
p.user_id = '70b02ed2-c110-40eb-96fe-e0daf8a04132'

const getuser0 = await p.getUser()
console.log("GET USER!!!",getuser0)

// const user11 = new User();
// user11.id = '70b02ed2-c110-40eb-96fe-e0daf8a04132'
// const ppp = await user11.getProfile();
// console.log(ppp)



//await User.hasOne(Profile)
// console.log(User)
// console.log(Profile)
// const userxx = new User()
// userxx.id = '70b02ed2-c110-40eb-96fe-e0daf8a04132'
// const ppxx = await userxx.getProfile()
// console.log(ppxx)


//// dfraft of CRUD work flow with association :
// const user0 = new User();
// user0.profile_id = '1' // directly. need to save the user instance after this
// user0.addProfile({ profile_id:1 }) // setting with ID
// user0.addProfile(p1) // adding instance, this will save p1 record if not exist

// user0.deleteProfile({ profile_id:1 })
// user0.updateProfile({ profile_id:1, new:2 })
// user0.updateProfile({ profile_id:1 }, { address: 'Main St.' })




// user0.firstName = 'user0-FirstName'
// await user0.where('id', '001').update({ profile_id: 'xx'})
// //User.where('id=1').getProfile();
// User.findInstance('name=user0').getProfile();
// User.findInstance('name=user0').addProfile({ email:'xxx', address:'yyy' }).save()
// User.findInstance('name=user0').update({ profile_id:'1' });
// User.wherexxxx.queryInstance().
// Model method?




