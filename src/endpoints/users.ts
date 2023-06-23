import { FastifyInstance } from "fastify";
import { RouteHandlerMethodWrapper } from "@/endpoints/RouteHandlerMethodWrapper";
import { getUser } from "@/utils/auth";
import { IGetUsersMeResponse } from "@/@types/users_me";

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
      owns: user.teamsOwns,
      belongs: user.teamsBelongs,
    },
  });
};

const setupUsers = (app: FastifyInstance) => {
  app.get("/users/me", get_users_me);
};

export { setupUsers };
