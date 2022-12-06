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
  const response = await signInService(reqBody.username, reqBody.password) 

    if (!response) {
      return ctx.response.status = 401;
    } else {
      // Context.response.status = 200;
      // Context.response.body = response;
      // await Context.cookies.set('cookie_name_test, cookie_value_test')
      // console.log(Context.response)
      // Context.response.body ={
      //   id: "test",
      //   username: "testname",
      //   token: "testtoken",
      // };
      // Context.response.status = 200;
      ctx.cookies.set("token", "12345")
      console.log(ctx.cookies)
  }
}