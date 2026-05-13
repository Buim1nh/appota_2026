"use client";

import React, { useEffect, useMemo, useState } from "react";
import { fetchGameRules, type GameRuleDto } from "@/lib/gameRulesClient";
import { useBuildDraftStore } from "@/store/build-draft-store";
import RuleCard from "./RuleCard";

function toSelection(rule: GameRuleDto) {
  return {
    id: rule._id,
    name: rule.name,
    description: rule.description,
    category: rule.category,
  };
}

function extractPrimaryAbility(description?: string) {
  const match = description?.match(/Primary Ability:\s*([^.]*)/i);
  return match?.[1]?.trim() || "";
}

function extractHitDie(description?: string) {
  const match = description?.match(/Hit Point Die:\s*([^.]*)/i);
  return match?.[1]?.trim() || "";
}

// Hàm hỗ trợ chuyển đổi key thành tên hiển thị đẹp hơn
function formatTargetStat(stat: string) {
  const statMap: Record<string, string> = {
    hp: "Hit Dice",
    "savingThrows.str": "Saving Throws Strength",
    "savingThrows.dex": "Saving Throws Dexterity",
    "savingThrows.con": "Saving Throws Constitution",
    "savingThrows.int": "Saving Throws Intelligence",
    "savingThrows.wis": "Saving Throws Wisdom",
    "savingThrows.cha": "Saving Throws Charisma",
  };
  return statMap[stat] || stat;
}

function buildFeatureOptions(rule?: GameRuleDto | null) {
  if (!rule) return [] as string[];

  const modifierOptions = (rule.modifiers || []).map((modifier) => {
    // 1 & 2. Format lại HP và Saving Throws
    const label = formatTargetStat(modifier.targetStat);
    // Nếu là HP dice thì hiển thị kèm value (ví dụ: Hit Dice 1d12)
    if (modifier.targetStat === "hp" && modifier.type === "dice") {
      return `${label} ${modifier.value}`;
    }
    return label;
  });

  // 3. Xử lý trùng lặp: Nếu đã có descriptionLine thì không thêm "Class overview"
  const descriptionLine = rule.description
    ? rule.description.split(".")[0]?.trim()
    : "";

  const features = [descriptionLine, ...modifierOptions].filter(Boolean);

  // Nếu không có bất kỳ mô tả hay modifier nào thì mới hiện Overview
  if (features.length === 0 && rule.description) {
    features.push("Class overview");
  }

  return Array.from(new Set(features));
}
export default function StepClass() {
  const draft = useBuildDraftStore((state) => state.draft);
  const selectClass = useBuildDraftStore((state) => state.selectClass);
  const selectSubclass = useBuildDraftStore((state) => state.selectSubclass);
  const updateDraft = useBuildDraftStore((state) => state.updateDraft);

  const [classes, setClasses] = useState<GameRuleDto[]>([]);
  const [subclasses, setSubclasses] = useState<GameRuleDto[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingSubclasses, setLoadingSubclasses] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadClasses() {
      try {
        setLoadingClasses(true);
        const data = await fetchGameRules("class");
        if (active) {
          setClasses(data);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load classes.",
          );
        }
      } finally {
        if (active) {
          setLoadingClasses(false);
        }
      }
    }

    void loadClasses();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadSubclasses() {
      if (!draft.classRule || draft.level < 3) {
        setSubclasses([]);
        return;
      }

      try {
        setLoadingSubclasses(true);
        const data = await fetchGameRules("subclass", draft.classRule.id);
        if (active) {
          setSubclasses(data);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load subclasses.",
          );
        }
      } finally {
        if (active) {
          setLoadingSubclasses(false);
        }
      }
    }

    void loadSubclasses();

    return () => {
      active = false;
    };
  }, [draft.classRule, draft.level]);

  const selectedClass = useMemo(
    () => classes.find((rule) => rule._id === draft.classRule?.id) ?? null,
    [classes, draft.classRule?.id],
  );
  const selectedSubclassFull = useMemo(
    () => subclasses.find((s) => s._id === draft.subclassRule?.id) || null,
    [subclasses, draft.subclassRule],
  );

  const featureOptions = useMemo(
    () => buildFeatureOptions(selectedClass),
    [selectedClass],
  );
  const classFeatures = useMemo(
    () => buildFeatureOptions(selectedClass),
    [selectedClass],
  );

  const subclassFeatures = useMemo(
    () => buildFeatureOptions(selectedSubclassFull),
    [selectedSubclassFull],
  );
  useEffect(() => {
    if (!featureOptions.length) {
      if (draft.classFeature) {
        updateDraft({ classFeature: "" });
      }
      return;
    }

    if (!featureOptions.includes(draft.classFeature)) {
      updateDraft({ classFeature: featureOptions[0] });
    }
  }, [draft.classFeature, featureOptions, updateDraft]);

  useEffect(() => {
    if (draft.classRule && draft.level < 3 && draft.subclassRule) {
      selectSubclass(null);
    }
  }, [draft.classRule, draft.level, draft.subclassRule, selectSubclass]);

  const classCards = classes.map((rule) => {
    const primaryAbility = extractPrimaryAbility(rule.description);
    const hitDie = extractHitDie(rule.description);

    return (
      <RuleCard
        key={rule._id}
        title={rule.name}
        description={rule.description}
        selected={draft.classRule?.id === rule._id}
        onSelect={() => selectClass(toSelection(rule))}
        footer={
          <div className="flex flex-wrap gap-2 text-[11px] text-(--muted)">
            {primaryAbility ? <span>{primaryAbility}</span> : null}
            {hitDie ? <span>{hitDie}</span> : null}
          </div>
        }
      />
    );
  });

  const selectedSubclassId = draft.subclassRule?.id || "";

  return (
    <div className="space-y-5">
      <div className="rpg-panel ornate-border rounded-sm p-4 md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-press text-xl text-[#f0e6d2] drop-shadow-[0_2px_0_rgba(0,0,0,0.9),0_0_10px_rgba(0,0,0,0.45)]">
              Step 1: Choose a Class
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#f3e5c7]">
              Select the foundation of your build, then refine the class feature
              and subclass path once your level unlocks it.
            </p>
          </div>

          <label className="flex min-w-55 flex-col gap-2 text-sm text-[#f3e5c7]">
            <span className="font-semibold">Level</span>
            <select
              className="rpg-control rounded-sm px-3 py-3"
              value={draft.level}
              onChange={(event) =>
                updateDraft({ level: Number(event.target.value) })
              }
            >
              {Array.from({ length: 20 }, (_, index) => index + 1).map(
                (level) => (
                  <option key={level} value={level}>
                    Level {level}
                  </option>
                ),
              )}
            </select>
          </label>
        </div>
      </div>

      {error ? (
        <div className="rounded-sm border border-[rgba(255,120,120,0.4)] bg-[rgba(64,18,18,0.6)] px-4 py-3 text-sm text-[#ffd9d2]">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loadingClasses && classes.length === 0 ? (
          <div className="rpg-panel ornate-border rounded-sm p-5 text-sm text-[#e8d9b6]">
            Loading classes from the archive...
          </div>
        ) : (
          classCards
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Cột 1: Class Features */}
        <div className="rpg-panel ornate-border rounded-sm p-5">
          <h3 className="font-press text-sm text-[#f0e6d2]">Class Features</h3>
          <div className="mt-4 space-y-3">
            {classFeatures.length === 0 ? (
              <p className="text-sm italic text-(--muted)">
                Select a class to view features.
              </p>
            ) : (
              classFeatures.map((f, idx) => (
                <div
                  key={idx}
                  className="rounded-sm border border-[rgba(240,230,210,0.1)] bg-[rgba(255,255,255,0.03)] p-3 text-sm text-[#f0e6d2]"
                >
                  {f}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cột 2: Subclass Path & Subclass Features */}
        <div className="space-y-5">
          <div className="rpg-panel ornate-border rounded-sm p-5">
            <h3 className="font-press text-sm text-[#f0e6d2]">Subclass Path</h3>
            <label className="mt-4 flex flex-col gap-2 text-sm text-[#f3e5c7]">
              <select
                className="rpg-control rounded-sm px-3 py-3"
                style={{ backgroundColor: "#1a1a1a", color: "#f3e5c7" }}
                value={selectedSubclassId}
                onChange={(e) => {
                  const rule = subclasses.find((r) => r._id === e.target.value);
                  selectSubclass(rule ? toSelection(rule) : null);
                }}
                disabled={
                  !draft.classRule || draft.level < 3 || loadingSubclasses
                }
              >
                <option value="">
                  {draft.level < 3 ? "Unlocks at Level 3" : "Select Subclass"}
                </option>
                {subclasses.map((rule) => (
                  <option key={rule._id} value={rule._id}>
                    {rule.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* 4. Feature của Subclass hiển thị ngay bên dưới dropdown Subclass */}
          {selectedSubclassFull && (
            <div className="rpg-panel ornate-border rounded-sm p-5 animate-in fade-in duration-500">
              <h3 className="font-press text-xs text-[#f0e6d2] uppercase tracking-widest">
                {selectedSubclassFull.name} Features
              </h3>
              <div className="mt-3 space-y-2">
                {subclassFeatures.map((f, idx) => (
                  <div
                    key={idx}
                    className="rounded-sm border border-[rgba(182,139,42,0.2)] bg-[rgba(182,139,42,0.05)] p-3 text-sm text-[#f3e5c7]"
                  >
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
