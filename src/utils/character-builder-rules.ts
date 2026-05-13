import type {
  BuilderFeatureGroup,
  RuleRecord,
  RuleResponse,
} from "@/types/character-builder";

const rulesCache = new Map<string, Promise<RuleRecord[]>>();

async function requestRules(searchParams: URLSearchParams): Promise<RuleRecord[]> {
  const query = searchParams.toString();
  const cacheKey = `rules:${query}`;

  const cached = rulesCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const request = fetch(`/api/rules?${query}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Failed to load game rules.");
      }
      const json = (await response.json()) as RuleResponse;
      return json.data;
    })
    .catch((error: unknown) => {
      rulesCache.delete(cacheKey);
      throw error;
    });

  rulesCache.set(cacheKey, request);
  return request;
}

export function getRulesByCategory(category: RuleRecord["category"]) {
  const params = new URLSearchParams();
  params.set("category", category);
  return requestRules(params);
}

export function getRulesByParent(
  category: RuleRecord["category"],
  parentRef: string
) {
  const params = new URLSearchParams();
  params.set("category", category);
  params.set("parentRef", parentRef);
  return requestRules(params);
}

function toLabel(value: string) {
  return value
    .replace(/\.|_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export function getClassFeatureGroups(
  selectedClass: RuleRecord | undefined,
  level: number
): BuilderFeatureGroup[] {
  if (!selectedClass) {
    return [];
  }

  const modifierTargets = Array.from(
    new Set(
      (selectedClass.modifiers ?? [])
        .map((modifier) => modifier.targetStat)
        .filter(Boolean)
    )
  );

  const groups: BuilderFeatureGroup[] = [
    {
      key: "combatFocus",
      label: "Combat Focus",
      options:
        modifierTargets.length > 0
          ? modifierTargets.slice(0, 6).map((value) => ({
              value,
              label: toLabel(value),
            }))
          : [
              {
                value: "balanced",
                label: "Balanced Training",
              },
              {
                value: "aggressive",
                label: "Aggressive Style",
              },
            ],
    },
  ];

  if (level >= 2) {
    groups.push({
      key: "trainingPath",
      label: "Training Path",
      options: [
        { value: "tactician", label: "Tactician" },
        { value: "survivor", label: "Survivor" },
        { value: "arcane", label: "Arcane Adept" },
      ],
    });
  }

  if (level >= 5) {
    groups.push({
      key: "mastery",
      label: "Mastery",
      options: [
        { value: "precision", label: "Precision Mastery" },
        { value: "fortitude", label: "Fortitude Mastery" },
        { value: "inspiration", label: "Inspiration Mastery" },
      ],
    });
  }

  return groups;
}

export function getTraitGroups(selectedRule: RuleRecord | undefined, title: string) {
  if (!selectedRule) {
    return [] as BuilderFeatureGroup[];
  }

  const modifierTargets = Array.from(
    new Set(
      (selectedRule.modifiers ?? [])
        .map((modifier) => modifier.targetStat)
        .filter(Boolean)
    )
  );

  const baseOptions =
    modifierTargets.length > 0
      ? modifierTargets.map((value) => ({ value, label: toLabel(value) }))
      : [
          { value: "athletics", label: "Athletics" },
          { value: "insight", label: "Insight" },
          { value: "stealth", label: "Stealth" },
          { value: "persuasion", label: "Persuasion" },
        ];

  return [
    {
      key: `${title}OptionA`,
      label: `${title} Option A`,
      options: baseOptions.slice(0, 4),
    },
    {
      key: `${title}OptionB`,
      label: `${title} Option B`,
      options: baseOptions.slice(1, 5).length
        ? baseOptions.slice(1, 5)
        : baseOptions,
    },
  ];
}

export function clampScore(value: number) {
  if (Number.isNaN(value)) {
    return 1;
  }
  return Math.max(1, Math.min(30, Math.trunc(value)));
}

export function rollStatValue() {
  const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1).sort(
    (a, b) => b - a
  );
  return rolls[0] + rolls[1] + rolls[2];
}
