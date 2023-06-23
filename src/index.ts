import "dotenv/config";
import { registerEndpointHandler } from "@/fastify";
import fastify from "fastify";
import cookie from "@fastify/cookie";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import cors from "@fastify/cors";
import fastifySocket from "fastify-socket.io";
import { setupWebsocketServer } from "@/websocket";
import fastifySession from "@mgcrea/fastify-session";
import { initDatabase } from "@/database";

const fastifyPort = Number(process.env.FASTIFY_PORT) || 9000;
const SESSION_TTL = Number(process.env.SESSION_TTL) || 86400;

const startFastifyServer = async (fastifyPort: number) => {
  const app = fastify().withTypeProvider<TypeBoxTypeProvider>();
  try {
    await app.register(cors, {
      origin: "*",
    });
    await app.register(fastifySocket, {});
    await app.register(cookie, {});
    await app.register(fastifySession, {
      secret: process.env.COOKIE_SECRET,
      cookie: { maxAge: SESSION_TTL },
    });
    registerEndpointHandler(app);
    await app.listen({ port: fastifyPort });
    app.ready((err) => {
      if (err) throw err;
      setupWebsocketServer(app);
    });
    console.info("init complete");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

void initDatabase().then(() => {
  void startFastifyServer(fastifyPort);
});
