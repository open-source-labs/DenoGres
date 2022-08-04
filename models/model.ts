import { Model } from 'https://raw.githubusercontent.com/oslabs-beta/DenoGres/dev/mod.ts'
// user model definition comes here


export interface Customer {
  customer_id: number
  customer_name: string
  username: string
}

export class Customer extends Model {
  static table: 'customers';
  static columns: {
    customer_id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_name: {
      type: 'varchar',
      notNull: true,
    },
    username: {
      type: 'varchar',
      notNull: true,
    },
  }
}


export interface Product {
  product_no: number
  discounted_price: number
  sale_item: string
  price: number
  name: string
}

export class Product extends Model {
  static table: 'products';
  static columns: {
    product_no: {
      type: 'int4',
    },
    discounted_price: {
      type: 'numeric',
    },
    sale_item: {
      type: 'varchar',
    },
    price: {
      type: 'numeric',
    },
    name: {
      type: 'text',
    },
  }
  static checks: ["(price > discounted_price)","(discounted_price > (0::numeric))","(price > (0::numeric))"]
  static unique: [["product_no","name"]]
}


export interface Person {
  name: string
  current_mood: keyof typeof Mood
}

export class Person extends Model {
  static table: 'person';
  static columns: {
    name: {
      type: 'text',
    },
    current_mood: {
      type: 'enum',
      enumName: 'mood'
    },
  }
}


export interface Contact {
  phone: string
  contact_name: string
  password: string
  contact_id: number
  email: string
  customer_id: number
}

export class Contact extends Model {
  static table: 'contacts';
  static columns: {
    phone: {
      type: 'varchar',
    },
    contact_name: {
      type: 'varchar',
      notNull: true,
    },
    password: {
      type: 'varchar',
      notNull: true,
    },
    contact_id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: 'varchar',
      notNull: true,
      unique: true,
    },
    customer_id: {
      type: 'int4',
      association: {
        table: 'customers',
        mappedCol: 'customer_id',
      }
    },
  }
}

export enum Color {
violet,
green,
blue,
indigo,
red,
orange,
yellow,
}

export enum Mood {
ok,
happy,
sad,
}

export interface TestTable {
    _id: number,
    username: string
}
export class TestTable extends Model {
    static table: 'testtable';
    static columns: {
        _id: {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: 'varchar',
            notNull: true,
            unique: true,
            length: 16
        }
    }
}
export interface Invoice {
    invoice_id: number,
    store_id: number,
    customer_id: number
}
export class Invoice extends Model {
    static table: 'invoice';
    static columns: {
        invoice_id: {
            type: 'integer';
            autoIncrement: true,
        },
        store_id: {
            type: 'integer',
            autoIncrement: true
        },
        customer_id: {
            type: 'integer',
            autoIncrement: true
        }
    }
    static primaryKey: ['invoice_id', 'store_id']
}
export interface PayMe {
    invoice_id: number,
    store_id: number,
    customer_id: number
}
export class PayMe extends Model {
    static table: 'PayMe';
    static columns: {
        payment_id: {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true
        },
        invoice_id: {
            type: 'integer',
            autoIncrement: true
        },
        store_id: {
            type: 'integer',
            autoincrement: true
        },
        payment_date: {
            type: 'timestamp',
            defaultVal: 'NOW()'
        },
        payment_amount: {
            type: 'integer',
        }
    }
    static foreignKey: [{columns: ['invoice_id', 'store_id'], mappedColumns: ['invoice_id', 'store_id'], table: 'invoice'}]
}