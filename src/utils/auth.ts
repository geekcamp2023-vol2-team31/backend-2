import { FastifyRequest } from "fastify";
import { source } from "@/database";
import { User } from "@/entity";

const getUser = async (request: FastifyRequest): Promise<User> => {
  const githubId = request.session.get("githubId");
  if (typeof githubId !== "number") {
    throw new Error("Unauthorized");
  }
  const user = await source.manager.findOne(User, {
    where: { githubId },
    relations: ["teamsBelongs", "teamsOwns", "userToTechs", "userToTechs.tech"],
  });
  if (!user) {
    throw new Error("Not registered");
  }
  return user;
};

export { getUser };
