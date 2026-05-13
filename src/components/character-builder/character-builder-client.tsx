"use client";

import { addTransitionType, startTransition, ViewTransition } from "react";
import { useMemo } from "react";

import { Button } from "@/components/shared/button";

import { StepBackground } from "./step-background";
import { StepClass } from "./step-class";
import { StepExport } from "./step-export";
import { StepRace } from "./step-race";
import { StepReview } from "./step-review";
import { StepStats } from "./step-stats";
import {
  getStepDescriptorByIndex,
  useCurrentStep,
  useWizardActions,
  WizardProvider,
} from "./wizard-context";
import { WizardShell } from "./wizard-shell";

function BuilderContent({ sharedId }: { sharedId: string }) {
  const { stepIndex, current, steps, total } = useCurrentStep();
  const actions = useWizardActions();

  const CurrentStep = useMemo(() => {
    switch (current.id) {
      case "class":
        return <StepClass />;
      case "race":
        return <StepRace />;
      case "background":
        return <StepBackground />;
      case "stats":
        return <StepStats />;
      case "review":
        return <StepReview />;
      case "export":
        return <StepExport sharedId={sharedId} />;
      default:
        return <StepClass />;
    }
  }, [current.id, sharedId]);

  const onPrevious = () => {
    startTransition(() => {
      addTransitionType("prev-step");
      actions.previousStep();
    });
  };

  const onNext = () => {
    startTransition(() => {
      addTransitionType("next-step");
      actions.nextStep();
    });
  };

  const jumpToStep = (index: number) => {
    const type = index > stepIndex ? "next-step" : "prev-step";

    startTransition(() => {
      addTransitionType(type);
      actions.setStep(index);
    });
  };

  return (
    <WizardShell>
      <WizardShell.Header title={current.title} subtitle={current.subtitle} />
      <WizardShell.Progress current={stepIndex} total={total} steps={steps} />

      <WizardShell.Content>
        <ViewTransition
          name={`step-title-${stepIndex}`}
          share="text-morph"
          default="none"
          enter={{
            "next-step": "slide-from-right",
            "prev-step": "slide-from-left",
            default: "none",
          }}
          exit={{
            "next-step": "slide-to-left",
            "prev-step": "slide-to-right",
            default: "none",
          }}
        >
          {CurrentStep}
        </ViewTransition>
      </WizardShell.Content>

      <WizardShell.Actions>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onPrevious}
            disabled={stepIndex === 0}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onNext}
            disabled={stepIndex === steps.length - 1}
          >
            Next
          </Button>
        </div>

        <nav aria-label="Step navigation" className="flex flex-wrap gap-2">
          {steps.map((step, index) => {
            const descriptor = getStepDescriptorByIndex(index);
            return (
              <Button
                key={step.id}
                type="button"
                size="sm"
                variant={stepIndex === index ? "secondary" : "ghost"}
                onClick={() => jumpToStep(index)}
                aria-current={stepIndex === index ? "step" : undefined}
              >
                {index + 1}. {descriptor.id}
              </Button>
            );
          })}
        </nav>
      </WizardShell.Actions>
    </WizardShell>
  );
}

export function CharacterBuilderClient({ sharedId }: { sharedId: string }) {
  return (
    <WizardProvider sharedId={sharedId}>
      <BuilderContent sharedId={sharedId} />
    </WizardProvider>
  );
}
