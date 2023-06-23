import { ITechLevel } from "@/@types/entity";

export type IGetUsersMeResponse = {
  user: {
    id: string;
    name: string;
    bio: string;
    icon?: string | null;
    userToTechs: { name: string; level: ITechLevel }[];
    teamsBelongs: { id: string; name: string }[];
    teamsOwns: { id: string; name: string }[];
  };
};

export type IPutUsersMeBody = {
  user: {
    name: string;
    bio: string;
    icon?: string;
    userToTechs: { name: string; level: ITechLevel }[];
  };
};
