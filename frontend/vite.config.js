import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  server: {
    host: true,
    port: 8000,
    proxy: {
      '/api': `http://${process.env.API_HOST || 'localhost'}:${process.env.API_PORT || 3000}/`,
      '/ws': {
        target: `ws://${process.env.API_HOST || 'localhost'}:${process.env.API_PORT || 3000}/`,
        changeOrigin: true,
        ws: true,
      },
    
    }
	},
})
