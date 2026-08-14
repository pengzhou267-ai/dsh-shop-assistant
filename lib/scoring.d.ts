/**
 * Reproducible product scoring and rough profit for shop operators.
 * Weights and commission defaults live in config/scoring.json (overridable via plugin Config).
 */
export interface ScoringWeights {
    demand: number;
    competition: number;
    margin: number;
    opsDifficulty: number;
    risk: number;
    timing: number;
}
export interface ScoringConfig {
    /** Platform commission rate 0–1 when the caller omits commissionRate. */
    defaultCommissionRate: number;
    /** Extra cost rate (ads/returns/etc.) 0–1 when omitted. */
    defaultExtraCostRate: number;
    weights: ScoringWeights;
    /** Minimum total weight sanity; weights are normalized to sum to 100. */
    decision: {
        stronglyRecommendMin: number;
        cautionMin: number;
    };
}
export interface ScoreInput {
    cost: number;
    sellPrice: number;
    competitorPrice?: number;
    commissionRate?: number;
    extraCostRate?: number;
    /** Each dimension 1–5 (higher is better except competition/ops/risk where higher = harder/worse). */
    demand: number;
    competition: number;
    opsDifficulty: number;
    risk: number;
    timing: number;
}
export type DecisionLevel = 'strongly_recommend' | 'caution' | 'not_recommend';
export interface ScoreResult {
    unitProfit: number;
    marginRate: number;
    dimensions: Record<keyof ScoringWeights, number>;
    weightedTotal: number;
    decision: DecisionLevel;
    notes: string[];
}
export declare const DEFAULT_SCORING: ScoringConfig;
/**
 * Compute unit profit, margin, six-dimension scores, and a Go/No-Go band.
 * @param input - costs, prices, and 1–5 dimension ratings from the seller
 * @param config - scoring weights and default rates
 */
export declare function scoreProduct(input: ScoreInput, config?: ScoringConfig): ScoreResult;
export declare function decisionLabelZh(level: DecisionLevel): string;
