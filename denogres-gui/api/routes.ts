import { Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

router
  .get('/api/', (ctx) => {
    ctx.response.body = 'Hello World, I am Deno!';
    console.log('Knock, knock...')
  });

export default router;

