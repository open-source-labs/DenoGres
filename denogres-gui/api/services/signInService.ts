import { checkUser } from "../repositories/userRepo.ts";
import { checkPW } from "../repositories/userRepo.ts";
import { bcryptUtil } from "../utilities/bcryptUtil.ts";
import { getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts"
import { cookieUtil } from "../utilities/cookieUtil.ts";
import { Context } from "https://deno.land/x/oak@v11.1.0/mod.ts"

/* 
- signInService takes username and password from the signIn controller
- it then passes the username and password to the userRepo where they are compared
- if the repo returns that it is a match, the service then calls the cookie utility to create the cookie, and sends it back to the controller, where the cookie is appended and returned
- if there are any errors in this process (like UN or PW are not a match) this service returns the error back to the controller to be returned as a response.
*/



const signInService = async (username: string, password: string): Promise<any> => {
  //first, check to see if the username is in the database
  const userID: string = await checkUser(username);
  if (!userID) return;
  //send username to checkPW to get back the hashed pw from the database
  const hashedPass: string = await checkPW(username);
  if (!hashedPass) return; 
  //pass the password to the bcryptUtil to get a t/f if the password if a match
  const pwVerified: boolean = await bcryptUtil(password, hashedPass);
  //if it is not a match, return false
  if (!pwVerified) return;
  //generate a payload to send to cookieUtil
  const payload = {
    id: userID,
    username: username,
    exp: getNumericDate(24 * 60 * 60)
  };
  //generate the JWT and cookies
  const packagedResponse = await cookieUtil(payload);
  //return package to signIn mw
  return packagedResponse;
};
 
export default signInService;
