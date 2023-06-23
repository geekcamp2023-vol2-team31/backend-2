import { RouteHandlerMethodWrapper } from "@/endpoints/RouteHandlerMethodWrapper";
import { ITeamParams } from "@/@types";
import { IGetTeamsCommentsResponse } from "@/@types/teams_comments";
import { isUserInTeamAndThrow } from "@/utils/isUserInTeamAndThrow";
import { source } from "@/database";
import { Team, Comment } from "@/entity";
import { getUser } from "@/utils/auth";
import { FastifyInstance } from "fastify";

const get_teams_teamId_comments: RouteHandlerMethodWrapper<{
  Params: ITeamParams;
  Reply: IGetTeamsCommentsResponse;
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

const setupTeamsComments = (app: FastifyInstance) => {
  app.get("/teams/:teamId/comments", get_teams_teamId_comments);
};

export { setupTeamsComments };
