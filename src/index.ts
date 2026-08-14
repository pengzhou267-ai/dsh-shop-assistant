import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'
import '@deepseek-ai/dsh-tools'
import '@deepseek-ai/dsh-skill'
import '@deepseek-ai/dsh-system-prompt'
import { DEFAULT_SCORING, type ScoringConfig, type ScoringWeights } from './scoring.js'
import { previewCsv } from './tools/csv-preview.js'
import { runProductScore } from './tools/product-score.js'
import { snapshotPublicPage } from './tools/page-snapshot.js'

const PACKAGE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

export const name = 'shop-assistant'
export const inject = ['tools', 'skills', 'systemPrompt']

/** Plugin configuration for paths and scoring defaults. */
export interface Config {
  /** Directory of SKILL.md folders relative to package root, or absolute. */
  skillsRelativeDir?: string
  /** Sample / store policy KB directory relative to package root, or absolute. */
  kbRelativeDir?: string
  /** Override default commission rate 0–1. */
  defaultCommissionRate?: number
  /** Override default extra cost rate 0–1. */
  defaultExtraCostRate?: number
  /** Optional weight overrides (unspecified keys keep defaults). */
  scoringWeights?: Partial<ScoringWeights>
}

export const Config: Schema<Config> = Schema.object({
  skillsRelativeDir: Schema.string().default('skills'),
  kbRelativeDir: Schema.string().default('kb/sample'),
  defaultCommissionRate: Schema.number().default(DEFAULT_SCORING.defaultCommissionRate),
  defaultExtraCostRate: Schema.number().default(DEFAULT_SCORING.defaultExtraCostRate),
})

function resolvePackagePath(relativeOrAbsolute: string): string {
  return relativeOrAbsolute.startsWith('/')
    ? relativeOrAbsolute
    : join(PACKAGE_ROOT, relativeOrAbsolute)
}

function buildScoringConfig(config: Config): ScoringConfig {
  return {
    defaultCommissionRate: config.defaultCommissionRate ?? DEFAULT_SCORING.defaultCommissionRate,
    defaultExtraCostRate: config.defaultExtraCostRate ?? DEFAULT_SCORING.defaultExtraCostRate,
    weights: { ...DEFAULT_SCORING.weights, ...config.scoringWeights },
    decision: { ...DEFAULT_SCORING.decision },
  }
}

interface ParsedSkillFile {
  name: string
  description: string
  whenToUse?: string
  content: string
}

function parseSkillMarkdown(raw: string, fallbackName: string): ParsedSkillFile {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) {
    return { name: fallbackName, description: fallbackName, content: raw.trim() }
  }
  const fm = match[1]!
  const body = match[2]!.trim()
  const field = (key: string): string | undefined => {
    const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
    return m?.[1]?.trim().replace(/^["']|["']$/g, '')
  }
  return {
    name: field('name') ?? fallbackName,
    description: field('description') ?? fallbackName,
    whenToUse: field('whenToUse'),
    content: body,
  }
}

function loadSkillsFromDir(skillsDir: string): ParsedSkillFile[] {
  let entries
  try {
    entries = readdirSync(skillsDir, { withFileTypes: true })
  } catch {
    return []
  }
  const skills: ParsedSkillFile[] = []
  for (const ent of entries) {
    if (!ent.isDirectory()) continue
    try {
      const raw = readFileSync(join(skillsDir, ent.name, 'SKILL.md'), 'utf8')
      skills.push(parseSkillMarkdown(raw, ent.name))
    } catch {
      // skip folders without readable SKILL.md
    }
  }
  return skills
}

/**
 * Register shop tools, Chinese skills, and an operator-facing prompt section.
 * @param ctx - Cordis context
 * @param config - validated plugin config
 */
export function apply(ctx: Context, config: Config = {}) {
  const scoring = buildScoringConfig(config)
  const skillsDir = resolvePackagePath(config.skillsRelativeDir ?? 'skills')
  const kbDir = resolvePackagePath(config.kbRelativeDir ?? 'kb/sample')

  ctx.systemPrompt.section({
    name: 'shop-assistant:persona',
    order: 40,
    text: [
      '你在协助电商运营（非程序员）。优先用本插件工具处理表格与公开网页，不要编造订单/评价数据。',
      '写客服或差评回复前，先阅读店铺政策知识库与相关 skill。',
      `店铺政策知识库目录：${kbDir}`,
      '算利润与选品结论时必须调用 shop_product_score，禁止口头估算佣金。',
      '仅抓取公开商品页；不要要求用户提供后台账号密码。',
    ].join('\n'),
  })

  for (const skill of loadSkillsFromDir(skillsDir)) {
    ctx.skills.register({
      name: skill.name,
      description: skill.description,
      whenToUse: skill.whenToUse,
      source: 'bundled',
      content: skill.content,
      resourceBase: { kind: 'directory', path: join(skillsDir, skill.name) },
      provider: 'dsh-shop-assistant',
    })
  }

  ctx.tools.register(defineTool({
    name: 'shop_csv_preview',
    description:
      '读取工作区内的商品/订单/评价 CSV，返回表头、行数与样例行。可用 adapter 映射淘宝/拼多多/Shopify 等常见列名。',
    parameters: {
      path: { type: 'string', required: true, description: 'CSV 路径（相对工作区或绝对路径）' },
      adapter: {
        type: 'string',
        description: '列映射：generic | taobao-review | pdd-review | shopify-product | generic-product',
      },
      sampleSize: { type: 'number', description: '样例行数，默认 5，最大 50' },
    },
    output: {
      schema: {
        type: 'object',
        properties: {
          path: { type: 'string' },
          adapter: { type: 'string' },
          adapterLabel: { type: 'string' },
          headers: { type: 'array', items: { type: 'string' } },
          rowCount: { type: 'number' },
          sampleRows: { type: 'array', items: { type: 'object', additionalProperties: true } },
          availableAdapters: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                label: { type: 'string' },
              },
              required: ['id', 'label'],
              additionalProperties: false,
            },
          },
        },
        required: ['path', 'adapter', 'adapterLabel', 'headers', 'rowCount', 'sampleRows', 'availableAdapters'],
        additionalProperties: false,
      },
      render: (_args, value) => [{
        type: 'text',
        text: `CSV ${value.path} · ${value.adapterLabel} · ${value.rowCount} 行 · 表头：${(value.headers ?? []).join(', ')}`,
      }],
    },
    async execute(args, exec) {
      return previewCsv({
        filePath: args.path,
        adapterId: args.adapter,
        sampleSize: args.sampleSize,
        cwd: process.cwd(),
        signal: exec.signal,
      })
    },
  }))

  ctx.tools.register(defineTool({
    name: 'shop_product_score',
    description:
      '用固定公式计算单位利润、毛利率与六维加权分，并给出强烈建议/谨慎/不建议。维度均为 1–5。',
    parameters: {
      cost: { type: 'number', required: true, description: '单件成本' },
      sellPrice: { type: 'number', required: true, description: '售价' },
      competitorPrice: { type: 'number', description: '竞品售价（可选）' },
      commissionRate: { type: 'number', description: '平台佣金率 0–1，默认用插件配置' },
      extraCostRate: { type: 'number', description: '广告/退货等额外费率 0–1' },
      demand: { type: 'number', required: true, description: '需求强度 1–5（越高越好）' },
      competition: { type: 'number', required: true, description: '竞争烈度 1–5（越高越卷）' },
      opsDifficulty: { type: 'number', required: true, description: '运营难度 1–5（越高越难）' },
      risk: { type: 'number', required: true, description: '风险 1–5（越高风险越大）' },
      timing: { type: 'number', required: true, description: '时机窗口 1–5（越高越好）' },
    },
    output: {
      schema: {
        type: 'object',
        properties: {
          unitProfit: { type: 'number' },
          marginRate: { type: 'number' },
          marginRatePercent: { type: 'number' },
          dimensions: { type: 'object', additionalProperties: true },
          weightedTotal: { type: 'number' },
          decision: { type: 'string' },
          decisionZh: { type: 'string' },
          notes: { type: 'array', items: { type: 'string' } },
        },
        required: [
          'unitProfit',
          'marginRate',
          'marginRatePercent',
          'dimensions',
          'weightedTotal',
          'decision',
          'decisionZh',
          'notes',
        ],
        additionalProperties: false,
      },
      render: (_args, value) => [{
        type: 'text',
        text: `选品评分 ${value.weightedTotal} 分 · ${value.decisionZh} · 单位利润 ${value.unitProfit} · 毛利率 ${value.marginRatePercent}%`,
      }],
    },
    async execute(args) {
      return runProductScore(args, scoring)
    },
  }))

  ctx.tools.register(defineTool({
    name: 'shop_page_snapshot',
    description:
      '抓取公开商品页的标题、描述摘要与价格线索（无登录）。用于竞品对比后再写 Listing/话术。',
    parameters: {
      url: { type: 'string', required: true, description: '公开商品页 http(s) URL' },
    },
    output: {
      schema: {
        type: 'object',
        properties: {
          url: { type: 'string' },
          status: { type: 'number' },
          title: { type: 'string' },
          description: { type: 'string' },
          priceHints: { type: 'array', items: { type: 'string' } },
          textExcerpt: { type: 'string' },
          truncated: { type: 'boolean' },
        },
        required: ['url', 'status', 'title', 'description', 'priceHints', 'textExcerpt', 'truncated'],
        additionalProperties: false,
      },
      render: (_args, value) => [{
        type: 'text',
        text: `页面 ${value.status} · ${value.title || '(无标题)'} · 价格线索：${(value.priceHints ?? []).slice(0, 5).join(' / ') || '无'}`,
      }],
    },
    async execute(args, exec) {
      const snap = await snapshotPublicPage(args.url, exec.signal)
      return {
        ...snap,
        title: snap.title ?? '',
        description: snap.description ?? '',
      }
    },
  }))
}
