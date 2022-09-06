import { assert } from './deps.ts';
import { dbPull } from '../src/functions/dbPull.ts';

const generatedModel = 
`import { Model } from 'https://deno.land/x/denogresdev/mod.ts'
// user model definition comes here


export interface Customer {
  customer_name: string
  username: string
  customer_id: number
}

export class Customer extends Model {
  static table = 'customers';
  static columns = {
    customer_name: {
      type: 'varchar',
      length: 255,
      notNull: true,
    },
    username: {
      type: 'varchar',
      length: 50,
      notNull: true,
    },
    customer_id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
  }
}


export interface Product {
  sale_item: string
  price: number
  product_no: number
  name: string
  discounted_price: number
}

export class Product extends Model {
  static table = 'products';
  static columns = {
    sale_item: {
      type: 'varchar',
    },
    price: {
      type: 'numeric',
    },
    product_no: {
      type: 'int4',
    },
    name: {
      type: 'text',
    },
    discounted_price: {
      type: 'numeric',
    },
  }
  static checks = ["(price > (0::numeric))","(discounted_price > (0::numeric))","(price > discounted_price)"]
  static unique = [["product_no","name"]]
}


export interface Contact {
  password: string
  contact_name: string
  contact_id: number
  phone: string
  customer_id: number
  email: string
}

export class Contact extends Model {
  static table = 'contacts';
  static columns = {
    password: {
      type: 'varchar',
      length: 30,
      notNull: true,
    },
    contact_name: {
      type: 'varchar',
      length: 255,
      notNull: true,
    },
    contact_id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    phone: {
      type: 'varchar',
      length: 15,
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
      length: 100,
      notNull: true,
      unique: true,
    },
  }
}


export interface Person {
  name: string
  current_mood: keyof typeof Mood
}

export class Person extends Model {
  static table = 'person';
  static columns = {
    name: {
      type: 'text',
    },
    current_mood: {
      type: 'enum',
      enumName: 'mood'
    },
  }
}

export enum Color {
red,
orange,
yellow,
green,
blue,
indigo,
violet,
}

export enum Mood {
sad,
ok,
happy,
}`;

Deno.test('DbPull Model Generation Test', async function() {
    await dbPull();
    const models = Deno.readTextFileSync('./models/model.ts');
    assert(models.includes(generatedModel));
})