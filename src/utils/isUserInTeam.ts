import { ITeam, IUser } from "@/@types";

export const isUserInTeam = (user: IUser, team: ITeam) => {
  const isUserInMemberFlg =
    team.members.findIndex((member) => member.id === user.id) !== -1;
  const isUserInOwnerFlg = team.owner.id === user.id;
  if (!isUserInMemberFlg && !isUserInOwnerFlg) {
    return false;
  }
  return true;
};
