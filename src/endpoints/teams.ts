import { RouteHandlerMethodWrapper } from "@/endpoints/RouteHandlerMethodWrapper";
import {
  IPostTeamsBody,
  IPostTeamsResponse,
  ITeamGetResponse,
  ITeamParams,
  UnauthorizedError,
} from "@/@types";
import { getUser } from "@/utils/auth";
import { uuid } from "@/utils/uuid";
import { Team } from "@/entity";
import { source } from "@/database";
import { FastifyInstance } from "fastify";
import { isUserInTeamAndThrow } from "@/utils/isUserInTeamAndThrow";

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

const get_teams_teamId: RouteHandlerMethodWrapper<{
  Params: ITeamParams;
  Reply: ITeamGetResponse;
}> = async (request) => {
  const { teamId } = request.params;
  const user = await getUser(request);
  const team = await source.manager.findOneBy(Team, { id: teamId });
  if (!team) {
    throw new Error("Team not found");
  }
  isUserInTeamAndThrow(user, team);
  return { team };
};

const delete_teams_teamId: RouteHandlerMethodWrapper<{
  Params: ITeamParams;
}> = async (request) => {
  const { teamId } = request.params;
  const user = await getUser(request);
  const team = await source.manager.findOneBy(Team, { id: teamId });
  if (!team) {
    throw new Error("Team not found");
  }
  if (team.owner.id !== user.id)
    throw new Error("You are not the owner of this team");
  await source.manager.remove(team);
};

const setupTeams = (app: FastifyInstance) => {
  app.post("/teams", post_teams);
  app.get("/teams/:teamId", get_teams_teamId);
  app.delete("/teams/:teamId", delete_teams_teamId);
};

export { setupTeams };
