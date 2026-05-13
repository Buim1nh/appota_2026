export type GameRuleCategory =
  | "class"
  | "subclass"
  | "race"
  | "subrace"
  | "background"
  | "feat";

export type GameRuleModifier = {
  targetStat: string;
  type: string;
  value: unknown;
};

export type GameRuleDto = {
  _id: string;
  name: string;
  category: GameRuleCategory;
  parentRef?: string | { _id: string; name?: string } | null;
  description?: string;
  modifiers?: GameRuleModifier[];
  source?: string;
  edition?: string;
};

export async function fetchGameRules(
  category: GameRuleCategory,
  parentRef?: string,
): Promise<GameRuleDto[]> {
  const params = new URLSearchParams({ category });

  if (parentRef) {
    params.set("parentRef", parentRef);
  }

  const response = await fetch(`/api/game-rules?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch game rules: ${response.status}`);
  }

  const payload = (await response.json()) as { data: GameRuleDto[] };
  return payload.data;
}
