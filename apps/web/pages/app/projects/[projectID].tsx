import { Button, Card, Container, Spacer, Text } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useAuthenticated } from "../../../state/auth";
import { trpc } from "../../../util/trpc";

const Project = () => {
  const router = useRouter();
  const authenticated = useAuthenticated();
  const project = trpc.useQuery(
    ["projects.get", { id: router.query["projectID"] as string }],
    {
      enabled: authenticated,
    }
  );

  return (
    <Container>
      <Text h1>{project.data?.name}</Text>
      <Spacer y={0.5} x={0} />
      <Container gap={0} wrap="wrap" display="flex" css={{ gap: 10 }}>
        <Card
          clickable
          bordered
          css={{ mw: "400px" }}
          // onClick={() => router.push("/app/projects/" + id)}
        >
          <Text size={25} weight="bold">
            Apps
          </Text>
        </Card>
        <Card
          clickable
          bordered
          css={{ mw: "400px" }}
          // onClick={() => router.push("/app/projects/" + id)}
        >
          <Text size={25} weight="bold">
            Members
          </Text>
        </Card>
        <Card
          clickable
          bordered
          css={{ mw: "400px" }}
          // onClick={() => router.push("/app/projects/" + id)}
        >
          <Text size={25} weight="bold">
            Settings
          </Text>
        </Card>
      </Container>
    </Container>
  );
};

export default Project;
