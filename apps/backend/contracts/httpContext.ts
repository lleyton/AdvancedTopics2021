// contracts/httpContext.ts

declare module '@ioc:Adonis/Core/HttpContext' {
  interface HttpContextContract {
    user?: {
      id: string
      username?: string | undefined
      displayName?: string | undefined
      email?: string | undefined
      photoURL?: string | undefined
    }
  }
}
