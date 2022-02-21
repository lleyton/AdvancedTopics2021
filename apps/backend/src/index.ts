import "dotenv/config";
import * as trpc from "@trpc/server";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { id } from "./services/id";
import { TRPCError } from "@trpc/server";
import http from "http";
import { prisma } from "./services/prisma";
import { Context, port } from "./constants";
import { apps } from "./routers/apps";
import { projects } from "./routers/projects";
import './services/bullmq'

const appRouter = trpc
  .router<Context>()
  .merge("apps.", apps)
  .merge("projects.", projects);

const handler = createHTTPHandler({
  router: appRouter,
  async createContext(opts) {
    const token = opts.req.headers.authorization;
    if (!token) return {};

    let userResponse;
    try {
      userResponse = await id.getUserFromToken(token);
    } catch (e: any) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    const user = await prisma.user.upsert({
      where: {
        id: userResponse.id,
      },
      create: {
        id: userResponse.id,
      },
      update: {},
    });

    return { user };
  },
});

export type AppRouter = typeof appRouter;

const main = async () => {
  http
    .createServer((req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Request-Method", "*");
      res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
      res.setHeader("Access-Control-Allow-Headers", "*");
      if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
      }
      handler(req, res);
    })
    .listen(port, () => console.log("Backend is listening on port: " + port));
};

main();
