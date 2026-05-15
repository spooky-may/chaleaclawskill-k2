#!/usr/bin/env node
// Generate public/sitemap.xml from the skill catalog index.
//
// Run after sync-skills.mjs so the sitemap stays in lockstep with the catalog.

import { readFile, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

const SITE = 'https://chaleaclawskill.site'
const STATIC_ROUTES = ['/', '/browse', '/docs', '/faq']

function urlEntry(loc, lastmod, priority = '0.6') {
  return `  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority}</priority>
  </url>`
}

async function main() {
  const catalogPath = resolve(root, 'public', 'skills.json')
  const catalog = JSON.parse(await readFile(catalogPath, 'utf8'))
  const today = new Date().toISOString().slice(0, 10)

  const entries = []
  for (const route of STATIC_ROUTES) {
    entries.push(urlEntry(route, today, route === '/' ? '1.0' : '0.7'))
  }
  for (const skill of catalog.skills ?? []) {
    entries.push(urlEntry(`/skill/${skill.slug}`, today, '0.5'))
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`
  await writeFile(resolve(root, 'public', 'sitemap.xml'), xml, 'utf8')
  console.log(`[sitemap] wrote ${entries.length} URLs to public/sitemap.xml`)
}

main().catch(err => {
  console.error('[sitemap] failed:', err.message ?? err)
  process.exit(1)
})
