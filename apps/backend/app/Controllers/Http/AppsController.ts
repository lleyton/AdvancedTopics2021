import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CreateAppValidator } from 'App/Validators/CreateAppValidator'
import { PostVariableValidator } from 'App/Validators/PostVariableValidator'
import { UpdateAppValidator } from 'App/Validators/UpdateAppValidator'
import { db } from 'Config/db'

export default class AppsController {
  public async getApps(ctx: HttpContextContract) {
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
      return ctx.response.notFound({ error: 'ProjectNotFound' })

    const project = await db.project.findUnique({
      where: {
        id: projectID,
      },
      include: {
        apps: true,
      },
    })

    if (!project) return ctx.response.notFound({ error: 'ProjectNotFound' })

    ctx.response.ok(project.apps.map((app) => ({ ...app, createdAt: app.createdAt.toISOString() })))
  }

  public async getApp(ctx: HttpContextContract) {
    const projectID = ctx.request.param('id')
    const appID = ctx.request.param('appID')

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
      return ctx.response.notFound({ error: 'ProjectNotFound' })

    const project = await db.project.findUnique({
      where: {
        id: projectID,
      },
    })

    if (!project) return ctx.response.notFound({ error: 'ProjectNotFound' })

    const app = await db.app.findUnique({
      where: {
        id: appID,
      },
    })

    if (!app || app.projectID !== projectID) return ctx.response.notFound({ error: 'AppNotFound' })

    return ctx.response.ok(app)
  }

  public async updateApp(ctx: HttpContextContract) {
    const payload = UpdateAppValidator.safeParse(ctx.request.body())
    if (!payload.success) return ctx.response.badRequest({ error: payload.error })

    const projectID = ctx.request.param('id')
    const appID = ctx.request.param('appID')

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
      return ctx.response.notFound({ error: 'ProjectNotFound' })

    const project = await db.project.findUnique({
      where: {
        id: projectID,
      },
    })

    if (!project) return ctx.response.notFound({ error: 'ProjectNotFound' })

    const app = await db.app.findUnique({
      where: {
        id: appID,
      },
    })

    if (!app || app.projectID !== projectID) return ctx.response.notFound({ error: 'AppNotFound' })

    await db.app.update({
      where: {
        id: appID,
      },
      data: payload.data,
    })

    return ctx.response.ok(undefined)
  }

  public async createApp(ctx: HttpContextContract) {
    const payload = CreateAppValidator.safeParse(ctx.request.body())
    if (!payload.success) return ctx.response.badRequest({ error: payload.error })

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
      return ctx.response.notFound({ error: 'ProjectNotFound' })

    const app = await db.app.create({
      data: {
        ...payload.data,
        project: {
          connect: {
            id: projectID,
          },
        },
      },
    })

    ctx.response.ok({ id: app.id })
  }

  public async getDeployments(ctx: HttpContextContract) {
    const projectID = ctx.request.param('id')
    const appID = ctx.request.param('appID')
    const query = ctx.request.qs()

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
      return ctx.response.notFound({ error: 'ProjectNotFound' })

    const app = await db.app.findUnique({
      where: {
        id: appID,
      },
    })

    if (!app || app.projectID !== projectID) return ctx.response.notFound({ error: 'AppNotFound' })

    const deployments = await db.deployment.findMany({
      take: 25,
      skip: query.lastID ? 1 : 0,
      where: {
        appID,
      },
      orderBy: {
        createdAt: 'desc',
      },
      ...(query.lastID
        ? {
            cursor: {
              id: query.lastID,
            },
          }
        : {}),
    })

    ctx.response.ok(deployments)
  }

  public async postVariable(ctx: HttpContextContract) {
    const payload = PostVariableValidator.safeParse(ctx.request.body())
    if (!payload.success) return ctx.response.badRequest({ error: payload.error })

    const projectID = ctx.request.param('id')
    const appID = ctx.request.param('appID')

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
      return ctx.response.notFound({ error: 'ProjectNotFound' })

    const app = await db.app.findUnique({
      where: {
        id: appID,
      },
    })

    if (!app || app.projectID !== projectID) return ctx.response.notFound({ error: 'AppNotFound' })

    const variable = await db.variable.create({
      data: {
        appID,
        ...payload.data,
      },
    })

    return ctx.response.ok({ id: variable.id })
  }

  public async updateVariable(ctx: HttpContextContract) {
    const payload = PostVariableValidator.safeParse(ctx.request.body())
    if (!payload.success) return ctx.response.badRequest({ error: payload.error })

    const projectID = ctx.request.param('id')
    const appID = ctx.request.param('appID')
    const variableID = ctx.request.param('variableID')

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
      return ctx.response.notFound({ error: 'ProjectNotFound' })

    const app = await db.app.findUnique({
      where: {
        id: appID,
      },
    })

    if (!app || app.projectID !== projectID) return ctx.response.notFound({ error: 'AppNotFound' })

    if (
      !(await db.variable.findUnique({
        where: {
          id: variableID,
        },
      }))
    )
      return ctx.response.notFound({ error: 'VariableNotFound' })

    await db.variable.update({
      where: {
        id: variableID,
      },
      data: {
        ...payload.data,
      },
    })

    return ctx.response.ok(undefined)
  }

  public async deleteVariable(ctx: HttpContextContract) {
    const projectID = ctx.request.param('id')
    const appID = ctx.request.param('appID')
    const variableID = ctx.request.param('variableID')

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
      return ctx.response.notFound({ error: 'ProjectNotFound' })

    const app = await db.app.findUnique({
      where: {
        id: appID,
      },
    })

    if (!app || app.projectID !== projectID) return ctx.response.notFound({ error: 'AppNotFound' })

    if (
      !(await db.variable.findUnique({
        where: {
          id: variableID,
        },
      }))
    )
      return ctx.response.notFound({ error: 'VariableNotFound' })

    await db.variable.delete({
      where: {
        id: variableID,
      },
    })

    return ctx.response.ok(undefined)
  }

  public async getVariables(ctx: HttpContextContract) {
    const projectID = ctx.request.param('id')
    const appID = ctx.request.param('appID')
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
      return ctx.response.notFound({ error: 'ProjectNotFound' })

    const app = await db.app.findUnique({
      where: {
        id: appID,
      },
    })

    if (!app || app.projectID !== projectID) return ctx.response.notFound({ error: 'AppNotFound' })

    const variables = await db.variable.findMany({
      where: {
        appID,
      },
    })

    return ctx.response.ok(variables)
  }
}
