import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/test-oct/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        heroCards: resolve(import.meta.dirname, 'hero-cards/index.html'),
        heroCardsSaved: resolve(import.meta.dirname, 'hero-cards-saved/index.html'),
        enterpriseHero: resolve(import.meta.dirname, 'enterprise-hero/index.html'),
        enterpriseHeroBigData: resolve(import.meta.dirname, 'enterprise-hero-bigdata/index.html'),
        enterpriseHeroFunnel: resolve(import.meta.dirname, 'enterprise-hero-funnel/index.html'),
        cursorGrid: resolve(import.meta.dirname, 'cursor-grid/index.html'),
        interactiveWeb: resolve(import.meta.dirname, 'interactive-web/index.html'),
        certification: resolve(import.meta.dirname, 'certification/index.html'),
        contacts: resolve(import.meta.dirname, 'contacts/index.html'),
        bloggers: resolve(import.meta.dirname, 'bloggers/index.html'),
        articleBrandbook: resolve(import.meta.dirname, 'article-brandbook/index.html'),
        aiAssistant: resolve(import.meta.dirname, 'ai-assistant/index.html'),
        beamLab: resolve(import.meta.dirname, 'beam-lab/index.html'),
        dcp: resolve(import.meta.dirname, 'dcp/index.html'),
        effectTest: resolve(import.meta.dirname, 'effect-test/index.html'),
        premiumVideo: resolve(import.meta.dirname, 'premium-video/index.html'),
      },
    },
  },
})
