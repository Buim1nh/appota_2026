import type { IBaseStats, IDerivedStats } from "./database";
import type { IModifier } from "./formulas";

export type BuildRuleDto = {
  _id: string;
  name: string;
  category: string;
  description?: string;
  modifiers: IModifier[];
  source?: string;
  edition?: string;
};

export type BuildItemDto = {
  _id: string;
  name: string;
  type: string;
  rarity: string;
  requiresAttunement: boolean;
  description?: string;
  modifiers: IModifier[];
  weaponProps?: {
    damageDice: string;
    damageType: string;
    properties: string[];
  };
  source?: string;
  edition?: string;
};

export type BuildSpellDto = {
  _id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  duration: string;
  range: string;
  components: { v: boolean; s: boolean; m: string };
  description?: string;
  modifiers: IModifier[];
  source?: string;
  edition?: string;
};

export type BuildEquipmentDto = {
  head?: BuildItemDto | null;
  chest?: BuildItemDto | null;
  mainHand?: BuildItemDto | null;
  offHand?: BuildItemDto | null;
  ring1?: BuildItemDto | null;
  ring2?: BuildItemDto | null;
  amulet?: BuildItemDto | null;
};

export type BuildDetailDto = {
  _id: string;
  name: string;
  level: number;
  classRef: BuildRuleDto | null;
  subclassId: BuildRuleDto | null;
  raceRef: BuildRuleDto | null;
  backgroundRef: BuildRuleDto | null;
  baseStats: IBaseStats;
  derivedStats: IDerivedStats;
  equipment: BuildEquipmentDto;
  spells: BuildSpellDto[];
  feats: BuildRuleDto[];
  activeModifiers: IModifier[];
  shareId: string;
  isPublic: boolean;
  optimizationScore: number;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
