import { scoreProduct, decisionLabelZh, type ScoringConfig, type ScoreInput } from '../scoring.js'

/**
 * Run configurable scoring and return a JSON-serializable summary for the model.
 */
export function runProductScore(input: ScoreInput, config: ScoringConfig) {
  const result = scoreProduct(input, config)
  return {
    ...result,
    decisionZh: decisionLabelZh(result.decision),
    marginRatePercent: Number((result.marginRate * 100).toFixed(2)),
  }
}
