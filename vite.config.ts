import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import wyw from "@wyw-in-js/vite";

// https://vite.dev/config/
export default defineConfig(async () => {
  const tsconfigPaths = (await import("vite-tsconfig-paths")).default;
  const netlifyReactRouterPlugin = (await import("@netlify/vite-plugin-react-router")).default;
  const netlifyVitePlugin = (await import('@netlify/vite-plugin')).default;

  return {
    plugins: [
      wyw({
        include: ["**/*.{ts,tsx}"],
        babelOptions: {
          presets: ["@babel/preset-typescript", "@babel/preset-react"],
        },
      }),
      reactRouter(),
      tsconfigPaths(),
      netlifyReactRouterPlugin(),
      netlifyVitePlugin(),
    ],
    build: { target: "es2022", },
  }
});
