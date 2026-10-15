import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // 開發時把 /api 轉發給 Go 服務（goodnote-server 監聽 :8080）。
      // 瀏覽器看來是同源請求，所以 Go 端不需要配置 CORS。
      '/api': 'http://localhost:8080',
    },
  },
})
