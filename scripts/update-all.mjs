#!/usr/bin/env node

// Runs the full data update pipeline in the correct order:
//
// 1. Build taxonomy (NCBI + OTL) — generates parents.json and raw species-pool.json
// 2. Import jb2hubs images (if ~/src/jb2hubs exists) — populates image cache
// 3. Validate pool images — filters pool to species with images, embeds URLs
// 4. Embed organism images — adds image URLs to easy-mode organisms.ts
// 5. Run tests
// 6. Build site
//
// Usage:
//   node scripts/update-all.mjs              # full pipeline
//   node scripts/update-all.mjs --skip-taxonomy   # skip slow taxonomy rebuild
//   node scripts/update-all.mjs --refresh    # re-check stale image URLs (90+ days)

import { execSync, spawnSync } from 'child_process'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const JB2HUBS = join(process.env.HOME, 'src', 'jb2hubs')

const args = process.argv.slice(2)
const skipTaxonomy = args.includes('--skip-taxonomy')
const refresh = args.includes('--refresh')

function run(label, command) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`  ${label}`)
  console.log(`${'='.repeat(60)}\n`)

  const result = spawnSync('node', command.split(' '), {
    cwd: ROOT,
    stdio: 'inherit',
    env: process.env,
  })

  if (result.status !== 0) {
    console.error(`\nFailed: ${label} (exit code ${result.status})`)
    process.exit(result.status || 1)
  }
}

function runShell(label, command) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`  ${label}`)
  console.log(`${'='.repeat(60)}\n`)

  try {
    execSync(command, { cwd: ROOT, stdio: 'inherit' })
  } catch (err) {
    console.error(`\nFailed: ${label}`)
    process.exit(err.status || 1)
  }
}

// Step 1: Build taxonomy
if (skipTaxonomy) {
  console.log('\nSkipping taxonomy build (--skip-taxonomy)')
} else {
  run('Step 1: Build taxonomy (NCBI + OTL)', 'scripts/build-taxonomy.mjs')
}

// Step 2: Import jb2hubs images (optional)
if (existsSync(JB2HUBS)) {
  run('Step 2: Import jb2hubs images', 'scripts/import-jb2hubs-images.mjs')
} else {
  console.log('\nSkipping jb2hubs import (~/src/jb2hubs not found)')
}

// Step 3: Validate pool images
const validateArgs =
  'scripts/validate-pool-images.mjs' + (refresh ? ' --refresh' : '')
run('Step 3: Validate pool images & embed URLs', validateArgs)

// Step 4: Embed organism images for easy mode
run(
  'Step 4: Embed easy-mode organism images',
  'scripts/embed-organism-images.mjs',
)

// Step 5: Split taxonomy for easy mode
run('Step 5: Split taxonomy for easy mode', 'scripts/split-taxonomy.mjs')

// Step 6: Run tests
runShell('Step 6: Run tests', 'npx vitest run')

// Step 7: Build site
runShell('Step 7: Build site', 'npx astro build')

console.log(`\n${'='.repeat(60)}`)
console.log('  All steps completed successfully!')
console.log(`${'='.repeat(60)}\n`)
