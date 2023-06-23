import { IComment, ICommentType } from "@/@types/entity";

export type IPostTeamsCommentsBody = {
  comment: {
    body: string;
    type: ICommentType;
  };
};

export type ITeamsCommentResponse = {
  comments: IComment[];
};

export type ITeamsCommentParams = {
  teamId: string;
  commentId: string;
};

export type IPutTeamsCommentBody = {
  comment: {
    body: string;
    type: ICommentType;
    next?: string;
  };
};
