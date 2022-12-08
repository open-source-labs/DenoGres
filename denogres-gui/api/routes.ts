import { Context, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import columnNames from "./controllers/columnNames.ts";
import getTables from "./controllers/getTables.ts";
import getConstraints from "./controllers/getConstraints.ts"
import signIn from "./controllers/signIn.ts";

const router = new Router();

router
  // working db routes:
  .get('/api/tables', getTables)
  .get('/api/constraints', getConstraints)
  .get('/api/columns/:table', columnNames)
  
  // user db routes:
  .post('/api/signin', signIn)

  //test route:
  .post('/api/test', async (ctx) => {
    if (!ctx.request.hasBody) {
      ctx.throw(415);
    }
    const reqBody = await ctx.request.body().value;
    ctx.response.status = 200;
    ctx.response.body = reqBody;
  })

export default router;

