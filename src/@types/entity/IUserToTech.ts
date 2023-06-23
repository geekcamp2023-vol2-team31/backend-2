import { ITech, IUser } from "./";

export type ITechLevel = "beginner" | "advanced" | "expert";

export interface IUserToTech {
  user: IUser;
  tech: ITech;
  level: ITechLevel;
}
