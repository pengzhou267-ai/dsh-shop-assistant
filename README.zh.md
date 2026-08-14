# dsh-shop-assistant（电商小助手）

[English](README.md) | 中文

面向**电商运营（非程序员）**的 DeepSeek Harness（**dsh**）组合包：CSV 批量工具、可复现利润公式、中文 Skill、可替换的店铺政策知识库。

**不是**又一个「写一句文案」的聊天机器人。相对直接问 AI，优势在：**整表批量、政策口径统一、利润用公式算、少粘贴**。

## 安装

需已安装 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（例如 `npx @deepseek-ai/dsh`）。

```sh
# npm（发布后）
dsh plugin --profile web add dsh-shop-assistant

# GitHub
dsh plugin --profile web add github:pengzhou267-ai/dsh-shop-assistant

# 本地目录
dsh plugin --profile web add /path/to/dsh-shop-assistant
```

启动 Web UI，把店铺导出的 CSV 放进工作区即可。

## 三个旗舰案例（相对直接问 AI）

### 案例 1：差评批量回复（每天高频）

1. **场景**：客服每天要回大量差评/中评，怕口径不一致。  
2. **直接问 AI**：把 30 条评价粘贴进对话框 → 上下文爆炸；每轮重讲退货规则。  
3. **用本插件**：把 `examples/reviews.csv` 放进工作区 → 复制下面提示词。  
4. **对比**：一次处理整表；回复遵守 `kb/sample/售后政策.md`。

```text
工作区里有 examples/reviews.csv。用 shop_csv_preview（adapter=taobao-review）读取，
按差评原因分组，严格遵守 kb/sample/售后政策.md，输出可直接粘贴的回复列表。
```

### 案例 2：上新 Listing（周～大促）

1. **场景**：上新要写标题/卖点/FAQ，对着竞品硬抄。  
2. **直接问 AI**：自己开网页抄完再贴。  
3. **用本插件**：公开链接 → `shop_page_snapshot` → Skill `shop-listing`。  
4. **对比**：少一次抄屏；价格线索来自页面摘要而非瞎编。

```text
对这个公开商品链接做 shop_page_snapshot，再按 shop-listing 输出标题×5、五点描述和 FAQ。
```

### 案例 3：选品算账（周～月，决策重）

1. **场景**：不知道这单赚不赚钱就上架。  
2. **直接问 AI**：佣金/毛利常被模型随口编。  
3. **用本插件**：必须调用 `shop_product_score`。  
4. **对比**：单位利润与六维分可复现。

```text
成本 35，售价 99，竞品 109；需求4 竞争3 运营难度2 风险2 时机4。
调用 shop_product_score，用中文解释 decisionZh 与 notes。
```

## 工具一览

| 工具 | 作用 |
|------|------|
| `shop_csv_preview` | 读 CSV + 淘宝/拼多多/Shopify 等列映射 |
| `shop_product_score` | 固定公式：利润 + 六维分 + 建议等级 |
| `shop_page_snapshot` | 公开页标题/价格线索（**无登录**） |

## 换成你自己的政策

复制 `kb/sample/`，改成真实售后规则，在组合包配置里设置 `kbRelativeDir` 指向该目录。

## 贡献

见 [CONTRIBUTING.md](CONTRIBUTING.md)、[docs/EXTENDING.md](docs/EXTENDING.md)。欢迎只改 Markdown Skill 或加一种 CSV 列映射。

## 许可证

MIT
