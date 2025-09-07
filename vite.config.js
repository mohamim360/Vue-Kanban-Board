import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    cssCodeSplit: false, // This can help with CSS loading issues
  },
  css: {
    postcss: './postcss.config.js',
  }
})