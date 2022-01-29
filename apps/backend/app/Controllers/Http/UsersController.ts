import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { id } from 'Config/auth'

export default class UsersController {
  public async me(ctx: HttpContextContract) {
    return ctx.response.ok(ctx.user)
  }

  public async get(ctx: HttpContextContract) {
    const userID = ctx.request.param('id')
    const res = await id.searchUser({ id: userID })
    if (!res.ok) return ctx.response.notFound({ error: 'UserNotFound' })

    return ctx.response.ok({ username: res.user.username })
  }
}
