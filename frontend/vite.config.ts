import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  
  // =======================================================
  // 🚀 CRITICAL FIX: PROXY SETUP ADDED
  // This tells Vite to forward any request starting with /api 
  // to your Node.js backend running on http://localhost:3000.
  // =======================================================
  server: {
    proxy: {
      '/api': {
        // Target is the address of your Node.js/Express server
        target: 'http://localhost:3000', 
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // Agar zarurat ho to use karein
        secure: false, 
      }
    }
  }
  // =======================================================
})
