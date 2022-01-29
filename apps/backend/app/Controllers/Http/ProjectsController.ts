import { Role } from '@prisma/client'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CreateProjectValidator } from 'App/Validators/CreateProjectValidator'
import { PutProjectMemberValidator } from 'App/Validators/PutProjectMemberValidator'
import { db } from 'Config/db'

export default class ProjectsController {
  public async getProjects(ctx: HttpContextContract) {
    const projects = await db.project.findMany({
      where: {
        members: {
          some: {
            userID: ctx.user!.id,
          },
        },
      },
    })

    ctx.response.ok(projects)
  }

  public async getProject(ctx: HttpContextContract) {
    const projectID = ctx.request.param('id')

    if (
      !(await db.member.findUnique({
        where: {
          userID_projectID: {
            userID: ctx.user!.id,
            projectID,
          },
        },
      }))
    )
      return ctx.response.notFound({ error: 'NotFound' })

    const project = await db.project.findUnique({
      where: {
        id: projectID,
      },
    })

    if (!project) return ctx.response.notFound({ error: 'NotFound' })

    ctx.response.ok(project)
  }

  public async createProject(ctx: HttpContextContract) {
    const payload = CreateProjectValidator.safeParse(ctx.request.body())
    if (!payload.success) return ctx.response.badRequest({ error: payload.error })

    const project = await db.project.create({
      data: {
        name: payload.data.name,
        members: {
          create: {
            userID: ctx.user!.id,
            role: Role.OWNER,
          },
        },
      },
    })

    ctx.response.ok({ id: project.id })
  }

  public async getProjectMembers(ctx: HttpContextContract) {
    const projectID = ctx.request.param('id')

    if (
      !(await db.member.findUnique({
        where: {
          userID_projectID: {
            userID: ctx.user!.id,
            projectID,
          },
        },
      }))
    )
      return ctx.response.notFound({ error: 'NotFound' })

    const project = await db.project.findUnique({
      where: {
        id: projectID,
      },
      include: {
        members: true,
      },
    })

    if (!project) return ctx.response.notFound({ error: 'NotFound' })

    ctx.response.ok(project.members)
  }

  public async putProjectMember(ctx: HttpContextContract) {
    const projectID = ctx.request.param('id')
    const userID = ctx.request.param('userID')
    const payload = PutProjectMemberValidator.safeParse(ctx.request.body())
    if (!payload.success) return ctx.response.badRequest({ error: payload.error })

    const member = await db.member.findUnique({
      where: {
        userID_projectID: {
          userID: ctx.user!.id,
          projectID,
        },
      },
    })

    if (!member || member.role !== 'OWNER') return ctx.response.notFound({ error: 'NotFound' })

    if (!(await db.user.findUnique({ where: { id: userID } })))
      return ctx.response.notFound({ error: 'UserNotFound' })

    await db.member.upsert({
      where: {
        userID_projectID: {
          userID,
          projectID,
        },
      },
      update: {
        role: payload.data.role as Role,
      },
      create: {
        userID,
        projectID,
        role: payload.data.role as Role,
      },
    })

    ctx.response.ok(undefined)
  }

  public async deleteProjectMember(ctx: HttpContextContract) {
    const projectID = ctx.request.param('id')
    const userID = ctx.request.param('userID')

    const member = await db.member.findUnique({
      where: {
        userID_projectID: {
          userID: ctx.user!.id,
          projectID,
        },
      },
    })

    if (!member || member.role !== 'OWNER') return ctx.response.notFound({ error: 'NotFound' })

    await db.member.delete({
      where: {
        userID_projectID: {
          userID,
          projectID,
        },
      },
    })

    ctx.response.ok(undefined)
  }
}
