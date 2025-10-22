// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: 'dist',
    rollupOptions: {
      input: {
        app: './index.html',
        server: './src/entry-server.tsx',
      },
       output: {
          // Optional: Customize output filenames if needed
       }
    },
  },
  publicDir: 'public',
});