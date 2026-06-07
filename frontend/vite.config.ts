import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/manifest.json',
          dest: '.',
        }
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://ufl.instructure.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        main: './index.html',
        background: './src/background.ts',
        content: './src/content.ts',
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') return 'background.js';
          if (chunkInfo.name === 'content') return 'content.js';
          return 'assets/[name]-[hash].js';
        },
        inlineDynamicImports: false,
        manualChunks: undefined,
      },
    },
  },
});