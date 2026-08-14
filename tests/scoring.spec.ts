import { describe, expect, it } from 'vitest'
import { scoreProduct, decisionLabelZh, DEFAULT_SCORING } from '../src/scoring.js'
import { getAdapter, normalizeRow } from '../src/adapters/csv-maps.js'
import { previewCsv } from '../src/tools/csv-preview.js'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

describe('scoreProduct', () => {
  it('returns strongly_recommend for healthy margin and dims', () => {
    const r = scoreProduct({
      cost: 30,
      sellPrice: 100,
      demand: 5,
      competition: 2,
      opsDifficulty: 2,
      risk: 2,
      timing: 5,
    })
    expect(r.unitProfit).toBeGreaterThan(40)
    expect(r.decision).toBe('strongly_recommend')
    expect(decisionLabelZh(r.decision)).toContain('强烈')
  })

  it('flags non-positive profit', () => {
    const r = scoreProduct({
      cost: 90,
      sellPrice: 100,
      demand: 3,
      competition: 3,
      opsDifficulty: 3,
      risk: 3,
      timing: 3,
      commissionRate: 0.1,
      extraCostRate: 0.1,
    })
    expect(r.unitProfit).toBeLessThanOrEqual(0)
    expect(r.notes.some(n => n.includes('利润'))).toBe(true)
  })

  it('respects weight overrides via config object', () => {
    const config = {
      ...DEFAULT_SCORING,
      weights: { ...DEFAULT_SCORING.weights, margin: 50, demand: 5 },
    }
    const r = scoreProduct({
      cost: 20,
      sellPrice: 100,
      demand: 1,
      competition: 1,
      opsDifficulty: 1,
      risk: 1,
      timing: 1,
    }, config)
    expect(r.weightedTotal).toBeGreaterThan(50)
  })
})

describe('csv adapters', () => {
  it('maps taobao review headers', () => {
    const adapter = getAdapter('taobao-review')
    const row = normalizeRow({ 评分: '2', 评价内容: '慢', 订单号: 'O1' }, adapter)
    expect(row.rating).toBe('2')
    expect(row.content).toBe('慢')
    expect(row.orderId).toBe('O1')
  })
})

describe('previewCsv', () => {
  it('reads examples/reviews.csv', async () => {
    const preview = await previewCsv({
      filePath: join(root, 'examples/reviews.csv'),
      adapterId: 'taobao-review',
    })
    expect(preview.rowCount).toBe(5)
    expect(preview.headers.length).toBeGreaterThan(0)
    expect(preview.sampleRows[0]?.rating || preview.sampleRows[0]?.['评分']).toBeTruthy()
  })
})
