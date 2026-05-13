// scripts/data/builds.ts
// Seed data for sample Builds.
// References are resolved by name at seed time.

export interface BuildSeedData {
  name: string;
  level: number;
  className: string;
  subclassName?: string;
  raceName: string;
  backgroundName?: string;
  baseStats: { str: number; dex: number; con: number; int: number; wis: number; cha: number };
  derivedStats: {
    hp: { max: number; current: number; temp: number };
    ac: number;
    initiative: number;
    speed: number;
    proficiencyBonus: number;
    spellSaveDC: number;
    attackBonus: number;
    carryWeight: { current: number; max: number };
  };
  equipmentNames: {
    head?: string;
    chest?: string;
    mainHand?: string;
    offHand?: string;
    ring1?: string;
    ring2?: string;
    amulet?: string;
  };
  spellNames: string[];
  featNames: string[];
  shareId: string;
  isPublic: boolean;
  optimizationScore: number;
  tags: string[];
  notes: string;
}

export const buildsData: BuildSeedData[] = [
  {
    name: "Fire Battlemage",
    level: 8,
    className: "Wizard",
    subclassName: "Evoker",
    raceName: "Elf",
    backgroundName: "Soldier",
    baseStats: { str: 10, dex: 14, con: 16, int: 18, wis: 10, cha: 8 },
    derivedStats: {
      hp: { max: 66, current: 66, temp: 0 },
      ac: 16,
      initiative: 2,
      speed: 30,
      proficiencyBonus: 3,
      spellSaveDC: 15,
      attackBonus: 7,
      carryWeight: { current: 45.5, max: 150 },
    },
    equipmentNames: { chest: "Chain Mail", mainHand: "Staff of Fire", ring1: "Ring of Protection" },
    spellNames: ["Fireball", "Shield", "Magic Missile", "Fire Shield", "Mage Armor", "Counterspell"],
    featNames: ["War Caster"],
    shareId: "fire-mage-xyz123",
    isPublic: true,
    optimizationScore: 85,
    tags: ["dps", "fire", "mid-range", "wizard"],
    notes: "Evoker Wizard specializing in fire damage. Uses Staff of Fire for bonus fire damage when low HP.",
  },
  {
    name: "Frontline Champion",
    level: 5,
    className: "Fighter",
    subclassName: "Champion",
    raceName: "Human",
    backgroundName: "Soldier",
    baseStats: { str: 18, dex: 14, con: 16, int: 8, wis: 12, cha: 10 },
    derivedStats: {
      hp: { max: 49, current: 49, temp: 0 },
      ac: 20,
      initiative: 2,
      speed: 30,
      proficiencyBonus: 3,
      spellSaveDC: 8,
      attackBonus: 8,
      carryWeight: { current: 95, max: 270 },
    },
    equipmentNames: { chest: "Chain Mail", mainHand: "Longsword +1", offHand: "Shield" },
    spellNames: [],
    featNames: ["Great Weapon Master"],
    shareId: "champion-abc789",
    isPublic: true,
    optimizationScore: 78,
    tags: ["tank", "melee", "frontline", "fighter"],
    notes: "Classic sword-and-board fighter. Champion subclass for expanded crit range.",
  },
  {
    name: "Shadow Assassin",
    level: 7,
    className: "Rogue",
    subclassName: "Assassin",
    raceName: "Halfling",
    backgroundName: "Criminal",
    baseStats: { str: 10, dex: 18, con: 14, int: 12, wis: 14, cha: 10 },
    derivedStats: {
      hp: { max: 52, current: 52, temp: 0 },
      ac: 16,
      initiative: 4,
      speed: 30,
      proficiencyBonus: 3,
      spellSaveDC: 8,
      attackBonus: 7,
      carryWeight: { current: 30, max: 150 },
    },
    equipmentNames: { chest: "Studded Leather Armor", mainHand: "Rapier", offHand: "Dagger" },
    spellNames: [],
    featNames: ["Alert"],
    shareId: "shadow-rogue-def456",
    isPublic: true,
    optimizationScore: 82,
    tags: ["dps", "stealth", "assassin", "rogue"],
    notes: "Assassin Rogue with high initiative. Sneak Attack 4d6 at level 7. Expertise in Stealth and Perception.",
  },
  {
    name: "Raging Berserker",
    level: 10,
    className: "Barbarian",
    subclassName: "Path of the Berserker",
    raceName: "Goliath",
    backgroundName: "Soldier",
    baseStats: { str: 20, dex: 14, con: 18, int: 8, wis: 12, cha: 10 },
    derivedStats: {
      hp: { max: 125, current: 125, temp: 0 },
      ac: 17,
      initiative: 2,
      speed: 40,
      proficiencyBonus: 4,
      spellSaveDC: 8,
      attackBonus: 9,
      carryWeight: { current: 80, max: 300 },
    },
    equipmentNames: { mainHand: "Greataxe" },
    spellNames: [],
    featNames: ["Great Weapon Master", "Savage Attacker"],
    shareId: "berserker-ghi012",
    isPublic: true,
    optimizationScore: 90,
    tags: ["tank", "melee", "dps", "barbarian"],
    notes: "Unarmored Defense (10 + DEX + CON = 17 AC). Rage damage +3 at level 10. Brutal Strike at level 9.",
  },
];
