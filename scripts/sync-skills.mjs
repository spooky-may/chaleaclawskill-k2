#!/usr/bin/env node
// Pulls the latest skill listings from the awesome-openclaw-skills index and
// merges any new entries into our local skills.json snapshot.
//
// Re-run whenever upstream publishes new skills. Idempotent: existing slugs
// are skipped, only the catalog index file is touched.

import { promises as fsp } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(here, '..')

const upstream = {
  owner: 'VoltAgent',
  repo: 'awesome-openclaw-skills',
  branch: 'main',
}

const ssotPath = resolve(projectRoot, 'public', 'skills.json')
const mirrorPath = resolve(projectRoot, 'public', 'data', 'skills.json')
const categoriesPath = resolve(projectRoot, 'public', 'data', 'categories.json')

const apiBase = `https://api.github.com/repos/${upstream.owner}/${upstream.repo}`
const rawBase = `https://raw.githubusercontent.com/${upstream.owner}/${upstream.repo}/${upstream.branch}`

class UpstreamClient {
  constructor({ token }) {
    this.headers = { 'User-Agent': 'chalea-sync/2.0', Accept: 'application/vnd.github+json' }
    if (token) this.headers.Authorization = `Bearer ${token}`
  }

  async json(url) {
    const r = await fetch(url, { headers: this.headers })
    if (!r.ok) throw new HttpError(url, r.status)
    return r.json()
  }

  async text(url) {
    const r = await fetch(url, { headers: { 'User-Agent': this.headers['User-Agent'] } })
    if (!r.ok) throw new HttpError(url, r.status)
    return r.text()
  }

  listCategoryMd() {
    return this.json(`${apiBase}/contents/categories`).then(entries =>
      entries.filter(e => e.type === 'file' && e.name.toLowerCase().endsWith('.md'))
    )
  }

  fetchCategoryRaw(filename) {
    return this.text(`${rawBase}/categories/${filename}`)
  }
}

class HttpError extends Error {
  constructor(url, status) {
    super(`HTTP ${status} on ${url}`)
    this.url = url
    this.status = status
  }
}

const titleFromFilename = (name) =>
  name
    .replace(/\.md$/i, '')
    .split(/[-_]/)
    .filter(Boolean)
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(' ')

const toKebab = (s) =>
  s.toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')

// Yield each `- [slug](url) - description` entry, plus the H1 category banner.
function* iterateMarkdownEntries(body, fallbackTitle) {
  const heading = /^#\s+(.+?)\s*$/m.exec(body)
  const category = heading ? heading[1].trim() : fallbackTitle

  const entry = /^- \[([^\]]+)\]\((https?:\/\/[^)]+)\)(?:\s+-\s+(.+?))?\s*$/gm
  let match
  while ((match = entry.exec(body)) !== null) {
    yield {
      slug: match[1].trim(),
      url: match[2].trim(),
      blurb: (match[3] ?? '').trim().slice(0, 280),
      category,
    }
  }
}

function authorFromClawUrl(slug, url) {
  // clawskills.sh URLs look like .../skills/<author>-<slug> — peel slug off.
  const tail = url.split('/').filter(Boolean).pop() ?? ''
  if (!tail.endsWith(slug)) return 'unknown'
  const stripped = tail.slice(0, tail.length - slug.length)
  return stripped.replace(/-$/, '') || 'unknown'
}

function buildSkillRecord({ slug, blurb, category, url, nextId }) {
  return {
    id: nextId,
    name: slug,
    slug,
    description: blurb,
    category,
    author: authorFromClawUrl(slug, url),
    github_url: url,
    install_command: `npx clawhub@latest install ${slug}`,
    featured: false,
    popular: false,
  }
}

function recomputeCategoryIndex(records) {
  const tally = new Map()
  for (const r of records) {
    const c = r.category || 'Uncategorized'
    const prev = tally.get(c)
    if (prev) prev.count += 1
    else tally.set(c, { name: c, slug: toKebab(c), count: 1 })
  }
  return [...tally.values()].sort((a, b) => b.count - a.count)
}

async function readJsonFile(path) {
  return JSON.parse(await fsp.readFile(path, 'utf8'))
}

async function writeJsonFile(path, value) {
  await fsp.writeFile(path, JSON.stringify(value, null, 2) + '\n', 'utf8')
}

async function main() {
  const client = new UpstreamClient({ token: process.env.GITHUB_TOKEN })

  console.log(`[sync] reading current snapshot at ${ssotPath}`)
  const snapshot = await readJsonFile(ssotPath)
  const knownSlugs = new Set(snapshot.skills.map(s => s.slug))
  let nextId = snapshot.skills.reduce((m, s) => (s.id > m ? s.id : m), 0)

  console.log(`[sync] fetching category index from upstream`)
  const categoryFiles = await client.listCategoryMd()
  console.log(`[sync] discovered ${categoryFiles.length} category files`)

  const additions = []
  let scanned = 0
  let alreadyHave = 0

  for (const file of categoryFiles) {
    const body = await client.fetchCategoryRaw(file.name)
    const fallback = titleFromFilename(file.name)
    let addedFromFile = 0

    for (const entry of iterateMarkdownEntries(body, fallback)) {
      scanned += 1
      if (!entry.url.includes('clawskills.sh/skills/')) continue
      if (knownSlugs.has(entry.slug)) {
        alreadyHave += 1
        continue
      }

      nextId += 1
      additions.push(buildSkillRecord({ ...entry, nextId }))
      knownSlugs.add(entry.slug)
      addedFromFile += 1
    }

    process.stdout.write(`  ${file.name}: +${addedFromFile}\n`)
  }

  const merged = [...snapshot.skills, ...additions]
  const categories = recomputeCategoryIndex(merged)

  const payload = {
    skills: merged,
    categories,
    total_count: merged.length,
    last_updated: new Date().toISOString().slice(0, 10),
  }

  await writeJsonFile(ssotPath, payload)
  await writeJsonFile(mirrorPath, payload)
  await writeJsonFile(categoriesPath, categories)

  console.log(`
[sync] complete`)
  console.log(`  scanned     : ${scanned}`)
  console.log(`  added       : ${additions.length}`)
  console.log(`  already had : ${alreadyHave}`)
  console.log(`  total now   : ${merged.length} skills across ${categories.length} categories`)
}

main().catch(err => {
  console.error('[sync] failed:', err.message)
  process.exitCode = 1
})
