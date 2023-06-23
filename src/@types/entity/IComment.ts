export interface IComment {
  id: string;
  body: string;
  type: ICommentType;
}

export type ICommentType = "problem" | "goal" | "solution";
