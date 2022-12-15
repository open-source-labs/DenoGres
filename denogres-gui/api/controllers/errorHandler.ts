import { Middleware } from "https://deno.land/x/oak@v11.1.0/mod.ts";

const errorHandler: Middleware = async ({ response }, next) => {
  try {
    await next();
  } catch (err) {
    response.status = 500;
    response.body = { msg: err.message };
  }
};

export default errorHandler;