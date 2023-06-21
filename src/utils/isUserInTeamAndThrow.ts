import { ITeam, IUser } from "@/@types";
import { isUserInTeam } from "./isUserInTeam";

export const isUserInTeamAndThrow = (
  user: IUser,
  team: ITeam,
  message = "You are not a member of the team."
) => {
  const isUserInTeamFlg = isUserInTeam(user, team);
  if (!isUserInTeamFlg) {
    throw new Error(message);
  }
};
