import type { IBaseStats, IDerivedStats } from "@/types/database";

/**
 * Calculate ability modifier from an ability score.
 * Modifier = (score - 10) / 2 (rounded down)
 */
export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/**
 * Calculate the proficiency bonus based on character level.
 * PB = 2 + floor((level - 1) / 4)
 */
export function getProficiencyBonus(level: number): number {
  return 2 + Math.floor((level - 1) / 4);
}

/**
 * Calculate derived stats from base stats, level, and optional modifiers.
 */
export function calculateDerivedStats(
  baseStats: IBaseStats,
  level: number,
): IDerivedStats {
  const conModifier = getAbilityModifier(baseStats.con);
  const dexModifier = getAbilityModifier(baseStats.dex);
  const profBonus = getProficiencyBonus(level);

  // Base HP = 10 + (CON modifier × level)
  // For simplicity, assume 10 HP at level 1
  const hpPerLevel = 10 + (conModifier > 0 ? conModifier : 0);
  const maxHp = hpPerLevel + (level - 1) * (5 + conModifier);

  // AC = 10 + DEX modifier (base unarmored)
  const ac = 10 + dexModifier;

  // Initiative = DEX modifier
  const initiative = dexModifier;

  // Speed = 30 ft (standard)
  const speed = 30;

  // Spell Save DC = 8 + Proficiency Bonus + ability modifier (Int for most casters)
  const spellSaveDC = 8 + profBonus + getAbilityModifier(baseStats.int);

  // Attack Bonus = Proficiency Bonus + relevant modifier
  const attackBonus = profBonus + getAbilityModifier(baseStats.str);

  return {
    hp: {
      max: Math.max(1, maxHp),
      current: Math.max(1, maxHp),
      temp: 0,
    },
    ac,
    initiative,
    speed,
    proficiencyBonus: profBonus,
    spellSaveDC,
    attackBonus,
    carryWeight: {
      current: 0,
      max: baseStats.str * 15,
    },
  };
}

/**
 * Roll 4d6, drop the lowest result.
 */
export function roll4d6DropLowest(): number {
  const rolls = [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
  ];
  rolls.sort((a, b) => b - a);
  return rolls[0] + rolls[1] + rolls[2];
}

/**
 * Generate a full set of stats using 4d6 drop lowest for each ability.
 */
export function rollAllStats(): IBaseStats {
  return {
    str: roll4d6DropLowest(),
    dex: roll4d6DropLowest(),
    con: roll4d6DropLowest(),
    int: roll4d6DropLowest(),
    wis: roll4d6DropLowest(),
    cha: roll4d6DropLowest(),
  };
}
