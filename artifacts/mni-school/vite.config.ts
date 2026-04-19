import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const isVercel = !process.env.REPL_ID;
const isProduction = process.env.NODE_ENV === "production";

const port = Number(process.env.PORT ?? 3000);
const basePath = process.env.BASE_PATH ?? "/";

const plugins: any[] = [react(), tailwindcss()];

if (!isProduction && !isVercel) {
  const { default: runtimeErrorOverlay } = await import("@replit/vite-plugin-runtime-error-modal");
  plugins.push(runtimeErrorOverlay());

  if (process.env.REPL_ID !== undefined) {
    const cartographer = await import("@replit/vite-plugin-cartographer").then(m =>
      m.cartographer({ root: path.resolve(import.meta.dirname, "..") })
    );
    const devBanner = await import("@replit/vite-plugin-dev-banner").then(m => m.devBanner());
    plugins.push(cartographer, devBanner);
  }
}

export default defineConfig({
  base: isVercel ? "/" : basePath,
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: false,
        secure: false,
      },
      "/uploads": {
        target: "http://localhost:8080",
        changeOrigin: false,
        secure: false,
      },
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
