import React from "react";
import type { BuildDetailDto } from "@/types/build-detail";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

type Features = {
  classFeature?: string;
  raceTrait?: string;
  backgroundFeature?: string;
  notes?: string;
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#efe2c9",
    padding: 20,
    fontSize: 11,
    color: "#1b1b1b",
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 6,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryCell: {
    flex: 1,
    padding: 6,
    borderWidth: 1,
    borderColor: "#b99f78",
    backgroundColor: "#fffdf6",
    marginRight: 8,
  },
  section: {
    marginTop: 8,
    marginBottom: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#b99f78",
    backgroundColor: "#fffdf6",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 6,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  statCell: {
    width: "30%",
    padding: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#d0bfa3",
    backgroundColor: "#fff",
  },
  smallText: {
    fontSize: 10,
  },
  twoColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  half: {
    width: "48%",
  },
});

const modFor = (score?: number) => {
  if (typeof score !== "number") return "0";
  const m = Math.floor((score - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
};

type BuildForPDF = Omit<Partial<BuildDetailDto>, "equipment"> & {
  // Ghi đè equipment bằng một Record chung chung để chấp nhận cả string id từ draft
  equipment?: Record<string, unknown>;
  classFeature?: string;
  raceTrait?: string;
  backgroundFeature?: string;
};

export default function CharacterPDFDocument({
  build,
  features,
}: {
  build: BuildForPDF;
  features?: Features;
}) {
  const stats = build.baseStats || {
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
  };
  const derived = build.derivedStats || {
    hp: { max: 0, current: 0, temp: 0 },
    ac: 0,
    initiative: 0,
    speed: 0,
    proficiencyBonus: 0,
    spellSaveDC: 0,
    attackBonus: 0,
    carryWeight: { current: 0, max: 0 },
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{build.name || "Unnamed Adventurer"}</Text>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCell, { marginRight: 8 }]}>
              <Text style={styles.smallText}>Level</Text>
              <Text>{build.level ?? "—"}</Text>
            </View>
            <View style={[styles.summaryCell, { marginRight: 8 }]}>
              <Text style={styles.smallText}>Class</Text>
              <Text>{build.classRef?.name ?? "—"}</Text>
            </View>
            <View style={[styles.summaryCell, { marginRight: 8 }]}>
              <Text style={styles.smallText}>Race</Text>
              <Text>{build.raceRef?.name ?? "—"}</Text>
            </View>
            <View style={styles.summaryCell}>
              <Text style={styles.smallText}>Background</Text>
              <Text>{build.backgroundRef?.name ?? "—"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ability Scores & Modifiers</Text>
          <View style={styles.statsGrid}>
            {(
              [
                ["STR", stats.str],
                ["DEX", stats.dex],
                ["CON", stats.con],
                ["INT", stats.int],
                ["WIS", stats.wis],
                ["CHA", stats.cha],
              ] as [string, number][]
            ).map(([label, value]) => (
              <View key={label} style={styles.statCell}>
                <Text style={{ fontWeight: 700 }}>{label}</Text>
                <Text>{value}</Text>
                <Text style={styles.smallText}>Modifier: {modFor(value)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Combat & Defense</Text>
          <View style={styles.twoColumn}>
            <View style={styles.half}>
              <Text>HP: {derived.hp?.max ?? "—"}</Text>
              <Text>AC: {derived.ac ?? "—"}</Text>
              <Text>Initiative: {derived.initiative ?? "—"}</Text>
              <Text>Proficiency: {derived.proficiencyBonus ?? "—"}</Text>
            </View>
            <View style={styles.half}>
              <Text>Speed: {derived.speed ?? "—"}</Text>
              <Text>Save DC: {derived.spellSaveDC ?? "—"}</Text>
              <Text>Attack Bonus: {derived.attackBonus ?? "—"}</Text>
              <Text>
                Carry: {derived.carryWeight?.current ?? "—"} /{" "}
                {derived.carryWeight?.max ?? "—"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features & Traits</Text>
          <Text style={styles.smallText}>Class Feature</Text>
          <Text>{features?.classFeature ?? build.classFeature ?? "—"}</Text>
          <Text style={[styles.smallText, { marginTop: 6 }]}>Racial Trait</Text>
          <Text>{features?.raceTrait ?? build.raceTrait ?? "—"}</Text>
          <Text style={[styles.smallText, { marginTop: 6 }]}>
            Background Feature
          </Text>
          <Text>
            {features?.backgroundFeature ?? build.backgroundFeature ?? "—"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Character Summary / Notes</Text>
          <Text>{features?.notes ?? build.notes ?? "—"}</Text>
        </View>
      </Page>
    </Document>
  );
}
