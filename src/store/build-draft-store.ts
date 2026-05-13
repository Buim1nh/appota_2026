import { create } from "zustand";
import type { IBaseStats } from "@/types/database";

type BuildStep = 1 | 2 | 3 | 4 | 5 | 6;

type RuleSelection = {
  id: string;
  name: string;
  description?: string;
  category?: string;
};

type BuildDraft = {
  name: string;
  level: number;
  classRule: RuleSelection | null;
  subclassRule: RuleSelection | null;
  raceRule: RuleSelection | null;
  backgroundRule: RuleSelection | null;
  classFeature: string;
  raceTrait: string;
  backgroundFeature: string;
  spells: string[];
  feats: string[];
  notes: string;
  isPublic: boolean;
  tags: string[];
  stats: IBaseStats;
  equipment: {
    head: string;
    chest: string;
    mainHand: string;
    offHand: string;
    ring1: string;
    ring2: string;
    amulet: string;
  };
};

type BuildDraftStore = {
  activeStep: BuildStep;
  draft: BuildDraft;
  setStep: (step: BuildStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateDraft: (patch: Partial<BuildDraft>) => void;
  hydrateDraft: (draft: BuildDraft) => void;
  selectClass: (rule: RuleSelection | null) => void;
  selectSubclass: (rule: RuleSelection | null) => void;
  selectRace: (rule: RuleSelection | null) => void;
  selectBackground: (rule: RuleSelection | null) => void;
  resetDraft: () => void;
};

const defaultDraft: BuildDraft = {
  name: "",
  level: 1,
  classRule: null,
  subclassRule: null,
  raceRule: null,
  backgroundRule: null,
  classFeature: "",
  raceTrait: "",
  backgroundFeature: "",
  spells: [],
  feats: [],
  notes: "",
  isPublic: false,
  tags: [],
  stats: {
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
  },
  equipment: {
    head: "",
    chest: "",
    mainHand: "",
    offHand: "",
    ring1: "",
    ring2: "",
    amulet: "",
  },
};

const stepClamp = (step: number) => Math.min(6, Math.max(1, step)) as BuildStep;

export const useBuildDraftStore = create<BuildDraftStore>((set, get) => ({
  activeStep: 1,
  draft: defaultDraft,
  setStep: (step) => set({ activeStep: stepClamp(step) }),
  nextStep: () => set({ activeStep: stepClamp(get().activeStep + 1) }),
  prevStep: () => set({ activeStep: stepClamp(get().activeStep - 1) }),
  updateDraft: (patch) =>
    set((state) => ({
      draft: {
        ...state.draft,
        ...patch,
      },
    })),
  hydrateDraft: (draft) =>
    set({
      activeStep: 1,
      draft: {
        ...draft,
        stats: { ...draft.stats },
        equipment: { ...draft.equipment },
        spells: [...draft.spells],
        feats: [...draft.feats],
        tags: [...draft.tags],
      },
    }),
  selectClass: (rule) =>
    set((state) => ({
      draft: {
        ...state.draft,
        classRule: rule,
        subclassRule: null,
        classFeature: "",
      },
    })),
  selectSubclass: (rule) =>
    set((state) => ({
      draft: {
        ...state.draft,
        subclassRule: rule,
      },
    })),
  selectRace: (rule) =>
    set((state) => ({
      draft: {
        ...state.draft,
        raceRule: rule,
        raceTrait: "",
      },
    })),
  selectBackground: (rule) =>
    set((state) => ({
      draft: {
        ...state.draft,
        backgroundRule: rule,
        backgroundFeature: "",
      },
    })),
  resetDraft: () => set({ activeStep: 1, draft: defaultDraft }),
}));
