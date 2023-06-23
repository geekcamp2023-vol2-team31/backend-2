import { ITeam, IUserToTech } from "./";

export interface IUser {
  id: string;
  name: string;
  bio: string;
  icon?: string | null;
  userToTechs: IUserToTech[];
  teamsBelongs: ITeam[];
  teamsOwns: ITeam[];
}
