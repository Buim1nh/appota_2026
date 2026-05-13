import { Suspense } from "react";

import { CharacterBuilderClient } from "@/components/character-builder/character-builder-client";

export default async function BuildPage({
  params,
}: {
  params: Promise<{ sharedId: string }>;
}) {
  const { sharedId } = await params;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <Suspense
        fallback={
          <div className="rounded-2xl border border-[#4d4738] bg-[#16130f] p-6 text-sm text-[#c3bcaa]">
            Loading character builder...
          </div>
        }
      >
        <CharacterBuilderClient sharedId={sharedId} />
      </Suspense>
    </main>
  );
}
