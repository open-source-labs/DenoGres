import { Model } from 'https://raw.githubusercontent.com/oslabs-beta/DenoGres/dev/mod.ts'
// user model definition comes here


export interface Todo {
  description: string
  todo_id: number
}

export class Todo extends Model {
  static table = 'todo';
  static columns = {
    description: {
      type: 'varchar',
    },
    todo_id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
  }
}


export interface Product {
  name: string
  price: number
  product_no: number
  discounted_price: number
}

export class Product extends Model {
  static table = 'products';
  static columns = {
    name: {
      type: 'text',
    },
    price: {
      type: 'numeric',
    },
    product_no: {
      type: 'int4',
    },
    discounted_price: {
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
  name: string
  price: number
  product_no: number
}

export class Products99 extends Model {
  static table = 'products99';
  static columns = {
    name: {
      type: 'text',
    },
    price: {
      type: 'numeric',
    },
    product_no: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
    },
  }
}


export interface Persa {
  current_mood: keyof typeof Mood
  name: string
}

export class Persa extends Model {
  static table = 'person';
  static columns = {
    current_mood: {
      type: 'enum',
    },
    name: {
      type: 'text',
    },
  }
}


export interface Products2 {
  name: string
  price: number
  product_no: number
}

export class Products2 extends Model {
  static table = 'products2';
  static columns = {
    name: {
      type: 'text',
      notNull: true,
    },
    price: {
      type: 'numeric',
      notNull: true,
    },
    product_no: {
      type: 'int4',
      notNull: true,
    },
  }
  static checks: ["(price > (0::numeric))"]
}


export interface OrderItem {
  order_id: number
  quantity: number
  product_no: number
}

export class OrderItem extends Model {
  static table = 'order_items';
  static columns = {
    order_id: {
      type: 'int4',
      notNull: true,
      association: {
        table: 'orders',
        mappedCol: 'order_id',
      }
    },
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
  }
  static primaryKey: ["product_no","order_id"]
}


export interface Products929 {
  product_no: number
  price: number
  discounted_price: number
  name: string
}

export class Products929 extends Model {
  static table = 'products929';
  static columns = {
    product_no: {
      type: 'int4',
    },
    price: {
      type: 'numeric',
    },
    discounted_price: {
      type: 'numeric',
    },
    name: {
      type: 'text',
    },
  }
  static checks: ["(price > discounted_price)","(discounted_price > (0::numeric))","(price > (0::numeric))"]
}


export interface Climber {
  name: string
  current_feeling: keyof typeof Feeling
}

export class Climber extends Model {
  static table = 'climber';
  static columns = {
    name: {
      type: 'text',
    },
    current_feeling: {
      type: 'enum',
    },
  }
}


export interface CharacterTest {
  w: undefined
  id: number
  z: string
  x: string
  y: string
}

export class CharacterTest extends Model {
  static table = 'character_tests';
  static columns = {
    w: {
      type: 'bpchar',
      limit: 1
    },
    id: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    z: {
      type: 'text',
    },
    x: {
      type: 'varchar',
      limit: 10
    },
    y: {
      type: 'varchar',
      limit: 255
    },
  }
}


export interface Products5 {
  price: number
  name: string
  product_no: number
}

export class Products5 extends Model {
  static table = 'products5';
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


export interface Products3 {
  product_no: number
  price: number
  name: string
}

export class Products3 extends Model {
  static table = 'products3';
  static columns = {
    product_no: {
      type: 'int4',
      unique: true,
    },
    price: {
      type: 'numeric',
    },
    name: {
      type: 'text',
    },
  }
}


export interface Example {
  c: number
  a: number
  b: number
}

export class Example extends Model {
  static table = 'example';
  static columns = {
    c: {
      type: 'int4',
    },
    a: {
      type: 'int4',
    },
    b: {
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
  col_1: string
  col_2: string
  col_3: string
}

export class Whatever extends Model {
  static table = 'whatever';
  static columns = {
    col_1: {
      type: 'varchar',
    },
    col_2: {
      type: 'varchar',
    },
    col_3: {
      type: 'varchar',
    },
  }
}


export interface OrderItems5 {
  quantity: number
  order_id: number
  product_no: number
}

export class OrderItems5 extends Model {
  static table = 'order_items5';
  static columns = {
    quantity: {
      type: 'int4',
    },
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
  }
  static primaryKey: ["product_no","order_id"]
}


export interface Products4 {
  name: string
  product_no: number
  price: number
}

export class Products4 extends Model {
  static table = 'products4';
  static columns = {
    name: {
      type: 'text',
    },
    product_no: {
      type: 'int4',
      notNull: true,
      primaryKey: true,
    },
    price: {
      type: 'numeric',
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

