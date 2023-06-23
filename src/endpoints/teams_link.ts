import { RouteHandlerMethodWrapper } from "@/endpoints/RouteHandlerMethodWrapper";
import { ITeamParams } from "@/@types";
import { getUser } from "@/utils/auth";
import { source } from "@/database";
import { Link, Team, Comment } from "@/entity";
import { isUserInTeamAndThrow } from "@/utils/isUserInTeamAndThrow";
import { IPostTeamsLinkBody, ITeamsLinkResponse } from "@/@types/teams_link";
import { FastifyInstance } from "fastify";
import { uuid } from "@/utils/uuid";

const get_teams_teamId_links: RouteHandlerMethodWrapper<{
  Params: ITeamParams;
  Reply: ITeamsLinkResponse;
}> = async (request, reply) => {
  const teamId = request.params.teamId;
  const user = await getUser(request);
  const team = await source.manager.findOne(Team, { where: { id: teamId } });
  if (!team) throw new Error("The team is not found.");
  isUserInTeamAndThrow(user, team);
  const links = await source.manager.find(Link, { where: { team } });
  await reply.status(200).send({
    links,
  });
};

const post_teams_teamId_links: RouteHandlerMethodWrapper<{
  Params: ITeamParams;
  Body: IPostTeamsLinkBody;
  Reply: ITeamsLinkResponse;
}> = async (request, reply) => {
  const { left, right } = request.body.link;
  const teamId = request.params.teamId;
  const user = await getUser(request);
  const team = await source.manager.findOne(Team, { where: { id: teamId } });
  if (!team) throw new Error("The team is not found.");
  isUserInTeamAndThrow(user, team);
  const leftComment = await source.manager.findOneBy(Comment, { id: left });
  const rightComment = await source.manager.findOneBy(Comment, { id: right });
  if (!leftComment || !rightComment) throw new Error("comment not found");
  const link = new Link();
  link.id = uuid();
  link.left = leftComment;
  link.right = rightComment;
  link.team = team;
  await source.manager.save(link);
  const links = await source.manager.find(Link, { where: { team } });
  await reply.status(200).send({
    links,
  });
};

const setupTeamsLinks = (app: FastifyInstance) => {
  app.get("/teams/:teamId/links", get_teams_teamId_links);
  app.post("/teams/:teamId/links", post_teams_teamId_links);
};

export { setupTeamsLinks };
