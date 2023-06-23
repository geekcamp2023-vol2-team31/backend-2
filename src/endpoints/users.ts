import { FastifyInstance } from "fastify";
import { RouteHandlerMethodWrapper } from "@/endpoints/RouteHandlerMethodWrapper";
import { getUser } from "@/utils/auth";
import {
  IDeleteUsersMeTeamParams,
  IGetUsersMeResponse,
  IPutUsersMeBody,
  IPutUsersMeTeamParams,
  IPutUsersMeTeamResponse,
} from "@/@types/users_me";
import { Team } from "@/entity";
import { source } from "@/database";
import { setupUsersMeTechs } from "@/endpoints/users_me_techs";

const get_users_me: RouteHandlerMethodWrapper<{
  Params: Record<string, never>;
  Reply: IGetUsersMeResponse;
}> = async (request, reply) => {
  const user = await getUser(request);
  if (!user) {
    throw new Error("The user is not found.");
  }
  await reply.status(200).send({
    user: {
      ...user,
      userToTechs: user.userToTechs,
    },
  });
};

const put_users_me: RouteHandlerMethodWrapper<{
  Params: IPutUsersMeBody;
  Reply: undefined;
}> = async (request, reply) => {
  const newUser = request.params.user;
  const user = await getUser(request);
  user.name = newUser.name;
  user.bio = newUser.bio;
  user.icon = newUser.icon || undefined;
  await source.manager.save(user);
  await reply.status(204);
};

const put_users_me_teams_invitationCode: RouteHandlerMethodWrapper<{
  Params: IPutUsersMeTeamParams;
  Reply: IPutUsersMeTeamResponse;
}> = async (request, reply) => {
  const invitationCode = request.params.invitationCode;
  const user = await getUser(request);
  const team = await source.manager.findOneBy(Team, { invitationCode });
  if (!team) {
    throw new Error("The team is not found.");
  }
  team.members.push(user);
  await source.manager.save(team);
  await reply.status(200).send({
    team: {
      id: team.id,
      name: team.name,
    },
  });
};

const delete_users_me_teams_invitationCode: RouteHandlerMethodWrapper<{
  Params: IDeleteUsersMeTeamParams;
  Reply: undefined;
}> = async (request, reply) => {
  const user = await getUser(request);
  const team = await source.manager.findOneBy(Team, {
    id: request.params.teamId,
  });
  if (!team) {
    throw new Error("The team is not found.");
  }
  team.members = team.members.filter(
    (member) => member.githubId !== user.githubId
  );
  await source.manager.save(team);
  await reply.status(204);
};

const setupUsers = (app: FastifyInstance) => {
  app.get("/users/me", get_users_me);
  app.put("/users/me", put_users_me);
  app.put("/users/me/teams/:invitationCode", put_users_me_teams_invitationCode);
  app.delete("/users/me/teams/:teamId", delete_users_me_teams_invitationCode);
  setupUsersMeTechs(app);
};

export { setupUsers };
