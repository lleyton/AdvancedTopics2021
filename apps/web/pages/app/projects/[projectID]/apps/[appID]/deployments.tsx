import { useRouter } from "next/router";
import { FC } from "react";
import AppSidebar from "../../../../../../components/AppSidebar";
import { trpc } from "../../../../../../util/trpc";

type DeploymentType = "PREVIEW" | "PRODUCTION";
type DeploymentStatus = "PENDING" | "DEPLOYING" | "ACTIVE" | "FAILED" | "DEAD";

const DepolymentRow: FC<{
  status: DeploymentStatus;
  type: DeploymentType;
  commitID: string;
  branch: string;
  commitMessage: string;
}> = ({ commitID, branch, commitMessage, status, type }) => {
  return (
    <div className="px-5 py-3 bg-neutral-800 hover:bg-neutral-700 cursor-pointer flex items-center gap-5 first:rounded-t-lg last:rounded-b-lg">
      <span className="flex h-3 w-3 relative">
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
            status === "PENDING"
              ? "bg-yellow-500"
              : status === "ACTIVE"
              ? "bg-green-500 animate-ping"
              : status === "DEAD"
              ? "bg-neutral-500"
              : status === "DEPLOYING"
              ? "bg-yellow-500 animate-ping"
              : status === "FAILED"
              ? "bg-red-500"
              : ""
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-3 w-3 ${
            status === "PENDING"
              ? "bg-yellow-500"
              : status === "ACTIVE"
              ? "bg-green-500"
              : status === "DEAD"
              ? "bg-neutral-500"
              : status === "DEPLOYING"
              ? "bg-yellow-500"
              : status === "FAILED"
              ? "bg-red-500"
              : ""
          }`}
        />
      </span>

      <div>
        <p className="font-bold">{commitMessage}</p>
        <p className="text-xs text-neutral-400">
          {commitID.slice(0, 7)} • {branch} •{" "}
          {type === "PREVIEW" ? "Preview" : "Production"} •{" "}
          {status === "PENDING"
            ? "Pending"
            : status === "ACTIVE"
            ? "Active"
            : status === "DEAD"
            ? "Dead"
            : status === "DEPLOYING"
            ? "Deploying"
            : status === "FAILED"
            ? "Failed"
            : ""}
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
              type={app.type}
              status={app.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Deployments;
