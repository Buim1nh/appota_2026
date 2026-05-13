// src/models/Item.ts
// Schema for equipment: weapons, armor, shields, accessories, consumables.

import mongoose, { Schema, model } from "mongoose";
import type { IItem } from "@/types/database";
import { ModifierSchema } from "./shared";

const ItemSchema = new Schema<IItem>(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["weapon", "armor", "shield", "accessory", "consumable"],
    },
    rarity: {
      type: String,
      required: true,
      enum: ["common", "uncommon", "rare", "very_rare", "legendary", "artifact"],
      default: "common",
    },
    requiresAttunement: { type: Boolean, default: false },
    modifiers: [ModifierSchema],
    weaponProps: {
      damageDice: { type: String },
      damageType: { type: String },
      properties: [{ type: String }], // "finesse", "versatile", "two-handed", etc.
    },
    description: { type: String, default: "" },
    source: { type: String, required: true, default: "official" },
    edition: { type: String, required: true, default: "5e" },
  },
  { timestamps: true }
);

/* ── Indexes ─────────────────────────────────────────────────────── */
// Text index for search bar
ItemSchema.index({ name: "text" });
// Compound index for filtering UI (type + rarity)
ItemSchema.index({ type: 1, rarity: 1 });

export const Item =
  mongoose.models.Item || model<IItem>("Item", ItemSchema);
