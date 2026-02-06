import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || 'VITE_GEMINI_API_KEY_PLACEHOLDER'),
      'process.env.USER_TABLE_ID': JSON.stringify(env.USER_TABLE_ID || 'VITE_USER_TABLE_ID_PLACEHOLDER'),
      'process.env.BASEROW_BASE_URL': JSON.stringify(env.BASEROW_BASE_URL || 'VITE_BASEROW_BASE_URL_PLACEHOLDER'),
      'process.env.BASEROW_WORKSPACE_TOKEN': JSON.stringify(env.BASEROW_WORKSPACE_TOKEN || 'VITE_BASEROW_WORKSPACE_TOKEN_PLACEHOLDER'),
      'process.env.CONFIGURATION_TABLE_ID': JSON.stringify(env.CONFIGURATION_TABLE_ID || 'VITE_CONFIGURATION_TABLE_ID_PLACEHOLDER')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
