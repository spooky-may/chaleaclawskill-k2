# Changelog

Notable changes per release. Unreleased entries land at the top.

## Unreleased

- Sitemap now regenerates against the latest catalog after each sync
- Toast notifications surface clipboard copy results for screen reader users

## v0.3.2 — 2026-05-15

- Catalog markdown content moved to Supabase Storage. The repo no longer
  bundles ~30k skill files; the app fetches `SKILL.md` lazily per skill
  with an in-memory cache per session.
- Vercel deploy size dropped from ~250 MB to ~5 MB.
- Loading skeleton shows in place of "Loading..." text while docs fetch.
- Error boundary wraps the app — render errors show a retry card rather
  than a white screen.

## v0.3.1 — 2026-05-08

- Reviews + star ratings backed by Supabase, gated behind login.
- "Your review" badge so the writer can find their own entry quickly.
- Average rating shown on the skill detail page.

## v0.3.0 — 2026-04-22

- Semantic search via Voyage AI rerank-2-lite.
- Skill bundle / loadout builder. Pin skills to a bar and copy all install
  commands at once.
- Side-drawer preview opens from any skill card. Esc closes.
- Splash screen with orbital constellation animation.

## v0.2.0 — 2026-03-30

- Skill detail page with markdown rendering and requirements panel.
- Bookmark a skill (requires login). Bookmarks listed on its own page.
- Login / register flow via Supabase auth.

## v0.1.0 — 2026-03-04

- First public deploy.
- Catalog browse with category filter and text search.
- One-click copy install command from the skill card.

## v0.0.1 — 2026-02-06

- Project scaffold. Vite + React + TypeScript + Tailwind. Catalog index
  imported from `awesome-openclaw-skills`.
