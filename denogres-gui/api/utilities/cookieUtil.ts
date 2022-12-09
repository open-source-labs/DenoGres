// cookie utility is used for creating and returning the authorization cookie that can later be appended to the body and sent as a response
import { key } from '../utilities/key.ts';
import { create } from 'https://deno.land/x/djwt/mod.ts';

interface PackagedResponse {
  cookie1: string[];
  cookie2: string[];
  status: number;
  body: string;
}

interface Payload {
  id: number;
  username: string;
  exp: number;
}

export const cookieUtil = async (
  payload: Payload
): Promise<PackagedResponse> => {
  const jwt: string = await create(
    { alg: 'HS512', typ: 'JWT' },
    { payload },
    key
  );
  const packagedResponse = {
    cookie1: ['jwt', `${jwt}`],
    cookie2: ['userId', `${payload.id}`],
    status: 200,
    body: `Logged in OK, cookies are set!`,
  };
  return packagedResponse;
};

export default {
  cookieUtil,
};
