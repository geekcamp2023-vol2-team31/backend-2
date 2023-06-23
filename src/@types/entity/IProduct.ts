import { IComment } from "./IComment";
import { ITech } from "./ITech";
import { IProductToTech } from "./IProductToTech";

export interface IProduct {
  id: string;
  name: string;
  comments: IComment[];
  productToTech: IProductToTech[];
}
