import * as trpc from "@trpc/server";
import { Context } from "../constants";
import { prisma } from "../services/prisma";
import { z } from "zod";
import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const projects = trpc
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
    async resolve({ ctx }) {
      const projects = await prisma.project.findMany({
        where: {
          members: {
            some: {
              userID: ctx.user.id,
            },
          },
        },
      });

      return projects.map((project) => project.id);
    },
  })
  .query("get", {
    input: z.object({ id: z.string().uuid() }),
    async resolve({ input, ctx }) {
      const projectID = input.id;

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
          _count: true,
        },
      });

      if (!project) throw new TRPCError({ code: "NOT_FOUND" });

      return project;
    },
  })
  .query("getMembers", {
    input: z.object({ id: z.string().uuid() }),
    async resolve({ input, ctx }) {
      const projectID = input.id;

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
          members: true,
        },
      });

      if (!project) throw new TRPCError({ code: "NOT_FOUND" });

      return project.members;
    },
  })
  .mutation("create", {
    input: z.object({ name: z.string() }),
    async resolve({ input, ctx }) {
      const project = await prisma.project.create({
        data: {
          name: input.name,
          members: {
            create: {
              userID: ctx.user.id,
              role: Role.OWNER,
            },
          },
        },
      });

      return project.id;
    },
  })
  .mutation("putMember", {
    input: z.object({
      id: z.string(),
      userID: z.string(),
      role: z.enum(["OWNER", "ADMIN", "NORMAL"]),
    }),
    async resolve({ input, ctx }) {
      const projectID = input.id;
      const userID = input.userID;
      const member = await prisma.member.findUnique({
        where: {
          userID_projectID: {
            userID: ctx.user.id,
            projectID,
          },
        },
      });

      if (!member || member.role !== "OWNER")
        throw new TRPCError({ code: "NOT_FOUND" });

      if (!(await prisma.user.findUnique({ where: { id: userID } })))
        throw new TRPCError({ code: "NOT_FOUND", message: "UserNotFound" });

      await prisma.member.upsert({
        where: {
          userID_projectID: {
            userID,
            projectID,
          },
        },
        update: {
          role: input.role,
        },
        create: {
          userID,
          projectID,
          role: input.role,
        },
      });
    },
  })
  .mutation("deleteMember", {
    input: z.object({ id: z.string(), userID: z.string() }),
    async resolve({ ctx, input }) {
      const projectID = input.id;
      const userID = input.userID;

      const member = await prisma.member.findUnique({
        where: {
          userID_projectID: {
            userID: ctx.user.id,
            projectID,
          },
        },
      });

      if (!member || member.role !== "OWNER")
        throw new TRPCError({ code: "NOT_FOUND" });

      await prisma.member.delete({
        where: {
          userID_projectID: {
            userID,
            projectID,
          },
        },
      });
    },
  });
