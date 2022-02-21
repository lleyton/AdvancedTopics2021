import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import ProjectSidebar from "../../../../../components/ProjectSidebar";
import { trpc } from "../../../../../util/trpc";

const AppRow: FC<{
  id: string;
  name: string;
  model: "LIGHT" | "BASIC" | "PLUS" | "UBER";
}> = ({ name, model, id }) => {
  const router = useRouter();

  return (
    <Link
      href={{
        pathname: "/app/projects/[projectID]/apps/[appID]",
        query: { projectID: router.query["projectID"], appID: id },
      }}
    >
      <div className="px-5 py-3 bg-neutral-800 hover:bg-neutral-700 cursor-pointer flex items-center gap-5 first:rounded-t-lg last:rounded-b-lg">
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
        </span>

        <div>
          <p className="font-bold">{name}</p>
          <p className="text-xs text-neutral-400">
            {model === "LIGHT"
              ? "Light"
              : model === "BASIC"
              ? "Basic"
              : model === "PLUS"
              ? "Plus"
              : model === "UBER"
              ? "Über"
              : ""}{" "}
            • 10 Replicas
          </p>
        </div>
      </div>
    </Link>
  );
};

const Apps = () => {
  const router = useRouter();
  const apps = trpc.useQuery(
    ["apps.all", { projectID: router.query["projectID"] as string }],
    { enabled: !!router.query["projectID"] }
  );

  return (
    <div className="flex min-h-screen">
      <ProjectSidebar />
      <div className="flex flex-col gap-3 flex-1 p-5">
        <div className="flex items-center">
          <h1 className="font-bold text-xl">Apps</h1>
          <button
            type="button"
            className="hover:text-blue-500 ml-auto text-xl"
            onClick={() =>
              router.push({
                pathname: "/app/projects/[projectID]/apps/create",
                query: { projectID: router.query["projectID"] },
              })
            }
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <div className="flex-col flex-1 divide-y-[0.75px] divide-neutral-700">
          {apps.data?.map((app) => (
            <AppRow
              key={app.id}
              name={app.name}
              model={app.model}
              id={app.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Apps;
