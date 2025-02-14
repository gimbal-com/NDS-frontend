import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  ssr: true,
  server: {
    proxy: {
      '/api': {
        target: 'https://api.mapbox.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
