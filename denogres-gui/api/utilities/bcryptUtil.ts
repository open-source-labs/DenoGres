// utility to use bcrypt to compare two strings - the first is plaintext and the second is a hashed value
import * as bcrypt from 'https://deno.land/x/bcrypt/mod.ts';

export const bcryptUtil = async (
  plain: string,
  hashed: string
): Promise<boolean> => {
  const match: boolean = await bcrypt.compareSync(plain, hashed);
  if (!match) return false;
  return true;
};

export const hashUtil = async (plain: string): Promise<string> => {
  const salt: string = await bcrypt.genSaltSync(8);
  const hashedPW: string = await bcrypt.hashSync(plain, salt);
  return hashedPW;
};

export default {
  bcryptUtil,
  hashUtil,
};