"use client";
import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BuildCard from "./BuildCard";

type IBuild = {
  _id: string;
  id: string;
  name: string;
  class?: string;
  race?: string;
  classRef?: { name: string };
  raceRef?: { name: string };
  level: number;
  optimizationScore: number;
  tags: string[];
};

export default function BuildsFilter({
  initialBuilds,
}: {
  initialBuilds: IBuild[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("name") || "");
  const [classFilter, setClassFilter] = useState<string>(
    searchParams.get("classRef") || "all",
  );
  const [raceFilter, setRaceFilter] = useState<string>(
    searchParams.get("raceRef") || "all",
  );
  const [levelFilter, setLevelFilter] = useState<string>(
    searchParams.get("level") || "all",
  );

  const classes = useMemo(
    () =>
      Array.from(
        new Set(
          initialBuilds
            .map((b) => b.classRef?.name || b.class)
            .filter(Boolean) as string[],
        ),
      ).sort(),
    [initialBuilds],
  );

  const races = useMemo(
    () =>
      Array.from(
        new Set(
          initialBuilds
            .map((b) => b.raceRef?.name || b.race)
            .filter(Boolean) as string[],
        ),
      ).sort(),
    [initialBuilds],
  );

  const filtered = useMemo(() => {
    return initialBuilds.filter((b) => {
      const className = b.classRef?.name || b.class;
      const raceName = b.raceRef?.name || b.race;

      if (classFilter !== "all" && className !== classFilter) return false;
      if (raceFilter !== "all" && raceName !== raceFilter) return false;
      if (levelFilter !== "all") {
        const lvl = parseInt(levelFilter, 10);
        if (!isNaN(lvl) && b.level !== lvl) return false;
      }
      if (query.trim()) {
        const q = query.toLowerCase();
        if (!b.name.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [initialBuilds, classFilter, raceFilter, levelFilter, query]);

  const handleSearch = (value: string) => {
    setQuery(value);
    updateUrl(value, classFilter, raceFilter, levelFilter);
  };

  const handleClassFilter = (value: string) => {
    setClassFilter(value);
    updateUrl(query, value, raceFilter, levelFilter);
  };

  const handleRaceFilter = (value: string) => {
    setRaceFilter(value);
    updateUrl(query, classFilter, value, levelFilter);
  };

  const handleLevelFilter = (value: string) => {
    setLevelFilter(value);
    updateUrl(query, classFilter, raceFilter, value);
  };

  const updateUrl = (name: string, cls: string, race: string, lvl: string) => {
    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (cls !== "all") params.append("classRef", cls);
    if (race !== "all") params.append("raceRef", race);
    if (lvl !== "all") params.append("level", lvl);

    const newUrl = `/builds${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(newUrl);
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-2">
          <input
            aria-label="Search builds"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name..."
            className="rounded-md border border-[color:var(--border)] bg-transparent px-3 py-2 text-sm"
          />

          <select
            className="rounded-md border px-2 py-2 text-sm"
            value={classFilter}
            onChange={(e) => handleClassFilter(e.target.value)}
          >
            <option value="all">All Classes</option>
            {classes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            className="rounded-md border px-2 py-2 text-sm"
            value={raceFilter}
            onChange={(e) => handleRaceFilter(e.target.value)}
          >
            <option value="all">All Races</option>
            {races.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select
            className="rounded-md border px-2 py-2 text-sm"
            value={levelFilter}
            onChange={(e) => handleLevelFilter(e.target.value)}
          >
            <option value="all">Any Level</option>
            {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={String(n)}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm dossier-subtle">Results: {filtered.length}</div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b) => (
          <BuildCard key={b._id || b.id} build={b} />
        ))}
      </div>
    </div>
  );
}
