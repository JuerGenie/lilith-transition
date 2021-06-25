import { defineConfig } from "rollup";

import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import html, { makeHtmlAttributes } from "@rollup/plugin-html";
import scss from "rollup-plugin-scss";
import image from "@rollup/plugin-image";
import svelte from "rollup-plugin-svelte";
const svelteConfig = require("./svelte.config");

const components_option = defineConfig({
  input: "src/index.ts",
  output: {
    name: "LilithTransitionGithubPage",
    format: "esm",
    dir: "dist",
    sourcemap: true,
  },
  plugins: [
    resolve(),
    image(),
    scss({
      output: "./dist/style.css",
    }),
    svelte(svelteConfig),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
    html({
      attributes: {
        html: {
          lang: "zh",
        },
      },
      title: "lilith-transition",
    }),
  ],
});

export default [components_option];
