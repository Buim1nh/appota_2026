"use client";

import { ViewTransition } from "react";
import { useEffect, useMemo, useState } from "react";

import { Card, CardDescription, CardTitle } from "@/components/shared/card";
import { Field, Input, Select } from "@/components/shared/field";
import type { RuleRecord } from "@/types/character-builder";
import {
  getClassFeatureGroups,
  getRulesByCategory,
  getRulesByParent,
} from "@/utils/character-builder-rules";

import { useWizardActions, useWizardSelector } from "./wizard-context";

export function StepClass() {
  const classStep = useWizardSelector((state) => state.classStep);
  const actions = useWizardActions();

  const [classes, setClasses] = useState<RuleRecord[]>([]);
  const [subclasses, setSubclasses] = useState<RuleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    getRulesByCategory("class")
      .then((rules) => {
        if (cancelled) return;
        setClasses(rules);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load classes.",
        );
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!classStep.classId) {
      setSubclasses([]);
      return;
    }

    getRulesByParent("subclass", classStep.classId)
      .then((rules) => {
        if (cancelled) return;
        setSubclasses(rules);
      })
      .catch(() => {
        if (cancelled) return;
        setSubclasses([]);
      });

    return () => {
      cancelled = true;
    };
  }, [classStep.classId]);

  const selectedClass = useMemo(
    () => classes.find((entry) => entry._id === classStep.classId),
    [classes, classStep.classId],
  );

  const featureGroups = useMemo(
    () => getClassFeatureGroups(selectedClass, classStep.level),
    [selectedClass, classStep.level],
  );

  return (
    <ViewTransition enter="slide-up" exit="slide-down" default="none">
      <Card>
        <CardTitle>Class Selection</CardTitle>
        <CardDescription>
          Pulling data from /api/rules?category=class with level-based feature
          controls.
        </CardDescription>

        {errorMessage ? (
          <p className="mt-4 rounded-lg border border-[#6f2f2f] bg-[#2a1515] p-3 text-sm text-[#f4c2c2]">
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Class" description="Choose your core character class.">
            <Select
              value={classStep.classId}
              onChange={(event) => actions.setClassId(event.target.value)}
              disabled={isLoading}
            >
              <option value="">Select class...</option>
              {classes.map((entry) => (
                <option key={entry._id} value={entry._id}>
                  {entry.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field
            label="Level"
            description="Level controls feature availability."
          >
            <Input
              type="number"
              min={1}
              max={20}
              value={classStep.level}
              onChange={(event) => {
                const nextLevel = Number.parseInt(event.target.value, 10);
                actions.setClassLevel(
                  Number.isNaN(nextLevel)
                    ? 1
                    : Math.min(20, Math.max(1, nextLevel)),
                );
              }}
            />
          </Field>

          {classStep.level >= 3 ? (
            <Field label="Subclass" description="Unlocked from level 3.">
              <Select
                value={classStep.subclassId}
                onChange={(event) => actions.setSubclassId(event.target.value)}
                disabled={subclasses.length === 0}
              >
                <option value="">Select subclass...</option>
                {subclasses.map((entry) => (
                  <option key={entry._id} value={entry._id}>
                    {entry.name}
                  </option>
                ))}
              </Select>
            </Field>
          ) : null}
        </div>

        {selectedClass ? (
          <ViewTransition
            name={`class-details-${selectedClass._id}`}
            share="morph"
            default="none"
          >
            <article className="mt-6 rounded-xl border border-[#3f3a30] bg-[#100e0a] p-4">
              <h3 className="font-(family-name:--font-cormorant) text-xl text-[#f3ecd8]">
                {selectedClass.name}
              </h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#bab3a0]">
                {selectedClass.description || "No class description available."}
              </p>
            </article>
          </ViewTransition>
        ) : null}

        {featureGroups.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {featureGroups.map((group) => (
              <Field key={group.key} label={group.label}>
                <Select
                  value={classStep.featureSelections[group.key] ?? ""}
                  onChange={(event) =>
                    actions.setClassFeatureSelection(
                      group.key,
                      event.target.value,
                    )
                  }
                >
                  <option value="">Choose option...</option>
                  {group.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
            ))}
          </div>
        ) : null}
      </Card>
    </ViewTransition>
  );
}
