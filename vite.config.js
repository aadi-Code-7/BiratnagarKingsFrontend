import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const proxy = { '/api': { target: process.env.API_TARGET || 'http://localhost:8080', changeOrigin: true } };

export default defineConfig({
  plugins: [react()],
  // host:true lets a phone on the same Wi-Fi open http://<your-pc-ip>:5173 — the proxy keeps /api same-origin (no CORS).
  server: { host: true, port: 5173, proxy },
  preview: { host: true, port: 4173, proxy },
  build: { target: 'es2020', rollupOptions: { output: { manualChunks: { vendor: ['react', 'react-dom', 'react-router-dom'] } } } },
});
