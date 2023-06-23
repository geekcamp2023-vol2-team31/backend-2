import { RouteHandlerMethodWrapper } from "@/endpoints/RouteHandlerMethodWrapper";
import { ITeamParams } from "@/@types";
import {
  IPostTeamsCommentsBody,
  IPutTeamsCommentBody,
  ITeamsCommentParams,
  ITeamsCommentResponse,
} from "@/@types/teams_comments";
import { isUserInTeamAndThrow } from "@/utils/isUserInTeamAndThrow";
import { source } from "@/database";
import { Team, Comment } from "@/entity";
import { getUser } from "@/utils/auth";
import { FastifyInstance } from "fastify";
import { IsNull } from "typeorm";

const get_teams_teamId_comments: RouteHandlerMethodWrapper<{
  Params: ITeamParams;
  Reply: ITeamsCommentResponse;
}> = async (request, reply) => {
  const teamId = request.params.teamId;
  const user = await getUser(request);
  const team = await source.manager.findOne(Team, { where: { id: teamId } });
  if (!team) throw new Error("The team is not found.");
  isUserInTeamAndThrow(user, team);
  const comments = await source.manager.find(Comment, { where: { team } });
  await reply.status(200).send({
    comments,
  });
};

const post_teams_teamId_comments: RouteHandlerMethodWrapper<{
  Params: ITeamParams;
  Body: IPostTeamsCommentsBody;
  Reply: ITeamsCommentResponse;
}> = async (request, reply) => {
  const teamId = request.params.teamId;
  const user = await getUser(request);
  const team = await source.manager.findOne(Team, { where: { id: teamId } });
  if (!team) throw new Error("The team is not found.");
  isUserInTeamAndThrow(user, team);
  const lastComment = await source.manager.findOneBy(Comment, {
    team,
    type: request.body.comment.type,
    next: IsNull(),
  });
  const comment = new Comment();
  comment.body = request.body.comment.body;
  comment.type = request.body.comment.type;
  comment.team = team;
  await source.manager.save(comment);
  if (lastComment) {
    lastComment.next = comment;
    await source.manager.save(lastComment);
  }
  const comments = await source.manager.find(Comment, { where: { team } });
  await reply.status(200).send({
    comments,
  });
};

const put_teams_teamId_comments_commentId: RouteHandlerMethodWrapper<{
  Params: ITeamsCommentParams;
  Body: IPutTeamsCommentBody;
  Reply: ITeamsCommentResponse;
}> = async (request, reply) => {
  const { teamId, commentId } = request.params;
  const { body, type, next } = request.body.comment;
  const user = await getUser(request);
  const team = await source.manager.findOne(Team, { where: { id: teamId } });
  if (!team) throw new Error("The team is not found.");
  isUserInTeamAndThrow(user, team);
  const comment = await source.manager.findOne(Comment, {
    where: { team, id: commentId },
  });
  if (!comment) throw new Error("The comment is not found");
  comment.body = body;
  comment.type = type;
  if (next) {
    const nextComment = await source.manager.findOne(Comment, {
      where: { team, id: next },
    });
    if (!nextComment) throw new Error("The next comment is not found");
    comment.next = nextComment;
  } else {
    comment.next = undefined;
  }
  await source.manager.save(comment);
  const comments = await source.manager.find(Comment, { where: { team } });
  await reply.status(200).send({
    comments,
  });
};

const delete_teams_teamId_comments_commentId: RouteHandlerMethodWrapper<{
  Params: ITeamsCommentParams;
  Reply: ITeamsCommentResponse;
}> = async (request, reply) => {
  const { teamId, commentId } = request.params;
  const user = await getUser(request);
  const team = await source.manager.findOne(Team, { where: { id: teamId } });
  if (!team) throw new Error("The team is not found.");
  isUserInTeamAndThrow(user, team);
  const comment = await source.manager.findOne(Comment, {
    where: { team, id: commentId },
  });
  await source.manager.remove(comment);
  const comments = await source.manager.find(Comment, { where: { team } });
  await reply.status(200).send({
    comments,
  });
};

const setupTeamsComments = (app: FastifyInstance) => {
  app.get("/teams/:teamId/comments", get_teams_teamId_comments);
  app.post("/teams/:teamId/comments", post_teams_teamId_comments);
  app.put(
    "/teams/:teamId/comments/:commentId",
    put_teams_teamId_comments_commentId
  );
  app.delete(
    "/teams/:teamId/comments/:commentId",
    delete_teams_teamId_comments_commentId
  );
};

export { setupTeamsComments };
