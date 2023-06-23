import { FastifyInstance } from "fastify";
import { RouteHandlerMethodWrapper } from "@/endpoints/RouteHandlerMethodWrapper";
import {
  IPostTeamsProductsTechsBody,
  ITeamsProductsTechResponse,
  ITeamsProductsTechsParams,
} from "@/@types/teams_products_techs";
import { ITeamsProductsParam } from "@/@types/teams_products";
import { getOrCreateTech } from "@/utils/tech";
import { getUser } from "@/utils/auth";
import { source } from "@/database";
import { Team } from "@/entity";
import { isUserInTeamAndThrow } from "@/utils/isUserInTeamAndThrow";
import { Product } from "@/entity/Product";
import { ProductToTech } from "@/entity/ProductToTech";

const post_teams_teamId_products_productId_techs: RouteHandlerMethodWrapper<{
  Params: ITeamsProductsParam;
  Body: IPostTeamsProductsTechsBody;
  Reply: ITeamsProductsTechResponse;
}> = async (request, reply) => {
  const { teamId, productId } = request.params;
  const { name } = request.body;
  const tech = await getOrCreateTech(name);
  const user = await getUser(request);
  const team = await source.manager.findOne(Team, { where: { id: teamId } });
  if (!team) throw new Error("The team is not found.");
  const product = await source.manager.findOne(Product, {
    where: { id: productId, team },
  });
  if (!product) throw new Error("The product is not found.");
  isUserInTeamAndThrow(user, team);
  const link = await (async () => {
    const link = await source.manager.findOneBy(ProductToTech, {
      product,
      tech,
    });
    if (link) return link;
    return new ProductToTech();
  })();
  link.product = product;
  link.tech = tech;
  await source.manager.save(link);
  const links = await source.manager.find(ProductToTech, {
    where: { product },
    relations: ["tech"],
  });
  await reply.status(200).send({
    techs: links.map((link) => link.tech),
  });
};

const delete_teams_teamId_products_productId_techs_name: RouteHandlerMethodWrapper<{
  Params: ITeamsProductsTechsParams;
  Reply: ITeamsProductsTechResponse;
}> = async (request, reply) => {
  const { teamId, productId, name } = request.params;
  const tech = await getOrCreateTech(name);
  const user = await getUser(request);
  const team = await source.manager.findOne(Team, { where: { id: teamId } });
  if (!team) throw new Error("The team is not found.");
  const product = await source.manager.findOne(Product, {
    where: { id: productId, team },
  });
  if (!product) throw new Error("The product is not found.");
  isUserInTeamAndThrow(user, team);
  const link = await source.manager.findOneBy(ProductToTech, { product, tech });
  if (!link) throw new Error("the link is not found");
  await source.manager.remove(link);
  const links = await source.manager.find(ProductToTech, {
    where: { product },
    relations: ["tech"],
  });
  await reply.status(200).send({
    techs: links.map((link) => link.tech),
  });
};

const setupTeamsProductsTechs = (app: FastifyInstance) => {
  app.post(
    "/teams/:teamId/products/:productId/techs",
    post_teams_teamId_products_productId_techs
  );
  app.delete(
    "/teams/:teamId/products/:productId/techs/:name",
    delete_teams_teamId_products_productId_techs_name
  );
};
export { setupTeamsProductsTechs };
