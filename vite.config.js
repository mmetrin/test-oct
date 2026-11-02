import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/test-oct/',
  appType: 'mpa',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        targetedCalls: resolve(import.meta.dirname, 'targeted-calls/index.html'),
        dsp: resolve(import.meta.dirname, 'dsp/index.html'),
        connectedTv: resolve(import.meta.dirname, 'connected-tv/index.html'),
        certification: resolve(import.meta.dirname, 'certification/index.html'),
        contacts: resolve(import.meta.dirname, 'contacts/index.html'),
        media: resolve(import.meta.dirname, 'media/index.html'),
        articleBrandbook: resolve(import.meta.dirname, 'article-brandbook/index.html'),
        orbitalHero: resolve(import.meta.dirname, 'orbital-hero/index.html'),
        platformCore: resolve(import.meta.dirname, 'platform-core/index.html'),
      },
    },
  },
})
