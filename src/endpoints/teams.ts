import { RouteHandlerMethodWrapper } from "@/endpoints/RouteHandlerMethodWrapper";
import { IPostTeamsBody } from "@/@types/team/ITeamsPostBody";
import { IPostTeamsResponse } from "@/@types/team/ITeamsPostResponse";
import { UnauthorizedError } from "@/@types/error/Error";
import { getUser } from "@/utils/auth";
import { uuid } from "@/utils/uuid";
import { Team } from "@/entity";
import { source } from "@/database";
import { FastifyInstance } from "fastify";

const post_teams: RouteHandlerMethodWrapper<{
  Body: IPostTeamsBody;
  Reply: IPostTeamsResponse | UnauthorizedError;
}> = async (request, reply) => {
  const { name } = request.body.team;
  const user = await getUser(request);
  const teamId = uuid();
  const invitationCode = uuid();
  const team = new Team();
  team.id = teamId;
  team.members = [user];
  team.name = name;
  team.invitationCode = invitationCode;
  team.owner = user;
  await source.manager.save(team);
  await reply.send({
    team: {
      id: teamId,
      name: name,
      members: [user],
      owner: user,
      invitationCode: invitationCode,
    },
  });
};

const setupTeams = (app: FastifyInstance) => {
  app.post("/teams", post_teams);
};

export { setupTeams };
