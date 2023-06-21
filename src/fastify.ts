import { FastifyInstance } from "fastify";
import { setupUsers } from "@/endpoints";
import { setupAuth } from "@/endpoints/auth";
import { setupTeams } from "@/endpoints/teams";

const registerEndpointHandler = (app: FastifyInstance) => {
  setupAuth(app);
  setupUsers(app);
  setupTeams(app);
};

export { registerEndpointHandler };
