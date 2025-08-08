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
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
        '/log': {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
        '/auth': {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
        '/enquiries': {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
        '/calllogs': {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
      },
      },
    }),
  };
});
