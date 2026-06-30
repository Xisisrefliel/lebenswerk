import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Workspace root — two levels up from packages/app/
const workspaceRoot = resolve(import.meta.dirname, '../..');

// https://vite.dev/config/
export default defineConfig({
  base: '/lebenslauf-anschreiben-creator/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2022',
  },
  server: {
    port: 5173,
    strictPort: false,
    fs: {
      // Allow serving files from the entire monorepo so workspace package
      // symlinks (e.g. @cv/layout-engine → ../../layout-engine) resolve.
      allow: [workspaceRoot],
    },
  },
});
