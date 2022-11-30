import { Application } from 'https://deno.land/x/oak/mod.ts';
import { oakCors } from 'https://deno.land/x/cors/mod.ts';
import router from './routes.ts'
import errorHandler from './controllers/errorHandler.ts';

const PORT = 8000;

const app = new Application();

app.use(errorHandler);
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener('listen', () => {
  console.log(`Oak is listening on localhost:${PORT} - Have a wonderful day :)`)
});

await app.listen({port: PORT});