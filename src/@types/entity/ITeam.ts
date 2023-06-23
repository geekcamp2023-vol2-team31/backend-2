import { IComment, IUser, IProduct } from "./";

export interface ITeam {
  id: string;
  name: string;
  invitationCode?: string;
  owner: IUser;
  members: IUser[];
  comments: IComment[];
  products: IProduct[];
}
