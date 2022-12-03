import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
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