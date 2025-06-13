import { defineConfig } from "vite";
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    open: true,
  },
  plugins: [viteSingleFile()],
  //build: { assetsInlineLimit: 100_000_000 }
    build: {
    cssCodeSplit: false,            // CSS &rarr; один файл
    assetsInlineLimit: 100_000_000, // на всякий случай
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
       // manualChunks: () => undefined
      }
    }
  }
});
