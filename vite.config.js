import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      // Polyfill buffer and crypto
      buffer: 'buffer',
      crypto: 'crypto-browserify',
    },
  },
  optimizeDeps: {
    include: ['buffer', 'crypto-browserify'],
  },
});
