export interface IComment {
  id: string;
  body: string;
  type: "problem" | "goal" | "solution";
  next?: IComment;
}
