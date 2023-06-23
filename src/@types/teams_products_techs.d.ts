import { ITech } from "@/@types/entity";

export type IPostTeamsProductsTechsBody = {
  name: string;
};

export type ITeamsProductsTechsParams = {
  teamId: string;
  productId: string;
  name: string;
};

export type ITeamsProductsTechResponse = {
  techs: ITech[];
};
