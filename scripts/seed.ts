// scripts/seed.ts
// Seeds the MongoDB Atlas cluster with D&D PHB 2024 data.
// Data is sourced from public/dataset markdown files.
// Run with: npx tsx scripts/seed.ts

import mongoose, { Schema, model } from "mongoose";
import dotenv from "dotenv";
import path from "path";

// ── Data imports ──
import { usersData } from "./data/users";
import { classesData, subclassesData, racesData, backgroundsData, featsData } from "./data/gameRules";
import { weaponsData, armorData, shieldsAndAccessoriesData } from "./data/items";
import { spellsData } from "./data/spells";
import { buildsData } from "./data/builds";

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

/* ── Inline schema registration (avoids path-alias issues in tsx) ── */

// Shared sub-schemas
const ConditionSchema = new Schema(
  {
    field: { type: String, required: true },
    operator: { type: String, enum: ["eq", "gt", "lt", "gte", "lte", "contains"], required: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const ModifierSchema = new Schema(
  {
    targetStat: { type: String, required: true },
    type: { type: String, enum: ["flat", "multiplier", "dice", "stat_bonus"], required: true },
    value: { type: Schema.Types.Mixed, required: true },
    conditions: [ConditionSchema],
  },
  { _id: false }
);

// ── User ──
const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);
const User = mongoose.models.User || model("User", UserSchema);

// ── Item ──
const ItemSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ["weapon", "armor", "shield", "accessory", "consumable"] },
    rarity: { type: String, required: true, enum: ["common", "uncommon", "rare", "very_rare", "legendary", "artifact"] },
    requiresAttunement: { type: Boolean, default: false },
    modifiers: [ModifierSchema],
    weaponProps: {
      damageDice: String,
      damageType: String,
      properties: [String],
    },
    description: { type: String, default: "" },
    source: { type: String, default: "official" },
    edition: { type: String, default: "2024" },
  },
  { timestamps: true }
);
ItemSchema.index({ name: "text" });
ItemSchema.index({ type: 1, rarity: 1 });
const Item = mongoose.models.Item || model("Item", ItemSchema);

// ── Spell ──
const SpellSchema = new Schema(
  {
    name: { type: String, required: true },
    level: { type: Number, required: true, min: 0, max: 9 },
    school: { type: String, required: true },
    castingTime: { type: String, required: true },
    duration: { type: String, required: true },
    range: { type: String, required: true },
    components: { v: Boolean, s: Boolean, m: String },
    description: { type: String, default: "" },
    modifiers: [ModifierSchema],
    source: { type: String, default: "official" },
    edition: { type: String, default: "2024" },
  },
  { timestamps: true }
);
SpellSchema.index({ name: "text" });
SpellSchema.index({ level: 1, school: 1 });
const Spell = mongoose.models.Spell || model("Spell", SpellSchema);

// ── GameRule ──
const GameRuleSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true, enum: ["class", "subclass", "race", "subrace", "background", "feat"] },
    parentRef: { type: Schema.Types.ObjectId, ref: "GameRule", default: null },
    description: { type: String, default: "" },
    modifiers: [ModifierSchema],
    source: { type: String, default: "official" },
    edition: { type: String, default: "2024" },
  },
  { timestamps: true }
);
GameRuleSchema.index({ category: 1 });
GameRuleSchema.index({ parentRef: 1 });
const GameRule = mongoose.models.GameRule || model("GameRule", GameRuleSchema);

// ── Build ──
const BuildSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, maxlength: 100 },
    level: { type: Number, required: true, min: 1, max: 20 },
    classRef: { type: Schema.Types.ObjectId, ref: "GameRule", required: true },
    subclassId: { type: Schema.Types.ObjectId, ref: "GameRule", default: null },
    raceRef: { type: Schema.Types.ObjectId, ref: "GameRule", required: true },
    backgroundRef: { type: Schema.Types.ObjectId, ref: "GameRule", default: null },
    baseStats: {
      str: { type: Number, default: 10 }, dex: { type: Number, default: 10 },
      con: { type: Number, default: 10 }, int: { type: Number, default: 10 },
      wis: { type: Number, default: 10 }, cha: { type: Number, default: 10 },
    },
    derivedStats: {
      hp: { max: { type: Number, default: 10 }, current: { type: Number, default: 10 }, temp: { type: Number, default: 0 } },
      ac: { type: Number, default: 10 }, initiative: { type: Number, default: 0 },
      speed: { type: Number, default: 30 }, proficiencyBonus: { type: Number, default: 2 },
      spellSaveDC: { type: Number, default: 10 }, attackBonus: { type: Number, default: 0 },
      carryWeight: { current: { type: Number, default: 0 }, max: { type: Number, default: 150 } },
    },
    equipment: {
      head: { type: Schema.Types.ObjectId, ref: "Item" },
      chest: { type: Schema.Types.ObjectId, ref: "Item" },
      mainHand: { type: Schema.Types.ObjectId, ref: "Item" },
      offHand: { type: Schema.Types.ObjectId, ref: "Item" },
      ring1: { type: Schema.Types.ObjectId, ref: "Item" },
      ring2: { type: Schema.Types.ObjectId, ref: "Item" },
      amulet: { type: Schema.Types.ObjectId, ref: "Item" },
    },
    spells: [{ type: Schema.Types.ObjectId, ref: "Spell" }],
    feats: [{ type: Schema.Types.ObjectId, ref: "GameRule" }],
    activeModifiers: [ModifierSchema],
    shareId: { type: String, required: true, unique: true, index: true },
    isPublic: { type: Boolean, default: false },
    optimizationScore: { type: Number, default: 0 },
    tags: [{ type: String, index: true }],
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);
BuildSchema.index({ userId: 1, updatedAt: -1 });
BuildSchema.index({ isPublic: 1, tags: 1 });
const Build = mongoose.models.Build || model("Build", BuildSchema);

/* ================================================================== */
/*  HELPER: lookup by name in a doc array                             */
/* ================================================================== */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findByName(docs: any[], name: string) {
  const doc = docs.find((d) => d.name === name);
  if (!doc) throw new Error(`❌ Could not find document with name "${name}"`);
  return doc;
}

/* ================================================================== */
/*  SEED                                                              */
/* ================================================================== */

async function seed() {
  console.log("🔌 Connecting to MongoDB Atlas …");
  await mongoose.connect(MONGODB_URI, { dbName: "dnd_builder" });
  console.log("✅ Connected!\n");

  // ── Clear existing data ──
  await Promise.all([
    User.deleteMany({}),
    Item.deleteMany({}),
    Spell.deleteMany({}),
    GameRule.deleteMany({}),
    Build.deleteMany({}),
  ]);
  console.log("🗑️  Cleared existing collections.\n");

  // ── 1. Users ──
  const users = await User.create(usersData);
  console.log(`👤 Created ${users.length} user(s).`);

  // ── 2. GameRules — Classes ──
  const classes = await GameRule.create(
    classesData.map((c) => ({ ...c, category: "class" }))
  );
  console.log(`⚔️  Created ${classes.length} classes.`);

  // ── 3. GameRules — Subclasses (need parent ObjectIds) ──
  const subclasses = await GameRule.create(
    subclassesData.map((sc) => {
      const parent = findByName(classes, sc.parentClassName);
      return {
        name: sc.name,
        category: "subclass",
        parentRef: parent._id,
        description: sc.description,
        modifiers: sc.modifiers,
        source: "official",
        edition: "2024",
      };
    })
  );
  console.log(`🗡️  Created ${subclasses.length} subclasses.`);

  // ── 4. GameRules — Races ──
  const races = await GameRule.create(
    racesData.map((r) => ({ ...r, category: "race", source: "official", edition: "2024" }))
  );
  console.log(`🧝 Created ${races.length} races.`);

  // ── 5. GameRules — Backgrounds ──
  const backgrounds = await GameRule.create(
    backgroundsData.map((b) => ({ ...b, category: "background", source: "official", edition: "2024" }))
  );
  console.log(`📜 Created ${backgrounds.length} backgrounds.`);

  // ── 6. GameRules — Feats ──
  const feats = await GameRule.create(
    featsData.map((f) => ({ name: f.name, category: "feat", description: f.description, modifiers: f.modifiers, source: "official", edition: "2024" }))
  );
  console.log(`🎯 Created ${feats.length} feats.`);

  // ── 7. Items ──
  const allItemsData = [...weaponsData, ...armorData, ...shieldsAndAccessoriesData].map((i) => ({
    ...i,
    source: "official",
    edition: "2024",
  }));
  const items = await Item.create(allItemsData);
  console.log(`🛡️  Created ${items.length} items.`);

  // ── 8. Spells ──
  const spells = await Spell.create(
    spellsData.map((s) => ({ ...s, source: "official", edition: "2024" }))
  );
  console.log(`✨ Created ${spells.length} spells.`);

  // ── 9. Builds (resolve all references by name) ──
  const allRules = [...classes, ...subclasses, ...races, ...backgrounds, ...feats];

  for (const b of buildsData) {
    const classDoc = findByName(classes, b.className);
    const raceDoc = findByName(races, b.raceName);
    const subclassDoc = b.subclassName ? findByName(allRules, b.subclassName) : null;
    const backgroundDoc = b.backgroundName ? findByName(backgrounds, b.backgroundName) : null;

    // Resolve equipment names to ObjectIds
    const equipment: Record<string, mongoose.Types.ObjectId | undefined> = {};
    for (const [slot, itemName] of Object.entries(b.equipmentNames)) {
      if (itemName) {
        equipment[slot] = findByName(items, itemName)._id;
      }
    }

    // Resolve spell names to ObjectIds
    const spellIds = b.spellNames.map((name) => findByName(spells, name)._id);

    // Resolve feat names to ObjectIds
    const featIds = b.featNames.map((name) => findByName(feats, name)._id);

    await Build.create({
      userId: users[0]._id,
      name: b.name,
      level: b.level,
      classRef: classDoc._id,
      subclassId: subclassDoc?._id ?? null,
      raceRef: raceDoc._id,
      backgroundRef: backgroundDoc?._id ?? null,
      baseStats: b.baseStats,
      derivedStats: b.derivedStats,
      equipment,
      spells: spellIds,
      feats: featIds,
      activeModifiers: [],
      shareId: b.shareId,
      isPublic: b.isPublic,
      optimizationScore: b.optimizationScore,
      tags: b.tags,
      notes: b.notes,
    });

    console.log(`🏰 Created build: ${b.name}`);
  }

  // ── Summary ──
  const counts = {
    Users: await User.countDocuments(),
    Items: await Item.countDocuments(),
    Spells: await Spell.countDocuments(),
    GameRules: await GameRule.countDocuments(),
    Builds: await Build.countDocuments(),
  };
  console.log("\n📊 Collection counts:", counts);

  await mongoose.disconnect();
  console.log("\n🔌 Disconnected. Seed complete ✅");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
