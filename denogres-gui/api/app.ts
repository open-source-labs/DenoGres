import { Application } from 'https://deno.land/x/oak/mod.ts';
import { oakCors } from 'https://deno.land/x/cors/mod.ts';
import 'https://deno.land/x/dotenv/load.ts';
import database from '../src/helpers/database.ts';

const PORT = 8000;

const router = new Router();
router.get('/api/', (ctx) => {
    ctx.response.body = 'Hello World, I am Deno!';
    console.log('Knock, knock...')
  });

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener('listen', () => {
  console.log(`Oak is listening on localhost:${PORT} - Have a wonderful day :)`)
});

await app.listen({port: PORT});

try {
  await database.connect();
  console.log('Connected to the database')
} catch(err) {
  console.log(err)
}

await database.end();
