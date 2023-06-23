import { RouteHandlerMethodWrapper } from "@/endpoints/RouteHandlerMethodWrapper";
import { getUser } from "@/utils/auth";
import {
  IPostUsersMeTechsBody,
  IPutUsersMeTechsBody,
  IUsersMeTechParams,
  IUsersMeTechsResponse,
} from "@/@types/users_me_techs";
import { UserToTech } from "@/entity";
import { getOrCreateTech } from "@/utils/tech";
import { source } from "@/database";
import { FastifyInstance } from "fastify";

const post_users_me_techs: RouteHandlerMethodWrapper<{
  Body: IPostUsersMeTechsBody;
  Reply: IUsersMeTechsResponse;
}> = async (request, reply) => {
  const { level, name } = request.body;
  const tech = await getOrCreateTech(name);
  const user = await getUser(request);
  const link = await (async () => {
    const link = await source.manager.findOneBy(UserToTech, { user, tech });
    if (link) return link;
    return new UserToTech();
  })();
  link.user = user;
  link.tech = tech;
  link.level = level;
  await source.manager.save(link);
  const links = await source.manager.find(UserToTech, {
    where: { user },
    relations: ["tech"],
  });
  await reply.status(200).send({
    techs: links.map((link) => link.tech),
  });
};

const put_users_me_techs_name: RouteHandlerMethodWrapper<{
  Params: IUsersMeTechParams;
  Body: IPutUsersMeTechsBody;
  Reply: IUsersMeTechsResponse;
}> = async (request, reply) => {
  const { name } = request.params;
  const { level } = request.body;
  const tech = await getOrCreateTech(name);
  const user = await getUser(request);
  const link = await source.manager.findOneBy(UserToTech, { user, tech });
  if (!link) throw Error("link is not found");
  link.user = user;
  link.tech = tech;
  link.level = level;
  await source.manager.save(link);
  const links = await source.manager.find(UserToTech, {
    where: { user },
    relations: ["tech"],
  });
  await reply.status(200).send({
    techs: links.map((link) => link.tech),
  });
};

const delete_users_me_techs_name: RouteHandlerMethodWrapper<{
  Params: IUsersMeTechParams;
  Reply: IUsersMeTechsResponse;
}> = async (request, reply) => {
  const { name } = request.params;
  const tech = await getOrCreateTech(name);
  const user = await getUser(request);
  const link = await source.manager.findOneBy(UserToTech, { user, tech });
  if (!link) throw Error("link is not found");
  await source.manager.remove(link);
  const links = await source.manager.find(UserToTech, {
    where: { user },
    relations: ["tech"],
  });
  await reply.status(200).send({
    techs: links.map((link) => link.tech),
  });
};

const setupUsersMeTechs = (app: FastifyInstance) => {
  app.post("/users/me/techs", post_users_me_techs);
  app.put("/users/me/techs/:name", put_users_me_techs_name);
  app.delete("/users/me/techs/:name", delete_users_me_techs_name);
};

export { setupUsersMeTechs };
