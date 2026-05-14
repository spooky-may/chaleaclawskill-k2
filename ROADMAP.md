# Roadmap

Living document. Reordered when reality changes.

## Shipped

- **v0.1** — Catalog browse, search, category filters, bookmark
- **v0.2** — Skill detail page, install-command copy, requirements display
- **v0.3** — Side-drawer preview, semantic search (Voyage rerank), bundle/loadout builder
- **v0.3.1** — Community ratings + reviews backed by Supabase
- **v0.3.2** — Markdown content moved to Supabase Storage (lean repo, fast deploys)

## Up next

### v0.4 — Submission flow
In-app form for community submissions. Validates SKILL.md schema, opens upstream PR automatically.

### v0.5 — Security badges
Per-skill static analysis: env access, network calls, filesystem writes. Surface as badges on the card so users know what they're installing.

### v0.6 — Skill diff / changelog
Track upstream SKILL.md changes per skill. Show "updated 3 days ago" with diff preview when a maintainer ships a new version.

## Considering

- **Live ClawHub API sync** — replace static JSON catalog with live API calls (cache aggressively). Removes the sync-script step.
- **Personal dashboard** — installed skills, recently viewed, custom collections
- **Mobile shell** — current responsive layout works but a real install (PWA) would be nice for on-the-go skill browsing
- **Curator notes** — short editorial blurbs on featured skills, similar to App Store editor's picks

## Not doing

- **Hosting actual skill code**. Catalog only. Code lives upstream where the authors put it.
- **Paid tiers / premium features**. Free, period.
- **A marketplace for paid skills**. Different product. Not interested.

## How to influence priority

Comment on the relevant tracking issue or open one. Real user needs reorder this faster than my own opinions do.
