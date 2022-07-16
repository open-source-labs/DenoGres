import { pool, createConnection } from './mod.ts';


const testQuery = createConnection(pool)

console.log(testQuery)