import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Keep the initial bundle small: heavy vendors load as separate cacheable chunks.
        manualChunks(id) {
          // Rollup's shared CommonJS interop helpers are needed by React's
          // CJS build and by every CJS vendor. They live with react-core: that
          // keeps them eagerly available, keeps the lazy "dates" bucket out of
          // the entry graph, and avoids a vendor <-> react-core chunk cycle.
          if (id.includes("commonjsHelpers")) return "react-core";
          if (!id.includes("node_modules")) return undefined;
          // react-core must be self-contained: pulling react-router's own
          // dependencies (@remix-run/router, scheduler) in with it prevents a
          // react-core <-> vendor cycle, which otherwise lets a CJS vendor run
          // before React is initialised (production white screen).
          if (
            /react-router|@remix-run|scheduler|node_modules\/react\/|node_modules\/react-dom\//.test(
              id,
            )
          )
            return "react-core";
          if (/leaflet/.test(id)) return "maps";
          if (/react-date-range|date-fns/.test(id)) return "dates";
          return "vendor";
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
