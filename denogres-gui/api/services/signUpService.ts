import { createUser } from '../repositories/userRepo.ts';
import { hashUtil } from '../utilities/bcryptUtil.ts';
import { getNumericDate } from 'https://deno.land/x/djwt@v2.8/mod.ts';
import { cookieUtil } from '../utilities/cookieUtil.ts';
import { Context } from 'https://deno.land/x/oak@v11.1.0/mod.ts';

/* 
- signInService takes username and password from the signIn controller
- it then passes the username and password to the userRepo where they are compared
- if the repo returns that it is a match, the service then calls the cookie utility to create the cookie, and sends it back to the controller, where the cookie is appended and returned
- if there are any errors in this process (like UN or PW are not a match) this service returns the error back to the controller to be returned as a response.
*/

const signUpService = async (
  username: string,
  password: string
): Promise<any> => {
  const hashedPass: string = await hashUtil(password);
  if (!hashedPass) return;

  const newUserID: string = await createUser(username, hashedPass);
  console.log(newUserID);
  if (!newUserID) return;
  //generate a payload to send to cookieUtil
  const payload = {
    id: newUserID,
    username: username,
    exp: getNumericDate(24 * 60 * 60),
  };
  //generate the JWT and cookies
  const packagedResponse = await cookieUtil(payload);
  //return package to signIn mw
  return packagedResponse;
};

export default signUpService;
