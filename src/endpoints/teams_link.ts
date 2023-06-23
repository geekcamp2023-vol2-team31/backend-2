import { RouteHandlerMethodWrapper } from "@/endpoints/RouteHandlerMethodWrapper";
import { ITeamParams } from "@/@types";
import { getUser } from "@/utils/auth";
import { source } from "@/database";
import { Link, Team } from "@/entity";
import { isUserInTeamAndThrow } from "@/utils/isUserInTeamAndThrow";
import { ITeamsLinkResponse } from "@/@types/teams_link";
import { FastifyInstance } from "fastify";

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

const setupTeamsLinks = (app: FastifyInstance) => {
  app.get("/teams/:teamId/links", get_teams_teamId_links);
};

export { setupTeamsLinks };
