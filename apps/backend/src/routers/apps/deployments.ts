import * as trpc from "@trpc/server";
import { Context } from "../../constants";
import { prisma } from "../../services/prisma";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const deployments = trpc
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
    input: z.object({
      projectID: z.string(),
      id: z.string(),
      lastID: z.string().optional(),
    }),
    async resolve({ input, ctx }) {
      const projectID = input.projectID;
      const appID = input.id;
      const lastID = input.lastID;

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

      const deployments = await prisma.deployment.findMany({
        take: 25,
        skip: lastID ? 1 : 0,
        where: {
          appID,
        },
        orderBy: {
          createdAt: "desc",
        },
        ...(lastID
          ? {
              cursor: {
                id: lastID,
              },
            }
          : {}),
      });

      return deployments;
    },
  });
