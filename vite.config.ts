import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Configuracao do Vite para o processo renderer (React).
// base relativo para funcionar corretamente quando carregado via file:// pelo Electron.
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  build: {
    outDir: "dist",
    emptyOutDir: true
  },
  server: {
    port: 5173,
    strictPort: true
  }
});
