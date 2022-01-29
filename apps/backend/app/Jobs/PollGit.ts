import Bull, { JobContract } from '@ioc:Rocketseat/Bull'
import { db } from 'Config/db'
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import DeployCommit from './DeployCommit'
import fs from 'fs'
import promisesFs from 'fs/promises'
import { randomUUID } from 'crypto'
import path from 'path'

/*
|--------------------------------------------------------------------------
| Job setup
|--------------------------------------------------------------------------
|
| This is the basic setup for creating a job, but you can override
| some settings.
|
| You can get more details by looking at the bullmq documentation.
| https://docs.bullmq.io/
*/

export default class PollGit implements JobContract {
  public key = 'PollGit'

  public async handle() {
    const apps = await db.app.findMany()

    apps.forEach(async (app) => {
      const refs = await git.listServerRefs({
        http,
        url: app.repo,
        prefix: 'refs/heads/',
      })

      const tmpUUID = randomUUID()
      const tmpPath = path.join('/tmp', tmpUUID)

      await promisesFs.mkdir(tmpPath)

      await git.clone({
        http,
        fs,
        url: app.repo,
        dir: tmpPath,
      })

      refs
        .filter((ref) => /^refs\/heads\/(.+)$/.test(ref.ref))
        .forEach(async (ref) => {
          const deployment = await db.deployment.findFirst({
            where: {
              appID: app.id,
              commitID: ref.oid,
            },
          })

          if (deployment) return

          const commit = await git.readCommit({
            fs,
            dir: tmpPath,
            oid: ref.oid,
          })

          const newDeployment = await db.deployment.create({
            data: {
              appID: app.id,
              commitID: ref.oid,
              status: 'PENDING',
              branch: ref.ref.match(/^refs\/heads\/(.+)$/)![1],
              type: 'PREVIEW',
              commitMessage: commit.commit.message,
            },
          })

          await Bull.add(new DeployCommit().key, newDeployment.id)
        })
    })
  }
}
