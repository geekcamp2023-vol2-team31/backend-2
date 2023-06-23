import { ILink } from "@/@types/entity/ILink";

export type ITeamsLinkResponse = {
  links: ILink[];
};

export type ITeamsLinkBody = {
  link: {
    left: string;
    right: string;
  };
};

export type ITeamsLinkParams = {
  teamId: string;
  linkId: string;
};
