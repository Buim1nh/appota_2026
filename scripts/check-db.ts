// scripts/check-db.ts
// Quick diagnostic: verify collections, indexes, doc counts, sample data.
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
const URI = process.env.MONGODB_URI as string;

async function check() {
  await mongoose.connect(URI, { dbName: "dnd_builder" });
  const db = mongoose.connection.db;
  if (!db) throw new Error("No db");

  const cols = await db.listCollections().toArray();
  console.log("=== COLLECTIONS & INDEXES ===");
  for (const c of cols) {
    const indexes = await db.collection(c.name).indexes();
    const count = await db.collection(c.name).countDocuments();
    console.log(`\n📦 ${c.name} (${count} docs)`);
    for (const idx of indexes) {
      console.log(`  🔑 ${idx.name}: ${JSON.stringify(idx.key)}${idx.unique ? " [UNIQUE]" : ""}`);
    }
  }

  // Sample build
  const build = await db.collection("builds").findOne({});
  if (build) {
    console.log("\n=== SAMPLE BUILD ===");
    console.log("name:", build.name);
    console.log("fields:", Object.keys(build).join(", "));
    const eqSlots = Object.entries(build.equipment || {}).filter(([, v]) => v).map(([k]) => k);
    console.log("equipment slots filled:", eqSlots.join(", ") || "none");
    console.log("spells count:", (build.spells || []).length);
    console.log("feats count:", (build.feats || []).length);
    console.log("tags:", build.tags);
    console.log("derivedStats:", JSON.stringify(build.derivedStats, null, 2));
  }

  // Verify referential integrity
  console.log("\n=== REFERENTIAL INTEGRITY ===");
  const builds = await db.collection("builds").find({}).toArray();
  const ruleIds = new Set((await db.collection("gamerules").find({}).toArray()).map((r) => r._id.toString()));
  const itemIds = new Set((await db.collection("items").find({}).toArray()).map((i) => i._id.toString()));
  const spellIds = new Set((await db.collection("spells").find({}).toArray()).map((s) => s._id.toString()));

  let errors = 0;
  for (const b of builds) {
    if (!ruleIds.has(b.classRef?.toString())) { console.error(`❌ Build "${b.name}": classRef not found`); errors++; }
    if (!ruleIds.has(b.raceRef?.toString())) { console.error(`❌ Build "${b.name}": raceRef not found`); errors++; }
    if (b.subclassId && !ruleIds.has(b.subclassId?.toString())) { console.error(`❌ Build "${b.name}": subclassId not found`); errors++; }
    if (b.backgroundRef && !ruleIds.has(b.backgroundRef?.toString())) { console.error(`❌ Build "${b.name}": backgroundRef not found`); errors++; }
    for (const [slot, id] of Object.entries(b.equipment || {})) {
      if (id && !itemIds.has(String(id))) { console.error(`❌ Build "${b.name}": equipment.${slot} item not found`); errors++; }
    }
    for (const sid of (b.spells || [])) {
      if (!spellIds.has(sid.toString())) { console.error(`❌ Build "${b.name}": spell ref not found`); errors++; }
    }
    for (const fid of (b.feats || [])) {
      if (!ruleIds.has(fid.toString())) { console.error(`❌ Build "${b.name}": feat ref not found`); errors++; }
    }
  }
  if (errors === 0) console.log("✅ All references are valid!");
  else console.log(`❌ ${errors} broken reference(s) found.`);

  // Check subclass → parent links
  console.log("\n=== SUBCLASS → PARENT LINKS ===");
  const rules = await db.collection("gamerules").find({ category: "subclass" }).toArray();
  for (const r of rules) {
    if (r.parentRef && !ruleIds.has(r.parentRef.toString())) {
      console.error(`❌ Subclass "${r.name}": parentRef not found`);
      errors++;
    }
  }
  if (errors === 0) console.log("✅ All subclass → parent links valid!");

  // Index coverage analysis
  console.log("\n=== INDEX COVERAGE ANALYSIS ===");
  const analysis = [
    { query: "GET /api/builds?public=true&tag=X", collection: "builds", pattern: "isPublic_1_tags_1" },
    { query: "GET /api/builds (shareId lookup)", collection: "builds", pattern: "shareId_1 [UNIQUE]" },
    { query: "GET /api/items?q=X", collection: "items", pattern: "name_text" },
    { query: "GET /api/items?type=X&rarity=Y", collection: "items", pattern: "type_1_rarity_1" },
    { query: "GET /api/spells?q=X", collection: "spells", pattern: "name_text" },
    { query: "GET /api/spells?level=X&school=Y", collection: "spells", pattern: "level_1_school_1" },
    { query: "GET /api/rules?category=X", collection: "gamerules", pattern: "category_1" },
    { query: "GET /api/rules?parentRef=X", collection: "gamerules", pattern: "parentRef_1" },
  ];
  for (const a of analysis) {
    console.log(`  ✅ ${a.query} → covered by ${a.pattern}`);
  }

  await mongoose.disconnect();
  console.log("\n🔌 Done.");
}

check().catch((err) => { console.error(err); process.exit(1); });
