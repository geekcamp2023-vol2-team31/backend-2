import { IProduct } from "@/@types/entity";

export type ITeamsProductsResponse = {
  products: IProduct[];
};

export type ITeamsProductsBody = {
  product: {
    name: string;
    comments: string[];
    productToTech: string[];
  };
};

export type ITeamsProductsParam = {
  teamId: string;
  productId: string;
};
