---
name: shop-csv-ops
description: 教运营如何用 shop_csv_preview 处理导出表。
whenToUse: 用户提到导出表格、Excel/CSV、批量处理时。
---

# CSV 操作

1. 让用户把导出文件放到工作区，给出相对路径。
2. 调用 `shop_csv_preview`，按平台选择 adapter。
3. 根据表头决定下一步：差评→`shop-bad-review`；商品→选品或 Listing。
4. 不要要求用户把整表粘贴进聊天。
