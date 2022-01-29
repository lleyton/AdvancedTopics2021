import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { id } from 'Config/auth'
import { db } from 'Config/db'

export default class AuthRequest {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const token = ctx.request.header('authorization')
    if (!token) return ctx.response.unauthorized({ error: 'AuthorizationRequired' })

    let res
    try {
      res = await id.getUserFromToken(token)
    } catch {
      return ctx.response.unauthorized({ error: 'InvalidToken' })
    }

    await db.user.upsert({
      where: {
        id: res.id,
      },
      update: {},
      create: {
        id: res.id,
      },
    })

    ctx.user = res
    await next()
  }
}
