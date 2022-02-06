import { AppProps } from "next/app";
import { NextUIProvider, createTheme } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "backend";
import { createReactQueryHooks } from "@trpc/react";

const lightTheme = createTheme({
  type: "light",
});

const darkTheme = createTheme({
  type: "dark",
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <NextThemesProvider
      defaultTheme="system"
      attribute="class"
      value={{
        light: lightTheme.className,
        dark: darkTheme.className,
      }}
    >
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
    </NextThemesProvider>
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
