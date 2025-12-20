import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest: manifest as any }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'src/popup/popup.html'),
        sidebar: path.resolve(__dirname, 'src/sidebar/sidebar.html'),
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  base: './',
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
