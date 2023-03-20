/// <reference types="vitest" />
/// <reference types="vite/client" />

import { resolve } from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import * as packageJson from "./package.json";

export default defineConfig((_: any) => ({
  plugins: [
    react(),
    dts({
      include: ["src/index.ts"],
    }),
  ],
  build: {
    lib: {
      entry: resolve("src", "index.ts"),
      name: "ReactBestPercentageCircleLibrary",
      formats: ["es", "umd"],
      fileName: (format: any) => `react-best-percentage-circle.${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.ts",
  },
}));
