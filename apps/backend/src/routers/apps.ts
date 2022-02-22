import * as trpc from "@trpc/server";
import { Context } from "../constants";
import { prisma } from "../services/prisma";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { variables } from "./apps/variables";
import { deployments } from "./apps/deployments";

export const apps = trpc
  .router<Context>()
  .merge("variables.", variables)
  .merge("deployments.", deployments)
  .middleware(({ ctx, next }) => {
    const user = ctx.user;
    if (!user) {
      throw new trpc.TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    return next({ ctx: { ...ctx, user } });
  })
  .query("all", {
    input: z.object({ projectID: z.string() }),
    async resolve({ ctx, input }) {
      const projectID = input.projectID;

      if (
        !(await prisma.member.findUnique({
          where: {
            userID_projectID: {
              userID: ctx.user.id,
              projectID,
            },
          },
        }))
      )
        throw new TRPCError({ code: "NOT_FOUND" });

      const project = await prisma.project.findUnique({
        where: {
          id: projectID,
        },
        include: {
          apps: {
            include: {
              _count: true,
            },
          },
        },
      });

      if (!project) throw new TRPCError({ code: "NOT_FOUND" });

      return project.apps;
    },
  })
  .query("get", {
    input: z.object({ projectID: z.string(), id: z.string() }),
    async resolve({ input, ctx }) {
      const projectID = input.projectID;
      const appID = input.id;

      if (
        !(await prisma.member.findUnique({
          where: {
            userID_projectID: {
              userID: ctx.user.id,
              projectID,
            },
          },
        }))
      )
        throw new TRPCError({ code: "NOT_FOUND" });

      const project = await prisma.project.findUnique({
        where: {
          id: projectID,
        },
      });

      if (!project) throw new TRPCError({ code: "NOT_FOUND" });

      const app = await prisma.app.findUnique({
        where: {
          id: appID,
        },
      });

      if (!app || app.projectID !== projectID)
        throw new TRPCError({ code: "NOT_FOUND" });

      return app;
    },
  })
  .mutation("create", {
    input: z.object({
      projectID: z.string(),
      name: z.string().max(32),
      repo: z
        .string()
        .max(128)
        .url()
        .regex(/^https:\/\/.+/),
      model: z.enum(["LIGHT", "BASIC", "PLUS", "UBER"]),
      minReplicas: z.number().int().min(1),
      maxReplicas: z.number().int().min(1),
    }),
    async resolve({ input, ctx }) {
      const projectID = input.projectID;

      if (
        !(await prisma.member.findUnique({
          where: {
            userID_projectID: {
              userID: ctx.user.id,
              projectID,
            },
          },
        }))
      )
        throw new TRPCError({ code: "NOT_FOUND" });

      const app = await prisma.app.create({
        data: {
          name: input.name,
          repo: input.repo,
          model: input.model,
          minReplicas: input.minReplicas,
          maxReplicas: input.maxReplicas,
          project: {
            connect: {
              id: projectID,
            },
          },
        },
      });

      return app.id;
    },
  })
  .mutation("update", {
    input: z.object({
      projectID: z.string(),
      id: z.string(),
      name: z.string().max(32).optional(),
      repo: z.string().max(128).optional(),
      model: z.enum(["LIGHT", "BASIC", "PLUS", "UBER"]).optional(),
      minReplicas: z.number().int().min(1).optional(),
      maxReplicas: z.number().int().min(1).optional(),
    }),
    async resolve({ ctx, input }) {
      const projectID = input.projectID;
      const appID = input.id;

      if (
        !(await prisma.member.findUnique({
          where: {
            userID_projectID: {
              userID: ctx.user.id,
              projectID,
            },
          },
        }))
      )
        throw new TRPCError({ code: "NOT_FOUND" });

      const project = await prisma.project.findUnique({
        where: {
          id: projectID,
        },
      });

      if (!project) throw new TRPCError({ code: "NOT_FOUND" });

      const app = await prisma.app.findUnique({
        where: {
          id: appID,
        },
      });

      if (!app || app.projectID !== projectID)
        throw new TRPCError({ code: "NOT_FOUND" });

      await prisma.app.update({
        where: {
          id: appID,
        },
        data: {
          name: input.name,
          repo: input.repo,
          model: input.model,
          minReplicas: input.minReplicas,
          maxReplicas: input.maxReplicas,
        },
      });
    },
  });
