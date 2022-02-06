import { Container, Grid, Text } from "@nextui-org/react";
import { useAuthenticated } from "../../state/auth";

const Projects = () => {
  const authenticated = useAuthenticated();
  return (
    <Container>
      <Text h1>Projects</Text>
      <Grid.Container></Grid.Container>
    </Container>
  );
};

export default Projects;
