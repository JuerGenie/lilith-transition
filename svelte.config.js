const sveltePreprocess = require("svelte-preprocess");

/**@type { import('rollup-plugin-svelte').Options } */
module.exports = {
  preprocess: sveltePreprocess({
    sourceMap: true,
    typescript: {
      tsconfigFile: "./tsconfig.json",
    },
  }),
  compilerOptions: {
    customElement: true,
  },
};
