import { faCircleNotch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { FC, Fragment, useState } from "react";
import { useAuthenticated } from "../../../state/auth";
import { trpc } from "../../../util/trpc";

const NewProject: FC<{ isOpen: boolean; closeModal: () => void }> = ({
  isOpen,
  closeModal,
}) => {
  const trpcContext = trpc.useContext();
  const createProject = trpc.useMutation(["projects.create"], {
    async onSuccess() {
      await trpcContext.refetchQueries(["projects.all"]);
      closeModal();
    },
  });
  const [name, setName] = useState("");

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 backdrop-blur" />
          </Transition.Child>
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-neutral-800 shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-white"
              >
                New Project
              </Dialog.Title>

              <div className="mt-2 flex flex-col">
                <label className="text-sm text-bold mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-neutral-800 block border border-neutral-700 rounded-md py-2 px-3 shadow-sm focus:outline-none"
                />
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium  border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 text-white bg-blue-500"
                  onClick={() => createProject.mutate({ name })}
                  disabled={createProject.isLoading}
                >
                  {!createProject.isLoading ? (
                    "Create Project"
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
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

const ProjectRow: FC<{ id: string }> = ({ id }) => {
  const project = trpc.useQuery(["projects.get", { id }]);

  return (
    <Link
      href={{
        pathname: "/app/projects/[projectID]/settings",
        query: { projectID: id },
      }}
    >
      <a className="px-5 py-3 bg-neutral-800 hover:bg-neutral-700 cursor-pointer flex items-center gap-5 first:rounded-t-lg last:rounded-b-lg">
        <div>
          <p className="font-bold">{project.data?.name}</p>
          <p className="text-xs text-neutral-400">
            {project.data?._count.apps} App
            {project.data?._count.apps !== 1 ? "s" : ""} •{" "}
            {project.data?._count.members} Member
            {project.data?._count.members !== 1 ? "s" : ""}
          </p>
        </div>
      </a>
    </Link>
  );
};

const Projects = () => {
  const authenticated = useAuthenticated();
  const projects = trpc.useQuery(["projects.all"], {
    enabled: authenticated,
  });
  const [showNewProject, setShowNewProject] = useState(false);

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col gap-3 flex-1 p-5">
        <div className="flex items-center">
          <h1 className="font-bold text-xl">Projects</h1>
          <button
            type="button"
            className="hover:text-blue-500 ml-auto text-xl"
            onClick={() => setShowNewProject(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <div className="flex flex-col flex-1 divide-y-[0.75px] divide-neutral-700">
          {projects.data?.map((id) => (
            <ProjectRow key={id} id={id} />
          ))}
          <NewProject
            isOpen={showNewProject}
            closeModal={() => setShowNewProject(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Projects;
