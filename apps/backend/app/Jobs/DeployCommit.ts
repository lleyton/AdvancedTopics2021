import { JobContract } from '@ioc:Rocketseat/Bull'
import { db } from 'Config/db'
import git from 'isomorphic-git'
import fs from 'fs'
import fsPromises from 'fs/promises'
import http from 'isomorphic-git/http/node'
import path from 'path'
import util from 'util'
import { exec as execCb } from 'child_process'
import Env from '@ioc:Adonis/Core/Env'
import { nomad } from 'Config/nomad'
const exec = util.promisify(execCb)

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

const generateJob = ({
  id,
  domain,
  image,
  variables,
}: {
  id: string
  domain: string
  image: string
  variables: Record<string, string>
}) => ({
  ID: id,
  Datacenters: ['hel-1'],
  TaskGroups: [
    {
      Name: 'app',
      Tasks: [
        {
          Name: 'app',
          Driver: 'docker',
          Config: {
            ports: ['http'],
            auth: [
              {
                username: 'root',
                password: Env.get('REGISTRY_TOKEN'),
                server_address: 'https://registry.sys.innatical.cloud',
              },
            ],
            image: `registry.sys.innatical.cloud/${image}:latest`,
          },
          Env: variables,
          Services: [
            {
              Name: id,
              PortLabel: 'http',
              Tags: ['inngress'],
              Checks: [
                {
                  Name: 'alive',
                  Type: 'tcp',
                  Interval: 10000000000,
                  Timeout: 2000000000,
                },
              ],
              Meta: {
                domain,
              },
            },
          ],
          Resources: {
            CPU: 100,
            MemoryMB: 256,
          },
        },
      ],
      Networks: [
        {
          DynamicPorts: [
            {
              Label: 'http',
              Value: 0,
              To: 3000,
              HostNetwork: 'default',
            },
          ],
        },
      ],
    },
  ],
})

export default class DeployCommit implements JobContract {
  public key = 'DeployCommit'

  public async handle(job) {
    const { data } = job
    const deployment = await db.deployment.findUnique({
      where: {
        id: data,
      },
      include: {
        app: true,
      },
    })

    if (!deployment) return

    const tmpPath = path.join('/tmp', deployment.id)

    await git.clone({
      fs,
      http,
      dir: tmpPath,
      url: deployment.app.repo,
    })

    await git.checkout({
      fs,
      dir: tmpPath,
      ref: deployment.commitID,
    })

    const rawBuildVariables = await db.variable.findMany({
      where: {
        appID: deployment.appID,
        scope: deployment.type,
        usage: 'BUILD',
      },
    })

    const tmpEnvPath = path.join('/tmp', deployment.id + '.env')

    if (rawBuildVariables.length > 0) {
      await fsPromises.writeFile(
        tmpEnvPath,
        rawBuildVariables.map((v) => v.name + '=' + v.value).join('\n')
      )
    }

    // TODO: So fucking sketch but it works
    await exec(
      `pack build ${deployment.id} -B paketobuildpacks/builder:full ${
        rawBuildVariables.length > 0 ? '--env-file ' + tmpEnvPath : ''
      }`,
      { cwd: tmpPath }
    )
    await exec(
      `docker tag ${deployment.id}:latest registry.sys.innatical.cloud/${deployment.id}:latest`
    )
    await exec(`docker push registry.sys.innatical.cloud/${deployment.id}:latest`)

    const rawRunVariables = await db.variable.findMany({
      where: {
        appID: deployment.appID,
        scope: deployment.type,
        usage: 'RUN',
      },
    })

    const runVariables = Object.fromEntries(rawRunVariables.map((v) => [v.name, v.value]))

    await nomad.post('/jobs', {
      Job: generateJob({
        id: deployment.id,
        domain: deployment.id + '.identifier.app',
        image: deployment.id,
        variables: runVariables,
      }),
    })
  }

  public async onFailed(job) {
    const { data } = job

    await db.deployment.update({
      where: {
        id: data,
      },
      data: {
        status: 'FAILED',
      },
    })
  }

  public async onCompleted(job) {
    const { data } = job

    await db.deployment.update({
      where: {
        id: data,
      },
      data: {
        status: 'ACTIVE',
      },
    })
  }
}
