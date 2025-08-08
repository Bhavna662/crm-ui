import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env': env,
    },
    // Only enable proxy during development
    ...(command === 'serve' && {
      server: {
        proxy: {
          '/customer': {
            target: 'http://localhost:8080',
            changeOrigin: true,
          },
          '/log': {
            target: 'http://localhost:8080',
            changeOrigin: true,
          },
          '/auth': {
            target: 'http://localhost:8080',
            changeOrigin: true,
          },
          '/enquiries': {
            target: 'http://localhost:8080',
            changeOrigin: true,
          },
          '/calllogs': {
            target: 'http://localhost:8080',
            changeOrigin: true,
          },
        },
      },
    }),
  };
});
