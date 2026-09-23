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
          if (!id.includes("node_modules")) return undefined;
          if (/react-router|node_modules\/react\/|node_modules\/react-dom\//.test(id))
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
