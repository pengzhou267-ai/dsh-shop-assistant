# Extending dsh-shop-assistant

## Skills

Each folder under `skills/` needs a `SKILL.md` with YAML frontmatter:

```yaml
---
name: my-skill
description: One-line routing text for the model.
whenToUse: Optional extra routing.
---

Markdown body with steps and output templates.
```

Skills are registered at plugin load via `ctx.skills.register`.

## CSV adapters

Edit `src/adapters/csv-maps.ts`:

```ts
{
  id: 'douyin-review',
  label: '抖音评价导出',
  columns: {
    rating: ['评分', '星级'],
    content: ['评价内容'],
  },
}
```

Then call `shop_csv_preview` with `adapter: "douyin-review"`.

## Scoring

Defaults live in `src/scoring.ts` (`DEFAULT_SCORING`) and are mirrored in `config/scoring.json` for documentation.

Plugin config can override:

- `defaultCommissionRate`
- `defaultExtraCostRate`

Weight overrides can be passed in code via `scoringWeights` when composing the plugin; keep decision thresholds documented when you change them.

## Future: platform MCP / official APIs

v1 deliberately avoids marketplace login and private APIs. A later provider can expose MCP tools while reusing the same skills and scoring module. Do not block that path by hard-coding Taobao-only assumptions in tools.

## Package layout for dsh

`package.json` declares:

```json
"dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
```

`cordis.patch.yml` inserts this package as a Cordis plugin row so `dsh plugin add` activates the layer.
