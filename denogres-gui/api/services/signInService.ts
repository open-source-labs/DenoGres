/* 
- signInService takes username and password from the signIn controller
- it then passes the username and password to the userRepo where they are compared
- if the repo returns that it is a match, the service then calls the cookie utility to create the cookie, and sends it back to the controller, where the cookie is appended and returned
- if there are any errors in this process (like UN or PW are not a match) this service returns the error back to the controller to be returned as a response.
*/

import { checkUser } from "../repositories/userRepo.ts";
import { checkPW } from "../repositories/userRepo.ts";
import { encryptUtil } from "../utilities/encryptUtil.ts";

const signInService = (username: string, password: string): boolean => {
  //first, check to see if the username is in the database, if it is, true is returned, if not - false.
  const userCheck: boolean = checkUser(username);
  if (!userCheck) return false;
  else {
    console.log('user is in the database')
  }

}

export default signInService;
