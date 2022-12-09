import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import columnNames from "./controllers/columnNames.ts";
import getTables from "./controllers/getTables.ts";
import getConstraints from "./controllers/getConstraints.ts"
import signIn from "./controllers/signIn.ts";
import signUp from "./controllers/signUp.ts";
import userConnections from "./controllers/userConnections.ts";
import addConnection from "./controllers/addConnection.ts";
import setActiveConnection from "./controllers/setActiveConnection.ts";

const router = new Router();

router

  // working db routes:
  .get('/api/tables', getTables)
  .get('/api/constraints', getConstraints)
  .get('/api/columns/:table', columnNames)
  
  // route to return list of user's connections
  .get('/api/allConnections', userConnections)

  //add a new connection to user's list of connections
  .post('/api/newConnection', addConnection)

  //set connectionId cookie
  .get('/api/setConnectionId/:id', setActiveConnection)
  
  // user db routes:
  .post('/api/signin', signIn)
  .post('/api/signup', signUp)

  //test route for devs:
  .post('/api/test', async (ctx) => {
    if (!ctx.request.hasBody) {
      ctx.throw(415);
    }
    const reqBody = await ctx.request.body().value;
    ctx.response.status = 200;
    ctx.response.body = reqBody;
  })

export default router;

