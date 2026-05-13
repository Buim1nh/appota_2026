// scripts/data/items.ts
// Seed data for Items collection.
// Sourced from public/dataset Ch. 6 Equipment (weapons & armor tables).

export const weaponsData = [
  // ── Simple Melee ──
  { name: "Club", type: "weapon" as const, rarity: "common" as const, weaponProps: { damageDice: "1d4", damageType: "bludgeoning", properties: ["light"] }, description: "A simple bludgeoning weapon. Mastery: Slow. Weight: 2 lb. Cost: 1 SP." },
  { name: "Dagger", type: "weapon" as const, rarity: "common" as const, weaponProps: { damageDice: "1d4", damageType: "piercing", properties: ["finesse", "light", "thrown (20/60)"] }, description: "A small blade. Mastery: Nick. Weight: 1 lb. Cost: 2 GP." },
  { name: "Greatclub", type: "weapon" as const, rarity: "common" as const, weaponProps: { damageDice: "1d8", damageType: "bludgeoning", properties: ["two-handed"] }, description: "A heavy club. Mastery: Push. Weight: 10 lb." },
  { name: "Handaxe", type: "weapon" as const, rarity: "common" as const, weaponProps: { damageDice: "1d6", damageType: "slashing", properties: ["light", "thrown (20/60)"] }, description: "A small axe. Mastery: Vex. Weight: 2 lb. Cost: 5 GP." },
  { name: "Javelin", type: "weapon" as const, rarity: "common" as const, weaponProps: { damageDice: "1d6", damageType: "piercing", properties: ["thrown (30/120)"] }, description: "A throwing spear. Mastery: Slow. Weight: 2 lb." },
  { name: "Mace", type: "weapon" as const, rarity: "common" as const, weaponProps: { damageDice: "1d6", damageType: "bludgeoning", properties: [] }, description: "A flanged metal head on a handle. Mastery: Sap. Weight: 4 lb." },
  { name: "Quarterstaff", type: "weapon" as const, rarity: "common" as const, weaponProps: { damageDice: "1d6", damageType: "bludgeoning", properties: ["versatile (1d8)"] }, description: "A sturdy wooden pole. Mastery: Topple. Weight: 4 lb." },
  { name: "Spear", type: "weapon" as const, rarity: "common" as const, weaponProps: { damageDice: "1d6", damageType: "piercing", properties: ["thrown (20/60)", "versatile (1d8)"] }, description: "A pointed shaft. Mastery: Sap. Weight: 3 lb." },
  // ── Simple Ranged ──
  { name: "Light Crossbow", type: "weapon" as const, rarity: "common" as const, weaponProps: { damageDice: "1d8", damageType: "piercing", properties: ["ammunition (80/320)", "loading", "two-handed"] }, description: "Mastery: Slow. Weight: 5 lb. Cost: 25 GP." },
  { name: "Shortbow", type: "weapon" as const, rarity: "common" as const, weaponProps: { damageDice: "1d6", damageType: "piercing", properties: ["ammunition (80/320)", "two-handed"] }, description: "Mastery: Vex. Weight: 2 lb. Cost: 25 GP." },
  // ── Martial Melee ──
  { name: "Battleaxe", type: "weapon" as const, rarity: "common" as const, weaponProps: { damageDice: "1d8", damageType: "slashing", properties: ["versatile (1d10)"] }, description: "Mastery: Topple. Weight: 4 lb. Cost: 10 GP." },
  { name: "Greataxe", type: "weapon" as const, rarity: "common" as const, weaponProps: { damageDice: "1d12", damageType: "slashing", properties: ["heavy", "two-handed"] }, description: "Mastery: Cleave. Weight: 7 lb. Cost: 30 GP." },
  { name: "Greatsword", type: "weapon" as const, rarity: "common" as const, weaponProps: { damageDice: "2d6", damageType: "slashing", properties: ["heavy", "two-handed"] }, description: "Mastery: Graze. Weight: 6 lb. Cost: 50 GP." },
  { name: "Longsword", type: "weapon" as const, rarity: "common" as const, weaponProps: { damageDice: "1d8", damageType: "slashing", properties: ["versatile (1d10)"] }, description: "Mastery: Sap. Weight: 3 lb. Cost: 15 GP." },
  { name: "Rapier", type: "weapon" as const, rarity: "common" as const, weaponProps: { damageDice: "1d8", damageType: "piercing", properties: ["finesse"] }, description: "Mastery: Vex. Weight: 2 lb. Cost: 25 GP." },
  { name: "Scimitar", type: "weapon" as const, rarity: "common" as const, weaponProps: { damageDice: "1d6", damageType: "slashing", properties: ["finesse", "light"] }, description: "Mastery: Nick. Weight: 3 lb. Cost: 25 GP." },
  { name: "Shortsword", type: "weapon" as const, rarity: "common" as const, weaponProps: { damageDice: "1d6", damageType: "piercing", properties: ["finesse", "light"] }, description: "Mastery: Vex. Weight: 2 lb. Cost: 10 GP." },
  { name: "Warhammer", type: "weapon" as const, rarity: "common" as const, weaponProps: { damageDice: "1d8", damageType: "bludgeoning", properties: ["versatile (1d10)"] }, description: "Mastery: Push. Weight: 5 lb. Cost: 15 GP." },
  { name: "Maul", type: "weapon" as const, rarity: "common" as const, weaponProps: { damageDice: "2d6", damageType: "bludgeoning", properties: ["heavy", "two-handed"] }, description: "Mastery: Topple. Weight: 10 lb. Cost: 10 GP." },
  { name: "Halberd", type: "weapon" as const, rarity: "common" as const, weaponProps: { damageDice: "1d10", damageType: "slashing", properties: ["heavy", "reach", "two-handed"] }, description: "Mastery: Cleave. Weight: 6 lb. Cost: 20 GP." },
  // ── Martial Ranged ──
  { name: "Longbow", type: "weapon" as const, rarity: "common" as const, weaponProps: { damageDice: "1d8", damageType: "piercing", properties: ["ammunition (150/600)", "heavy", "two-handed"] }, description: "Mastery: Slow. Weight: 2 lb. Cost: 50 GP." },
  { name: "Hand Crossbow", type: "weapon" as const, rarity: "common" as const, weaponProps: { damageDice: "1d6", damageType: "piercing", properties: ["ammunition (30/120)", "light", "loading"] }, description: "Mastery: Vex. Weight: 3 lb. Cost: 75 GP." },
  // ── Magic Weapons ──
  { name: "Longsword +1", type: "weapon" as const, rarity: "uncommon" as const, requiresAttunement: false, modifiers: [{ targetStat: "attackBonus", type: "flat" as const, value: 1 }, { targetStat: "damage.melee", type: "flat" as const, value: 1 }], weaponProps: { damageDice: "1d8", damageType: "slashing", properties: ["versatile (1d10)"] }, description: "A finely crafted longsword with a magical +1 bonus to attack and damage rolls." },
  { name: "Staff of Fire", type: "weapon" as const, rarity: "very_rare" as const, requiresAttunement: true, modifiers: [{ targetStat: "damage.fire", type: "multiplier" as const, value: 1.05, conditions: [{ field: "hp.current", operator: "lt" as const, value: 33 }] }], weaponProps: { damageDice: "1d6", damageType: "bludgeoning", properties: ["versatile (1d8)"] }, description: "This staff can be wielded as a magic quarterstaff. It grants fire spell bonuses." },
];

export const armorData = [
  // ── Light Armor ──
  { name: "Padded Armor", type: "armor" as const, rarity: "common" as const, modifiers: [{ targetStat: "ac", type: "flat" as const, value: 11 }], description: "AC 11 + Dex modifier. Stealth Disadvantage. Weight: 8 lb. Cost: 5 GP." },
  { name: "Leather Armor", type: "armor" as const, rarity: "common" as const, modifiers: [{ targetStat: "ac", type: "flat" as const, value: 11 }], description: "AC 11 + Dex modifier. Weight: 10 lb. Cost: 10 GP." },
  { name: "Studded Leather Armor", type: "armor" as const, rarity: "common" as const, modifiers: [{ targetStat: "ac", type: "flat" as const, value: 12 }], description: "AC 12 + Dex modifier. Weight: 13 lb. Cost: 45 GP." },
  // ── Medium Armor ──
  { name: "Chain Shirt", type: "armor" as const, rarity: "common" as const, modifiers: [{ targetStat: "ac", type: "flat" as const, value: 13 }], description: "AC 13 + Dex modifier (max 2). Weight: 20 lb. Cost: 50 GP." },
  { name: "Scale Mail", type: "armor" as const, rarity: "common" as const, modifiers: [{ targetStat: "ac", type: "flat" as const, value: 14 }], description: "AC 14 + Dex modifier (max 2). Stealth Disadvantage. Weight: 45 lb. Cost: 50 GP." },
  { name: "Breastplate", type: "armor" as const, rarity: "common" as const, modifiers: [{ targetStat: "ac", type: "flat" as const, value: 14 }], description: "AC 14 + Dex modifier (max 2). Weight: 20 lb. Cost: 400 GP." },
  { name: "Half Plate Armor", type: "armor" as const, rarity: "common" as const, modifiers: [{ targetStat: "ac", type: "flat" as const, value: 15 }], description: "AC 15 + Dex modifier (max 2). Stealth Disadvantage. Weight: 40 lb. Cost: 750 GP." },
  // ── Heavy Armor ──
  { name: "Ring Mail", type: "armor" as const, rarity: "common" as const, modifiers: [{ targetStat: "ac", type: "flat" as const, value: 14 }], description: "AC 14. Stealth Disadvantage. Weight: 40 lb. Cost: 30 GP." },
  { name: "Chain Mail", type: "armor" as const, rarity: "common" as const, modifiers: [{ targetStat: "ac", type: "flat" as const, value: 16 }], description: "AC 16. Requires Str 13. Stealth Disadvantage. Weight: 55 lb. Cost: 75 GP." },
  { name: "Splint Armor", type: "armor" as const, rarity: "common" as const, modifiers: [{ targetStat: "ac", type: "flat" as const, value: 17 }], description: "AC 17. Requires Str 15. Stealth Disadvantage. Weight: 60 lb. Cost: 200 GP." },
  { name: "Plate Armor", type: "armor" as const, rarity: "common" as const, modifiers: [{ targetStat: "ac", type: "flat" as const, value: 18 }], description: "AC 18. Requires Str 15. Stealth Disadvantage. Weight: 65 lb. Cost: 1,500 GP." },
];

export const shieldsAndAccessoriesData = [
  { name: "Shield", type: "shield" as const, rarity: "common" as const, modifiers: [{ targetStat: "ac", type: "flat" as const, value: 2 }], description: "+2 AC. Weight: 6 lb. Cost: 10 GP." },
  { name: "Ring of Protection", type: "accessory" as const, rarity: "rare" as const, requiresAttunement: true, modifiers: [{ targetStat: "ac", type: "flat" as const, value: 1 }, { targetStat: "savingThrows", type: "flat" as const, value: 1 }], description: "You gain a +1 bonus to AC and saving throws while wearing this ring." },
  { name: "Cloak of Protection", type: "accessory" as const, rarity: "uncommon" as const, requiresAttunement: true, modifiers: [{ targetStat: "ac", type: "flat" as const, value: 1 }, { targetStat: "savingThrows", type: "flat" as const, value: 1 }], description: "You gain a +1 bonus to AC and saving throws while wearing this cloak." },
  { name: "Amulet of Health", type: "accessory" as const, rarity: "rare" as const, requiresAttunement: true, modifiers: [{ targetStat: "con", type: "flat" as const, value: 19 }], description: "Your Constitution score is 19 while you wear this amulet." },
  { name: "Potion of Healing", type: "consumable" as const, rarity: "common" as const, modifiers: [{ targetStat: "hp.current", type: "dice" as const, value: "2d4+2" }], description: "You regain 2d4+2 Hit Points when you drink this potion. Cost: 50 GP." },
  { name: "Potion of Greater Healing", type: "consumable" as const, rarity: "uncommon" as const, modifiers: [{ targetStat: "hp.current", type: "dice" as const, value: "4d4+4" }], description: "You regain 4d4+4 Hit Points when you drink this potion." },
];
