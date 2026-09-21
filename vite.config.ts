import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    hmr: {
      host: '722429802e61dce9dfd9-pod-ltwkkvjudzbd3gzinspevhypvy-3000.us1.cursorvm.com',
      protocol: 'wss',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
