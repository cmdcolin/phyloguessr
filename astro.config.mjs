import preact from '@astrojs/preact'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://phyloguessr.com',
  integrations: [preact({ compat: true })],
  vite: {
    build: {
      sourcemap: true,
    },
  },
})
