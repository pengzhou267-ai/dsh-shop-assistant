import type { Context } from '@deepseek-ai/cordis';
import Schema from '@deepseek-ai/schemastery';
import '@deepseek-ai/dsh-tools';
import '@deepseek-ai/dsh-skill';
import '@deepseek-ai/dsh-system-prompt';
import { type ScoringWeights } from './scoring.js';
export declare const name = "shop-assistant";
export declare const inject: string[];
/** Plugin configuration for paths and scoring defaults. */
export interface Config {
    /** Directory of SKILL.md folders relative to package root, or absolute. */
    skillsRelativeDir?: string;
    /** Sample / store policy KB directory relative to package root, or absolute. */
    kbRelativeDir?: string;
    /** Override default commission rate 0–1. */
    defaultCommissionRate?: number;
    /** Override default extra cost rate 0–1. */
    defaultExtraCostRate?: number;
    /** Optional weight overrides (unspecified keys keep defaults). */
    scoringWeights?: Partial<ScoringWeights>;
}
export declare const Config: Schema<Config>;
/**
 * Register shop tools, Chinese skills, and an operator-facing prompt section.
 * @param ctx - Cordis context
 * @param config - validated plugin config
 */
export declare function apply(ctx: Context, config?: Config): void;
