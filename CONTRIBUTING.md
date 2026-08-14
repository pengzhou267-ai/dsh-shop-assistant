# Contributing

Thanks for helping **dsh-shop-assistant**.

## Easy contributions (no TypeScript required)

1. Add or improve a skill under `skills/<kebab-name>/SKILL.md` (Chinese preferred).
2. Improve `kb/sample/` policy templates.
3. Open a PR describing the seller scenario.

## Code contributions

1. Add a CSV column map in `src/adapters/csv-maps.ts` (see `docs/EXTENDING.md`).
2. Adjust scoring defaults via `config/scoring.json` notes / `src/scoring.ts` (keep formulas documented).
3. Run `npm test` and `npm run build` before pushing.

## Good first issues

Look for labels `good first issue` — typical starters:

- Add Pinduoduo / Douyin export column aliases
- Add one more Chinese skill (e.g. live-stream objection handling)
- Translate a skill to English without changing tool names

## License

By contributing you agree your work is MIT-licensed.
