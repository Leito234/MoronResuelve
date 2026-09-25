import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    watch: {
      ignored: ['**/proyecto_API/**', '**/bin/**', '**/obj/**']
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5006',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
