import { RouteHandlerMethodWrapper } from "@/endpoints/RouteHandlerMethodWrapper";
import { ITeamParams } from "@/@types";
import {
  ITeamsProductsBody,
  ITeamsProductsParam,
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
import { getOrCreateTech } from "@/utils/tech";
import { setupTeamsProductsTechs } from "@/endpoints/teams_products_techs";

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
  Body: ITeamsProductsBody;
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

const put_teams_teamId_products_productId: RouteHandlerMethodWrapper<{
  Params: ITeamsProductsParam;
  Body: ITeamsProductsBody;
  Reply: ITeamsProductsResponse;
}> = async (request, reply) => {
  const { name, comments, productToTech } = request.body.product;
  const { teamId, productId } = request.params;
  const user = await getUser(request);
  const team = await source.manager.findOne(Team, { where: { id: teamId } });
  if (!team) throw new Error("The team is not found.");
  isUserInTeamAndThrow(user, team);
  const product = await source.manager.findOne(Product, {
    where: { id: productId, team },
    relations: ["productToTech", "productToTech.tech"],
  });
  if (!product) {
    throw new Error("The product is not found.");
  }
  product.name = name;
  product.team = team;
  product.comments = await Promise.all(
    comments.map(async (id) => {
      const comment = await source.manager.findOneBy(Comment, { id });
      if (!comment) throw new Error("The comment is not found.");
      return comment;
    })
  );
  const oldTechs = product.productToTech.map((team) => {
    return team.tech.name;
  });
  const removed = oldTechs.filter((i) => !productToTech.includes(i));
  const added = productToTech.filter((i) => !oldTechs.includes(i));
  for (const name of removed) {
    const tech = await getOrCreateTech(name);
    const link = await source.manager.findOne(ProductToTech, {
      where: { product, tech },
    });
    await source.manager.remove(link);
  }
  for (const name of added) {
    const tech = await getOrCreateTech(name);
    const link = new ProductToTech();
    link.tech = tech;
    link.product = product;
    await source.manager.save(link);
  }
  const products = await source.manager.find(Product, { where: { team } });
  await reply.status(200).send({ products });
};

const delete_teams_teamId_products_productId: RouteHandlerMethodWrapper<{
  Params: ITeamsProductsParam;
  Reply: ITeamsProductsResponse;
}> = async (request, reply) => {
  const { teamId, productId } = request.params;
  const user = await getUser(request);
  const team = await source.manager.findOne(Team, { where: { id: teamId } });
  if (!team) throw new Error("The team is not found.");
  isUserInTeamAndThrow(user, team);
  const product = await source.manager.findOne(Product, {
    where: { id: productId, team },
    relations: ["productToTech", "productToTech.tech"],
  });
  if (!product) {
    throw new Error("The product is not found.");
  }
  await source.manager.remove(product);
  const products = await source.manager.find(Product, { where: { team } });
  await reply.status(200).send({ products });
};

const setupTeamsProducts = (app: FastifyInstance) => {
  app.get("/teams/:teamId/products", get_teams_teamId_products);
  app.post("/teams/:teamId/products", post_teams_teamId_products);
  app.put(
    "/teams/:teamId/products/:productId",
    put_teams_teamId_products_productId
  );
  app.delete(
    "/teams/:teamId/products/:productId",
    delete_teams_teamId_products_productId
  );
  setupTeamsProductsTechs(app);
};

export { setupTeamsProducts };
