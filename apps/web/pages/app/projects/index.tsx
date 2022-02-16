import {
  Button,
  Card,
  Container,
  Input,
  Loading,
  Modal,
  Spacer,
  Text,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuthenticated } from "../../../state/auth";
import { trpc } from "../../../util/trpc";

const ProjectCard: React.FC<{ id: string }> = ({ id }) => {
  const project = trpc.useQuery(["projects.get", { id }]);
  const router = useRouter();

  return (
    <div
      // clickable
      // bordered
      // css={{ mw: "400px" }}
      onClick={() => router.push("/app/projects/" + id)}
      className="max-w-2xl"
    >
      <Text size={25} weight="bold">
        {project.data?.name}
      </Text>
    </div>
  );
};

const NewProject = () => {
  const [visible, setVisible] = useState(false);
  const remoteContext = trpc.useContext();
  const createProject = trpc.useMutation("projects.create", {
    onSuccess: () => {
      closeHandler();
      remoteContext.refetchQueries(["projects.all"]);
    },
  });
  const [name, setName] = useState("");
  const closeHandler = () => {
    if (createProject.isLoading) return;
    setVisible(false);
    setName("");
  };

  return (
    <>
      <Modal
        closeButton={!createProject.isLoading}
        blur
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            New Project
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            auto
            onClick={() =>
              !createProject.isLoading && createProject.mutate({ name })
            }
          >
            {createProject.isLoading ? (
              <Loading color="white" size="sm" />
            ) : (
              "Create"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      <div
        onClick={() => setVisible(true)}
        className="max-w-3xl bg-zinc-800 p-4 rounded-xl shadow-lg "
      >
        <p className="font-bold text-3xl">New Project</p>
        <p>Create a new project</p>
      </div>
    </>
  );
};

const Projects = () => {
  const authenticated = useAuthenticated();
  const projects = trpc.useQuery(["projects.all"], {
    enabled: authenticated,
  });

  return (
    <div className="p-5">
      <h1 className="font-black text-4xl mb-5">Projects</h1>
      <div className="flex gap-5">
        {projects.data?.map((id) => (
          <ProjectCard id={id} />
        ))}
        <NewProject />
      </div>
    </div>
  );
};

export default Projects;
