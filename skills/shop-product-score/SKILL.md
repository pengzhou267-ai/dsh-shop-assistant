---
name: shop-product-score
description: 引导用 shop_product_score 做可复现的选品算账与 Go/No-Go。
whenToUse: 评估是否上架、对比两个 SKU 利润时。
---

# 选品评分

1. 向用户收集：成本、售价、可选竞品价、佣金率；以及需求/竞争/运营难度/风险/时机（1–5）。
2. **必须**调用 `shop_product_score`，禁止口算利润。
3. 用工具返回的 `decisionZh`、`unitProfit`、`notes` 解释给用户。
4. 若结论为谨慎/不建议，给出可执行的改价或控成本建议（仍基于公式结果）。
