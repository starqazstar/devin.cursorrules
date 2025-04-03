import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: Number(process.env.FRONTEND_PORT) || 3000,
    strictPort: true,
    open: true,
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.BACKEND_PORT || 3002}`,
        changeOrigin: true,
      }
    }
  }
}); 