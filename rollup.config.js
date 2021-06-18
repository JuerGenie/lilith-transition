import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import scss from "rollup-plugin-scss";

const production_option = defineConfig({
  input: "src/index.ts",
  output: {
    name: "LilithTransition",
    format: "esm",
    dir: "dist",
    sourcemap: true,
  },
  plugins: [
    resolve(),
    typescript({
      tsconfig: "./tsconfig.json",
      sourceMap: true,
      declaration: true,
      declarationDir: "dist/types",
    }),
  ],
});

const example_option = defineConfig({
  input: "example/main.ts",
  output: {
    name: "LilithTransitionExample",
    format: "esm",
    dir: "dist/example",
    sourcemap: true,
  },
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      sourceMap: true,
    }),
    resolve(),
    scss({
      sass: require("sass"),
      output: "dist/example/style.css",
    }),
  ],
});

export default [production_option, example_option];
