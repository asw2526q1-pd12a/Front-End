import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all requests starting with '/api' to your Rails server
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        // Example rewrite, if your Rails endpoints don't use a prefix:
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  }
})
