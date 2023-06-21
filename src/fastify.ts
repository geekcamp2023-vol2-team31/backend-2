import { FastifyInstance } from "fastify";
import { setupUsers } from "@/endpoints";
import { setupAuth } from "@/endpoints/auth";

const registerEndpointHandler = (app: FastifyInstance) => {
  setupAuth(app);
  setupUsers(app);
};

export { registerEndpointHandler };
