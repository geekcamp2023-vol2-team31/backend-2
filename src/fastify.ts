import { FastifyInstance } from "fastify";
import { setupUsers } from "@/endpoints";

const registerEndpointHandler = (app: FastifyInstance) => {
  setupUsers(app);
};

export { registerEndpointHandler };
