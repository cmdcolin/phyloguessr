import preact from '@astrojs/preact'
import { defineConfig } from 'astro/config'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

function qcDevPlugin() {
  return {
    name: 'qc-dev-save',
    configureServer(server) {
      server.middlewares.use('/api/qc-save', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method not allowed')
          return
        }
        let body = ''
        req.on('data', chunk => { body += chunk })
        req.on('end', () => {
          const flaggedPath = join(process.cwd(), 'public', 'flagged-species.json')
          writeFileSync(flaggedPath, body)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: true }))
        })
      })
    },
  }
}

export default defineConfig({
  site: 'https://phyloguessr.com',
  integrations: [preact({ compat: true })],
  vite: {
    build: {
      sourcemap: true,
    },
    plugins: [qcDevPlugin()],
  },
})
