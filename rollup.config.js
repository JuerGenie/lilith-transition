import { defineConfig } from "rollup";
import path from "path";

import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import scss from "rollup-plugin-scss";
import { string } from "rollup-plugin-string";
import svelte from "rollup-plugin-svelte";
const svelteConfig = require("./svelte.config");

const painter_option = defineConfig({
  input: "src/painter/index.ts",
  output: {
    name: "LilithTransitionPointer",
    format: "esm",
    dir: "dist/painter",
    sourcemap: true,
  },
  plugins: [
    resolve(),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
  ],
});

const components_option = defineConfig({
  input: "src/components/index.ts",
  output: {
    name: "LilithTransitionComponents",
    format: "esm",
    dir: "dist/components",
    sourcemap: true,
  },
  plugins: [
    resolve(),
    svelte(svelteConfig),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
    string({
      include: "src/**/*.html",
    }),
  ],
});

const production_option = defineConfig({
  input: "src/index.ts",
  output: {
    name: "LilithTransition",
    format: "esm",
    dir: "dist",
    sourcemap: true,
    paths: {
      [path.resolve(__dirname, "./src/painter/index.ts")]: "./painter/index.js",
      [path.resolve(__dirname, "./src/components/index.ts")]:
        "./components/index.js",
    },
  },
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "./dist",
    }),
  ],
  external: [
    path.resolve(__dirname, "./src/painter/index.ts"),
    path.resolve(__dirname, "./src/components/index.ts"),
  ],
});

const example_option = defineConfig({
  input: "example/main.ts",
  output: {
    name: "LilithTransitionExample",
    format: "esm",
    dir: "dist/example",
    sourcemap: true,
    paths: {
      [path.resolve(__dirname, "./src/index.ts")]: "../index.js",
    },
  },
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      sourceMap: true,
      baseUrl: "./example",
    }),
    resolve(),
    scss({
      sass: require("sass"),
      output: "dist/example/style.css",
    }),
  ],
  external: [path.resolve(__dirname, "./src/index.ts")],
});

export default [
  painter_option,
  components_option,
  production_option,
  example_option,
];
