export type BuilderStepId =
  | "class"
  | "race"
  | "background"
  | "stats"
  | "review"
  | "export";

export interface RuleRecord {
  _id: string;
  name: string;
  category: "class" | "subclass" | "race" | "subrace" | "background" | "feat";
  parentRef?: string | null;
  description?: string;
  modifiers?: Array<{
    targetStat: string;
    type: "flat" | "multiplier" | "dice" | "stat_bonus";
    value: number | string;
  }>;
}

export interface RuleResponse {
  data: RuleRecord[];
  total: number;
}

export interface AbilityScores {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface StepClassState {
  classId: string;
  level: number;
  subclassId: string;
  featureSelections: Record<string, string>;
}

export interface StepRaceState {
  raceId: string;
  subraceId: string;
  traitSelections: Record<string, string>;
}

export interface StepBackgroundState {
  backgroundId: string;
  proficiencySelections: Record<string, string>;
}

export interface BuilderWizardState {
  stepIndex: number;
  classStep: StepClassState;
  raceStep: StepRaceState;
  backgroundStep: StepBackgroundState;
  baseStats: AbilityScores;
}

export interface BuilderFeatureGroup {
  key: string;
  label: string;
  options: Array<{ value: string; label: string }>;
}

export interface BuilderStepDescriptor {
  id: BuilderStepId;
  title: string;
  subtitle: string;
}

export const BUILDER_STEP_ORDER: BuilderStepDescriptor[] = [
  { id: "class", title: "Choose Class", subtitle: "Select your core role" },
  { id: "race", title: "Choose Race", subtitle: "Define your ancestry" },
  { id: "background", title: "Choose Background", subtitle: "Shape your story" },
  { id: "stats", title: "Roll Stats", subtitle: "Set ability scores" },
  { id: "review", title: "Review", subtitle: "Validate your build" },
  { id: "export", title: "Export", subtitle: "Download character JSON" },
];

export const DEFAULT_ABILITY_SCORES: AbilityScores = {
  str: 10,
  dex: 10,
  con: 10,
  int: 10,
  wis: 10,
  cha: 10,
};

export const DEFAULT_WIZARD_STATE: BuilderWizardState = {
  stepIndex: 0,
  classStep: {
    classId: "",
    level: 1,
    subclassId: "",
    featureSelections: {},
  },
  raceStep: {
    raceId: "",
    subraceId: "",
    traitSelections: {},
  },
  backgroundStep: {
    backgroundId: "",
    proficiencySelections: {},
  },
  baseStats: DEFAULT_ABILITY_SCORES,
};
