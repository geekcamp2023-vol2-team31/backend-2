import { IComment, ICommentType } from "@/@types/entity";

export type IGetTeamsCommentsResponse = {
  comments: IComment[];
};

export type IPostTeamsCommentsBody = {
  comment: {
    body: string;
    type: ICommentType;
  };
};

export type IPostTeamsCommentResponse = {
  comments: ICOmment[];
};
