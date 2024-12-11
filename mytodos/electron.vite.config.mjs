import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [vue()],
    server: {
      proxy: {
        '/api': {
          target: 'https://restapi.amap.com/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/ipi': {
          target: 'http://txt.go.sohu.com/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ip/, '')
        }
      }
    }
  }
})