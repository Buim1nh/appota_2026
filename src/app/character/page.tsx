import type { Metadata } from "next";
import { CharacterLanding } from "@/components/CharacterLanding";

export const metadata: Metadata = {
  title: "Create your character",
  description: "Character creation — start your story",
};

export default function CharacterPage() {
  return <CharacterLanding />;
}
