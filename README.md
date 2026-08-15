# dsh-shop-assistant

[中文](README.zh.md) | English

For **shop owners, CS leads, and operators** — you do **not** need to write code.

**You do not need to know English tool names. Follow the cases step by step.**

## In one minute

After you install this DeepSeek Harness (**dsh**) plugin, you can do three jobs in chat with plain language:

1. **Batch bad-review replies** — put an exported review spreadsheet in a folder; get many paste-ready replies that follow **your** return policy.
2. **New listing copy from a competitor page** — paste a public product URL; the assistant summarizes the page, then drafts titles, bullets, and FAQs.
3. **Go / No-Go before listing** — give cost, price, and 1–5 scores; a **fixed formula** computes profit and a recommendation (not a made-up guess).

This is **not** “just another chatbot.” Versus pasting into a web AI chat, you get **whole-table handling**, **stable policy wording**, **reproducible math**, and **less copy-paste**.

---

## Install

1. Run [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (e.g. `npx @deepseek-ai/dsh web`).
2. Install this plugin:

```sh
dsh plugin --profile web add dsh-shop-assistant
# or
dsh plugin --profile web add github:pengzhou267-ai/dsh-shop-assistant
```

3. **Restart** the Web UI or open a new session.
4. Pick a **workspace folder** (next section), then chat.

---

## Before you start: where do files go?

### What is the “workspace”?

It is the folder you select when you start dsh Web chat.  
The assistant reliably reads tables and docs **inside that folder only**.

Suggested layout:

```text
my-shop-files/
├── reviews.csv           ← your exported reviews
├── after-sales-policy.md ← your return rules
└── (optional) products.csv
```

### Try without your own data first?

Copy samples from this package into the workspace:

| File | Use |
|------|-----|
| `examples/reviews.csv` | Fake reviews for case 1 |
| `examples/products.csv` | Fake products |
| `examples/score-inputs.csv` | Numbers for scoring |
| `kb/sample/售后政策.md` | Sample return policy (**edit before real use**) |

Header formats: [examples/README.zh.md](examples/README.zh.md) (Chinese; table headers are the same).

---

## Case 1: Batch bad-review replies (daily)

### How people usually do it

Copy reviews one by one from the seller console → paste into ChatGPT / DeepSeek web → re-explain return rules every time → paste replies back. Long threads blow up; wording drifts.

### Prepare

1. Export reviews from Taobao / Pinduoduo / etc. Save as **CSV UTF-8** if needed.
2. Prefer columns like: order id, rating, review text, date, SKU (see `examples/reviews.csv`).
3. Put the file in the workspace, e.g. `reviews.csv`.
4. Put return rules in `after-sales-policy.md` (start from `kb/sample/售后政策.md`).

### Steps

1. Open dsh Web; set workspace to that folder.
2. Confirm you can see `reviews.csv` and the policy file.
3. Paste and send:

```text
The workspace has reviews.csv and after-sales-policy.md (or 售后政策.md).

Please use the “read review spreadsheet” feature to open reviews.csv
(use the Taobao-style column mapping if headers look like a Taobao export).
Do not ask me to paste the table into chat.

Then:
1) Group bad reviews by reason (shipping delay, color mismatch, damage, size, …);
2) Write paste-ready replies for each group;
3) Strictly follow the policy file — no promises that are not written there.
```

(You may see tools like `shop_csv_preview` in the UI — **you do not type those names yourself**.)

### What you get

Grouped, copy-paste replies keyed by reason / order id, aligned with your policy.

### Compare

| | Web AI chat | This plugin |
|--|--|--|
| Input | Paste into the dialog | Whole CSV in the workspace |
| Many rows | Context overflow | Whole-table pass |
| Policy | Re-typed every turn | Fixed policy file |

---

## Case 2: New listing copy (weekly / campaigns)

### How people usually do it

Open competitor tabs → hand-copy titles → paste into an AI for polish. Slow; prices get wrong or invented.

### Prepare

Copy a **public** product URL from the browser address bar (buyer-visible page, not a login-only seller console).

### Steps

Send something like:

```text
First, fetch information from this public product page (title, description summary, visible price clues).
Do not ask me to log into a seller console, and do not invent stock or promotions.

URL:
https://paste-a-real-public-product-url-here

Then follow the “new listing copy” flow and output:
1) 5 title options (with rough length);
2) five bullet points;
3) a detail-page outline;
4) 5–8 FAQs.
Our channel is Taobao. Core selling points: …
```

In plain words: the assistant **summarizes the public page** (`shop_page_snapshot`), then follows the built-in listing playbook (`shop-listing`). You only paste Chinese/English instructions and the link.

### Compare

| | Web AI chat | This plugin |
|--|--|--|
| Competitor info | You copy by hand | Paste public URL |
| Prices | Easy to invent | Prefer page price clues |

---

## Case 3: Pre-list profit check (weekly–monthly)

### How people usually do it

Ask “cost 35, sell at 99 — how much do I make?” Numbers change every time.

### Prepare

| Field | Meaning | Example |
|------|---------|---------|
| cost | Unit cost | 35 |
| sell price | Your price | 99 |
| competitor price (optional) | Peers | 109 |
| demand / competition / ops / risk / timing | Scores 1–5 | see prompt |

See also `examples/score-inputs.csv`.

### Steps

```text
Please use the “profit scoring / product score” feature (fixed formula, no verbal guesses)
and explain in plain language: unit profit, margin rate, total score,
and whether to strongly recommend / caution / not recommend.

Cost 35, sell price 99, competitor 109;
demand 4, competition 3, ops difficulty 2, risk 2, timing 4.
```

You are asking the assistant to run the plugin formula (`shop_product_score`). **You do not memorize the English name.**

Same inputs → **same outputs**.

### Compare

| | Web AI chat | This plugin |
|--|--|--|
| Math | Improvised | Fixed formula |
| Repeat asks | Numbers may drift | Stable |

---

## Appendix

| Shop-owner wording | What to say in chat | Internal name (optional) |
|--------------------|---------------------|---------------------------|
| Read CSV | “Use read-spreadsheet on xxx.csv” | `shop_csv_preview` |
| Fetch public page | “Fetch this public product page first” | `shop_page_snapshot` |
| Formula score | “Use profit scoring” | `shop_product_score` |

### Your own policy file

Copy `kb/sample/售后政策.md`, edit it, mention the path in the prompt. Advanced: set `kbRelativeDir` in the bundle config.

### Contributing / license

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/EXTENDING.md](docs/EXTENDING.md). MIT.
