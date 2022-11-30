import { Router } from "https://deno.land/x/oak/mod.ts";
import columnNames from "./controllers/columnNames.ts";
import getTables from "./controllers/getTables.ts";
import getConstraints from "./controllers/getConstraints.ts"

const router = new Router();

router
  .get('/api/tables', getTables)
  .get('/api/constraints', getConstraints)
  .get('/api/columns/:table', columnNames)
  .get('/api', (ctx) => {
    ctx.response.body = 'Hello World, I am Deno!';
    console.log('Knock, knock...')
  });

export default router;

