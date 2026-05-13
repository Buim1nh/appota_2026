"use client";

/**
 * Landing tạo nhân vật (style D&D Beyond): header, lưới thẻ Class/Species/Background,
 * cột phải placeholder chân dung + ô tên + gợi ý tên. Đồng bộ tên từ cookie session sau login.
 */
import Image from "next/image";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import createScreenBg from "../../public/asset/backgound home2.jpg";
import portraitFighter from "../../public/asset/portrait fighter.png";
import portraitMage from "../../public/asset/potrait mage.png";
import idleGifFighter from "../../public/asset/Idle-animated fighter.gif";
import idleGifMage from "../../public/asset/Idle-animated mage.gif";

import { Header } from "./Header";

const GOLD = "#C4A454";

export type PortraitChoice =
  | { kind: "preset"; id: "mage" | "fighter" }
  | { kind: "custom"; dataUrl: string };

type PortraitTab = "library" | "upload";

type LibraryPortrait = {
  id: "mage" | "fighter";
  src: StaticImageData;
  alt: string;
  species: string;
};

const LIBRARY_PORTRAITS: LibraryPortrait[] = [
  {
    id: "mage",
    src: portraitMage,
    alt: "Arcane portrait",
    species: "humanoid",
  },
  {
    id: "fighter",
    src: portraitFighter,
    alt: "Martial portrait",
    species: "humanoid",
  },
];

const SPECIES_FILTER_OPTIONS: { value: string; en: string; vi: string }[] = [
  { value: "all", en: "All species", vi: "Tất cả loài" },
  { value: "humanoid", en: "Humanoid", vi: "Người hình" },
  { value: "reptilian", en: "Reptilian", vi: "Bò sát" },
];

/** Gold rule + center diamond — modal header. */
function GoldOrnamentModal({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 ${className ?? ""}`}
      aria-hidden
    >
      <span
        className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-[color:var(--gold)] opacity-90"
        style={{ ["--gold" as string]: GOLD }}
      />
      <span
        className="size-2 rotate-45 border border-[color:var(--gold)] bg-[#121212]"
        style={{ ["--gold" as string]: GOLD }}
      />
      <span
        className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-[color:var(--gold)] opacity-90"
        style={{ ["--gold" as string]: GOLD }}
      />
    </div>
  );
}

function PortraitPickerModal({
  open,
  initialChoice,
  onClose,
  onSave,
}: {
  open: boolean;
  initialChoice: PortraitChoice | null;
  onClose: () => void;
  onSave: (choice: PortraitChoice) => void;
}) {
  const titleId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<PortraitTab>("library");
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [pending, setPending] = useState<PortraitChoice | null>(initialChoice);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const filteredLibrary = LIBRARY_PORTRAITS.filter(
    (p) => speciesFilter === "all" || p.species === speciesFilter,
  );

  const handleFile = (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file. · Chọn tệp ảnh.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Max 2 MB. · Tối đa 2 MB.");
      return;
    }
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl === "string") {
        setPending({ kind: "custom", dataUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  if (!open) return null;

  const canSave = pending !== null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[min(90vh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-zinc-700/80 bg-[#121212] shadow-2xl ring-1 ring-black/60"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-zinc-800 px-5 pb-3 pt-4 sm:px-6">
          <div className="min-w-0 flex-1 text-center sm:px-4">
            <h2
              id={titleId}
              className="text-balance [font-family:var(--font-cinzel),serif] text-lg font-bold leading-snug text-white sm:text-xl"
            >
              Choose Portrait{" "}
              <span className="text-zinc-200">Chọn Chân dung</span>
            </h2>
            <GoldOrnamentModal className="mt-2" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            aria-label="Close"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="currentColor"
              aria-hidden
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        <div className="flex shrink-0 border-b border-zinc-800 px-5 sm:px-6">
          <button
            type="button"
            onClick={() => setTab("library")}
            className={`relative px-1 py-3 text-[10px] font-semibold uppercase tracking-wide transition sm:text-[11px] ${
              tab === "library"
                ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Portrait library · Thư viện chân dung
          </button>
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`relative ml-6 px-1 py-3 text-[10px] font-semibold uppercase tracking-wide transition sm:ml-8 sm:text-[11px] ${
              tab === "upload"
                ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Custom upload · Tải lên tùy chỉnh
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          {tab === "library" ? (
            <>
              <label className="mb-4 block max-w-xs">
                <span className="mb-1.5 block text-[11px] text-zinc-400">
                  Filter by species · Lọc theo loài
                </span>
                <span className="sr-only">Filter by species</span>
                <select
                  value={speciesFilter}
                  onChange={(e) => setSpeciesFilter(e.target.value)}
                  className="w-full appearance-none rounded-md border border-zinc-600 bg-zinc-900/90 bg-[length:12px] bg-[right_12px_center] bg-no-repeat py-2.5 pl-3 pr-10 text-xs text-zinc-100 focus:border-[color:var(--gold)] focus:outline-none focus:ring-1 focus:ring-[color:var(--gold)]"
                  style={{
                    ["--gold" as string]: GOLD,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a1a1aa' d='M3 4.5L6 8l3-3.5'/%3E%3C/svg%3E")`,
                  }}
                >
                  {SPECIES_FILTER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.en} / {o.vi}
                    </option>
                  ))}
                </select>
              </label>

              <section className="space-y-6">
                <div>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-200 sm:text-xs">
                    Starter portraits · Chân dung khởi đầu
                  </h3>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {filteredLibrary.map((p) => {
                      const selected =
                        pending?.kind === "preset" && pending.id === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() =>
                            setPending({ kind: "preset", id: p.id })
                          }
                          className={`aspect-square overflow-hidden rounded-md border-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] ${
                            selected
                              ? "border-[color:var(--gold)] ring-1 ring-[color:var(--gold)]/40"
                              : "border-zinc-700 hover:border-zinc-500"
                          }`}
                          style={{ ["--gold" as string]: GOLD }}
                        >
                          <Image
                            src={p.src}
                            alt={p.alt}
                            width={160}
                            height={160}
                            className="size-full object-cover"
                          />
                        </button>
                      );
                    })}
                    {filteredLibrary.length === 0 && (
                      <p className="col-span-full text-sm text-zinc-500">
                        No portraits for this filter. · Không có chân dung cho
                        bộ lọc này.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400 sm:text-xs">
                    More coming soon · Sắp có thêm
                  </h3>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex aspect-square items-center justify-center rounded-md border border-dashed border-zinc-800 bg-zinc-900/40 text-[10px] text-zinc-600"
                      >
                        —
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-zinc-400">
                Upload a square image for best results. · Tải ảnh vuông để hiển
                thị đẹp nhất.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => handleFile(e.target.files)}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-md border border-zinc-600 bg-zinc-900 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-zinc-200 transition hover:border-[color:var(--gold)] hover:text-white"
                style={{ ["--gold" as string]: GOLD }}
              >
                Choose file · Chọn tệp
              </button>
              {uploadError && (
                <p className="text-sm text-amber-600/90">{uploadError}</p>
              )}
              {pending?.kind === "custom" && (
                <div className="mt-2 max-w-xs overflow-hidden rounded-md border border-zinc-700">
                  <Image
                    src={pending.dataUrl}
                    alt="Upload preview"
                    width={320}
                    height={320}
                    unoptimized
                    className="aspect-square w-full object-cover"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex shrink-0 justify-end gap-3 border-t border-zinc-800 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded border-2 border-[color:var(--gold)] bg-transparent px-5 py-2 text-[11px] font-semibold uppercase tracking-wide text-white transition hover:bg-zinc-900"
            style={{ ["--gold" as string]: GOLD }}
          >
            Cancel · Hủy bỏ
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => {
              if (pending) onSave(pending);
            }}
            className="rounded px-5 py-2 text-[11px] font-semibold uppercase tracking-wide text-white transition enabled:bg-zinc-600 enabled:hover:bg-zinc-500 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
          >
            Save · Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

/** Tên mẫu để gợi ý nhanh — shuffle bằng nút xúc xắc */
const NAME_POOL = [
  "DRALTIMAU",
  "RUNLIN",
  "THORVIN",
  "MIRAEL",
  "KASDEK",
  "VELNOR",
  "ASHFEN",
  "BRYNN",
];

/** Icon xúc xắc — random tên / placeholder nút. */
function DiceIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm2 2v4h4V5H7zm6 0v4h4V5h-4zm6 4h-4v4h4V9zm0 6h-4v4h4v-4zm-6 4v-4h-4v4h4zm-6 0v-4H7v4h4zm-4-6h4v-4H5v4zm0 6h4v-4H5v4z" />
    </svg>
  );
}

/** Icon khung ảnh — nút “Chọn chân dung” (chưa mở picker). */
function ImageIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

/** Silhouette trang trí thẻ “Class” — nhóm nhân vật. */
function SilhouetteParty({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden>
      <path
        fill="currentColor"
        opacity="0.35"
        d="M40 118c0-18 8-32 22-38 4-12 14-20 26-20s22 8 26 20c14 6 22 20 22 38H40zm48-58a18 18 0 1 0-36 0 18 18 0 0 0 36 0zm72 58c0-16 6-28 18-34 3-10 12-16 22-16s19 6 22 16c12 6 18 18 18 34h-80zm36-52a14 14 0 1 0-28 0 14 14 0 0 0 28 0z"
      />
    </svg>
  );
}

/** Silhouette thẻ “Species”. */
function SilhouetteRaces({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden>
      <path
        fill="currentColor"
        opacity="0.3"
        d="M30 118V85c0-12 10-22 22-22h8c6 0 10-4 12-10l4-12c2-6 8-10 14-10s12 4 14 10l4 12c2 6 6 10 12 10h8c12 0 22 10 22 22v33H30zm90-70a16 16 0 1 0-32 0 16 16 0 0 0 32 0zm48 70V92c0-8 6-14 14-14h4l-6-18a12 12 0 0 0-24 0l-6 18h4c8 0 14 6 14 14v26h-4z"
      />
    </svg>
  );
}

/** Silhouette phong cảnh — thẻ “Background” (wide). */
function SilhouetteLand({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 100" className={className} aria-hidden>
      <path
        fill="currentColor"
        opacity="0.25"
        d="M0 100V60l40-20 32 12 48-40 40 28 56-32 44 24 60-32v100H0zm120 0L180 40l50 60H120zm160 0l-30-50 30-10v60z"
      />
    </svg>
  );
}

/** Khung chân dung trung tâm — placeholder nhân vật. */
function CharacterSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 200" className={className} aria-hidden>
      <path
        fill="currentColor"
        opacity="0.45"
        d="M60 8c-10 0-18 8-18 18 0 7 4 13 10 16-12 4-20 16-20 30v48c0 8 6 14 14 14h4v36c0 6 5 10 10 10s10-4 10-10v-36h4c8 0 14-6 14-14V72c0-14-8-26-20-30 6-3 10-9 10-16 0-10-8-18-18-18z"
      />
    </svg>
  );
}

type CardTone = "red" | "gold";

/**
 * Thẻ lựa chọn (Class / Species / Background): tiêu đề song ngữ, câu hỏi, minh họa SVG góc,
 * nút “Xem tùy chọn” (UI — chưa routing). `wide` = span 2 cột trên sm+.
 */
function SelectionCard({
  tone,
  titleEn,
  titleVi,
  questionEn,
  questionVi,
  illustration,
  wide,
}: {
  tone: CardTone;
  titleEn: string;
  titleVi: string;
  questionEn: string;
  questionVi: string;
  illustration: React.ReactNode;
  wide?: boolean;
}) {
  /** Nút CTA theo tone đỏ (Class) hoặc vàng (Species/Background). */
  const btnPrimary =
    tone === "red"
      ? "border border-red-900/50 bg-red-800/90 text-white hover:bg-red-700"
      : "border border-amber-500/70 bg-zinc-900/90 text-amber-100 hover:bg-zinc-800";

  return (
    <div
      className={`relative flex min-h-[220px] flex-col overflow-hidden rounded-lg border border-amber-900/25 bg-zinc-950/75 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm sm:min-h-[240px] ${wide ? "sm:col-span-2" : ""}`}
    >
      {/* Gradient che đáy thẻ — chữ đọc rõ trên illustration */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />{" "}
      <div className="pointer-events-none absolute -right-4 bottom-0 opacity-90">
        {illustration}
      </div>
      <div className="relative z-10 flex flex-1 flex-col">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Choose · Chọn
        </p>
        <h3 className="mt-1 [font-family:var(--font-cinzel),serif] text-xl font-semibold tracking-wide text-white sm:text-2xl">
          {titleEn}{" "}
          <span className="text-amber-200/90 [font-family:var(--font-inter),sans-serif] font-semibold">
            {titleVi}
          </span>
        </h3>
        <p className="mt-2 max-w-[240px] text-sm leading-relaxed text-zinc-400">
          {questionEn} <span className="text-zinc-500">{questionVi}</span>
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded border border-zinc-600 bg-zinc-900/80 text-amber-500/90 transition hover:border-amber-500/50 hover:text-amber-300"
            aria-label="Randomize"
          >
            <DiceIcon className="size-5" />
          </button>
          <button
            type="button"
            className={`rounded px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide transition ${btnPrimary}`}
          >
            See options · Xem các tùy chọn
          </button>
        </div>
      </div>
    </div>
  );
}

export function CreateCharacter() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [suggestions, setSuggestions] = useState(() => NAME_POOL.slice(0, 4));
  const [portraitOpen, setPortraitOpen] = useState(false);
  const [portraitModalEpoch, setPortraitModalEpoch] = useState(0);
  const [portrait, setPortrait] = useState<PortraitChoice | null>(null);

  /** Xáo trộn NAME_POOL, lấy 4 tên hiển thị lại */
  const shuffleNames = useCallback(() => {
    const shuffled = [...NAME_POOL].sort(() => Math.random() - 0.5);
    setSuggestions(shuffled.slice(0, 4));
  }, []);

  return (
    <div className="relative min-h-svh overflow-x-hidden">
      {/* Full-viewport art + scrim — text/cards stay readable */}
      <div className="pointer-events-none fixed inset-0 -z-20" aria-hidden>
        <Image
          src={createScreenBg}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/55 to-black/80"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_90%_60%_at_50%_20%,transparent,rgba(0,0,0,0.45))]"
        aria-hidden
      />

      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        {/* lg: 2 cột — trái nội dung + thẻ; phải sidebar tạo nhân vật */}
        <div className="grid gap-10 lg:grid-cols-[1fr_min(100%,380px)] lg:items-start lg:gap-12">
          {/* Cột trái: hero copy + lưới 3 thẻ (Background span 2 ô trên sm) */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Ready, set · Sẵn sàng, thiết lập
            </p>
            <h1 className="mt-2 max-w-2xl [font-family:var(--font-cinzel),serif] text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-[2.75rem]">
              Start your story…{" "}
              <span className="text-amber-100/90 [font-family:var(--font-inter),sans-serif] font-medium">
                Bắt đầu câu chuyện của bạn…
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400">
              Build your hero step by step: class, species, and background shape
              who you are at the table.{" "}
              <span className="text-zinc-500">
                Xây dựng nhân vật từng bước: lớp, chủng tộc và xuất thân định
                hình con người bạn khi phiêu lưu.
              </span>
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {/* Thẻ demo — onClick thật chỉ có ở nút xúc xắc / gợi ý tên */}
              <SelectionCard
                tone="red"
                titleEn="Class"
                titleVi="Lớp"
                questionEn="What is your calling?"
                questionVi="Vocation của bạn là gì?"
                illustration={
                  <SilhouetteParty className="h-44 w-56 text-zinc-100" />
                }
              />
              <SelectionCard
                tone="gold"
                titleEn="Species"
                titleVi="Chủng tộc"
                questionEn="Where does your bloodline begin?"
                questionVi="Dòng máu của bạn bắt nguồn từ đâu?"
                illustration={
                  <SilhouetteRaces className="h-44 w-56 text-amber-200" />
                }
              />
              <SelectionCard
                tone="gold"
                titleEn="Background"
                titleVi="Xuất thân"
                questionEn="What shaped you before the adventure?"
                questionVi="Điều gì định hình bạn trước chuyến phiêu lưu?"
                illustration={
                  <SilhouetteLand className="h-36 w-full min-w-[280px] text-emerald-900" />
                }
                wide
              />
            </div>
          </div>

          {/* Cột phải: CTA + khung portrait + input tên + chip gợi ý */}
          <aside className="relative mx-auto w-full max-w-[380px] lg:mx-0 lg:max-w-none">
            {" "}
            <div className="mb-3 flex justify-center">
              <button
                type="button"
                className="rounded-lg bg-gradient-to-b from-amber-700/90 to-amber-950 px-8 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-amber-50 shadow-lg ring-1 ring-amber-500/40 transition hover:from-amber-600 hover:to-amber-900"
              >
                Create character · Tạo nhân vật
              </button>
            </div>
            <div className="relative mx-auto flex w-full max-w-[320px] flex-col items-center">
              {/* Khung “bức chân dung”: bo trên oval, gradient nền, silhouette + nút chọn ảnh */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-[50%] border-2 border-amber-600/70 bg-gradient-to-b from-zinc-800/90 via-zinc-950 to-black px-6 pb-8 pt-14 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
                {" "}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-amber-900/15 to-transparent" />
                <div className="relative mx-auto flex h-52 w-32 shrink-0 items-center justify-center sm:h-60 sm:w-36">
                  {portrait ? (
                    portrait.kind === "custom" ? (
                      <Image
                        src={portrait.dataUrl}
                        alt="Character Custom"
                        width={200}
                        height={280}
                        unoptimized
                        className="max-h-full w-auto object-contain object-bottom"
                      />
                    ) : (
                      <Image
                        src={
                          portrait.id === "mage" ? idleGifMage : idleGifFighter
                        }
                        alt="Character"
                        width={240}
                        height={320}
                        unoptimized
                        className="max-h-full w-auto scale-[1.4] origin-bottom object-contain object-bottom [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"
                      />
                    )
                  ) : (
                    <CharacterSilhouette className="h-full w-full max-h-[220px] text-zinc-700" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPortraitModalEpoch((n) => n + 1);
                    setPortraitOpen(true);
                  }}
                  className="relative z-10 mt-4 flex w-full items-center justify-center gap-2 rounded border border-amber-700/50 bg-zinc-900/80 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-amber-100/90 transition hover:border-amber-500 hover:bg-zinc-800"
                >
                  <ImageIcon className="size-4 shrink-0" />
                  Choose portrait · Chọn chân dung
                </button>
              </div>

              <div className="mt-6 w-full space-y-3">
                <label className="block" htmlFor="character-name">
                  <span className="sr-only">Character name</span>
                  <input
                    id="character-name"
                    name="characterName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Choose a name · Chọn tên"
                    autoComplete="off"
                    spellCheck={false}
                    suppressHydrationWarning
                    className="w-full rounded border border-zinc-700 bg-zinc-900/90 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-600/60 focus:outline-none focus:ring-1 focus:ring-amber-600/40"
                  />
                </label>
                <div>
                  <p className="text-xs text-zinc-500">
                    Suggested names · Tên đề xuất
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {/* Chip: điền nhanh ô tên */}
                    {suggestions.map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setName(n)}
                        className="rounded-md border border-amber-800/40 bg-amber-900/30 px-3 py-1.5 text-xs font-semibold tracking-wide text-amber-100 transition hover:bg-amber-800/50"
                      >
                        {n}
                      </button>
                    ))}
                    {/* Xáo trộn pool tên */}
                    <button
                      type="button"
                      onClick={shuffleNames}
                      className="flex size-9 items-center justify-center rounded-md border border-zinc-600 bg-zinc-900 text-amber-500 transition hover:border-amber-500/50 hover:text-amber-300"
                      aria-label="New suggested names"
                    >
                      <DiceIcon className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Thanh icon cố định bên phải (md+) — Help / Book / Dice placeholder */}
      <nav
        className="fixed right-2 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-1 rounded-full border border-zinc-800/80 bg-black/70 p-1.5 shadow-xl backdrop-blur-md md:flex"
        aria-label="Quick tools"
      >
        {/* Map dữ liệu path SVG — cùng một nút style */}
        {[
          {
            label: "Help",
            d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z",
          },
          {
            label: "Book",
            d: "M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12V2zm-7 2v5l2.5-1.5L18 9V4h-7z",
          },
          {
            label: "Dice",
            d: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm3 3v2h2V6H8zm5 0v2h2V6h-2zm5 0v2h2V6h-2zM8 11v2h2v-2H8zm5 0v2h2v-2h-2zm5 0v2h2v-2h-2zM8 16v2h2v-2H8zm5 0v2h2v-2h-2zm5 0v2h2v-2h-2z",
          },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            className="flex size-10 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-800 hover:text-amber-400"
            aria-label={item.label}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
              <path d={item.d} />
            </svg>
          </button>
        ))}
      </nav>

      <PortraitPickerModal
        key={portraitModalEpoch}
        open={portraitOpen}
        initialChoice={portrait}
        onClose={() => setPortraitOpen(false)}
        onSave={(choice) => {
          setPortrait(choice);
          setPortraitOpen(false);
        }}
      />
    </div>
  );
}
