// cookie utility is used for creating and returning the authorization cookie that can later be appended to the body and sent as a response
import * as cookie from "https://deno.land/std@0.167.0/http/cookie.ts";
import { key } from "../utilities/key.ts"
import { create } from "https://deno.land/x/djwt/mod.ts"

export const jwtUtil = () => {
  return true;
}

export default {
  jwtUtil
}