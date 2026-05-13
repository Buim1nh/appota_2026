// src/types/database.d.ts
// TypeScript interfaces for every MongoDB collection.

import { Document, Types } from "mongoose";
import { IModifier } from "./formulas";

/* ------------------------------------------------------------------ */
/*  Shared / Embedded Sub-documents                                   */
/* ------------------------------------------------------------------ */

/** The six core D&D ability scores. */
export interface IBaseStats {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

/** Pre-calculated combat stats cached on each Build document. */
export interface IDerivedStats {
  hp: { max: number; current: number; temp: number };
  ac: number;
  initiative: number;
  speed: number;
  proficiencyBonus: number;
  spellSaveDC: number;
  attackBonus: number;
  carryWeight: { current: number; max: number };
}


/* ------------------------------------------------------------------ */
/*  Items (weapons, armor, shields, accessories, consumables)         */
/* ------------------------------------------------------------------ */

export interface IItem extends Document {
  name: string;
  type: "weapon" | "armor" | "shield" | "accessory" | "consumable";
  rarity:
    | "common"
    | "uncommon"
    | "rare"
    | "very_rare"
    | "legendary"
    | "artifact";
  requiresAttunement: boolean;
  modifiers: IModifier[];
  weaponProps?: {
    damageDice: string; // e.g. "1d8", "2d6"
    damageType: string; // e.g. "slashing", "fire"
    properties: string[]; // "finesse", "versatile", "two-handed", etc.
  };
  description?: string;
  source: string; // "official" | "homebrew"
  edition: string; // e.g. "5e", "5.5e"
}

/* ------------------------------------------------------------------ */
/*  Spells                                                            */
/* ------------------------------------------------------------------ */

export interface ISpell extends Document {
  name: string;
  level: number; // 0 = cantrip
  school: string; // "evocation", "abjuration", etc.
  castingTime: string;
  duration: string;
  range: string;
  components: { v: boolean; s: boolean; m: string };
  description?: string;
  modifiers: IModifier[];
  source: string;
  edition: string;
}

/* ------------------------------------------------------------------ */
/*  GameRules (classes, races, backgrounds, feats, subclasses, etc.)  */
/* ------------------------------------------------------------------ */

export interface IGameRule extends Document {
  name: string;
  category: "class" | "subclass" | "race" | "subrace" | "background" | "feat";
  parentRef?: Types.ObjectId; // e.g. subclass → class, subrace → race
  description?: string;
  modifiers: IModifier[];
  source: string;
  edition: string;
}

/* ------------------------------------------------------------------ */
/*  Builds (character loadouts)                                       */
/* ------------------------------------------------------------------ */

export interface IBuild extends Document {
  name: string;
  level: number;
  classRef: Types.ObjectId;
  subclassId?: Types.ObjectId;
  raceRef: Types.ObjectId;
  backgroundRef?: Types.ObjectId;
  baseStats: IBaseStats;
  derivedStats: IDerivedStats; // cached / pre-calculated
  equipment: {
    head?: Types.ObjectId;
    chest?: Types.ObjectId;
    mainHand?: Types.ObjectId;
    offHand?: Types.ObjectId;
    ring1?: Types.ObjectId;
    ring2?: Types.ObjectId;
    amulet?: Types.ObjectId;
  };
  spells: Types.ObjectId[];
  feats: Types.ObjectId[];
  activeModifiers: IModifier[]; // engine-computed modifiers snapshot
  shareId: string;
  isPublic: boolean;
  optimizationScore: number;
  tags: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
