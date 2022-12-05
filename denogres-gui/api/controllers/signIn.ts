import { Context } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { signInService } from "../services/signInService.ts";

export default ({ request, response }: Context) => {
  console.log(request.body)
}
