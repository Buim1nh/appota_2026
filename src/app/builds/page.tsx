import React from "react";
import BuildsFilter from "../../components/BuildsFilter";

type IBuild = {
  _id: string;
  id: string;
  name: string;
  class?: string;
  race?: string;
  classRef?: { name: string; category: string };
  raceRef?: { name: string; category: string };
  level: number;
  optimizationScore: number;
  tags: string[];
};

async function getBuilds(
  name?: string,
  classRef?: string,
  raceRef?: string,
  level?: string,
  page?: string,
  limit?: string,
): Promise<IBuild[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const params = new URLSearchParams();

    if (name) params.append("name", name);
    if (classRef) params.append("classRef", classRef);
    if (raceRef) params.append("raceRef", raceRef);
    if (level) params.append("level", level);
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit || "10");

    const response = await fetch(`${baseUrl}/api/builds?${params.toString()}`, {
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const { data } = (await response.json()) as { data: IBuild[] };
    return data;
  } catch (error) {
    console.error("Failed to fetch builds:", error);
    return [];
  }
}

const MOCK_BUILDS: IBuild[] = [
  {
    _id: "1",
    id: "1",
    name: "Thornblade Ranger",
    classRef: { name: "Ranger", category: "class" },
    raceRef: { name: "Elf", category: "race" },
    level: 5,
    optimizationScore: 82,
    tags: ["ranged", "survivor"],
  },
  {
    _id: "2",
    id: "2",
    name: "Arcane Weaver",
    classRef: { name: "Wizard", category: "class" },
    raceRef: { name: "Human", category: "race" },
    level: 7,
    optimizationScore: 91,
    tags: ["control", "arcane"],
  },
  {
    _id: "3",
    id: "3",
    name: "Stonewall Defender",
    classRef: { name: "Fighter", category: "class" },
    raceRef: { name: "Dwarf", category: "race" },
    level: 6,
    optimizationScore: 77,
    tags: ["tank", "melee"],
  },
  {
    _id: "4",
    id: "4",
    name: "Shade Whisper",
    classRef: { name: "Rogue", category: "class" },
    raceRef: { name: "Halfling", category: "race" },
    level: 4,
    optimizationScore: 69,
    tags: ["stealth"],
  },
  {
    _id: "5",
    id: "5",
    name: "Verdant Warden",
    classRef: { name: "Druid", category: "class" },
    raceRef: { name: "Half-Elf", category: "race" },
    level: 8,
    optimizationScore: 88,
    tags: ["summon", "healer"],
  },
  {
    _id: "6",
    id: "6",
    name: "Eldritch Knight",
    classRef: { name: "Paladin", category: "class" },
    raceRef: { name: "Human", category: "race" },
    level: 9,
    optimizationScore: 94,
    tags: ["melee", "spell"],
  },
];

export default async function BuildsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const name = typeof params.name === "string" ? params.name : "";
  const classRef = typeof params.classRef === "string" ? params.classRef : "";
  const raceRef = typeof params.raceRef === "string" ? params.raceRef : "";
  const level = typeof params.level === "string" ? params.level : "";
  const page = typeof params.page === "string" ? params.page : "1";

  const builds = await getBuilds(name, classRef, raceRef, level, page);
  const displayBuilds = builds.length > 0 ? builds : MOCK_BUILDS;

  return (
    <div className="mx-auto max-w-6xl px-6">
      <h1
        style={{ fontFamily: "var(--font-press)" }}
        className="mb-4 text-2xl text-[#f0e6d2] drop-shadow-[2px_3px_0_rgba(0,0,0,0.92),0_0_12px_rgba(0,0,0,0.35)]"
      >
        Public Builds
      </h1>
      <BuildsFilter initialBuilds={displayBuilds} />
    </div>
  );
}
