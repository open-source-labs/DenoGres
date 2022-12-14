import { checkUser } from '../repositories/userRepo.ts';
import { checkPW } from '../repositories/userRepo.ts';
import { bcryptUtil } from '../utilities/bcryptUtil.ts';
import { getNumericDate } from 'https://deno.land/x/djwt@v2.8/mod.ts';
import { cookieUtil } from '../utilities/cookieUtil.ts';
import { getOneConnection } from '../repositories/userRepo.ts';
import { setClientInfo } from '../connections/database.ts';

const connectionIdService = async (
  connID: string,
  userID: string
): Promise<string | null> => {
  const validNewConnection = await getOneConnection(userID, connID);
  if (!validNewConnection) {
    return null;
  }
  // await setClientInfo(validNewConnection);
  return validNewConnection.id;
};

export default connectionIdService;
