import { FastifyInstance } from "fastify";

const setupWebsocketServer = (app: FastifyInstance) => {
  app.io.on("connection", (socket) => {
    console.log("socket connected");
    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });
  });
};

export { setupWebsocketServer };
