import type { Metadata } from "next";
import { CreateCharacter } from "@/components/CreateCharacter";

export const metadata: Metadata = {
  title: "Tạo nhân vật",
  description: "Character builder — class, species, background",
};

export default function CreateCharacterPage() {
  return <CreateCharacter />;
}
