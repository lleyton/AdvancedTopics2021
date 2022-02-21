import {
  faServer,
  faUserGroup,
  faCog,
  faDashboard,
  faComment,
  faCodeCommit,
  faChartArea,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../util/trpc";

const AppSidebar = () => {
  const router = useRouter();
  const app = trpc.useQuery(
    [
      "apps.get",
      {
        id: router.query["appID"] as string,
        projectID: router.query["projectID"] as string,
      },
    ],
    {
      enabled: !!(router.query["appID"] && router.query["projectID"]),
    }
  );

  return (
    <div className="p-3 w-full max-w-[250px] bg-neutral-800">
      <h1 className="text-3xl font-black mb-2">{app.data?.name}</h1>
      <div className="flex flex-col gap-1">
        <Link
          href={{
            pathname: "/app/projects/[projectID]/apps/[appID]/overview",
            query: {
              projectID: router.query["projectID"],
              appID: router.query["appID"],
            },
          }}
        >
          <a
            className={`flex p-2 gap-2 text-md items-center rounded-md hover:bg-neutral-700 cursor-pointer ${
              router.pathname ===
              `/app/projects/[projectID]/apps/[appID]/overview`
                ? "bg-blue-500"
                : ""
            }`}
          >
            <FontAwesomeIcon icon={faChartArea} fixedWidth />
            <span>Overview</span>
          </a>
        </Link>
        <Link
          href={{
            pathname: "/app/projects/[projectID]/apps/[appID]/deployments",
            query: {
              projectID: router.query["projectID"],
              appID: router.query["appID"],
            },
          }}
        >
          <a
            className={`flex p-2 gap-2 text-md items-center rounded-md hover:bg-neutral-700 cursor-pointer ${
              router.pathname ===
              `/app/projects/[projectID]/apps/[appID]/deployments`
                ? "bg-blue-500"
                : ""
            }`}
          >
            <FontAwesomeIcon icon={faCodeCommit} fixedWidth />
            <span>Deployments</span>
          </a>
        </Link>
        <Link
          href={{
            pathname: "/app/projects/[projectID]/apps/[appID]/settings",
            query: {
              projectID: router.query["projectID"],
              appID: router.query["appID"],
            },
          }}
        >
          <a
            className={`flex p-2 gap-2 text-md items-center rounded-md hover:bg-neutral-700 cursor-pointer ${
              router.pathname ===
              `/app/projects/[projectID]/apps/[appID]/settings`
                ? "bg-blue-500"
                : ""
            }`}
          >
            <FontAwesomeIcon icon={faCog} fixedWidth />
            <span>Settings</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default AppSidebar;
