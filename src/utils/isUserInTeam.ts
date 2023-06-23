import { Team, User } from "@/entity";

export const isUserInTeam = (user: User, team: Team) => {
  const isUserInMemberFlg =
    team.members.findIndex((member) => member.id === user.id) !== -1;
  const isUserInOwnerFlg = team.owner.id === user.id;
  if (!isUserInMemberFlg && !isUserInOwnerFlg) {
    return false;
  }
  return true;
};
