// src/models/shared.ts
// Reusable sub-document schemas shared across multiple models.

import { Schema } from "mongoose";

/**
 * A condition that determines whether a modifier is active.
 * Used inside IModifier.conditions.
 */
export const ConditionSchema = new Schema(
  {
    field: { type: String, required: true },
    operator: {
      type: String,
      enum: ["eq", "gt", "lt", "gte", "lte", "contains"],
      required: true,
    },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

/**
 * A stat modifier produced by items, spells, feats, or racial traits.
 */
export const ModifierSchema = new Schema(
  {
    targetStat: { type: String, required: true },
    type: {
      type: String,
      enum: ["flat", "multiplier", "dice", "stat_bonus"],
      required: true,
    },
    value: { type: Schema.Types.Mixed, required: true },
    conditions: [ConditionSchema],
  },
  { _id: false }
);
