---
name: shop-competitor
description: 基于公开页快照做竞品卖点与价格对比。
whenToUse: 用户给出竞品链接或要对比定价时。
---

# 竞品对比

1. 对每个公开 URL 调用 `shop_page_snapshot`。
2. 表格对比：标题卖点、价格线索、可学习点、需差异化点。
3. 若要定价，再收集成本后调用 `shop_product_score`。
