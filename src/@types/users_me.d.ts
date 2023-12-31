import { ITech, ITechLevel } from "@/@types/entity";

export type IGetUsersMeResponse = {
  user: {
    id: string;
    name: string;
    bio: string;
    icon?: string | null;
    userToTechs: { tech: ITech; level: ITechLevel }[];
    teamsBelongs: { id: string; name: string }[];
    teamsOwns: { id: string; name: string }[];
  };
};

export type IPutUsersMeBody = {
  user: {
    name: string;
    bio: string;
    icon?: string;
  };
};

export type IPutUsersMeTeamParams = {
  invitationCode: string;
};
export type IPutUsersMeTeamResponse = {
  team: {
    id: string;
    name: string;
  };
};

export type IDeleteUsersMeTeamParams = {
  teamId: string;
};
