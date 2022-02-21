import { useRouter } from "next/router";
import { useEffect } from "react";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router.query["projectID"] || !router.query["appID"]) return;

    router.replace({
      pathname: "/app/projects/[projectID]/apps/[appID]/overview",
      query: {
        projectID: router.query["projectID"],
        appID: router.query["appID"],
      },
    });
  }, [router.query["projectID"], router.query["appID"]]);

  return <></>;
};

export default Index;
