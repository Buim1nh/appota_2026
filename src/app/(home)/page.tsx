import type { Metadata } from "next";
import { CharacterLanding } from "@/components/HomeScreen";

export const metadata: Metadata = {
  title: "Create your character",
  description: "Character creation — start your story",
};

export default function HomePage() {
  return <CharacterLanding />;
}
