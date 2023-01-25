import { Context } from 'https://deno.land/x/oak@v11.1.0/context.ts';
import signUpService from '../services/signUpService.ts';

export interface Ilogin {
  username: string;
  password: string;
}

export default async (ctx: Context) => {
  //check to see if the request body is empty, if it is, immediately return status 400 as response
  if (!ctx.request.hasBody) {
    return (ctx.response.status = 400);
  }
  const reqBody = await ctx.request.body().value;

  const packagedResponse = await signUpService(
    reqBody.username,
    reqBody.password
  );

  if (!packagedResponse) {
    return (ctx.response.status = 401);
  } else {
    ctx.response.status = packagedResponse.status;
    await ctx.cookies.set(
      `${packagedResponse.cookie1[0]}`,
      `${packagedResponse.cookie1[1]}`
    );
    await ctx.cookies.set(
      `${packagedResponse.cookie2[0]}`,
      `${packagedResponse.cookie2[1]}`
    );
    ctx.response.body = packagedResponse.body;
    return;
  }
};

// const body: Ilogin = await req.json();
// const { username, password } = body;
// const salt: string = await bcrypt.genSaltSync(8);
// const hashedPW: string = await bcrypt.hashSync(password, salt);
