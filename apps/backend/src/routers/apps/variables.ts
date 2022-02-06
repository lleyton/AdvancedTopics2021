import * as trpc from "@trpc/server";
import { Context } from "../../constants";
import { prisma } from "../../services/prisma";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const variables = trpc
  .router<Context>()
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
    input: z.object({ projectID: z.string(), appID: z.string() }),
    async resolve({ ctx, input }) {
      const projectID = input.projectID;
      const appID = input.appID;

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

      const app = await prisma.app.findUnique({
        where: {
          id: appID,
        },
      });

      if (!app || app.projectID !== projectID)
        throw new TRPCError({ code: "NOT_FOUND" });

      const variables = await prisma.variable.findMany({
        where: {
          appID,
        },
      });

      return variables;
    },
  })
  .mutation("create", {
    input: z.object({
      usage: z.enum(["BUILD", "RUN"]),
      scope: z.enum(["PREVIEW", "PRODUCTION"]),
      name: z.string(),
      value: z.string(),
      projectID: z.string(),
      appID: z.string(),
    }),
    async resolve({ ctx, input }) {
      const projectID = input.projectID;
      const appID = input.appID;

      if (
        !(await prisma.member.findUnique({
          where: {
            userID_projectID: {
              userID: ctx.user!.id,
              projectID,
            },
          },
        }))
      )
        throw new TRPCError({ code: "NOT_FOUND" });

      const app = await prisma.app.findUnique({
        where: {
          id: appID,
        },
      });

      if (!app || app.projectID !== projectID)
        throw new TRPCError({ code: "NOT_FOUND" });

      const variable = await prisma.variable.create({
        data: {
          appID,
          usage: input.usage,
          scope: input.scope,
          name: input.name,
          value: input.usage,
        },
      });

      return variable.id;
    },
  })
  .mutation("update", {
    input: z.object({
      usage: z.enum(["BUILD", "RUN"]),
      scope: z.enum(["PREVIEW", "PRODUCTION"]),
      name: z.string(),
      value: z.string(),
      projectID: z.string(),
      appID: z.string(),
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const projectID = input.projectID;
      const appID = input.appID;
      const variableID = input.id;

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

      const app = await prisma.app.findUnique({
        where: {
          id: appID,
        },
      });

      if (!app || app.projectID !== projectID)
        throw new TRPCError({ code: "NOT_FOUND" });

      if (
        !(await prisma.variable.findUnique({
          where: {
            id: variableID,
          },
        }))
      )
        throw new TRPCError({ code: "NOT_FOUND" });

      await prisma.variable.update({
        where: {
          id: variableID,
        },
        data: {
          usage: input.usage,
          scope: input.scope,
          name: input.name,
          value: input.usage,
        },
      });
    },
  })
  .mutation("delete", {
    input: z.object({
      projectID: z.string(),
      appID: z.string(),
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const projectID = input.projectID;
      const appID = input.appID;
      const variableID = input.id;

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

      const app = await prisma.app.findUnique({
        where: {
          id: appID,
        },
      });

      if (!app || app.projectID !== projectID)
        throw new TRPCError({ code: "NOT_FOUND" });

      if (
        !(await prisma.variable.findUnique({
          where: {
            id: variableID,
          },
        }))
      )
        throw new TRPCError({ code: "NOT_FOUND" });

      await prisma.variable.delete({
        where: {
          id: variableID,
        },
      });
    },
  });
