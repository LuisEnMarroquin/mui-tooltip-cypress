import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // The publish folder is ./build, not Vite's default ./dist.
  build: { outDir: 'build' },
  server: { port: 47319, strictPort: true },
  preview: { port: 47369, strictPort: true },
})
