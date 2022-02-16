import { AppProps } from "next/app";
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "backend";
import Auth from "../state/auth";
import "@fontsource/inter/variable.css";
import "../style/main.scss";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Auth.Provider>
      <Component {...pageProps} />
    </Auth.Provider>
  );
};

export default withTRPC<AppRouter>({
  ssr: false,
  config() {
    return {
      url: "http://localhost:3001",
      headers() {
        const token = localStorage.getItem("token");
        return token
          ? {
              authorization: JSON.parse(token),
            }
          : {};
      },
    };
  },
})(App);
