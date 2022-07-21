import { Model } from '../src/class/Model.ts';

interface User {
    _id: number,
    user_name: string
}

class User extends Model {
    static table = 'users'
    static columns = {
        _id: {type: 'number', primaryKey: true},
        user_name: {type: 'string'}
    }
}

const user1 = new User();
user1.user_name = 'one';
user1.test();

// console.log(user1.save()) // Insert SQL statement
// user1.user_name = 'two'
// console.log(user1.update())