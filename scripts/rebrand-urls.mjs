/**
 * rebrand-urls.mjs
 * 1. Updates ALL github_url in public/skills.json (SSOT) to point to this repo:
 *    https://github.com/Mdednnjya/chaleaclawskill/tree/main/public/skills/<author>/<slug>
 * 2. Mirrors updated data to public/data/skills.json
 * 3. Updates _meta.json commit field in each public/skills/<author>/<slug>/ folder
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SSOT = path.join(ROOT, 'public', 'skills.json')
const MIRROR = path.join(ROOT, 'public', 'data', 'skills.json')
const SKILLS_DIR = path.join(ROOT, 'public', 'skills')

const REPO_BASE = 'https://github.com/Mdednnjya/chaleaclawskill/tree/main/public/skills'

// ── 1. Update SSOT skills.json ───────────────────────────────────────────────
console.log('Reading SSOT...')
const data = JSON.parse(fs.readFileSync(SSOT, 'utf8'))
let urlsUpdated = 0

for (const skill of data.skills) {
  const author = (skill.author || 'unknown').replace(/[<>:"/\\|?*]/g, '_')
  const slug = skill.slug.replace(/[<>:"/\\|?*]/g, '_')
  const newUrl = `${REPO_BASE}/${author}/${slug}`

  if (skill.github_url !== newUrl) {
    skill.github_url = newUrl
    urlsUpdated++
  }
}

const updatedJson = JSON.stringify(data, null, 2)
fs.writeFileSync(SSOT, updatedJson, 'utf8')
fs.writeFileSync(MIRROR, updatedJson, 'utf8')
console.log(`Updated ${urlsUpdated} github_url values in skills.json`)
console.log('Mirrored to public/data/skills.json')

// ── 2. Update _meta.json in each skill folder ────────────────────────────────
console.log('\nUpdating _meta.json files...')
let metaUpdated = 0
let metaSkipped = 0
let metaErrors = 0

const authorDirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())

for (const authorEntry of authorDirs) {
  const authorPath = path.join(SKILLS_DIR, authorEntry.name)
  const slugDirs = fs.readdirSync(authorPath, { withFileTypes: true })
    .filter(d => d.isDirectory())

  for (const slugEntry of slugDirs) {
    const metaPath = path.join(authorPath, slugEntry.name, '_meta.json')
    if (!fs.existsSync(metaPath)) {
      metaSkipped++
      continue
    }

    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'))
      const newCommit = `${REPO_BASE}/${authorEntry.name}/${slugEntry.name}`

      if (meta.latest?.commit !== newCommit) {
        meta.latest = meta.latest || {}
        meta.latest.commit = newCommit
        fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8')
        metaUpdated++
      } else {
        metaSkipped++
      }
    } catch (err) {
      console.error(`  ERROR ${authorEntry.name}/${slugEntry.name}: ${err.message}`)
      metaErrors++
    }
  }
}

console.log(`  Updated : ${metaUpdated} _meta.json files`)
console.log(`  Skipped : ${metaSkipped} (no change or no file)`)
console.log(`  Errors  : ${metaErrors}`)
console.log('\nDone. All URLs now point to github.com/Mdednnjya/chaleaclawskill')
