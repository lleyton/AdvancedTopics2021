import { useRouter } from "next/router";
import { useEffect } from "react";
import Auth from "../state/auth";
import {
  faCircleNotch,
  faCompactDisc,
  faRecordVinyl,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    router.replace("/app/projects");
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <FontAwesomeIcon
          icon={faCircleNotch}
          size="2x"
          className="animate-spin text-inndigo"
        />
        <p>Logging In...</p>
      </div>
    </div>
  );
};

export default Login;
