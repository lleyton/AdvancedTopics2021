import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
  }

  public async ready() {
    // App is ready
    require('@ioc:Rocketseat/Bull').add('PollGit', {}, { repeat: { cron: '*/5 * * * *' } })
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
