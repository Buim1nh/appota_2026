// src/models/Build.ts
// Schema for character builds / loadouts — the core document of the app.

import mongoose, { Schema, model } from "mongoose";
import type { IBuild } from "@/types/database";
import { ModifierSchema } from "./shared";

const BuildSchema = new Schema<IBuild>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    level: { type: Number, required: true, min: 1, max: 20 },

    /* ── References to GameRules ───────────────────────────────── */
    classRef: {
      type: Schema.Types.ObjectId,
      ref: "GameRule",
      required: true,
    },
    subclassId: {
      type: Schema.Types.ObjectId,
      ref: "GameRule",
      default: null,
    },
    raceRef: {
      type: Schema.Types.ObjectId,
      ref: "GameRule",
      required: true,
    },
    backgroundRef: {
      type: Schema.Types.ObjectId,
      ref: "GameRule",
      default: null,
    },

    /* ── Embedded: Base Stats ──────────────────────────────────── */
    baseStats: {
      str: { type: Number, default: 10 },
      dex: { type: Number, default: 10 },
      con: { type: Number, default: 10 },
      int: { type: Number, default: 10 },
      wis: { type: Number, default: 10 },
      cha: { type: Number, default: 10 },
    },

    /* ── Embedded: Derived Stats (cached on save) ─────────────── */
    derivedStats: {
      hp: {
        max: { type: Number, default: 10 },
        current: { type: Number, default: 10 },
        temp: { type: Number, default: 0 },
      },
      ac: { type: Number, default: 10 },
      initiative: { type: Number, default: 0 },
      speed: { type: Number, default: 30 },
      proficiencyBonus: { type: Number, default: 2 },
      spellSaveDC: { type: Number, default: 10 },
      attackBonus: { type: Number, default: 0 },
      carryWeight: {
        current: { type: Number, default: 0 },
        max: { type: Number, default: 150 },
      },
    },

    /* ── Equipment slots (referenced Items) ───────────────────── */
    equipment: {
      head: { type: Schema.Types.ObjectId, ref: "Item" },
      chest: { type: Schema.Types.ObjectId, ref: "Item" },
      mainHand: { type: Schema.Types.ObjectId, ref: "Item" },
      offHand: { type: Schema.Types.ObjectId, ref: "Item" },
      ring1: { type: Schema.Types.ObjectId, ref: "Item" },
      ring2: { type: Schema.Types.ObjectId, ref: "Item" },
      amulet: { type: Schema.Types.ObjectId, ref: "Item" },
    },

    /* ── Referenced arrays ────────────────────────────────────── */
    spells: [{ type: Schema.Types.ObjectId, ref: "Spell" }],
    feats: [{ type: Schema.Types.ObjectId, ref: "GameRule" }],

    /* ── Engine-computed modifiers snapshot ────────────────────── */
    activeModifiers: [ModifierSchema],

    /* ── Sharing & metadata ───────────────────────────────────── */
    shareId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    isPublic: { type: Boolean, default: false },
    optimizationScore: { type: Number, default: 0 },
    tags: [{ type: String, index: true }],
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

/* ── Compound Indexes ────────────────────────────────────────────── */
// User's builds sorted by last update
BuildSchema.index({ userId: 1, updatedAt: -1 });
// Public build discovery by tags
BuildSchema.index({ isPublic: 1, tags: 1 });

export const Build =
  mongoose.models.Build || model<IBuild>("Build", BuildSchema);
