# dsh-shop-assistant

[中文](README.zh.md) | English

DeepSeek Harness (**dsh**) bundle for **ecommerce operators** (not developers): batch CSV tools, reproducible profit scoring, Chinese skills, and a replaceable store-policy knowledge base.

This is **not** another chatbot for one-off copywriting. It wins when you bring **your tables + store policy + fixed SOPs**.

## Install

Requires [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) / `npx @deepseek-ai/dsh`.

```sh
# from npm (after publish)
dsh plugin --profile web add dsh-shop-assistant

# from GitHub
dsh plugin --profile web add github:pengzhou267-ai/dsh-shop-assistant

# from a local checkout
dsh plugin --profile web add /Users/chenyang/Movies/study/dsh-shop-assistant
```

Then start Web UI (`dsh web` or your profile) and put export CSVs in the workspace.

## Flagship cases (vs asking a chat AI)

### 1) Batch bad-review replies

| | Chat AI alone | This plugin |
|--|--|--|
| Input | Paste 30 reviews into the chat | `examples/reviews.csv` + `kb/sample/售后政策.md` |
| Pain | Context blows up; policy forgotten each turn | `shop_csv_preview` + skill `shop-bad-review` |
| Output | Uneven tone | Grouped, copy-paste replies under **your** policy |

**Prompt:**

```text
工作区里有 examples/reviews.csv。用 shop_csv_preview（adapter=taobao-review）读取，
按差评原因分组，遵守 kb/sample/售后政策.md，写出可直接粘贴的回复。
```

### 2) New listing from a public competitor URL

| | Chat AI alone | This plugin |
|--|--|--|
| Input | You manually copy the competitor page | Public URL → `shop_page_snapshot` |
| Pain | Extra copy-paste; easy to invent prices | Snapshot + skill `shop-listing` |

**Prompt:**

```text
对这个公开商品链接做 shop_page_snapshot，再按 shop-listing 输出标题×5、五点描述和 FAQ。
不要编造库存和活动。
```

### 3) Product Go / No-Go with real math

| | Chat AI alone | This plugin |
|--|--|--|
| Input | “Is 99 yuan ok if cost is 35?” | `shop_product_score` fixed formula |
| Pain | Hallucinated fees | Reproducible unit profit + six-dimension score |

**Prompt:**

```text
成本 35，售价 99，竞品 109；需求4 竞争3 运营难度2 风险2 时机4。
调用 shop_product_score 并解释 decisionZh。
```

## Tools

| Tool | Role |
|--|--|
| `shop_csv_preview` | Read CSV + column adapters |
| `shop_product_score` | Profit + weighted score + decision |
| `shop_page_snapshot` | Public HTML title/price hints (no login) |

## Extending / contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/EXTENDING.md](docs/EXTENDING.md). Markdown skills and CSV adapters are the easiest PRs.

## License

MIT
