import * as cookie from "cookie/cookie.ts";
import { decode } from "djwt/mod.ts";

export default function jwtAuth(req: Request) {
  const cookies = cookie.getCookies(req.headers);
  // validate JWT
  if (!cookies.jwt) {
    return false;
  }

  const [header, payload, signature]: [any, any, any] = decode(cookies.jwt);
  // if JWT is valid, render page else render error
  if (payload.payload.username) {
    return true;
  } else {
    false;
  }
}
