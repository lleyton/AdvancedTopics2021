import { useRouter } from "next/router";
import { FC } from "react";
import AppSidebar from "../../../../../../components/AppSidebar";
import { trpc } from "../../../../../../util/trpc";

const DepolymentRow: FC<{
  // status;
  // type;
  commitID: string;
  branch: string;
  commitMessage: string;
}> = ({ commitID, branch, commitMessage }) => {
  return (
    <div className="px-5 py-3 bg-neutral-800 hover:bg-neutral-700 cursor-pointer flex items-center gap-5 first:rounded-t-lg last:rounded-b-lg">
      <span className="flex h-3 w-3 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
      </span>

      <div>
        <p className="font-bold">{commitMessage}</p>
        <p className="text-xs text-neutral-400">
          {commitID.slice(0, 7)} • {branch}
          {/* {model === "LIGHT"
            ? "Light"
            : model === "BASIC"
            ? "Basic"
            : model === "PLUS"
            ? "Plus"
            : model === "UBER"
            ? "Über"
            : ""}{" "}
          • 10 Replicas */}
        </p>
      </div>
    </div>
  );
};

const Deployments = () => {
  const router = useRouter();

  const deployments = trpc.useQuery(
    [
      "apps.deployments.all",
      {
        id: router.query["appID"] as string,
        projectID: router.query["projectID"] as string,
      },
    ],
    {
      enabled: !!(router.query["appID"] || router.query["projectID"]),
    }
  );

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex flex-col gap-3 flex-1 p-5">
        <div className="flex items-center">
          <h1 className="font-bold text-xl">Deployments</h1>
        </div>
        <div className="flex-col flex-1 divide-y-[0.75px] divide-neutral-700">
          {deployments.data?.map((app) => (
            <DepolymentRow
              key={app.id}
              commitID={app.commitID}
              commitMessage={app.commitMessage}
              branch={app.branch}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Deployments;
