import {
  faCog,
  faPlus,
  faTimes,
  faTimesCircle,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProjectSidebar from "../../../../components/ProjectSidebar";

const Members = () => {
  return (
    <div className="flex min-h-screen">
      <ProjectSidebar />
      <div className="flex flex-col gap-3 flex-1 p-5">
        <div className="flex items-center">
          <h1 className="font-bold text-xl">Members</h1>
          <button type="button" className="hover:text-blue-500 ml-auto text-xl">
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <div className="flex flex-col flex-1 divide-y-[0.75px] divide-neutral-700">
          <div className="px-5 py-3 bg-neutral-800 flex items-center gap-5 first:rounded-t-lg last:rounded-b-lg">
            <div>
              <p className="font-bold">Lleyton</p>
              <p className="text-xs text-neutral-400">Owner</p>
            </div>

            <div className="ml-auto flex gap-3 items-center">
              <button type="button" className="hover:text-blue-500">
                <FontAwesomeIcon icon={faCog} />
              </button>
              <button type="button" className="hover:text-red-500">
                <FontAwesomeIcon icon={faTimesCircle} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;
