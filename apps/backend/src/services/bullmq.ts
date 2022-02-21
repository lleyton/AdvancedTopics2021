import { Queue, Worker, QueueEvents } from "bullmq";
import git from "isomorphic-git";
import http from "isomorphic-git/http/node";
import { prisma } from "./prisma";
import fs from "fs";
import promisesFs from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";
import { exec as execCb } from "child_process";
import util from "util";
import { nomad } from "./nomad";
const exec = util.promisify(execCb);

const gitQueue = new Queue("git", {
  connection: {
    host: process.env["REDIS_HOST"]!,
    port: parseInt(process.env["REDIS_PORT"]!),
  },
});
const deployQueue = new Queue("deploy", {
  connection: {
    host: process.env["REDIS_HOST"]!,
    port: parseInt(process.env["REDIS_PORT"]!),
  },
});
const deployQueueEvents = new QueueEvents("deploy", {
  connection: {
    host: process.env["REDIS_HOST"]!,
    port: parseInt(process.env["REDIS_PORT"]!),
  },
});

new Worker(
  "git",
  async (job) => {
    const apps = await prisma.app.findMany();

    apps.forEach(async (app) => {
      const refs = await git.listServerRefs({
        http,
        url: app.repo,
        prefix: "refs/heads/",
      });

      const tmpUUID = randomUUID();
      const tmpPath = path.join("/tmp", tmpUUID);

      await promisesFs.mkdir(tmpPath);

      await git.clone({
        http,
        fs,
        url: app.repo,
        dir: tmpPath,
      });

      refs
        .filter((ref) => /^refs\/heads\/(.+)$/.test(ref.ref))
        .forEach(async (ref) => {
          const deployment = await prisma.deployment.findFirst({
            where: {
              appID: app.id,
              commitID: ref.oid,
            },
          });

          if (deployment) return;

          const commit = await git.readCommit({
            fs,
            dir: tmpPath,
            oid: ref.oid,
          });

          const newDeployment = await prisma.deployment.create({
            data: {
              appID: app.id,
              commitID: ref.oid,
              status: "PENDING",
              branch: ref.ref.match(/^refs\/heads\/(.+)$/)![1],
              type: "PREVIEW",
              commitMessage: commit.commit.message,
            },
          });

          await deployQueue.add("DeployCommit", newDeployment.id);
        });
    });
  },
  {
    connection: {
      host: process.env["REDIS_HOST"]!,
      port: parseInt(process.env["REDIS_PORT"]!),
    },
  }
);

const generateJob = ({
  id,
  domain,
  image,
  variables,
}: {
  id: string;
  domain: string;
  image: string;
  variables: Record<string, string>;
}) => ({
  ID: id,
  Datacenters: ["hel-1"],
  TaskGroups: [
    {
      Name: "app",
      Tasks: [
        {
          Name: "app",
          Driver: "docker",
          Config: {
            ports: ["http"],
            auth: [
              {
                username: "root",
                password: process.env["REGISTRY_TOKEN"]!,
                server_address: "https://registry.sys.innatical.cloud",
              },
            ],
            image: `registry.sys.innatical.cloud/${image}:latest`,
          },
          Env: variables,
          Services: [
            {
              Name: id,
              PortLabel: "http",
              Tags: ["inngress"],
              Checks: [
                {
                  Name: "alive",
                  Type: "tcp",
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
              Label: "http",
              Value: 0,
              To: 3000,
              HostNetwork: "default",
            },
          ],
        },
      ],
    },
  ],
});

new Worker(
  "deploy",
  async (job) => {
    const { data } = job;
    const deployment = await prisma.deployment.findUnique({
      where: {
        id: data,
      },
      include: {
        app: true,
      },
    });

    if (!deployment) return;

    const tmpPath = path.join("/tmp", deployment.id);

    await git.clone({
      fs,
      http,
      dir: tmpPath,
      url: deployment.app.repo,
    });

    await git.checkout({
      fs,
      dir: tmpPath,
      ref: deployment.commitID,
    });

    const rawBuildVariables = await prisma.variable.findMany({
      where: {
        appID: deployment.appID,
        scope: deployment.type,
        usage: "BUILD",
      },
    });

    const tmpEnvPath = path.join("/tmp", deployment.id + ".env");

    if (rawBuildVariables.length > 0) {
      await promisesFs.writeFile(
        tmpEnvPath,
        rawBuildVariables.map((v) => v.name + "=" + v.value).join("\n")
      );
    }

    // TODO: So fucking sketch but it works
    await exec(
      `pack build ${deployment.id} -B paketobuildpacks/builder:full ${
        rawBuildVariables.length > 0 ? "--env-file " + tmpEnvPath : ""
      }`,
      { cwd: tmpPath }
    );
    await exec(
      `docker tag ${deployment.id}:latest registry.sys.innatical.cloud/${deployment.id}:latest`
    );
    await exec(
      `docker push registry.sys.innatical.cloud/${deployment.id}:latest`
    );

    const rawRunVariables = await prisma.variable.findMany({
      where: {
        appID: deployment.appID,
        scope: deployment.type,
        usage: "RUN",
      },
    });

    const runVariables = Object.fromEntries(
      rawRunVariables.map((v) => [v.name, v.value])
    );

    await nomad.post("/jobs", {
      Job: generateJob({
        id: deployment.id,
        domain: deployment.id + ".identifier.app",
        image: deployment.id,
        variables: runVariables,
      }),
    });
  },
  {
    connection: {
      host: process.env["REDIS_HOST"]!,
      port: parseInt(process.env["REDIS_PORT"]!),
    },
  }
);

deployQueueEvents.on("failed", async (job) => {
  const { data } = job as any;

  await prisma.deployment.update({
    where: {
      id: data,
    },
    data: {
      status: "FAILED",
    },
  });
});

deployQueueEvents.on("completed", async (job) => {
  const { data } = job as any;

  await prisma.deployment.update({
    where: {
      id: data,
    },
    data: {
      status: "ACTIVE",
    },
  });
});

gitQueue.add(
  "PollGit",
  {},
  {
    repeat: {
      cron: "*/5 * * * *",
    },
  }
);
