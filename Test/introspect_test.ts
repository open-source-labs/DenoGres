import { assert, assertEquals } from '../deps.ts';
import { introspect } from '../src/functions/introspect.ts';

// All tests to be ran with DenoGres Test DB

Deno.test('Introspection Table Name Test', async function () {
  const [tableListObj] = await introspect();
  assert(Object.keys(tableListObj).includes('customers'));
  assert(Object.keys(tableListObj).includes('person'));
  assert(Object.keys(tableListObj).includes('contacts'));
  assert(Object.keys(tableListObj).includes('products'));
});

Deno.test('Introspection Table Column Name Test', async function () {
  const [tableListObj] = await introspect();
  assert(Object.keys(tableListObj.customers.columns).includes('customer_name'));
  assert(Object.keys(tableListObj.customers.columns).includes('customer_id'));
  assert(Object.keys(tableListObj.customers.columns).includes('username'));
  assert(Object.keys(tableListObj.products.columns).includes('product_no'));
  assert(Object.keys(tableListObj.products.columns).includes('name'));
  assert(Object.keys(tableListObj.products.columns).includes('sale_item'));
  assert(Object.keys(tableListObj.products.columns).includes('price'));
  assert(
    Object.keys(tableListObj.products.columns).includes('discounted_price'),
  );
  assert(Object.keys(tableListObj.contacts.columns).includes('contact_id'));
  assert(Object.keys(tableListObj.contacts.columns).includes('customer_id'));
  assert(Object.keys(tableListObj.contacts.columns).includes('contact_name'));
  assert(Object.keys(tableListObj.contacts.columns).includes('phone'));
  assert(Object.keys(tableListObj.contacts.columns).includes('email'));
  assert(Object.keys(tableListObj.contacts.columns).includes('password'));
  assert(Object.keys(tableListObj.person.columns).includes('name'));
  assert(Object.keys(tableListObj.person.columns).includes('current_mood'));
});

Deno.test('Introspection Table Column Type Test', async function () {
  const [tableListObj] = await introspect();
  assertEquals(tableListObj.customers.columns.customer_name.type, 'varchar');
  assertEquals(tableListObj.customers.columns.customer_id.type, 'int4');
  assertEquals(tableListObj.products.columns.price.type, 'numeric');
  assertEquals(tableListObj.products.columns.name.type, 'text');
  assertEquals(tableListObj.products.columns.name.type, 'text');
  assertEquals(tableListObj.person.columns.current_mood.type, 'enum: mood');
});

Deno.test('Introspection Column Constraint Test', async function () {
  const [tableListObj] = await introspect();
  assertEquals(tableListObj.customers.columns.customer_name.notNull, true);
  assertEquals(tableListObj.customers.columns.customer_name.length, 255);
  assertEquals(tableListObj.customers.columns.customer_id.autoIncrement, true);
  assertEquals(tableListObj.customers.columns.customer_id.primaryKey, true);
  assertEquals(tableListObj.products.columns.sale_item.defaultVal, false);
  assertEquals(tableListObj.contacts.columns.email.unique, true);
});

Deno.test('Introspection Table Constraint Test', async function () {
  const [tableListObj] = await introspect();
  assert(tableListObj.products.checks.includes('(price > discounted_price)'));
  assert(Array.isArray(tableListObj.products.unique));
  assertEquals(tableListObj.products.unique[0], ['product_no', 'name']);
});

Deno.test('Enum Object Test', async function () {
  const [tableListObj, enumObj] = await introspect();
  assertEquals(enumObj.color, [
    'violet',
    'green',
    'blue',
    'indigo',
    'red',
    'orange',
    'yellow',
  ]);
  assert(Object.keys(enumObj).includes('mood'));
  assertEquals(enumObj.mood, ['ok', 'happy', 'sad']);
});
