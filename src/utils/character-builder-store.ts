import {
  BUILDER_STEP_ORDER,
  DEFAULT_WIZARD_STATE,
  type AbilityScores,
  type BuilderWizardState,
} from "@/types/character-builder";

type Listener = () => void;

type StateUpdater =
  | Partial<BuilderWizardState>
  | ((prev: BuilderWizardState) => BuilderWizardState);

export interface WizardStore {
  getState: () => BuilderWizardState;
  subscribe: (listener: Listener) => () => void;
  setState: (updater: StateUpdater) => void;
  actions: {
    nextStep: () => void;
    previousStep: () => void;
    setStep: (index: number) => void;
    setClassLevel: (level: number) => void;
    setClassId: (classId: string) => void;
    setSubclassId: (subclassId: string) => void;
    setClassFeatureSelection: (key: string, value: string) => void;
    setRaceId: (raceId: string) => void;
    setSubraceId: (subraceId: string) => void;
    setRaceTraitSelection: (key: string, value: string) => void;
    setBackgroundId: (backgroundId: string) => void;
    setBackgroundTraitSelection: (key: string, value: string) => void;
    setAbilityScore: (key: keyof AbilityScores, value: number) => void;
    setAllAbilityScores: (scores: AbilityScores) => void;
    reset: () => void;
  };
}

function isBrowser() {
  return typeof window !== "undefined";
}

function persistenceKey(sharedId: string) {
  return `character-builder:${sharedId}`;
}

function hydrateInitialState(sharedId: string): BuilderWizardState {
  if (!isBrowser()) {
    return DEFAULT_WIZARD_STATE;
  }

  const raw = window.localStorage.getItem(persistenceKey(sharedId));
  if (!raw) {
    return DEFAULT_WIZARD_STATE;
  }

  try {
    const parsed = JSON.parse(raw) as BuilderWizardState;
    return {
      ...DEFAULT_WIZARD_STATE,
      ...parsed,
      classStep: {
        ...DEFAULT_WIZARD_STATE.classStep,
        ...parsed.classStep,
      },
      raceStep: {
        ...DEFAULT_WIZARD_STATE.raceStep,
        ...parsed.raceStep,
      },
      backgroundStep: {
        ...DEFAULT_WIZARD_STATE.backgroundStep,
        ...parsed.backgroundStep,
      },
      baseStats: {
        ...DEFAULT_WIZARD_STATE.baseStats,
        ...parsed.baseStats,
      },
    };
  } catch {
    return DEFAULT_WIZARD_STATE;
  }
}

export function createWizardStore(sharedId: string): WizardStore {
  let state = hydrateInitialState(sharedId);
  const listeners = new Set<Listener>();

  const save = (nextState: BuilderWizardState) => {
    if (!isBrowser()) {
      return;
    }
    window.localStorage.setItem(persistenceKey(sharedId), JSON.stringify(nextState));
  };

  const getState = () => state;

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  const setState = (updater: StateUpdater) => {
    const nextState =
      typeof updater === "function"
        ? updater(state)
        : {
            ...state,
            ...updater,
          };

    if (Object.is(nextState, state)) {
      return;
    }

    state = nextState;
    save(state);
    notify();
  };

  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const actions: WizardStore["actions"] = {
    nextStep() {
      setState((prev) => ({
        ...prev,
        stepIndex: Math.min(prev.stepIndex + 1, BUILDER_STEP_ORDER.length - 1),
      }));
    },
    previousStep() {
      setState((prev) => ({
        ...prev,
        stepIndex: Math.max(prev.stepIndex - 1, 0),
      }));
    },
    setStep(index) {
      setState((prev) => ({
        ...prev,
        stepIndex: Math.max(0, Math.min(index, BUILDER_STEP_ORDER.length - 1)),
      }));
    },
    setClassLevel(level) {
      setState((prev) => ({
        ...prev,
        classStep: {
          ...prev.classStep,
          level,
        },
      }));
    },
    setClassId(classId) {
      setState((prev) => ({
        ...prev,
        classStep: {
          ...prev.classStep,
          classId,
          subclassId: "",
        },
      }));
    },
    setSubclassId(subclassId) {
      setState((prev) => ({
        ...prev,
        classStep: {
          ...prev.classStep,
          subclassId,
        },
      }));
    },
    setClassFeatureSelection(key, value) {
      setState((prev) => ({
        ...prev,
        classStep: {
          ...prev.classStep,
          featureSelections: {
            ...prev.classStep.featureSelections,
            [key]: value,
          },
        },
      }));
    },
    setRaceId(raceId) {
      setState((prev) => ({
        ...prev,
        raceStep: {
          ...prev.raceStep,
          raceId,
          subraceId: "",
        },
      }));
    },
    setSubraceId(subraceId) {
      setState((prev) => ({
        ...prev,
        raceStep: {
          ...prev.raceStep,
          subraceId,
        },
      }));
    },
    setRaceTraitSelection(key, value) {
      setState((prev) => ({
        ...prev,
        raceStep: {
          ...prev.raceStep,
          traitSelections: {
            ...prev.raceStep.traitSelections,
            [key]: value,
          },
        },
      }));
    },
    setBackgroundId(backgroundId) {
      setState((prev) => ({
        ...prev,
        backgroundStep: {
          ...prev.backgroundStep,
          backgroundId,
        },
      }));
    },
    setBackgroundTraitSelection(key, value) {
      setState((prev) => ({
        ...prev,
        backgroundStep: {
          ...prev.backgroundStep,
          proficiencySelections: {
            ...prev.backgroundStep.proficiencySelections,
            [key]: value,
          },
        },
      }));
    },
    setAbilityScore(key, value) {
      setState((prev) => ({
        ...prev,
        baseStats: {
          ...prev.baseStats,
          [key]: value,
        },
      }));
    },
    setAllAbilityScores(scores) {
      setState((prev) => ({
        ...prev,
        baseStats: scores,
      }));
    },
    reset() {
      setState({ ...DEFAULT_WIZARD_STATE });
    },
  };

  return {
    getState,
    subscribe,
    setState,
    actions,
  };
}
