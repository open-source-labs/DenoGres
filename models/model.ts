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
  discounted_price: number
  name: string
  price: number
  product_no: number
  sale_item: string
}

export class Product extends Model {
  static table: 'products';
  static columns: {
    discounted_price: {
      type: 'numeric',
    },
    name: {
      type: 'text',
    },
    price: {
      type: 'numeric',
    },
    product_no: {
      type: 'int4',
    },
    sale_item: {
      type: 'varchar',
    },
  }
  static checks: ["(price > discounted_price)","(discounted_price > (0::numeric))","(price > (0::numeric))"]
  static unique: [["product_no","name"]]
}


export interface Person {
  current_mood: keyof typeof Mood
  name: string
}

export class Person extends Model {
  static table: 'person';
  static columns: {
    current_mood: {
      type: 'enum',
      enumName: 'mood'
    },
    name: {
      type: 'text',
    },
  }
}


export interface Contact {
  contact_id: number
  contact_name: string
  customer_id: number
  email: string
  password: string
  phone: string
}

export class Contact extends Model {
  static table: 'contacts';
  static columns: {
    contact_id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    contact_name: {
      type: 'varchar',
      notNull: true,
    },
    customer_id: {
      type: 'int4',
      association: {
        table: 'customers',
        mappedCol: 'customer_id',
      }
    },
    email: {
      type: 'varchar',
      notNull: true,
      unique: true,
    },
    password: {
      type: 'varchar',
      notNull: true,
    },
    phone: {
      type: 'varchar',
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

export enum Weather {
sunny,
cloudy,
rainy
}
