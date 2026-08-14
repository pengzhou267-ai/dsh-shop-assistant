import { type ScoringConfig, type ScoreInput } from '../scoring.js';
/**
 * Run configurable scoring and return a JSON-serializable summary for the model.
 */
export declare function runProductScore(input: ScoreInput, config: ScoringConfig): {
    decisionZh: string;
    marginRatePercent: number;
    unitProfit: number;
    marginRate: number;
    dimensions: Record<keyof import("../scoring.js").ScoringWeights, number>;
    weightedTotal: number;
    decision: import("../scoring.js").DecisionLevel;
    notes: string[];
};
