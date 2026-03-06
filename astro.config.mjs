import preact from '@astrojs/preact'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://cmdcolin.github.io',
  base: '/phyloguessr/',
  integrations: [preact({ compat: true })],
  vite: {
    build: {
      sourcemap: true,
    },
  },
})
