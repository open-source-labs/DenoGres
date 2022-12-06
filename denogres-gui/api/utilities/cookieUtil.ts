// cookie utility is used for creating and returning the authorization cookie that can later be appended to the body and sent as a response
import { key } from "../utilities/key.ts"
import { create } from "https://deno.land/x/djwt/mod.ts"
import { Context } from "https://deno.land/x/oak@v11.1.0/mod.ts"

export const cookieUtil = async (payload) => {
  const jwt: string = await create(
    { alg: "HS512", typ: "JWT" },
    { payload },
    key,
  );
}

export default {
  cookieUtil
}