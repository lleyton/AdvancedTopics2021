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
    <Card
      clickable
      bordered
      css={{ mw: "400px" }}
      onClick={() => router.push("/app/projects/" + id)}
    >
      <Text size={25} weight="bold">
        {project.data?.name}
      </Text>
    </Card>
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
      <Card
        clickable
        bordered
        onClick={() => setVisible(true)}
        css={{ mw: "400px" }}
      >
        <Text size={25} weight="bold">
          New Project
        </Text>
        <Text size={15}>Create a new project</Text>
      </Card>
    </>
  );
};

const Projects = () => {
  const authenticated = useAuthenticated();
  const projects = trpc.useQuery(["projects.all"], {
    enabled: authenticated,
  });

  return (
    <Container>
      <Text h1>Projects</Text>
      <Spacer y={0.5} x={0} />
      <Container gap={0} wrap="wrap" display="flex" css={{ gap: 10 }}>
        {projects.data?.map((id) => (
          <ProjectCard id={id} />
        ))}
        <NewProject />
      </Container>
    </Container>
  );
};

export default Projects;
