import { IComment } from "./IComment";
import { ITech } from "./ITech";

export interface IProduct {
  id: string;
  name: string;
  comments: IComment[];
  techs: ITech[];
}
