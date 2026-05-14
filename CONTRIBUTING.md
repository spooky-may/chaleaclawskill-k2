# Contributing

Thanks for taking the time. Below is the working agreement for this repo — keep it simple, keep it shipping.

## Reporting bugs

Open an issue with:
- What you tried (steps)
- What happened
- What you expected
- Browser + OS

Screenshots help. A minimal repro link helps more.

## Suggesting features

Open an issue prefixed `feat:` and describe the user-facing outcome before the implementation. If you're not sure it fits the project, ask first — saves both of us a rebuild.

## Pull requests

1. Fork, branch from `main` (use `feat/`, `fix/`, or `chore/` prefixes)
2. Run `pnpm lint` and `pnpm build` locally — both must pass
3. Keep diffs focused. One feature or fix per PR.
4. Match the existing style; don't reformat unrelated files
5. If you're touching a component already named `Chalea*`, keep that prefix

## Commit messages

Conventional commits, lowercase subject, present tense:

```
feat: add bundle export to clipboard
fix: skill drawer closes on outside click
refactor: split useChaleaSkills into list/filter/search
docs: clarify supabase env vars in README
```

No need to mention which file. The diff already shows it.

## Code style

- TypeScript strict on. No `any` in new code unless there's a real reason in a comment.
- Hooks: `useChalea*` prefix for project-specific state. Plain `use*` for generic helpers.
- Components: functional + hooks. No new class components unless you have a strong case.
- Tailwind: prefer composing utility classes over writing CSS. Custom CSS lives in `src/index.css`.
- One blank line between logical blocks. Don't golf the spacing.

## Skill submissions

If you've built an OpenClaw skill you want surfaced in the catalog:

1. Make sure it's published in the canonical OpenClaw registry
2. Open a PR adding the slug to `public/data/skills.json` with the right metadata
3. CI will validate the schema; if upstream `SKILL.md` is missing, the PR will fail

For now there's no in-app submission flow — that's tracked in [ROADMAP.md](./ROADMAP.md) under v0.4.

## Questions

Open an issue with the `question` label.
