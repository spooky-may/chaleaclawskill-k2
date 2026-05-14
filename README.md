# Chalea Clawskill

A browsable directory of OpenClaw skills — modular AI agent plugins for everything from DeFi research and health tracking to terminal automation and document generation.

Live at **[chaleaclawskill.site](https://chaleaclawskill.site)**.

## What it does

The project gives the OpenClaw skill ecosystem a real front door. Instead of digging through scattered GitHub folders to discover what's available, you get:

- **Browse** — filter 6,000+ skills by category, search semantically, sort by popularity
- **Inspect** — one-click preview of any skill's documentation, requirements, and install command
- **Bundle** — assemble a "loadout" of skills you actually use and copy the install commands as a single block
- **Review** — leave ratings and notes so other users know what's worth their setup time

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS + custom glass/bento UI system
- Supabase (auth, reviews table, skill content storage)
- Voyage AI rerank-2-lite for semantic search

The skill catalog (`public/skills/`) is held in Supabase Storage at runtime so the deployed app stays small. The frontend fetches markdown on demand and caches in memory per session.

## Local development

```bash
pnpm install
cp .env.example .env.local   # fill in Supabase + Voyage keys
pnpm dev
```

The app reads `public/data/skills.json` for the catalog index. Skill documentation is fetched from a Supabase Storage bucket (`skill-docs`) at runtime — see `src/hooks/useChaleaSkillContent.ts`.

## Project layout

```
src/
  components/    UI building blocks (Chalea-prefixed)
  hooks/         data + interaction hooks (useChalea*)
  pages/         route-level views
  context/       auth provider
  lib/           Supabase client, types, markdown parsing
public/
  data/          skills.json + categories.json (catalog index)
  mascot.jpeg    project mascot
scripts/
  sync-skills.mjs              sync catalog from upstream
  upload-skills-to-supabase.mjs bulk-upload SKILL.md to Storage
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Bug reports and skill submissions both welcome.

## License

MIT.
