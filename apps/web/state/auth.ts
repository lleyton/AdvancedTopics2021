import { createContainer } from "@innatical/innstate";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

const useAuth = () => {
  const [token, setToken] = useLocalStorage<string | null>("token", null);

  return {
    token,
    setToken,
  };
};

const Auth = createContainer(useAuth);

export const useAuthenticated = () => {
  const { token } = Auth.useContainer();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.replace("/login");
  }, [token]);

  return !!token;
};

export default Auth;
