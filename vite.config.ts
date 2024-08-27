import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser', // Bạn có thể sử dụng 'esbuild' hoặc 'terser'
    terserOptions: {
      compress: {
        drop_console: true, // Loại bỏ console.log
      },
    },
  },
  server: {
    port: 3000
  },
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@helpers': path.resolve(__dirname, './src/helpers'),
      '@context': path.resolve(__dirname, './src/context'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@data': path.resolve(__dirname, 'src/data'),
      '@hooks': path.resolve(__dirname, "src/hooks"),
      '@reducers': path.resolve(__dirname, "src/reducers"),
      '@routes': path.resolve(__dirname, "src/routes"),
      "~leaflet": path.resolve(__dirname, "node_modules/leaflet"),
      '@config': path.resolve(__dirname, "src/config"),
      '@zalo': path.resolve(__dirname, "src/zalo"),
      '@web': path.resolve(__dirname, "src/web"),
      '@atom': path.resolve(__dirname, "src/atom"),
      '@services': path.resolve(__dirname, "src/services"),
      '@i18n': path.resolve(__dirname, "./i18n-config.ts"),
      '@shared': path.resolve(__dirname, "src/shared"),
      '@pages': path.resolve(__dirname, "src/pages"),
      '@locale': path.resolve(__dirname, "src/locale"),
      '@schema': path.resolve(__dirname, "src/schema")
    }
  }
})