import { defineConfig } from "vite"
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname,'./src'),
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        app: path.resolve(__dirname, './src/main.js')
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  server: {
    port: 8000,
    open: true
  }
})