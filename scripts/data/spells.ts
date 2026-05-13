// scripts/data/spells.ts
// Seed data for Spells collection.
// Sourced from public/dataset Ch. 7 Spells.

export const spellsData = [
  // ── Cantrips (Level 0) ──
  {
    name: "Fire Bolt", level: 0, school: "evocation",
    castingTime: "1 action", duration: "Instantaneous", range: "120 feet",
    components: { v: true, s: true, m: "" },
    description: "You hurl a mote of fire at a creature or object. Make a ranged spell attack. On hit: 1d10 fire damage. Scales at higher levels.",
    modifiers: [{ targetStat: "damage.fire", type: "dice" as const, value: "1d10" }],
  },
  {
    name: "Ray of Frost", level: 0, school: "evocation",
    castingTime: "1 action", duration: "Instantaneous", range: "60 feet",
    components: { v: true, s: true, m: "" },
    description: "A frigid beam of blue-white light streaks toward a creature. On hit: 1d8 cold damage and speed reduced by 10 ft until start of your next turn.",
    modifiers: [{ targetStat: "damage.cold", type: "dice" as const, value: "1d8" }],
  },
  {
    name: "Light", level: 0, school: "evocation",
    castingTime: "1 action", duration: "1 hour", range: "Touch",
    components: { v: true, s: false, m: "a firefly or phosphorescent moss" },
    description: "You touch one object. It sheds bright light in a 20-foot radius and dim light for an additional 20 feet.",
    modifiers: [],
  },
  {
    name: "Mage Hand", level: 0, school: "conjuration",
    castingTime: "1 action", duration: "1 minute", range: "30 feet",
    components: { v: true, s: true, m: "" },
    description: "A spectral, floating hand appears at a point you choose. You can control the hand as a Bonus Action.",
    modifiers: [],
  },
  {
    name: "Poison Spray", level: 0, school: "conjuration",
    castingTime: "1 action", duration: "Instantaneous", range: "30 feet",
    components: { v: true, s: true, m: "" },
    description: "You project a puff of noxious gas. Target must succeed on a CON save or take 1d12 poison damage.",
    modifiers: [{ targetStat: "damage.poison", type: "dice" as const, value: "1d12" }],
  },
  {
    name: "Sacred Flame", level: 0, school: "evocation",
    castingTime: "1 action", duration: "Instantaneous", range: "60 feet",
    components: { v: true, s: true, m: "" },
    description: "Flame-like radiance descends on a creature. DEX save or 1d8 radiant damage. No benefit from cover.",
    modifiers: [{ targetStat: "damage.radiant", type: "dice" as const, value: "1d8" }],
  },
  {
    name: "Eldritch Blast", level: 0, school: "evocation",
    castingTime: "1 action", duration: "Instantaneous", range: "120 feet",
    components: { v: true, s: true, m: "" },
    description: "A beam of crackling energy streaks toward a creature. Make a ranged spell attack. On hit: 1d10 force damage.",
    modifiers: [{ targetStat: "damage.force", type: "dice" as const, value: "1d10" }],
  },

  // ── Level 1 ──
  {
    name: "Magic Missile", level: 1, school: "evocation",
    castingTime: "1 action", duration: "Instantaneous", range: "120 feet",
    components: { v: true, s: true, m: "" },
    description: "You create three glowing darts of magical force. Each dart hits automatically dealing 1d4+1 force damage. At Higher Levels: one additional dart per slot above 1st.",
    modifiers: [{ targetStat: "damage.force", type: "dice" as const, value: "3d4+3" }],
  },
  {
    name: "Shield", level: 1, school: "abjuration",
    castingTime: "1 reaction", duration: "1 round", range: "Self",
    components: { v: true, s: true, m: "" },
    description: "An invisible barrier of magical force appears and protects you. +5 AC until the start of your next turn, including against the triggering attack.",
    modifiers: [{ targetStat: "ac", type: "flat" as const, value: 5 }],
  },
  {
    name: "Mage Armor", level: 1, school: "abjuration",
    castingTime: "1 action", duration: "8 hours", range: "Touch",
    components: { v: true, s: true, m: "a piece of cured leather" },
    description: "You touch a willing creature who isn't wearing armor. The target's base AC becomes 13 + its Dexterity modifier.",
    modifiers: [{ targetStat: "ac", type: "flat" as const, value: 13 }],
  },
  {
    name: "Cure Wounds", level: 1, school: "evocation",
    castingTime: "1 action", duration: "Instantaneous", range: "Touch",
    components: { v: true, s: true, m: "" },
    description: "A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier.",
    modifiers: [{ targetStat: "hp.current", type: "dice" as const, value: "1d8" }],
  },
  {
    name: "Burning Hands", level: 1, school: "evocation",
    castingTime: "1 action", duration: "Instantaneous", range: "Self (15-foot cone)",
    components: { v: true, s: true, m: "" },
    description: "A thin sheet of flames shoots forth from your outstretched fingertips. Each creature in a 15-foot cone must make a DEX save. 3d6 fire damage on fail, half on success.",
    modifiers: [{ targetStat: "damage.fire", type: "dice" as const, value: "3d6" }],
  },
  {
    name: "Thunderwave", level: 1, school: "evocation",
    castingTime: "1 action", duration: "Instantaneous", range: "Self (15-foot cube)",
    components: { v: true, s: true, m: "" },
    description: "A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube must make a CON save. 2d8 thunder damage on fail, half on success. Pushed 10 ft on fail.",
    modifiers: [{ targetStat: "damage.thunder", type: "dice" as const, value: "2d8" }],
  },
  {
    name: "Healing Word", level: 1, school: "evocation",
    castingTime: "1 bonus action", duration: "Instantaneous", range: "60 feet",
    components: { v: true, s: false, m: "" },
    description: "A creature of your choice that you can see within range regains hit points equal to 2d4 + your spellcasting ability modifier.",
    modifiers: [{ targetStat: "hp.current", type: "dice" as const, value: "2d4" }],
  },
  {
    name: "Detect Magic", level: 1, school: "divination",
    castingTime: "1 action", duration: "Concentration, 10 minutes", range: "Self (30-foot radius)",
    components: { v: true, s: true, m: "" },
    description: "For the duration, you sense the presence of magic within 30 feet of you. You can use your action to see a faint aura around any visible creature or object that bears magic.",
    modifiers: [],
  },
  {
    name: "Charm Person", level: 1, school: "enchantment",
    castingTime: "1 action", duration: "1 hour", range: "30 feet",
    components: { v: true, s: true, m: "" },
    description: "You attempt to charm a humanoid you can see within range. It must make a WIS save, with advantage if you or your companions are fighting it.",
    modifiers: [],
  },

  // ── Level 2 ──
  {
    name: "Misty Step", level: 2, school: "conjuration",
    castingTime: "1 bonus action", duration: "Instantaneous", range: "Self",
    components: { v: true, s: false, m: "" },
    description: "Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see.",
    modifiers: [],
  },
  {
    name: "Scorching Ray", level: 2, school: "evocation",
    castingTime: "1 action", duration: "Instantaneous", range: "120 feet",
    components: { v: true, s: true, m: "" },
    description: "You create three rays of fire and hurl them. Each ray requires a ranged spell attack. On hit: 2d6 fire damage.",
    modifiers: [{ targetStat: "damage.fire", type: "dice" as const, value: "6d6" }],
  },
  {
    name: "Hold Person", level: 2, school: "enchantment",
    castingTime: "1 action", duration: "Concentration, 1 minute", range: "60 feet",
    components: { v: true, s: true, m: "a small, straight piece of iron" },
    description: "Choose a humanoid that you can see within range. The target must succeed on a WIS save or be paralyzed for the duration.",
    modifiers: [],
  },

  // ── Level 3 ──
  {
    name: "Fireball", level: 3, school: "evocation",
    castingTime: "1 action", duration: "Instantaneous", range: "150 feet",
    components: { v: true, s: true, m: "a tiny ball of bat guano and sulfur" },
    description: "A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere must make a DEX save. 8d6 fire damage on fail, half on success.",
    modifiers: [{ targetStat: "damage.fire", type: "dice" as const, value: "8d6" }],
  },
  {
    name: "Lightning Bolt", level: 3, school: "evocation",
    castingTime: "1 action", duration: "Instantaneous", range: "Self (100-foot line)",
    components: { v: true, s: true, m: "a bit of fur and a rod of amber, crystal, or glass" },
    description: "A stroke of lightning forming a line 100 feet long and 5 feet wide blasts out. Each creature in the line must make a DEX save. 8d6 lightning damage on fail, half on success.",
    modifiers: [{ targetStat: "damage.lightning", type: "dice" as const, value: "8d6" }],
  },
  {
    name: "Counterspell", level: 3, school: "abjuration",
    castingTime: "1 reaction", duration: "Instantaneous", range: "60 feet",
    components: { v: false, s: true, m: "" },
    description: "You attempt to interrupt a creature in the process of casting a spell. If the spell is level 3 or lower, it fails. For higher levels, make an ability check (DC 10 + spell level).",
    modifiers: [],
  },
  {
    name: "Haste", level: 3, school: "transmutation",
    castingTime: "1 action", duration: "Concentration, 1 minute", range: "30 feet",
    components: { v: true, s: true, m: "a shaving of licorice root" },
    description: "Choose a willing creature. Its speed is doubled, it gains +2 to AC, advantage on DEX saves, and an additional action on each of its turns.",
    modifiers: [{ targetStat: "speed", type: "multiplier" as const, value: 2 }, { targetStat: "ac", type: "flat" as const, value: 2 }],
  },

  // ── Level 4 ──
  {
    name: "Fire Shield", level: 4, school: "evocation",
    castingTime: "1 action", duration: "10 minutes", range: "Self",
    components: { v: true, s: true, m: "a bit of phosphorus or a firefly" },
    description: "Thin and wispy flames wreathe your body, shedding bright light. You have resistance to cold or fire damage. When a creature within 5 feet hits you with a melee attack, the shield erupts dealing 2d8 fire/cold damage.",
    modifiers: [
      { targetStat: "resistance.fire", type: "flat" as const, value: 1 },
      { targetStat: "damage.fire", type: "dice" as const, value: "2d8", conditions: [{ field: "combat.hitByMelee", operator: "eq" as const, value: true }] },
    ],
  },
  {
    name: "Greater Invisibility", level: 4, school: "illusion",
    castingTime: "1 action", duration: "Concentration, 1 minute", range: "Touch",
    components: { v: true, s: true, m: "" },
    description: "You or a creature you touch becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target's person.",
    modifiers: [],
  },

  // ── Level 5 ──
  {
    name: "Cone of Cold", level: 5, school: "evocation",
    castingTime: "1 action", duration: "Instantaneous", range: "Self (60-foot cone)",
    components: { v: true, s: true, m: "a small crystal or glass cone" },
    description: "A blast of cold air erupts from your hands. Each creature in a 60-foot cone must make a CON save. 8d8 cold damage on fail, half on success.",
    modifiers: [{ targetStat: "damage.cold", type: "dice" as const, value: "8d8" }],
  },
  {
    name: "Wall of Force", level: 5, school: "evocation",
    castingTime: "1 action", duration: "Concentration, 10 minutes", range: "120 feet",
    components: { v: true, s: true, m: "a pinch of powder made by crushing a clear gemstone" },
    description: "An invisible wall of force springs into existence at a point you choose. It is immune to all damage and can't be dispelled by Dispel Magic.",
    modifiers: [],
  },
];
