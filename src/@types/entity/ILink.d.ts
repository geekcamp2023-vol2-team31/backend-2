import { IComment, ITeam } from "@/@types";

export interface ILink {
  id: string;
  team: ITeam;
  left: IComment;
  right: IComment;
}
