import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { id } from 'Config/auth'
import { db } from 'Config/db'

export default class AuthRequest {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const token = ctx.request.header('authorization')
    if (!token) return ctx.response.unauthorized({ error: 'AuthorizationRequired' })

    const res = await id.getUserInfo(token)
    if (!res.ok) return ctx.response.unauthorized({ error: 'InvalidToken' })

    await db.user.upsert({
      where: {
        id: res.user.id,
      },
      update: {},
      create: {
        id: res.user.id,
      },
    })

    ctx.user = res.user
    await next()
  }
}
