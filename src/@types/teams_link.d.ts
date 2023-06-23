import { ILink } from "@/@types/entity/ILink";

export type ITeamsLinkResponse = {
  links: ILink[];
};

export type IPostTeamsLinkBody = {
  link: {
    left: string;
    right: string;
  };
};
