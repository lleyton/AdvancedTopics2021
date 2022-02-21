import { faGit, faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faChevronRight,
  faCircleNotch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { trpc } from "../../../../../util/trpc";

const FirstStage: FC<{
  name: string;
  setName: (name: string) => void;
  setStage: (page: 0 | 1 | 2) => void;
}> = ({ name, setName, setStage }) => {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col p-5 gap-5 h-screen">
      <div className="w-96 mx-auto p-5 flex flex-col h-full items-center">
        <div className="flex items-center gap-2">
          <p className="font-bold">New app</p>
          <FontAwesomeIcon
            className="text-neutral-500 dark:text-neutral-200"
            icon={faChevronRight}
          />
          <p className="text-neutral-500 dark:text-neutral-200">Upload App</p>
          <FontAwesomeIcon
            className="text-neutral-500 dark:text-neutral-200"
            icon={faChevronRight}
          />
          <p className="text-neutral-500 dark:text-neutral-200">
            Configure App
          </p>
        </div>

        <div className="flex flex-col my-auto">
          <h1 className="font-bold text-xl">Create a new app</h1>
          <p className="mb-5">Create and deploy a new application in seconds</p>

          <label htmlFor="name" className="text-sm text-bold">
            App Name
          </label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            type="text"
            id="name"
            className="mt-2 block w-full p-4 rounded-md mb-5 bg-neutral-800 border-neutral-700"
          />

          <div className="flex items-center justify-between">
            <Link
              href={{
                pathname: "/app/projects/[projectID]/apps",
                query: { projectID: router.query["projectID"] },
              }}
            >
              Cancel
            </Link>

            <button
              type="button"
              className="bg-blue-500 p-3 w-24 rounded-lg text-white"
              disabled={name.length == 0}
              onClick={() => setStage(1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SecondStage: FC<{
  setStage: Dispatch<SetStateAction<0 | 1 | 2>>;
  setRepo: Dispatch<
    SetStateAction<{ username?: string; password?: string; repo?: string }>
  >;
  repo: {
    username?: string;
    password?: string;
    repo?: string;
  };
}> = ({ repo, setRepo, setStage }) => {
  const [selectGitRepo, setSelectGitRepo] = useState(false);
  return (
    <div className="flex flex-1 flex-col p-5 gap-5 h-screen">
      <div className="w-96 mx-auto p-5 flex flex-col h-full items-center">
        <div className="flex items-center gap-2">
          <p className="text-neutral-200">New app</p>
          <FontAwesomeIcon className="text-neutral-200" icon={faChevronRight} />
          <p className="font-bold ">Upload App</p>
          <FontAwesomeIcon className="text-neutral-200" icon={faChevronRight} />
          <p className="text-neutral-200">Configure App</p>
        </div>

        {!selectGitRepo ? (
          <div className="flex flex-col my-auto">
            <h1 className="font-bold text-xl">Connect your code</h1>
            <p className="mb-5">
              Connect your source code from GitHub or another Git provider to
              get started
            </p>

            <button
              type="button"
              className="bg-black p-3 rounded-lg font-bold flex justify-center text-white items-center"
            >
              Deploy from Github{" "}
              <FontAwesomeIcon className="ml-2" icon={faGithub} />
            </button>
            <button
              onClick={() => setSelectGitRepo(true)}
              type="button"
              className="bg-yellow-600 p-3 mt-2 rounded-lg font-bold flex justify-center text-white items-center"
            >
              Deploy from Git <FontAwesomeIcon className="ml-2" icon={faGit} />
            </button>
            <div className="flex items-center justify-between mt-5">
              <button type="button" onClick={() => setStage(0)}>
                Back
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col my-auto">
            <h1 className="font-bold text-xl">Deploy from Git</h1>
            <p className="mb-5">
              Sign in with Git username and password to deploy your app. Git
              over HTTPS is only supported.
            </p>
            <label htmlFor="name" className="text-sm text-bold">
              Repository URL
            </label>
            <input
              type="text"
              id="name"
              value={repo.repo ?? ""}
              onChange={(event) =>
                setRepo((repo) => ({
                  ...repo,
                  repo: event.target.value,
                }))
              }
              className="mt-2 block w-full p-4 rounded-md mb-5 bg-neutral-800 border-neutral-700"
            />
            <label htmlFor="username" className="text-sm text-bold">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={repo.username ?? ""}
              onChange={(event) =>
                setRepo((repo) => ({
                  ...repo,
                  username: event.target.value,
                }))
              }
              className="mt-2 block w-full p-4 rounded-md mb-5 bg-neutral-800 border-neutral-700"
            />

            <label htmlFor="password" className="text-sm text-bold">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={repo.password ?? ""}
              onChange={(event) =>
                setRepo((repo) => ({
                  ...repo,
                  password: event.target.value,
                }))
              }
              className="mt-2 block w-full p-4 rounded-md mb-5 bg-neutral-800 border-neutral-700"
            />

            <div className="flex items-center justify-between mt-0">
              <div
                onClick={() => setSelectGitRepo(false)}
                className="cursor-pointer"
              >
                Back
              </div>
              <button
                type="button"
                className="bg-blue-500 p-3 w-24 rounded-lg text-white"
                disabled={!repo.repo}
                onClick={() => setStage(2)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ThirdStage: FC<{
  setStage: Dispatch<SetStateAction<0 | 1 | 2>>;
  setSpecs: Dispatch<
    SetStateAction<{
      minReplicas?: number;
      maxReplicas?: number;
      model?: "LIGHT" | "BASIC" | "PLUS" | "UBER";
    }>
  >;
  submit: () => void;
  specs: {
    minReplicas?: number;
    maxReplicas?: number;
    model?: "LIGHT" | "BASIC" | "PLUS" | "UBER";
  };
  isSubmitting: boolean;
}> = ({ specs, setSpecs, setStage, submit, isSubmitting }) => {
  return (
    <div className="flex flex-1 flex-col p-5 gap-5 h-screen">
      <div className="w-96 mx-auto p-5 flex flex-col h-full items-center">
        <div className="flex items-center gap-2">
          <p className="text-neutral-200">New app</p>
          <FontAwesomeIcon className="text-neutral-200" icon={faChevronRight} />
          <p className="text-neutral-200">Upload App</p>
          <FontAwesomeIcon className="text-neutral-200" icon={faChevronRight} />
          <p className="font-bold">Configure App</p>
        </div>

        <div className="flex flex-col my-auto">
          <h1 className="font-bold text-xl">Configure a new app</h1>
          <p className="mb-5">
            Configure your app to make sure it runs smoothly.
          </p>

          <label htmlFor="min-replicas" className="text-sm text-bold">
            Minimum Replicas
          </label>
          <input
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            onChange={(event) => {
              setSpecs((specs) => ({
                ...specs,
                minReplicas: Number(event.target.value),
              }));
            }}
            value={specs.minReplicas}
            type="text"
            id="min-replicas"
            min={1}
            className="mt-2 block w-full p-4 rounded-md mb-5 bg-neutral-800 border-neutral-700"
          />

          <label htmlFor="max-replicas" className="text-sm text-bold">
            Maximum Replicas
          </label>
          <input
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            onChange={(event) => {
              setSpecs((specs) => ({
                ...specs,
                maxReplicas: Number(event.target.value),
              }));
            }}
            value={specs.maxReplicas}
            type="text"
            id="max-replicas"
            min={1}
            className="mt-2 block w-full p-4 rounded-md mb-5 bg-neutral-800 border-neutral-700"
          />

          <label htmlFor="name" className="text-sm text-bold">
            Container Type
          </label>
          <select
            onChange={(event) => {
              setSpecs((specs) => ({
                ...specs,
                model: event.target.value as any,
              }));
            }}
            value={specs.model}
            defaultValue="LIGHT"
            className="mt-2 block w-full p-4 rounded-md mb-5 bg-neutral-800 border-neutral-700"
          >
            <option value="LIGHT">Light</option>
            <option value="BASIC">Basic</option>
            <option value="PLUS">Plus</option>
            <option value="UBER">Über</option>
          </select>

          <div className="flex items-center justify-between">
            <button type="button" onClick={() => setStage(1)}>
              Back
            </button>

            <button
              type="button"
              className="bg-inndigo p-3 w-24 rounded-lg text-white"
              onClick={() => submit()}
              disabled={isSubmitting}
            >
              {!isSubmitting ? (
                "Complete"
              ) : (
                <FontAwesomeIcon
                  icon={faCircleNotch}
                  size="2x"
                  className="animate-spin text-white"
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Create = () => {
  const router = useRouter();
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const [name, setName] = useState("");
  const [repo, setRepo] = useState<{
    username?: string;
    password?: string;
    repo?: string;
  }>({});
  const [specs, setSpecs] = useState<{
    minReplicas?: number;
    maxReplicas?: number;
    model?: "LIGHT" | "BASIC" | "PLUS" | "UBER";
  }>({});

  const trpcContext = trpc.useContext();

  const createApp = trpc.useMutation("apps.create", {
    async onSuccess() {
      await trpcContext.refetchQueries([
        "apps.all",
        { projectID: router.query["projectID"] as string },
      ]);
      router.push({
        pathname: "/app/projects/[projectID]/apps",
        query: { projectID: router.query["projectID"] },
      });
    },
  });

  const stages = [
    <FirstStage name={name} setName={setName} setStage={setStage} />,
    <SecondStage setStage={setStage} repo={repo} setRepo={setRepo} />,
    <ThirdStage
      setStage={setStage}
      specs={specs}
      setSpecs={setSpecs}
      submit={() => {
        const fullURL = `https://${repo?.username ? repo.username : ""}${
          repo?.password ? ":" + repo.password : ""
        }${repo?.username ? "@" : ""}${repo.repo}`;
        createApp.mutate({
          projectID: router.query["projectID"] as string,
          name,
          repo: fullURL,
          minReplicas: specs.minReplicas!,
          maxReplicas: specs.maxReplicas!,
          model: specs.model!,
        });
      }}
      isSubmitting={createApp.isLoading}
    />,
  ];

  return stages[stage];
};

export default Create;
