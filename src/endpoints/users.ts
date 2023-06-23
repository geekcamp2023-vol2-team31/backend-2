import { FastifyInstance } from "fastify";
import { RouteHandlerMethodWrapper } from "@/endpoints/RouteHandlerMethodWrapper";
import { getUser } from "@/utils/auth";
import { IGetUsersMeResponse, IPutUsersMeBody } from "@/@types/users_me";
import { UserToTech } from "@/entity";
import { getOrCreateTech } from "@/utils/tech";
import { source } from "@/database";

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
      userToTechs: user.userToTechs.map((item) => ({
        name: item.tech.name,
        level: item.level,
      })),
    },
  });
};

const put_users_me: RouteHandlerMethodWrapper<{
  Params: IPutUsersMeBody;
  Reply: undefined;
}> = async (request) => {
  const newUser = request.params.user;
  const user = await getUser(request);
  user.name = newUser.name;
  user.bio = newUser.bio;
  user.icon = newUser.icon || undefined;
  await source.manager.save(user);
  for (const val of newUser.userToTechs) {
    const tech = await getOrCreateTech(val.name);
    const userToTech = await source.manager.findOneBy(UserToTech, {
      user,
      tech,
    });
    if (userToTech) {
      userToTech.level = val.level;
      await source.manager.save(userToTech);
      continue;
    }
    const item = new UserToTech();
    item.user = user;
    item.tech = tech;
    item.level = val.level;
    await source.manager.save(tech);
  }
};

const setupUsers = (app: FastifyInstance) => {
  app.get("/users/me", get_users_me);
  app.put("/users/me", put_users_me);
};

export { setupUsers };
