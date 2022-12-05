import { Context } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import signInService from "../services/signInService.ts";

export default async (Context) => {
  //check to see if the request body is empty, if it is, immediately return status 400 as response
  if (!Context.request.hasBody) {
    return Context.response.status = 400;
  }

  //create variable for easier use of request body
  const reqBody = await Context.request.body().value;
  /*
  reqBody is an object with the following structure (JSON, which deno automatically parses for us):
  {
    "username": "enteredusername",
    "password": "enteredpassword"
  }
  */
  //send username and password to the Sign In Service to check that they are valid
  //if the service returns false, the credentials were not valid, return status 401 - unauthorized
  if (!signInService(reqBody.username, reqBody.password)) {
    return Context.response.status = 401;
  } else {
    console.log('signinservice - true')
  }
  //Context.response.status = 200;
}
