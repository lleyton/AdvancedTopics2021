import { Container, Loading } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Auth from "../state/auth";

const Login = () => {
  const router = useRouter();
  const { setToken, token: authToken } = Auth.useContainer();

  useEffect(() => {
    if (authToken) {
      router.push("/app/projects");
      return;
    }

    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      window.location.href =
        "https://id.innatical.com/connect?" +
        new URLSearchParams({
          id: "b2ff98cd-9a78-4198-991a-6d0dd2f578d7",
          callback: window.location.href,
        });
      return;
    }

    setToken(token);
    router.replace("/notebooks");
  }, []);

  return (
    <Container
      css={{ display: "flex", height: "100vh" }}
      alignItems="center"
      justify="center"
      fluid
    >
      <Loading>Logging In...</Loading>
    </Container>
  );
};

export default Login;
