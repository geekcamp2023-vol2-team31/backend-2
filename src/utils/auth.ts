import { FastifyRequest } from "fastify";
import { source } from "@/database";
import { User } from "@/entity";

const getUser = async (request: FastifyRequest): Promise<User> => {
  const email = request.session.get("email");
  if (typeof email !== "string") {
    throw new Error("Unauthorized");
  }
  const user = await source.manager.findOne(User, {
    where: { email },
    relations: ["teamsBelongs", "teamsOwns", "userToTechs", "userToTechs.tech"],
  });
  if (!user) {
    throw new Error("Not registered");
  }
  return user;
};

export { getUser };
