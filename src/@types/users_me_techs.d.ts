import { ITechLevel, IUserToTech } from "@/@types/entity";

export type IPostUsersMeTechsBody = {
  name: string;
  level: ITechLevel;
};

export type IUsersMeTechParams = {
  name: string;
};
export type IPutUsersMeTechsBody = {
  level: ITechLevel;
};

export type IUsersMeTechsResponse = {
  techs: IUserToTech[];
};
