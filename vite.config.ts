/// <reference types="vitest/config" />

import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import wyw from "@wyw-in-js/vite";
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    wyw({
      include: ["**/*.{ts,tsx}"],
      babelOptions: {
        presets: ["@babel/preset-typescript", "@babel/preset-react"],
      },
    }),
    reactRouter(),
    tsconfigPaths(),
  ],
  build: { target: "es2022", },
  define: { 'import.meta.vitest': 'undefined', },
  test: { includeSource: ['app/**/*.{js,ts}'], },
});
