import { useRouter } from "next/router";
import { useEffect } from "react";

const Project = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router.query["projectID"]) return;

    router.replace({
      pathname: "/app/projects/[projectID]/apps",
      query: { projectID: router.query["projectID"] },
    });
  }, [router.query["projectID"]]);

  return <></>;
};

export default Project;
