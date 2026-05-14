/**
 * scaffold-skills.mjs
 * 1. Read skills.json
 * 2. For each skill, ensure public/skills/{author}/{slug}/ exists with SKILL.md + _meta.json
 * 3. Update github_url in skills.json → spooky-may/chaleaclawskill-k1
 */
import fs   from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.resolve(__dirname, '..')
const SKILLS_JSON = path.join(ROOT, 'public', 'skills.json')
const SKILLS_DIR  = path.join(ROOT, 'public', 'skills')
const NEW_BASE    = 'https://github.com/spooky-may/chaleaclawskill-k1/tree/main/public/skills'
const NOW         = Date.now()

const raw    = fs.readFileSync(SKILLS_JSON, 'utf8').replace(/^﻿/, '')
const data   = JSON.parse(raw)
const skills = data.skills

let created  = 0
let skipped  = 0

for (const skill of skills) {
  const { author, slug, name, description, install_command } = skill
  const dir = path.join(SKILLS_DIR, author, slug)

  // ── Ensure directory exists ────────────────────────────────────────────────
  fs.mkdirSync(dir, { recursive: true })

  // ── SKILL.md — only write if missing ──────────────────────────────────────
  const skillMdPath = path.join(dir, 'SKILL.md')
  if (!fs.existsSync(skillMdPath)) {
    const md = `---\nname: ${name}\ndescription: ${description}\n---\n\n# ${name}\n\n${description}\n\n## Install\n\n\`\`\`\n${install_command}\n\`\`\`\n`
    fs.writeFileSync(skillMdPath, md, 'utf8')
  }

  // ── _meta.json — create if missing, or patch commit URL if wrong ──────────
  const metaPath    = path.join(dir, '_meta.json')
  const correctCommit = `${NEW_BASE}/${author}/${slug}`
  if (!fs.existsSync(metaPath)) {
    const meta = {
      owner:       author,
      slug,
      displayName: name,
      latest: { version: '1.0.0', publishedAt: NOW, commit: correctCommit },
      history: [],
    }
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8')
    created++
  } else {
    // Patch commit field if it doesn't already point to the correct repo
    const existing = JSON.parse(fs.readFileSync(metaPath, 'utf8').replace(/^﻿/, ''))
    if (existing.latest?.commit !== correctCommit) {
      existing.latest = { ...existing.latest, commit: correctCommit }
      fs.writeFileSync(metaPath, JSON.stringify(existing, null, 2), 'utf8')
      created++  // repurpose counter as "patched"
    } else {
      skipped++
    }
  }

  // ── Update github_url in memory ────────────────────────────────────────────
  skill.github_url = `${NEW_BASE}/${author}/${slug}`
}

// ── Write updated skills.json ─────────────────────────────────────────────────
fs.writeFileSync(SKILLS_JSON, JSON.stringify(data, null, 2), 'utf8')

console.log(`✓ skills.json github_url updated → spooky-may/chaleaclawskill-k1`)
console.log(`✓ _meta.json created or commit-patched: ${created}`)
console.log(`✓ _meta.json already correct (skipped): ${skipped}`)
console.log(`✓ total skills processed: ${skills.length}`)
