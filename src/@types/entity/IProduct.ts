import { IComment, IProductToTech } from "@/@types";

export interface IProduct {
  id: string;
  name: string;
  comments: IComment[];
  productToTech: IProductToTech[];
}
