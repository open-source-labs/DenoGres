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