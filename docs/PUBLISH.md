# Publish checklist

Local project: `/Users/chenyang/Movies/study/dsh-shop-assistant`  
Target GitHub: `https://github.com/pengzhou267-ai/dsh-shop-assistant`

## Already done locally

- Bundle with `dsh.bundle` + tools + 10 Chinese skills + KB + examples
- `npm test` / `npm run build` pass
- `dsh plugin --profile shop-demo add <local path>` succeeds; `--dump-config` shows `# == dsh-shop-assistant`

## GitHub (needs your login once)

SSH to GitHub as `pengzhou267-ai` already works. Create the empty repo, then push:

```sh
# Option A — browser: https://github.com/new  (name: dsh-shop-assistant, Public, no README)
# Option B — gh (after: gh auth login)
gh repo create pengzhou267-ai/dsh-shop-assistant --public --source=. --remote=origin --push

cd /Users/chenyang/Movies/study/dsh-shop-assistant
git push -u origin main
# Topics: dsh-plugin, dsh, ecommerce
gh repo edit pengzhou267-ai/dsh-shop-assistant --add-topic dsh-plugin --add-topic dsh --add-topic ecommerce
```

Or run `./scripts/bootstrap-remote.sh` after `gh auth login`.

## npm (needs npmjs.org login)

This machine uses `registry.npmmirror.com` by default. Publish to the public registry:

```sh
npm login --registry https://registry.npmjs.org/
npm publish --access public --registry https://registry.npmjs.org/
```

Install line for users:

```sh
dsh plugin --profile web add dsh-shop-assistant
dsh plugin --profile web add github:pengzhou267-ai/dsh-shop-assistant
```

## awesome-dsh-plugin

After the GitHub repo is public with `dsh.bundle` in `package.json`, open a PR against [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) listing:

- `pengzhou267-ai/dsh-shop-assistant` — ecommerce operator CSV/scoring/skills bundle
