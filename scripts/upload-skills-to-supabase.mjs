#!/usr/bin/env node
// Upload all SKILL.md files from public/skills/<author>/<slug>/SKILL.md
// to Supabase Storage bucket "skill-docs" under path <author>/<slug>.md
//
// Requires in .env.local:
//   VITE_SUPABASE_URL=...
//   SUPABASE_SERVICE_ROLE_KEY=...
//
// Run: node scripts/upload-skills-to-supabase.mjs

import { readFileSync, readdirSync, statSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const SKILLS_DIR = join(ROOT, 'public', 'skills')
const BUCKET = 'skill-docs'
const CONCURRENCY = 4

function loadEnv() {
  const envPath = join(ROOT, '.env.local')
  const raw = readFileSync(envPath, 'utf8')
  const env = {}
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (m) env[m[1]] = m[2].trim()
  }
  return env
}

const env = loadEnv()
const SUPABASE_URL = env.VITE_SUPABASE_URL
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('[upload] Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

async function ensureBucket() {
  // Check if bucket exists
  const checkRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket/${BUCKET}`, {
    headers: { Authorization: `Bearer ${SERVICE_KEY}`, apikey: SERVICE_KEY },
  })
  if (checkRes.ok) {
    console.log(`[bucket] "${BUCKET}" already exists`)
    return
  }
  // Create as public bucket
  const createRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: BUCKET,
      name: BUCKET,
      public: true,
      file_size_limit: 524288,
      allowed_mime_types: ['text/markdown', 'text/plain'],
    }),
  })
  if (!createRes.ok) {
    const err = await createRes.text()
    throw new Error(`Create bucket failed: ${createRes.status} ${err}`)
  }
  console.log(`[bucket] created "${BUCKET}" (public)`)
}

function collectSkillMdFiles(dir) {
  const out = []
  for (const author of readdirSync(dir)) {
    const authorPath = join(dir, author)
    if (!statSync(authorPath).isDirectory()) continue
    for (const slug of readdirSync(authorPath)) {
      const slugPath = join(authorPath, slug)
      if (!statSync(slugPath).isDirectory()) continue
      const skillMd = join(slugPath, 'SKILL.md')
      try {
        if (statSync(skillMd).isFile()) {
          out.push({ author, slug, path: skillMd })
        }
      } catch {
        // SKILL.md doesn't exist for this skill — skip
      }
    }
  }
  return out
}

async function uploadOne({ author, slug, path }) {
  const content = readFileSync(path)
  const objectPath = `${author}/${slug}.md`
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${objectPath}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        apikey: SERVICE_KEY,
        'Content-Type': 'text/markdown',
        'x-upsert': 'true',
      },
      body: content,
    }
  )
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`${objectPath}: ${res.status} ${err.slice(0, 200)}`)
  }
}

async function runPool(items, worker, concurrency) {
  const results = { ok: 0, fail: 0, errors: [] }
  let idx = 0
  const workers = Array.from({ length: concurrency }, async () => {
    while (idx < items.length) {
      const i = idx++
      const item = items[i]
      try {
        await worker(item)
        results.ok++
      } catch (e) {
        results.fail++
        if (results.errors.length < 20) results.errors.push(e.message)
      }
      if ((results.ok + results.fail) % 100 === 0) {
        console.log(`[upload] ${results.ok + results.fail}/${items.length} (ok=${results.ok} fail=${results.fail})`)
      }
    }
  })
  await Promise.all(workers)
  return results
}

async function main() {
  console.log('[upload] scanning public/skills/ for SKILL.md files...')
  const files = collectSkillMdFiles(SKILLS_DIR)
  console.log(`[upload] found ${files.length} SKILL.md files`)

  console.log('[upload] ensuring bucket exists...')
  await ensureBucket()

  console.log(`[upload] uploading with concurrency=${CONCURRENCY}...`)
  const t0 = Date.now()
  const r = await runPool(files, uploadOne, CONCURRENCY)
  const dt = ((Date.now() - t0) / 1000).toFixed(1)
  console.log(`[upload] done in ${dt}s — ok=${r.ok} fail=${r.fail}`)
  if (r.errors.length) {
    console.log('[upload] first errors:')
    r.errors.forEach(e => console.log('  -', e))
  }
}

main().catch(err => {
  console.error('[upload] FATAL:', err)
  process.exit(1)
})
