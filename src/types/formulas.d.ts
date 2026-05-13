// src/types/formulas.d.ts
// Interfaces for the Formula Engine — powers conditional modifiers,
// additive/multiplicative bonuses, and dynamic stat calculations.

/**
 * A single condition that gates whether a modifier applies.
 * @example { field: "hp.current", operator: "lt", value: 33 }
 */
export interface ICondition {
  field: string; // dot-path into the Build document, e.g. "hp.current", "equipment.hands"
  operator: "eq" | "gt" | "lt" | "gte" | "lte" | "contains";
  value: unknown;
}

/**
 * A stat modifier produced by items, spells, feats, or racial traits.
 * @example { targetStat: "ac", type: "flat", value: 2 }
 */
export interface IModifier {
  targetStat: string; // dot-path to the stat being modified, e.g. "ac", "damage.fire"
  type: "flat" | "multiplier" | "dice" | "stat_bonus";
  value: number | string; // numeric bonus or dice expression like "1d4"
  conditions?: ICondition[];
}
