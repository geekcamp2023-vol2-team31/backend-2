import { FastifyInstance } from "fastify";
import { setupUsers, setupAuth, setupTeams, setupTechs } from "@/endpoints";

const registerEndpointHandler = (app: FastifyInstance) => {
  setupAuth(app);
  setupUsers(app);
  setupTeams(app);
  setupTechs(app);
};

export { registerEndpointHandler };
