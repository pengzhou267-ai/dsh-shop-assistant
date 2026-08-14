/**
 * Reproducible product scoring and rough profit for shop operators.
 * Weights and commission defaults live in config/scoring.json (overridable via plugin Config).
 */

export interface ScoringWeights {
  demand: number
  competition: number
  margin: number
  opsDifficulty: number
  risk: number
  timing: number
}

export interface ScoringConfig {
  /** Platform commission rate 0–1 when the caller omits commissionRate. */
  defaultCommissionRate: number
  /** Extra cost rate (ads/returns/etc.) 0–1 when omitted. */
  defaultExtraCostRate: number
  weights: ScoringWeights
  /** Minimum total weight sanity; weights are normalized to sum to 100. */
  decision: {
    stronglyRecommendMin: number
    cautionMin: number
  }
}

export interface ScoreInput {
  cost: number
  sellPrice: number
  competitorPrice?: number
  commissionRate?: number
  extraCostRate?: number
  /** Each dimension 1–5 (higher is better except competition/ops/risk where higher = harder/worse). */
  demand: number
  competition: number
  opsDifficulty: number
  risk: number
  timing: number
}

export type DecisionLevel = 'strongly_recommend' | 'caution' | 'not_recommend'

export interface ScoreResult {
  unitProfit: number
  marginRate: number
  dimensions: Record<keyof ScoringWeights, number>
  weightedTotal: number
  decision: DecisionLevel
  notes: string[]
}

export const DEFAULT_SCORING: ScoringConfig = {
  defaultCommissionRate: 0.05,
  defaultExtraCostRate: 0.08,
  weights: {
    demand: 20,
    competition: 20,
    margin: 25,
    opsDifficulty: 10,
    risk: 15,
    timing: 10,
  },
  decision: {
    stronglyRecommendMin: 75,
    cautionMin: 55,
  },
}

function clampScore(n: number): number {
  if (!Number.isFinite(n)) return 1
  return Math.min(5, Math.max(1, n))
}

/** Map 1–5 "higher is worse" into a 0–100 contribution. */
function invertDim(value: number): number {
  return ((6 - clampScore(value)) / 5) * 100
}

/** Map 1–5 "higher is better" into a 0–100 contribution. */
function forwardDim(value: number): number {
  return (clampScore(value) / 5) * 100
}

/**
 * Compute unit profit, margin, six-dimension scores, and a Go/No-Go band.
 * @param input - costs, prices, and 1–5 dimension ratings from the seller
 * @param config - scoring weights and default rates
 */
export function scoreProduct(input: ScoreInput, config: ScoringConfig = DEFAULT_SCORING): ScoreResult {
  const commission = input.commissionRate ?? config.defaultCommissionRate
  const extra = input.extraCostRate ?? config.defaultExtraCostRate
  const fees = input.sellPrice * (commission + extra)
  const unitProfit = input.sellPrice - input.cost - fees
  const marginRate = input.sellPrice > 0 ? unitProfit / input.sellPrice : 0

  const notes: string[] = []
  if (input.sellPrice <= 0) notes.push('售价必须大于 0')
  if (input.cost < 0) notes.push('成本不能为负')
  if (unitProfit <= 0) notes.push('按当前费率估算单位利润 ≤ 0')
  if (input.competitorPrice !== undefined && input.competitorPrice > 0) {
    const delta = (input.sellPrice - input.competitorPrice) / input.competitorPrice
    if (delta > 0.15) notes.push(`售价高于竞品约 ${(delta * 100).toFixed(0)}%，注意转化`)
    if (delta < -0.15) notes.push(`售价低于竞品约 ${(-delta * 100).toFixed(0)}%，核对是否伤利润`)
  }

  // Margin dimension: map marginRate into 1–5 then to 0–100
  let marginDim = 1
  if (marginRate >= 0.35) marginDim = 5
  else if (marginRate >= 0.25) marginDim = 4
  else if (marginRate >= 0.15) marginDim = 3
  else if (marginRate >= 0.05) marginDim = 2

  const dimensions = {
    demand: forwardDim(input.demand),
    competition: invertDim(input.competition),
    margin: forwardDim(marginDim),
    opsDifficulty: invertDim(input.opsDifficulty),
    risk: invertDim(input.risk),
    timing: forwardDim(input.timing),
  }

  const w = config.weights
  const weightSum = w.demand + w.competition + w.margin + w.opsDifficulty + w.risk + w.timing
  const weightedTotal =
    (dimensions.demand * w.demand
      + dimensions.competition * w.competition
      + dimensions.margin * w.margin
      + dimensions.opsDifficulty * w.opsDifficulty
      + dimensions.risk * w.risk
      + dimensions.timing * w.timing)
    / weightSum

  let decision: DecisionLevel = 'not_recommend'
  if (weightedTotal >= config.decision.stronglyRecommendMin && unitProfit > 0) {
    decision = 'strongly_recommend'
  } else if (weightedTotal >= config.decision.cautionMin) {
    decision = 'caution'
  }

  return {
    unitProfit: Number(unitProfit.toFixed(2)),
    marginRate: Number(marginRate.toFixed(4)),
    dimensions,
    weightedTotal: Number(weightedTotal.toFixed(2)),
    decision,
    notes,
  }
}

export function decisionLabelZh(level: DecisionLevel): string {
  switch (level) {
    case 'strongly_recommend':
      return '强烈建议上架'
    case 'caution':
      return '谨慎（需改价或控成本）'
    case 'not_recommend':
      return '不建议'
    default: {
      const _exhaustive: never = level
      return _exhaustive
    }
  }
}
