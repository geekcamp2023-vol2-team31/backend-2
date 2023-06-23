import { IProduct } from "@/@types/entity";

export type ITeamsProductsResponse = {
  products: IProduct[];
};

export type IPostTeamsProductsBody = {
  product: {
    name: string;
    comments: string[];
    productToTech: string[];
  };
};
