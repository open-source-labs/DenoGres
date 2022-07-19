class Model{
    static table_name: string;
    static columns: {
        [key: string]: {
            type: string,
            primaryKey?: boolean,
            notNull?: boolean,
            unique?: boolean,
            checks?: string[],
        }
    };
    static checks: string[];
    static unique: string[];
    static primaryKey: string[];

    static where() {
        console.log(`SELECT * FROM ${this.table_name}`)
    }

    save() {
        console.log('added record to db')
    }
}

interface UserModel {
    id: number;
    email: string;
}

class UserModel extends Model{
    static table_name = 'users';
    static columns = {
        id: {
            type: 'number'
        },
        email: {
            type: 'string'
        }
    };
}

UserModel.where();

const newUser = new UserModel();
newUser.email = '123'
newUser.id = 1

newUser.save();

// abstract class AbstractModel {
//     static table_name: string;
//     static columns: Record<string, Record<string, unknown>>;

//     static where() {
//         console.log('ABSTRACT SELECT * FROM')
//     }

//     save() {
//         console.log('added record to db')
//     }
// }

// class UserAb extends AbstractModel {

// }

// UserAb.where();




