import { Model } from 'https://raw.githubusercontent.com/oslabs-beta/DenoGres/dev/mod.ts'
// user model definition comes here


export interface Todo {
  todo_id: number
  description: string
}

export class Todo extends Model {
  static table = 'todo';
  static columns = {
    todo_id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: 'varchar',
      length: 200
    },
  }
}


export interface Product {
  discounted_price: number
  product_no: number
  name: string
  price: number
}

export class Product extends Model {
  static table = 'products';
  static columns = {
    discounted_price: {
      type: 'numeric',
    },
    product_no: {
      type: 'int4',
    },
    name: {
      type: 'text',
    },
    price: {
      type: 'numeric',
    },
  }
  static checks: ["(price > discounted_price)","(price > discounted_price)","(discounted_price > (0::numeric))","(price > (0::numeric))"]
}


export interface Order {
  order_id: number
  shipping_address: string
}

export class Order extends Model {
  static table = 'orders';
  static columns = {
    order_id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
    },
    shipping_address: {
      type: 'text',
    },
  }
}


export interface Products99 {
  price: number
  name: string
  product_no: number
}

export class Products99 extends Model {
  static table = 'products99';
  static columns = {
    price: {
      type: 'numeric',
    },
    name: {
      type: 'text',
    },
    product_no: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
    },
  }
}


export interface Persa {
  name: string
  current_mood: keyof typeof Mood
}

export class Persa extends Model {
  static table = 'person';
  static columns = {
    name: {
      type: 'text',
    },
    current_mood: {
      type: 'enum',
    },
  }
}


export interface Products2 {
  product_no: number
  price: number
  name: string
}

export class Products2 extends Model {
  static table = 'products2';
  static columns = {
    product_no: {
      type: 'int4',
      notNull: true,
    },
    price: {
      type: 'numeric',
      notNull: true,
    },
    name: {
      type: 'text',
      notNull: true,
    },
  }
  static checks: ["(price > (0::numeric))"]
}


export interface OrderItem {
  quantity: number
  product_no: number
  order_id: number
}

export class OrderItem extends Model {
  static table = 'order_items';
  static columns = {
    quantity: {
      type: 'int4',
    },
    product_no: {
      type: 'int4',
      notNull: true,
      association: {
        table: 'products4',
        mappedCol: 'product_no',
      }
    },
    order_id: {
      type: 'int4',
      notNull: true,
      association: {
        table: 'orders',
        mappedCol: 'order_id',
      }
    },
  }
  static primaryKey: ["product_no","order_id"]
}


export interface Products929 {
  product_no: number
  name: string
  price: number
  discounted_price: number
}

export class Products929 extends Model {
  static table = 'products929';
  static columns = {
    product_no: {
      type: 'int4',
    },
    name: {
      type: 'text',
    },
    price: {
      type: 'numeric',
    },
    discounted_price: {
      type: 'numeric',
    },
  }
  static checks: ["(price > discounted_price)","(discounted_price > (0::numeric))","(price > (0::numeric))"]
}


export interface Climber {
  current_feeling: keyof typeof Feeling
  name: string
}

export class Climber extends Model {
  static table = 'climber';
  static columns = {
    current_feeling: {
      type: 'enum',
    },
    name: {
      type: 'text',
    },
  }
}


export interface CharacterTest {
  z: string
  id: number
  y: string
  w: undefined
  x: string
}

export class CharacterTest extends Model {
  static table = 'character_tests';
  static columns = {
    z: {
      type: 'text',
    },
    id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    y: {
      type: 'varchar',
      length: 255
    },
    w: {
      type: 'bpchar',
      length: 1
    },
    x: {
      type: 'varchar',
      length: 10
    },
  }
}


export interface Products5 {
  price: number
  product_no: number
  name: string
}

export class Products5 extends Model {
  static table = 'products5';
  static columns = {
    price: {
      type: 'numeric',
    },
    product_no: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
    },
    name: {
      type: 'text',
    },
  }
}


export interface Products3 {
  price: number
  product_no: number
  name: string
}

export class Products3 extends Model {
  static table = 'products3';
  static columns = {
    price: {
      type: 'numeric',
    },
    product_no: {
      type: 'int4',
      unique: true,
    },
    name: {
      type: 'text',
    },
  }
}


export interface Example {
  c: number
  b: number
  a: number
}

export class Example extends Model {
  static table = 'example';
  static columns = {
    c: {
      type: 'int4',
    },
    b: {
      type: 'int4',
    },
    a: {
      type: 'int4',
    },
  }
  static unique: ["a","c"]
}


export interface Orders5 {
  order_id: number
  shipping_address: string
}

export class Orders5 extends Model {
  static table = 'orders5';
  static columns = {
    order_id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
    },
    shipping_address: {
      type: 'text',
    },
  }
}


export interface Whatever {
  col_2: string
  col_1: string
  col_3: string
}

export class Whatever extends Model {
  static table = 'whatever';
  static columns = {
    col_2: {
      type: 'varchar',
      length: 4096
    },
    col_1: {
      type: 'varchar',
      length: 255
    },
    col_3: {
      type: 'varchar',
    },
  }
}


export interface OrderItems5 {
  order_id: number
  product_no: number
  quantity: number
}

export class OrderItems5 extends Model {
  static table = 'order_items5';
  static columns = {
    order_id: {
      type: 'int4',
      notNull: true,
      association: {
        table: 'orders5',
        mappedCol: 'order_id',
      }
    },
    product_no: {
      type: 'int4',
      notNull: true,
      association: {
        table: 'products5',
        mappedCol: 'product_no',
      }
    },
    quantity: {
      type: 'int4',
    },
  }
  static primaryKey: ["product_no","order_id"]
}


export interface Products4 {
  product_no: number
  price: number
  name: string
}

export class Products4 extends Model {
  static table = 'products4';
  static columns = {
    product_no: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
    },
    price: {
      type: 'numeric',
    },
    name: {
      type: 'text',
    },
  }
}


export interface Circle {
  c: undefined
}

export class Circle extends Model {
  static table = 'circles';
  static columns = {
    c: {
      type: 'circle',
    },
  }
}

export enum Feeling {
weak,
decent,
strong,
superStrong,
}

export enum Mood {
ok,
happy,
sad,
}

