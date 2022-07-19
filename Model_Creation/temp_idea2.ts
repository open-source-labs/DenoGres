function TypeModel<Type>() {
    interface TypeM extends 
    const Baz = class Baz {
        constructor() {   
        }
    }
    return Baz
}

class Model<Type>{
    name: string;
    columns: Record<string, Record<string, unknown>>;

    constructor(params: {name: string, 
        columns: Record<string, Record<string, unknown>>},) {

        this.name = params.name;
        this.columns = params.columns;

        Object.assign(this, TypeModel<Type>);
    }
}

interface IUser {
    id: number,
    first_name: string
}

const User = new Model<IUser>({
    name: 'users',
    columns: {
        id: {
            type: 'number',
            primary: true
        }
    }
})

//User.Fields.id = 3;
User.Fields = {id: 1};

// class User extends Model<IUser> {
//     constructor(firstname:string, age:number) {
//       super('User')
//     }

//     id: number,
// }

class ModelNo {
    // all methods
}

class UserNo extends ModelNo {
    static table_name =  'users';
    static columns =  {
        id: {
            type: 'number',
            primary: true
        }
    }

    id!: number;
}

console.log(User)