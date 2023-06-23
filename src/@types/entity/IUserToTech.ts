import { ITech, IUser } from "./";

export interface IUserToTech {
  user: IUser;
  tech: ITech;
  level: "beginner" | "advanced" | "expert";
}
