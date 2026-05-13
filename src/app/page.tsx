import React from "react";
import Card from "../components/Card";
import Button from "../components/Button";

type IBuild = {
  id: string;
  _id: string;
  name: string;
  class?: string;
  race?: string;
  classRef?: { name: string };
  raceRef?: { name: string };
  level: number;
  optimizationScore: number;
  tags: string[];
};

const MOCK_BUILDS: IBuild[] = [
  {
    id: "1",
    _id: "1",
    name: "Thornblade Ranger",
    classRef: { name: "Ranger" },
    raceRef: { name: "Elf" },
    level: 5,
    optimizationScore: 82,
    tags: ["ranged", "survivor"],
  },
  {
    id: "2",
    _id: "2",
    name: "Arcane Weaver",
    classRef: { name: "Wizard" },
    raceRef: { name: "Human" },
    level: 7,
    optimizationScore: 91,
    tags: ["control", "arcane"],
  },
  {
    id: "3",
    _id: "3",
    name: "Stonewall Defender",
    classRef: { name: "Fighter" },
    raceRef: { name: "Dwarf" },
    level: 6,
    optimizationScore: 77,
    tags: ["tank", "melee"],
  },
  {
    id: "4",
    _id: "4",
    name: "Shade Whisper",
    classRef: { name: "Rogue" },
    raceRef: { name: "Halfling" },
    level: 4,
    optimizationScore: 69,
    tags: ["stealth"],
  },
  {
    id: "5",
    _id: "5",
    name: "Verdant Warden",
    classRef: { name: "Druid" },
    raceRef: { name: "Half-Elf" },
    level: 8,
    optimizationScore: 88,
    tags: ["summon", "healer"],
  },
  {
    id: "6",
    _id: "6",
    name: "Eldritch Knight",
    classRef: { name: "Paladin" },
    raceRef: { name: "Human" },
    level: 9,
    optimizationScore: 94,
    tags: ["melee", "spell"],
  },
];

async function getRecentBuilds(): Promise<IBuild[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/builds?limit=3&page=1`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const { data } = (await response.json()) as { data: IBuild[] };
    return data;
  } catch (error) {
    console.error("Failed to fetch recent builds:", error);
    return [];
  }
}

export default async function Home() {
  const recentBuilds = await getRecentBuilds();
  const builds = recentBuilds.length > 0 ? recentBuilds : MOCK_BUILDS;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-start py-12">
      <section className="w-full px-6 hero-epic">
        <div className="mx-auto max-w-6xl grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
          <div>
            <h1
              style={{ fontFamily: "var(--font-press)" }}
              className="text-5xl text-[#f0e6d2] drop-shadow-[2px_3px_0_rgba(0,0,0,0.95),0_0_14px_rgba(0,0,0,0.35)]"
            >
              Forge your legend — craft the perfect adventurer
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-7 text-[#e7dcc0] drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
              D&D Character Builder is now a richly detailed dark-fantasy
              character atelier. Your adventurers dossier awaits — create,
              clone, and export your masterpiece.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <Button href="/building" variant="primary" className="px-6 py-3">
                Create New Character
              </Button>
              <Button href="/builds" variant="ghost" className="px-4 py-2">
                Browse Builds
              </Button>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-1 gap-3">
              {builds.slice(0, 4).map((b) => {
                const className = b.classRef?.name || b.class || "Unknown";
                const raceName = b.raceRef?.name || b.race || "Unknown";
                return (
                  <Card key={b._id || b.id} title={b.name} className="mb-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm dossier-subtle text-ink">
                        {className} • {raceName} • Lv {b.level}
                      </div>
                      <div className="text-sm font-semibold text-ink">
                        {b.optimizationScore}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-6 mt-12">
        <div className="mx-auto max-w-6xl">
          <h2
            style={{ fontFamily: "var(--font-press)" }}
            className="mb-4 text-2xl text-[#f0e6d2] drop-shadow-[2px_3px_0_rgba(0,0,0,0.92),0_0_12px_rgba(0,0,0,0.35)]"
          >
            Featured Adventurer Dossiers
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {builds.map((b) => {
              const className = b.classRef?.name || b.class || "Unknown";
              const raceName = b.raceRef?.name || b.race || "Unknown";
              return (
                <Card key={b._id || b.id} title={b.name} className="p-4">
                  <div className="mb-2 text-sm text-ink">
                    <span className="dossier-subtle">
                      {className} — {raceName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-ink">Level {b.level}</div>
                    <div className="text-sm font-medium text-ink">
                      Score {b.optimizationScore}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
