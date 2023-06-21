import type { RouteHandlerMethodWrapper } from "@/endpoints/RouteHandlerMethodWrapper";
import { source } from "@/database";
import { User } from "@/entity";
import { FastifyInstance } from "fastify";

const post_auth: RouteHandlerMethodWrapper<{
  Body: { token: string };
  Reply: {
    type: "AuthResponse";
    status: string;
    message: string;
    isFirstLogin: boolean;
  };
}> = async (request, reply) => {
  const { token } = request.body;
  const req = await fetch(`https://api.github.com/user`, {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  if (req.status !== 200) {
    await reply.code(401).send({
      type: "AuthResponse",
      status: "fail",
      message: "Invalid token",
      isFirstLogin: false,
    });
  }
  const res = (await req.json()) as unknown as { email: string };
  request.session.set("email", res.email);
  const user = await source.manager.findOneBy(User, { email: res.email });
  await reply.send({
    type: "AuthResponse",
    status: "ok",
    message: "Successfully authenticated",
    isFirstLogin: !user,
  });
};

const delete_auth: RouteHandlerMethodWrapper<{
  Body: undefined;
  Reply: {
    type: "LogoutResponse";
  };
}> = async (request, reply) => {
  request.session.set("email", undefined);
  await reply.send({
    type: "LogoutResponse",
  });
};

const setupAuth = (app: FastifyInstance) => {
  app.post("/auth", post_auth);
  app.delete("/auth", delete_auth);
};

export { setupAuth };
