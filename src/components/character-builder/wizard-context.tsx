"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type {
  AbilityScores,
  BuilderStepDescriptor,
  BuilderWizardState,
} from "@/types/character-builder";
import { BUILDER_STEP_ORDER } from "@/types/character-builder";
import {
  createWizardStore,
  type WizardStore,
} from "@/utils/character-builder-store";

const WizardStoreContext = createContext<WizardStore | null>(null);

export function WizardProvider({
  sharedId,
  children,
}: {
  sharedId: string;
  children: ReactNode;
}) {
  const storeRef = useRef<WizardStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createWizardStore(sharedId);
  }

  return (
    <WizardStoreContext.Provider value={storeRef.current}>
      {children}
    </WizardStoreContext.Provider>
  );
}

function useWizardStore() {
  const store = useContext(WizardStoreContext);
  if (!store) {
    throw new Error("useWizardStore must be used inside WizardProvider");
  }
  return store;
}

export function useWizardActions() {
  return useWizardStore().actions;
}

export function useWizardSelector<T>(
  selector: (state: BuilderWizardState) => T,
  isEqual: (left: T, right: T) => boolean = Object.is,
) {
  const store = useWizardStore();
  const selectorRef = useRef(selector);
  const isEqualRef = useRef(isEqual);

  selectorRef.current = selector;
  isEqualRef.current = isEqual;

  const [selected, setSelected] = useState(() => selector(store.getState()));

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const nextSelected = selectorRef.current(store.getState());
      setSelected((prevSelected) =>
        isEqualRef.current(prevSelected, nextSelected)
          ? prevSelected
          : nextSelected,
      );
    });

    return unsubscribe;
  }, [store]);

  return selected;
}

export function useCurrentStep() {
  const stepIndex = useWizardSelector((state) => state.stepIndex);

  return useMemo(() => {
    const current = BUILDER_STEP_ORDER[stepIndex] ?? BUILDER_STEP_ORDER[0];
    return {
      stepIndex,
      current,
      steps: BUILDER_STEP_ORDER,
      total: BUILDER_STEP_ORDER.length,
    };
  }, [stepIndex]);
}

export function useWizardSnapshot() {
  return useWizardSelector(
    (state) => state,
    () => false,
  );
}

export function useAbilityScores() {
  return useWizardSelector((state) => state.baseStats, shallowAbilityEqual);
}

function shallowAbilityEqual(left: AbilityScores, right: AbilityScores) {
  return (
    left.str === right.str &&
    left.dex === right.dex &&
    left.con === right.con &&
    left.int === right.int &&
    left.wis === right.wis &&
    left.cha === right.cha
  );
}

export function getStepDescriptorByIndex(index: number): BuilderStepDescriptor {
  return BUILDER_STEP_ORDER[index] ?? BUILDER_STEP_ORDER[0];
}
