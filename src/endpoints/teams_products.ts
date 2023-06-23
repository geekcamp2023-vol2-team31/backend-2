import { RouteHandlerMethodWrapper } from "@/endpoints/RouteHandlerMethodWrapper";
import { ITeamParams } from "@/@types";
import { ITeamsProductsResponse } from "@/@types/teams_products";
import { getUser } from "@/utils/auth";
import { source } from "@/database";
import { Team } from "@/entity";
import { isUserInTeamAndThrow } from "@/utils/isUserInTeamAndThrow";
import { Product } from "@/entity/Product";
import { FastifyInstance } from "fastify";

const get_teams_teamId_products: RouteHandlerMethodWrapper<{
  Params: ITeamParams;
  Reply: ITeamsProductsResponse;
}> = async (request, reply) => {
  const teamId = request.params.teamId;
  const user = await getUser(request);
  const team = await source.manager.findOne(Team, { where: { id: teamId } });
  if (!team) throw new Error("The team is not found.");
  isUserInTeamAndThrow(user, team);
  const products = await source.manager.find(Product, { where: { team } });
  await reply.status(200).send({ products });
};

const setupTeamsProducts = (app: FastifyInstance) => {
  app.get("/teams/:teamId/products", get_teams_teamId_products);
};

export { setupTeamsProducts };
