import { Types } from "mongoose";
import { cache } from "react";
import { Build } from "@/models";
import { connectMongoDB } from "@/lib/mongoose";
import type { BuildDetailDto } from "@/types/build-detail";

const populatedBuildProjection = [
  {
    path: "classRef",
    select: "name category description modifiers source edition",
  },
  {
    path: "subclassId",
    select: "name category description modifiers source edition",
  },
  {
    path: "raceRef",
    select: "name category description modifiers source edition",
  },
  {
    path: "backgroundRef",
    select: "name category description modifiers source edition",
  },
  { path: "feats", select: "name category description modifiers source edition" },
  {
    path: "spells",
    select:
      "name level school castingTime duration range components description modifiers source edition",
  },
  {
    path: "equipment.head",
    select: "name type rarity requiresAttunement description modifiers weaponProps source edition",
  },
  {
    path: "equipment.chest",
    select: "name type rarity requiresAttunement description modifiers weaponProps source edition",
  },
  {
    path: "equipment.mainHand",
    select: "name type rarity requiresAttunement description modifiers weaponProps source edition",
  },
  {
    path: "equipment.offHand",
    select: "name type rarity requiresAttunement description modifiers weaponProps source edition",
  },
  {
    path: "equipment.ring1",
    select: "name type rarity requiresAttunement description modifiers weaponProps source edition",
  },
  {
    path: "equipment.ring2",
    select: "name type rarity requiresAttunement description modifiers weaponProps source edition",
  },
  {
    path: "equipment.amulet",
    select: "name type rarity requiresAttunement description modifiers weaponProps source edition",
  },
] 

export const getBuildByIdentifier = cache(async (identifier: string) => {
  await connectMongoDB();

  const query = Types.ObjectId.isValid(identifier)
    ? {
        $or: [{ _id: new Types.ObjectId(identifier) }, { shareId: identifier }],
      }
    : { shareId: identifier };

  const build = await Build.findOne(query)
    .populate(populatedBuildProjection)
    .lean();

  if (!build) {
    return null;
  }

  return JSON.parse(JSON.stringify(build)) as BuildDetailDto;
});
