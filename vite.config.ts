import { defineConfig } from "vite";

import path from "path";

function resolve(...paths: string[]) {
  return path.resolve(__dirname, ...paths);
}

export default defineConfig({
  server: {
    port: 4800,
    proxy: {
      "^((/src)|(/example))/.*\\.js(\\?.*)?": {
        target: "http://localhost:4800",
        rewrite(path) {
          console.log("rewrite", path, "->", path.replace(".js", ".ts"));
          return path.replace(".js", ".ts");
        },
      },
    },
  },
  build: {
    lib: {
      entry: resolve("src/index.ts"),
      name: "LilithTransition",
    },
    rollupOptions: {
      output: {
        exports: "named",
      },
    },
  },
});
