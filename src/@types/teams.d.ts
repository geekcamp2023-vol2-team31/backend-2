import { Team, User } from "@/entity";

export type IPostTeamsBody = {
  team: {
    name: string;
  };
};

export type IPostTeamsResponse = {
  team: {
    id: string;
    name: string;
    members: User[];
    owner: User;
    invitationCode?: string;
  };
};

export type ITeamParams = {
  teamId: string;
};

export type ITeamGetResponse = {
  team: Team;
};
