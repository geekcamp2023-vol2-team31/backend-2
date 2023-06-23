import { Team } from "@/entity";

export type IGetUsersMeResponse = {
  user: {
    id: string;
    name: string;
    bio: string;
    icon?: string;
    owns: Team[];
    belongs: Team[];
  };
};
