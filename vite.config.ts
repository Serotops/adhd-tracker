import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        background: resolve(__dirname, 'src/background/index.ts'),
        content: resolve(__dirname, 'src/content/index.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'background' || chunkInfo.name === 'content'
            ? '[name].js'
            : 'assets/[name]-[hash].js'
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
})
