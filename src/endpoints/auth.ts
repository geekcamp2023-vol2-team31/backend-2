import type { RouteHandlerMethodWrapper } from "@/endpoints/RouteHandlerMethodWrapper";
import { source } from "@/database";
import { User } from "@/entity";
import { FastifyInstance } from "fastify";
import { GithubUserResponse } from "@/@types/github";
import { uuid } from "@/utils/uuid";

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
    return;
  }
  const res = (await req.json()) as unknown as GithubUserResponse;
  request.session.set("githubId", res.id);
  const user = await source.manager.findOneBy(User, { githubId: res.id });
  if (!user) {
    const newUser = new User();
    newUser.id = uuid();
    newUser.bio = "";
    newUser.githubId = res.id;
    newUser.name = res.name || res.login || "";
    await source.manager.save(newUser);
  }
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
