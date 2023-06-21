import { FastifyInstance } from "fastify";
import { IGetUsersMeResponse } from "@/@types/user/IGetUsersMeResponse";
import { RouteHandlerMethodWrapper } from "@/endpoints/RouteHandlerMethodWrapper";
import { getUser } from "@/utils/auth";

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
      id: user.id,
      name: user.name,
      bio: user.bio,
      icon: user.icon,
      owns: user.teamsOwns.map((team) => ({ id: team.id, name: team.name })),
      belongs: user.teamsBelongs.map((team) => ({
        id: team.id,
        name: team.name,
      })),
    },
  });
};

const setupUsers = (app: FastifyInstance) => {
  app.get("/users/me", get_users_me);
};

export { setupUsers };
