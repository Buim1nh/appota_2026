// scripts/data/gameRules.ts
// Seed data for classes, subclasses, races, backgrounds, feats.
// Sourced from public/dataset PHB 2024 chapters 2-5 and class files.

/* ────────────────────────── CLASSES ────────────────────────── */

export const classesData = [
  {
    name: "Barbarian",
    category: "class" as const,
    description:
      "Storm with Rage, and wade into hand-to-hand combat. Primary Ability: Strength. Hit Point Die: D12 per Barbarian level.",
    modifiers: [
      { targetStat: "hp", type: "dice" as const, value: "1d12" },
      { targetStat: "savingThrows.str", type: "flat" as const, value: 1 },
      { targetStat: "savingThrows.con", type: "flat" as const, value: 1 },
    ],
    source: "official",
    edition: "2024",
  },
  {
    name: "Bard",
    category: "class" as const,
    description:
      "Perform spells that inspire and heal allies or beguile foes. Primary Ability: Charisma. Hit Point Die: D8.",
    modifiers: [{ targetStat: "hp", type: "dice" as const, value: "1d8" }],
    source: "official",
    edition: "2024",
  },
  {
    name: "Cleric",
    category: "class" as const,
    description:
      "Invoke divine magic to heal, bolster, and smite. Primary Ability: Wisdom. Hit Point Die: D8.",
    modifiers: [{ targetStat: "hp", type: "dice" as const, value: "1d8" }],
    source: "official",
    edition: "2024",
  },
  {
    name: "Druid",
    category: "class" as const,
    description:
      "Channel nature magic to heal, shape-shift, and control the elements. Primary Ability: Wisdom. Hit Point Die: D8.",
    modifiers: [{ targetStat: "hp", type: "dice" as const, value: "1d8" }],
    source: "official",
    edition: "2024",
  },
  {
    name: "Fighter",
    category: "class" as const,
    description:
      "Master all weapons and armor. Primary Ability: Strength or Dexterity. Hit Point Die: D10.",
    modifiers: [{ targetStat: "hp", type: "dice" as const, value: "1d10" }],
    source: "official",
    edition: "2024",
  },
  {
    name: "Monk",
    category: "class" as const,
    description:
      "Dart in and out of melee while striking fast and hard. Primary Ability: Dexterity and Wisdom. Hit Point Die: D8.",
    modifiers: [{ targetStat: "hp", type: "dice" as const, value: "1d8" }],
    source: "official",
    edition: "2024",
  },
  {
    name: "Paladin",
    category: "class" as const,
    description:
      "Smite foes and shield allies with divine and martial might. Primary Ability: Strength and Charisma. Hit Point Die: D10.",
    modifiers: [{ targetStat: "hp", type: "dice" as const, value: "1d10" }],
    source: "official",
    edition: "2024",
  },
  {
    name: "Ranger",
    category: "class" as const,
    description:
      "Weave together martial prowess, nature magic, and survival skills. Primary Ability: Dexterity and Wisdom. Hit Point Die: D10.",
    modifiers: [{ targetStat: "hp", type: "dice" as const, value: "1d10" }],
    source: "official",
    edition: "2024",
  },
  {
    name: "Rogue",
    category: "class" as const,
    description:
      "Launch deadly Sneak Attacks while avoiding harm through stealth. Primary Ability: Dexterity. Hit Point Die: D8.",
    modifiers: [
      { targetStat: "hp", type: "dice" as const, value: "1d8" },
      { targetStat: "savingThrows.dex", type: "flat" as const, value: 1 },
      { targetStat: "savingThrows.int", type: "flat" as const, value: 1 },
    ],
    source: "official",
    edition: "2024",
  },
  {
    name: "Sorcerer",
    category: "class" as const,
    description:
      "Wield magic innate to your being, shaping the power to your will. Primary Ability: Charisma. Hit Point Die: D6.",
    modifiers: [{ targetStat: "hp", type: "dice" as const, value: "1d6" }],
    source: "official",
    edition: "2024",
  },
  {
    name: "Warlock",
    category: "class" as const,
    description:
      "Cast spells derived from occult knowledge. Primary Ability: Charisma. Hit Point Die: D8.",
    modifiers: [{ targetStat: "hp", type: "dice" as const, value: "1d8" }],
    source: "official",
    edition: "2024",
  },
  {
    name: "Wizard",
    category: "class" as const,
    description:
      "Study arcane magic and master spells for every purpose. Primary Ability: Intelligence. Hit Point Die: D6.",
    modifiers: [
      { targetStat: "hp", type: "dice" as const, value: "1d6" },
      { targetStat: "savingThrows.int", type: "flat" as const, value: 1 },
      { targetStat: "savingThrows.wis", type: "flat" as const, value: 1 },
    ],
    source: "official",
    edition: "2024",
  },
];

/* ────────────────────── SUBCLASSES ────────────────────── */
// parentClassName is resolved at seed time to link ObjectId.

export const subclassesData = [
  // Barbarian
  { name: "Path of the Berserker", parentClassName: "Barbarian", description: "Unleash raw violence.", modifiers: [] },
  { name: "Path of the Wild Heart", parentClassName: "Barbarian", description: "Manifest kinship with animals.", modifiers: [] },
  { name: "Path of the World Tree", parentClassName: "Barbarian", description: "Tap into cosmic vitality. Vitality Surge grants Temporary HP equal to Barbarian level on Rage activation.", modifiers: [{ targetStat: "hp.temp", type: "flat" as const, value: 1 }] },
  { name: "Path of the Zealot", parentClassName: "Barbarian", description: "Rage in union with a god.", modifiers: [] },
  // Fighter
  { name: "Battle Master", parentClassName: "Fighter", description: "Use special combat maneuvers.", modifiers: [] },
  { name: "Champion", parentClassName: "Fighter", description: "Strive for peak combat prowess. Improved Critical: crit range 19-20.", modifiers: [{ targetStat: "critRange", type: "flat" as const, value: 19 }] },
  { name: "Eldritch Knight", parentClassName: "Fighter", description: "Learn spells to aid in combat.", modifiers: [] },
  { name: "Psi Warrior", parentClassName: "Fighter", description: "Augment attacks with psionic power.", modifiers: [] },
  // Rogue
  { name: "Arcane Trickster", parentClassName: "Rogue", description: "Enhance stealth with arcane spells. Intelligence is your spellcasting ability for Wizard spells.", modifiers: [] },
  { name: "Assassin", parentClassName: "Rogue", description: "Practice the grim art of death. Advantage on Initiative rolls. Surprising Strikes in first round.", modifiers: [] },
  { name: "Soulknife", parentClassName: "Rogue", description: "Strike foes with psionic blades (1d6 Psychic, Finesse, Thrown 60/120).", modifiers: [{ targetStat: "damage.psychic", type: "dice" as const, value: "1d6" }] },
  // Wizard
  { name: "Abjurer", parentClassName: "Wizard", description: "Shield allies and banish foes. Arcane Ward absorbs damage.", modifiers: [] },
  { name: "Evoker", parentClassName: "Wizard", description: "Create explosive elemental effects. Empowered Evocation adds INT modifier to one damage roll.", modifiers: [{ targetStat: "damage.evocation", type: "stat_bonus" as const, value: "int" }] },
  { name: "Diviner", parentClassName: "Wizard", description: "Learn the multiverse's secrets.", modifiers: [] },
  { name: "Illusionist", parentClassName: "Wizard", description: "Weave spells of deception.", modifiers: [] },
];

/* ────────────────────── RACES (Species) ────────────────────── */

export const racesData = [
  { name: "Human", description: "Humans are the most adaptable and ambitious people among the common races. Size: Medium. Speed: 30 ft.", modifiers: [{ targetStat: "str", type: "flat" as const, value: 1 }, { targetStat: "dex", type: "flat" as const, value: 1 }, { targetStat: "con", type: "flat" as const, value: 1 }, { targetStat: "int", type: "flat" as const, value: 1 }, { targetStat: "wis", type: "flat" as const, value: 1 }, { targetStat: "cha", type: "flat" as const, value: 1 }] },
  { name: "Elf", description: "Elves are a magical people of otherworldly grace. Size: Medium. Speed: 30 ft. Darkvision 60 ft.", modifiers: [{ targetStat: "dex", type: "flat" as const, value: 2 }] },
  { name: "Dwarf", description: "Bold and hardy, dwarves are known as skilled warriors. Size: Medium. Speed: 25 ft. Darkvision 120 ft.", modifiers: [{ targetStat: "con", type: "flat" as const, value: 2 }] },
  { name: "Halfling", description: "The diminutive halflings survive in a world full of larger creatures. Size: Small. Speed: 30 ft.", modifiers: [{ targetStat: "dex", type: "flat" as const, value: 2 }] },
  { name: "Dragonborn", description: "Born of dragons. Size: Medium. Speed: 30 ft. Breath Weapon.", modifiers: [{ targetStat: "str", type: "flat" as const, value: 2 }, { targetStat: "cha", type: "flat" as const, value: 1 }] },
  { name: "Gnome", description: "A constant hum of busy activity pervades gnome warrens. Size: Small. Speed: 25 ft. Darkvision 60 ft.", modifiers: [{ targetStat: "int", type: "flat" as const, value: 2 }] },
  { name: "Orc", description: "Orcs trace their creation to Gruumsh. Size: Medium. Speed: 30 ft. Darkvision 120 ft.", modifiers: [{ targetStat: "str", type: "flat" as const, value: 2 }, { targetStat: "con", type: "flat" as const, value: 1 }] },
  { name: "Tiefling", description: "Tieflings are derived from human bloodlines linked to the Lower Planes. Size: Medium. Speed: 30 ft. Darkvision 60 ft.", modifiers: [{ targetStat: "cha", type: "flat" as const, value: 2 }, { targetStat: "int", type: "flat" as const, value: 1 }] },
  { name: "Goliath", description: "Goliaths are large and hardy. Size: Medium. Speed: 35 ft.", modifiers: [{ targetStat: "str", type: "flat" as const, value: 2 }, { targetStat: "con", type: "flat" as const, value: 1 }] },
  { name: "Aasimar", description: "Aasimar bear within their souls the light of the heavens. Size: Medium. Speed: 30 ft. Darkvision 60 ft.", modifiers: [{ targetStat: "cha", type: "flat" as const, value: 2 }] },
];

/* ────────────────────── BACKGROUNDS ────────────────────── */

export const backgroundsData = [
  { name: "Acolyte", description: "You devoted yourself to service in a temple. Ability: INT, WIS, CHA. Feat: Magic Initiate (Cleric)." },
  { name: "Artisan", description: "You began moiling for your livelihood in an artisan's workshop. Ability: STR, DEX, INT." },
  { name: "Charlatan", description: "Once combating boredom, you learned the art of the hustle. Ability: DEX, CON, CHA." },
  { name: "Criminal", description: "You eked out a living in dark alleyways. Ability: DEX, CON, INT." },
  { name: "Entertainer", description: "You spent much of your youth following roving fairs and troupes. Ability: STR, DEX, CHA." },
  { name: "Farmer", description: "You grew up close to the land. Ability: STR, CON, WIS." },
  { name: "Guard", description: "You served as a guard in a settlement. Ability: STR, INT, WIS." },
  { name: "Guide", description: "You came of age outdoors, far from civilization. Ability: DEX, CON, WIS." },
  { name: "Hermit", description: "You spent your early years secluded from the rest of the world. Ability: CON, WIS, CHA." },
  { name: "Merchant", description: "You were raised in a family of traders. Ability: CON, INT, CHA." },
  { name: "Noble", description: "You were raised in a castle. Ability: STR, INT, CHA." },
  { name: "Sage", description: "You spent your formative years searching for lore. Ability: CON, INT, WIS." },
  { name: "Sailor", description: "You spent years aboard ships. Ability: STR, DEX, WIS." },
  { name: "Scribe", description: "You spent formative years in a scriptorium. Ability: DEX, INT, WIS." },
  { name: "Soldier", description: "War has been your life for as long as you care to remember. Ability: STR, DEX, CON." },
  { name: "Wayfarer", description: "You grew up on the road, traveling with merchant caravans. Ability: DEX, WIS, CHA." },
];

/* ────────────────────── FEATS ────────────────────── */

export const featsData = [
  // Origin Feats
  { name: "Alert", description: "Always on the lookout for danger, you gain +2 to Initiative.", category: "origin" as const, modifiers: [{ targetStat: "initiative", type: "flat" as const, value: 2 }] },
  { name: "Savage Attacker", description: "Once per turn when you deal damage with a weapon, you can reroll the weapon's damage dice and use either roll.", category: "origin" as const, modifiers: [] },
  { name: "Tough", description: "Your HP maximum increases by 2 for every level.", category: "origin" as const, modifiers: [{ targetStat: "hp.max", type: "flat" as const, value: 2 }] },
  { name: "Lucky", description: "You have 3 luck points to add d10 to or subtract d10 from attack, ability check, or saving throw.", category: "origin" as const, modifiers: [] },
  // General Feats
  { name: "Great Weapon Master", description: "You can forgo your proficiency bonus to attack roll to add it doubled to damage with Heavy weapons.", category: "general" as const, modifiers: [{ targetStat: "damage.melee", type: "flat" as const, value: 10, conditions: [{ field: "feat.gwm.active", operator: "eq" as const, value: true }] }] },
  { name: "Sharpshooter", description: "Attacking at long range doesn't impose disadvantage. You can forgo proficiency bonus to attack to add it doubled to ranged damage.", category: "general" as const, modifiers: [{ targetStat: "damage.ranged", type: "flat" as const, value: 10, conditions: [{ field: "feat.sharpshooter.active", operator: "eq" as const, value: true }] }] },
  { name: "Sentinel", description: "Creatures provoke opportunity attacks even if they took the Disengage action. When you hit with an OA, the creature's speed becomes 0.", category: "general" as const, modifiers: [] },
  { name: "War Caster", description: "Advantage on CON saves to maintain concentration. Can use spell as opportunity attack.", category: "general" as const, modifiers: [] },
  { name: "Resilient", description: "Increase one ability score by 1 and gain proficiency in saving throws using that ability.", category: "general" as const, modifiers: [{ targetStat: "ability", type: "flat" as const, value: 1 }] },
  { name: "Shield Master", description: "If you take the Attack action, you can use a Bonus Action to shove with your shield.", category: "general" as const, modifiers: [] },
  { name: "Polearm Master", description: "When you take the Attack action with a glaive, halberd, quarterstaff, or spear, you can use a Bonus Action to make a d4 bludgeoning attack with the other end.", category: "general" as const, modifiers: [] },
  { name: "Dual Wielder", description: "You can engage in two-weapon fighting even when the one-handed melee weapons you are wielding aren't Light. +1 AC when dual wielding.", category: "general" as const, modifiers: [{ targetStat: "ac", type: "flat" as const, value: 1, conditions: [{ field: "equipment.dualWielding", operator: "eq" as const, value: true }] }] },
  // Fighting Style Feats
  { name: "Defense", description: "While you are wearing armor, you gain a +1 bonus to AC.", category: "fighting_style" as const, modifiers: [{ targetStat: "ac", type: "flat" as const, value: 1, conditions: [{ field: "equipment.armorType", operator: "contains" as const, value: "armor" }] }] },
  { name: "Dueling", description: "When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.", category: "fighting_style" as const, modifiers: [{ targetStat: "damage.melee", type: "flat" as const, value: 2 }] },
  { name: "Archery", description: "You gain a +2 bonus to attack rolls you make with Ranged weapons.", category: "fighting_style" as const, modifiers: [{ targetStat: "attackBonus.ranged", type: "flat" as const, value: 2 }] },
  { name: "Great Weapon Fighting", description: "When you roll a 1 or 2 on a damage die for an attack with a Heavy melee weapon wielded with two hands, you can reroll the die.", category: "fighting_style" as const, modifiers: [] },
];
