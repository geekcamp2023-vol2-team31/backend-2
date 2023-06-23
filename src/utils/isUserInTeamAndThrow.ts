import { isUserInTeam } from "./isUserInTeam";
import { Team, User } from "@/entity";

export const isUserInTeamAndThrow = (
  user: User,
  team: Team,
  message = "You are not a member of the team."
) => {
  const isUserInTeamFlg = isUserInTeam(user, team);
  if (!isUserInTeamFlg) {
    throw new Error(message);
  }
};
