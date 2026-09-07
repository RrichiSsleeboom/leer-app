import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this repo under /leer-app/ instead of at the domain root.
  base: process.env.GITHUB_PAGES === 'true' ? '/leer-app/' : '/',
})
