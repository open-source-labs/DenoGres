import { Model } from '../src/model/Model.ts';

class User extends Model {
    static tablename = 'users'
    static fields = {
        _id: {type: 'number', primaryKey: true},
        user_name: 'string'
    }

    _id!: number;
    user_name!: string;
}

const user1 = new User();
user1.user_name = 'one';

console.log(user1)

const user2 = new User()
console.log(user2)

console.log(User.fields)