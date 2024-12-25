import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  define: {
    // @ts-expect-error - node types not installed
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8763",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "./yeetland-build",
    emptyOutDir: true,
  },
});
