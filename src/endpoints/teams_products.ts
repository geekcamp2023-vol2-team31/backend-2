import { RouteHandlerMethodWrapper } from "@/endpoints/RouteHandlerMethodWrapper";
import { ITeamParams } from "@/@types";
import {
  IPostTeamsProductsBody,
  ITeamsProductsResponse,
} from "@/@types/teams_products";
import { getUser } from "@/utils/auth";
import { source } from "@/database";
import { Team, Tech } from "@/entity";
import { isUserInTeamAndThrow } from "@/utils/isUserInTeamAndThrow";
import { Product } from "@/entity/Product";
import { FastifyInstance } from "fastify";
import { Comment } from "@/entity";
import { ProductToTech } from "@/entity/ProductToTech";

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

const post_teams_teamId_products: RouteHandlerMethodWrapper<{
  Params: ITeamParams;
  Body: IPostTeamsProductsBody;
  Reply: ITeamsProductsResponse;
}> = async (request, reply) => {
  const { name, comments, productToTech } = request.body.product;
  const teamId = request.params.teamId;
  const user = await getUser(request);
  const team = await source.manager.findOne(Team, { where: { id: teamId } });
  if (!team) throw new Error("The team is not found.");
  isUserInTeamAndThrow(user, team);
  const product = new Product();
  product.name = name;
  product.team = team;
  product.comments = await Promise.all(
    comments.map(async (id) => {
      const comment = await source.manager.findOneBy(Comment, { id });
      if (!comment) throw new Error("The comment is not found.");
      return comment;
    })
  );
  for (const name of productToTech) {
    const tech = await (async () => {
      const tech = await source.manager.findOneBy(Tech, { name });
      if (tech) return tech;
      const newTech = new Tech();
      newTech.name = name;
      await source.manager.save(newTech);
      return newTech;
    })();
    const link = new ProductToTech();
    link.product = product;
    link.tech = tech;
    await source.manager.save(link);
  }
  const products = await source.manager.find(Product, { where: { team } });
  await reply.status(200).send({ products });
};

const setupTeamsProducts = (app: FastifyInstance) => {
  app.get("/teams/:teamId/products", get_teams_teamId_products);
  app.post("/teams/:teamId/products", post_teams_teamId_products);
};

export { setupTeamsProducts };
