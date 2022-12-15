import { getAllConnections } from "../repositories/userRepo.ts";

export const allConnections = async (userID: string) => {
  const userConnections = await getAllConnections(userID);
  return userConnections;
}


export default {
  allConnections
};