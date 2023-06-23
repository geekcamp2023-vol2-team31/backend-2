import { FastifyInstance } from "fastify";
import { setupUsers, setupAuth, setupTeams } from "@/endpoints";

const registerEndpointHandler = (app: FastifyInstance) => {
  setupAuth(app);
  setupUsers(app);
  setupTeams(app);
};

export { registerEndpointHandler };
