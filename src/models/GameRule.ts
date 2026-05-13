// src/models/GameRule.ts
// Schema for game rules: classes, subclasses, races, subraces, backgrounds, feats.

import mongoose, { Schema, model } from "mongoose";
import type { IGameRule } from "@/types/database";
import { ModifierSchema } from "./shared";

const GameRuleSchema = new Schema<IGameRule>(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["class", "subclass", "race", "subrace", "background", "feat"],
    },
    parentRef: {
      type: Schema.Types.ObjectId,
      ref: "GameRule",
      default: null,
    },
    description: { type: String, default: "" },
    modifiers: [ModifierSchema],
    source: { type: String, required: true, default: "official" },
    edition: { type: String, required: true, default: "5e" },
  },
  { timestamps: true }
);

/* ── Indexes ─────────────────────────────────────────────────────── */
// Fast lookup by category (e.g. list all classes)
GameRuleSchema.index({ category: 1 });
// Find children of a parent (e.g. subclasses of a class)
GameRuleSchema.index({ parentRef: 1 });
// Compound: category + source for edition/homebrew filtering
GameRuleSchema.index({ category: 1, source: 1, edition: 1 });

export const GameRule =
  mongoose.models.GameRule || model<IGameRule>("GameRule", GameRuleSchema);
