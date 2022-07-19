class Model{
    static table_name: string;
    static columns: Record<string, Record<string, unknown>>;

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
        }
    };
}

UserModel.where();

const newUser = new UserModel();
newUser.email = '123'
newUser.id = 1

newUser.save();