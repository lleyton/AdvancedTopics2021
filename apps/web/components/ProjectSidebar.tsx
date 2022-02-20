import {
  faServer,
  faUserGroup,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";

const ProjectSidebar = () => {
  const router = useRouter();

  return (
    <div className="p-3 w-full max-w-[250px] bg-neutral-800">
      <h1 className="text-3xl font-black mb-2">Testing</h1>
      <div className="flex flex-col gap-1">
        <Link
          href={{
            pathname: "/app/projects/[projectID]/apps",
            query: { projectID: router.query["projectID"] },
          }}
        >
          <div
            className={`flex p-2 gap-2 text-md items-center rounded-md hover:bg-neutral-700 cursor-pointer ${
              router.pathname === `/app/projects/[projectID]/apps`
                ? "bg-blue-500"
                : ""
            }`}
          >
            <FontAwesomeIcon icon={faServer} fixedWidth />
            <span>Apps</span>
          </div>
        </Link>
        <Link
          href={{
            pathname: "/app/projects/[projectID]/members",
            query: { projectID: router.query["projectID"] },
          }}
        >
          <div
            className={`flex p-2 gap-2 text-md items-center rounded-md hover:bg-neutral-700 cursor-pointer ${
              router.pathname === `/app/projects/[projectID]/members`
                ? "bg-blue-500"
                : ""
            }`}
          >
            <FontAwesomeIcon icon={faUserGroup} fixedWidth />
            <span>Members</span>
          </div>
        </Link>
        <Link
          href={{
            pathname: "/app/projects/[projectID]/settings",
            query: { projectID: router.query["projectID"] },
          }}
        >
          <div
            className={`flex p-2 gap-2 text-md items-center rounded-md hover:bg-neutral-700 cursor-pointer ${
              router.pathname === `/app/projects/[projectID]/settings`
                ? "bg-blue-500"
                : ""
            }`}
          >
            <FontAwesomeIcon icon={faCog} fixedWidth />
            <span>Settings</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProjectSidebar;
