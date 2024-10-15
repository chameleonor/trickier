import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  resolve: {
    alias: {
      // src folders
      '@': path.resolve(__dirname, './src'),
      api: path.resolve(__dirname, './api'),
      atoms: path.resolve(__dirname, './src/atoms'),
      configs: path.resolve(__dirname, './src/configs'),
      pages: path.resolve(__dirname, './src/pages'),
      types: path.resolve(__dirname, './src/types'),
      utils: path.resolve(__dirname, './src/utils'),
      public: path.resolve(__dirname, './public'),
      '@constants': path.resolve(__dirname, './src/constants.ts'),
    },
  },
});
