import { checkUser } from "../repositories/userRepo.ts";
import { checkPW } from "../repositories/userRepo.ts";
import { bcryptUtil } from "../utilities/bcryptUtil.ts";
import { getNumericDate } from "https://deno.land/x/djwt/mod.ts"
import { jwtUtil } from "../utilities/jwtUtil.ts";

/* 
- signInService takes username and password from the signIn controller
- it then passes the username and password to the userRepo where they are compared
- if the repo returns that it is a match, the service then calls the cookie utility to create the cookie, and sends it back to the controller, where the cookie is appended and returned
- if there are any errors in this process (like UN or PW are not a match) this service returns the error back to the controller to be returned as a response.
*/

const signInService = async (username: string, password: string): Promise<boolean> => {
  //first, check to see if the username is in the database, if it is, true is returned, if not - false.
  const userID: string = await checkUser(username);
  if (!userID) return false;
  //if checkUser returns true, it means the user exists in our DB and has a hashed PW
  //send username to checkPW to get back the hashed pw from the database
  const hashedPass: string = await checkPW(username);
  if (!hashedPass) return false; 
  //pass the password to the bcryptUtil to get a t/f if the password if a match
  const pwVerified: boolean = await bcryptUtil(password, hashedPass);
  //if there is no match, return false
  if (!pwVerified) return false;
  //if the pw is correct, move on to the cookie utility to generate the cookies to return
  //first generate a payload to send to cookieUtil
  const payload = {
    id: userID,
    username: username,
    exp: getNumericDate(30 * 60)
  };
  //generate the JWT
  const jwt = await jwtUtil(payload)
  return true;
}

export default signInService;
