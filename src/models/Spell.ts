// src/models/Spell.ts
// Schema for spells (cantrips through 9th level).

import mongoose, { Schema, model } from "mongoose";
import type { ISpell } from "@/types/database";
import { ModifierSchema } from "./shared";

const SpellSchema = new Schema<ISpell>(
  {
    name: { type: String, required: true, trim: true },
    level: { type: Number, required: true, min: 0, max: 9 }, // 0 = cantrip
    school: {
      type: String,
      required: true,
      enum: [
        "abjuration",
        "conjuration",
        "divination",
        "enchantment",
        "evocation",
        "illusion",
        "necromancy",
        "transmutation",
      ],
    },
    castingTime: { type: String, required: true },
    duration: { type: String, required: true },
    range: { type: String, required: true },
    components: {
      v: { type: Boolean, default: false },
      s: { type: Boolean, default: false },
      m: { type: String, default: "" },
    },
    description: { type: String, default: "" },
    modifiers: [ModifierSchema],
    source: { type: String, required: true, default: "official" },
    edition: { type: String, required: true, default: "5e" },
  },
  { timestamps: true }
);

/* ── Indexes ─────────────────────────────────────────────────────── */
// Text index for spell search
SpellSchema.index({ name: "text" });
// Compound index for filtering by level and school
SpellSchema.index({ level: 1, school: 1 });

export const Spell =
  mongoose.models.Spell || model<ISpell>("Spell", SpellSchema);
