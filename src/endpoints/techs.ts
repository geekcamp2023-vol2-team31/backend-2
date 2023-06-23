import { RouteHandlerMethodWrapper } from "@/endpoints/RouteHandlerMethodWrapper";
import { ITechsResponse } from "@/@types/techs";
import { source } from "@/database";
import { Tech } from "@/entity";
import { FastifyInstance } from "fastify";

const get_techs: RouteHandlerMethodWrapper<{
  Reply: ITechsResponse;
}> = async (_, reply) => {
  const techs = await source.manager.find(Tech);
  await reply.status(200).send({
    techs,
  });
};

const setupTechs = (app: FastifyInstance) => {
  app.get("/techs", get_techs);
};

export { setupTechs };
