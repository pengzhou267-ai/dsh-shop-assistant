# awesome-dsh-plugin submission draft

Suggested list entry (Tools & Capabilities or Skills):

```markdown
- [pengzhou267-ai/dsh-shop-assistant](https://github.com/pengzhou267-ai/dsh-shop-assistant) - Ecommerce operator workbench for non-developers: CSV batch preview with marketplace column adapters, reproducible profit/six-dimension scoring, public product-page snapshots, Chinese skills and a replaceable store-policy KB.
```

Install:

```sh
dsh plugin --profile web add github:pengzhou267-ai/dsh-shop-assistant
# after npm publish:
dsh plugin --profile web add dsh-shop-assistant
```

Open PR against: https://github.com/awesome-dsh-plugin/awesome-dsh-plugin

Repo must keep `"dsh": { "bundle": { "patch": "./cordis.patch.yml" } }` and topic `dsh-plugin`.
