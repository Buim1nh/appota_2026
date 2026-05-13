"use client";

import { useEffect } from "react";

import { Button } from "@/components/shared/button";

export default function BuildError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <section className="rounded-2xl border border-[#6d2e2e] bg-[#1d1111] p-6">
        <h2 className="font-(family-name:--font-cormorant) text-3xl text-[#f2dbb9]">
          Failed to load builder
        </h2>
        <p className="mt-3 text-sm text-[#d4c0b7]">
          {error.message ||
            "An unexpected error happened while rendering the character wizard."}
        </p>
        <Button
          className="mt-5"
          type="button"
          variant="secondary"
          onClick={reset}
        >
          Try again
        </Button>
      </section>
    </main>
  );
}
