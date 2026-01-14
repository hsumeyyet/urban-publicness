import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // Base for GitHub Pages. Defaults to project folder name; can be overridden
      // by setting GH_PAGES_BASE in the environment (useful for user pages).
      base: env.GH_PAGES_BASE || '/urban-publicness/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      // Do not inject server API keys into the client bundle.
      // Server-side code should use `process.env.GEMINI_API_KEY` at runtime.
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
