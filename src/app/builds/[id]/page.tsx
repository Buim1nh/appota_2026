import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BuildDetailClient from "@/components/build/BuildDetailClient";
import { getBuildByIdentifier } from "@/lib/build-details";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const build = await getBuildByIdentifier(id);

  if (!build) {
    return {
      title: "Build not found",
    };
  }

  return {
    title: `${build.name} | Character Dossier`,
    description: `Detailed D&D character sheet for ${build.name}, a level ${build.level} ${build.classRef?.name || "adventurer"}.`,
  };
}

export default async function BuildDetailPage({ params }: PageProps) {
  const { id } = await params;
  const build = await getBuildByIdentifier(id);

  if (!build) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-6">
      <BuildDetailClient build={build} />
    </div>
  );
}
