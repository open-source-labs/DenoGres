import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import signInService from "../services/signInService.ts";

export default async (ctx: Context) => {
  //check to see if the request body is empty, if it is, immediately return status 400 as response
  if (!ctx.request.hasBody) {
    return ctx.response.status = 400;
  }

  //create variable for easier use of request body
  const reqBody = await ctx.request.body().value;
  /*
  reqBody is an object with the following structure (JSON, which deno automatically parses for us):
  {
    "username": "enteredusername",
    "password": "enteredpassword"
  }
  */
  //send username and password to the Sign In Service to check that they are valid
  //if the service returns false, the credentials were not valid, return status 401 - unauthorized
  const packagedResponse = await signInService(reqBody.username, reqBody.password) 

    if (!packagedResponse) {
      return ctx.response.status = 401;
    } else {
      ctx.response.status = packagedResponse.status;
      ctx.cookies.set(`${packagedResponse.cookie1[0]}`, `${packagedResponse.cookie1[1]}`);
      ctx.cookies.set(`${packagedResponse.cookie2[0]}`, `${packagedResponse.cookie2[1]}`);
      ctx.response.body = packagedResponse.body;
      return;
  }
}