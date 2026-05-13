"use client";

/**
 * Trang landing: hero kiểu D&D Beyond (chữ nền), lưới lớp, phần đồng bộ; logo + minh họa nhân vật.
 */
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import characterIllustration from "@/asset/character.webp";
import homeHeroBg from "@/asset/backgound home3.webp";
import homeBackdrop from "@/asset/backgound home2.jpg";
import classesSectionBg from "@/asset/backgound home1.webp";
import brandLogo from "@/asset/logo.png";
import {
  ACCOUNT_STORAGE_KEY,
  clearSessionAccount,
  readSessionAccount,
  type SessionAccount,
} from "@/lib/session-account";

const GOLD = "#C89B3C";
const CTA_RED = "#E21F27";

/** Gold rule + center diamond (decorative). */
function GoldOrnament({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 ${className ?? ""}`}
      aria-hidden
    >
      <span
        className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-[color:var(--gold)] opacity-80"
        style={{ ["--gold" as string]: GOLD }}
      />
      <span
        className="size-2 rotate-45 border border-[color:var(--gold)] bg-zinc-950/80"
        style={{ ["--gold" as string]: GOLD }}
      />
      <span
        className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-[color:var(--gold)] opacity-80"
        style={{ ["--gold" as string]: GOLD }}
      />
    </div>
  );
}

type ClassDef = {
  id: string;
  tag: string;
  name: string;
  ring: string;
  icon: ReactNode;
};

function ClassIconCircle({
  ring,
  children,
}: {
  ring: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-black/40 text-white shadow-inner ${ring}`}
    >
      {children}
    </div>
  );
}

const CLASSES: ClassDef[] = [
  {
    id: "barbarian",
    tag: "Sức mạnh chiến binh thịnh nộ",
    name: "Người man rợ",
    ring: "bg-gradient-to-br from-orange-600 to-amber-950",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="currentColor"
        aria-hidden
      >
        <path d="M14 2l1 3h4l-3 2 1 4-3-2-3 2 1-4-3-2h4l1-3zm-8 7L5.5 11H2l2.5 2L3 15l2.5-1.5L8 15l-.5-2L10 11H6.5L6 9zm4 4l-1 2H5l2 1.5L6 19l2-1 2 1-1-2.5L11 15H9l-1-2zm6 3l1 2h4l-2.5 2 .5 2.5-2-1-2 1 .5-2.5L13 18h3l1-2z" />
      </svg>
    ),
  },
  {
    id: "bard",
    tag: "Sức hút truyền cảm hứng",
    name: "Thi sĩ",
    ring: "bg-gradient-to-br from-violet-600 to-purple-950",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6zm-2 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
      </svg>
    ),
  },
  {
    id: "cleric",
    tag: "Sự khôn ngoan của linh mục thần thánh",
    name: "Giáo sĩ",
    ring: "bg-gradient-to-br from-amber-400 to-yellow-900",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 2L4 6v2c0 5.25 3.5 10 8 11 4.5-1 8-5.75 8-11V6l-8-4zm0 2.18l6 3v1.5c0 4.12-2.88 7.86-6 8.87-3.12-1.01-6-4.75-6-8.87V7.18l6-3zM12 8a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
    ),
  },
  {
    id: "druid",
    tag: "Trí tuệ linh mục tự nhiên",
    name: "Hiền nhân",
    ring: "bg-gradient-to-br from-emerald-600 to-green-950",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="currentColor"
        aria-hidden
      >
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.26A9.96 9.96 0 0012 21c2.31 0 4.43-.78 6.13-2.09L19 22l1.89-.66C18.78 16.84 16 10 17 8zm-3.89 6.37l-1.42-1.41-1.41 1.41-1.41-1.41-1.42 1.41-1.41-1.41 1.42-1.41-1.42-1.41 1.41-1.41 1.42 1.41 1.41-1.41 1.41 1.41 1.42-1.41 1.41 1.41-1.41 1.41 1.42 1.41-1.42 1.41 1.42 1.41-1.41 1.41-1.42-1.41-1.41 1.41-1.41-1.41-1.42 1.41z" />
      </svg>
    ),
  },
  {
    id: "fighter",
    tag: "Bậc thầy vũ khí Str · Dex",
    name: "Chiến binh",
    ring: "bg-gradient-to-br from-slate-500 to-zinc-900",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="currentColor"
        aria-hidden
      >
        <path d="M6.92 5L5 6.92l2.05 2.05L3 13l1.41 1.41 4.05-4.05L10.08 12 6 16.08l1.41 1.41L11.5 13.41l2.05 2.05L15.5 13.5 21 8l-5.5-5.5-1.96 1.96-2.05-2.05L10.08 5 6.92 5zm9.06 1.41L19 9.43l-4.24 4.24-2.83-2.83L16 6.41z" />
      </svg>
    ),
  },
  {
    id: "monk",
    tag: "Nghệ sĩ võ thuật Dex · Wis",
    name: "Nhà sư võ",
    ring: "bg-gradient-to-br from-sky-600 to-slate-900",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    ),
  },
  {
    id: "paladin",
    tag: "Chiến binh sùng đạo STR · CHA",
    name: "Thánh chiến binh",
    ring: "bg-gradient-to-br from-yellow-200 to-amber-800 text-amber-950",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v5.7c0 4.54-3.07 8.44-7 9.93-3.93-1.49-7-5.39-7-9.93V6.3l7-3.12zM7.41 10.59L6 12l4 4 8-8-1.41-1.42L10 14.17 7.41 10.59z" />
      </svg>
    ),
  },
  {
    id: "ranger",
    tag: "Chiến binh nguyên thủy DEX · WIS",
    name: "Thợ săn",
    ring: "bg-gradient-to-br from-lime-700 to-emerald-950",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="currentColor"
        aria-hidden
      >
        <path d="M4 18c2-6 6-10 12-12 1.5-.4 3-.6 4-.6v2c-1 0-2.2.2-3.5.6C9.5 10.5 6 14 4 18zm0-4c1.8-3.6 4.8-6.4 9-8.2.8-.3 1.6-.5 2.4-.6V5c-1 0-2.1.2-3.2.6C8.2 7.6 5.2 11 4 14zm16-8v3l-2-1-2 1V6l2-1 2 1z" />
      </svg>
    ),
  },
  {
    id: "rogue",
    tag: "Chuyên gia khéo léo — Sự nhanh nhẹn",
    name: "Kẻ lưu manh",
    ring: "bg-gradient-to-br from-zinc-600 to-neutral-900",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5S15.01 22 17.5 22 22 19.99 22 17.5 19.99 13 17.5 13zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21h8v-2H3v2z" />
      </svg>
    ),
  },
  {
    id: "sorcerer",
    tag: "Ma thuật bẩm sinh — Quyến rũ",
    name: "Pháp sư bẩm sinh",
    ring: "bg-gradient-to-br from-rose-600 to-red-950",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
  },
  {
    id: "warlock",
    tag: "Ma thuật huyền bí — Quyến rũ",
    name: "Thuật sĩ khế ước",
    ring: "bg-gradient-to-br from-indigo-700 to-violet-950",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
      </svg>
    ),
  },
  {
    id: "wizard",
    tag: "Ma thuật học thuật — Trí tuệ",
    name: "Phù thủy",
    ring: "bg-gradient-to-br from-blue-600 to-indigo-950",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="currentColor"
        aria-hidden
      >
        <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 017 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
      </svg>
    ),
  },
];

export function CharacterLanding() {
  const [account, setAccount] = useState<SessionAccount | null>(null);

  useEffect(() => {
    setAccount(readSessionAccount());
    const onStorage = (e: StorageEvent) => {
      if (e.key === ACCOUNT_STORAGE_KEY || e.key === null) {
        setAccount(readSessionAccount());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const logout = useCallback(() => {
    clearSessionAccount();
    setAccount(null);
  }, []);

  return (
    <div className="relative min-h-svh overflow-x-hidden bg-[#06080c] text-zinc-100">
      {/* Full-viewport art (dragon / mountains) + scrims for legible copy */}
      <div className="pointer-events-none fixed inset-0 -z-20" aria-hidden>
        <Image
          src={homeBackdrop}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-black/78 via-black/62 to-black/88"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_95%_55%_at_50%_18%,transparent,rgba(0,0,0,0.42))]"
        aria-hidden
      />

      <header className="relative border-b border-zinc-800/90 bg-black/55 px-4 py-3 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex min-h-[44px] max-w-7xl items-center justify-end sm:min-h-[48px]">
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-black/55 px-3 py-1.5 ring-1 ring-white/15 backdrop-blur-sm transition hover:bg-black/70"
            aria-label="Trang chủ"
          >
            <Image
              src={brandLogo}
              alt="Logo D&amp;D"
              width={200}
              height={56}
              className="h-8 w-auto max-w-[min(52vw,200px)] object-contain object-center sm:h-10"
              priority
            />
          </Link>
          <div className="flex max-w-[min(100%,280px)] shrink-0 flex-col items-end gap-2 text-right sm:max-w-none">
            {account ? (
              <>
                <p className="text-[11px] leading-snug text-zinc-100 sm:text-xs">
                  Xin chào, {account.displayName}
                </p>
                <button
                  type="button"
                  onClick={logout}
                  className="text-[10px] font-medium uppercase tracking-wide text-[#C89B3C]/90 underline-offset-2 hover:text-[#e0b85c] hover:underline"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <nav
                className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-3"
                aria-label="Tài khoản"
              >
                <Link
                  href="/register"
                  className="rounded border border-[#C89B3C]/50 bg-amber-950/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-100 transition hover:border-[#C89B3C] hover:bg-amber-900/50"
                >
                  Tạo tài khoản
                </Link>
                <Link
                  href="/login"
                  className="text-[11px] font-semibold text-zinc-100 underline-offset-2 hover:text-white hover:underline"
                >
                  Đăng nhập
                </Link>
              </nav>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero — giống tham chiếu D&D Beyond: chữ nền lớn, không thẻ kính đặc */}
        <section className="relative isolate flex min-h-[min(96svh,64rem)] flex-col justify-center overflow-hidden border-b border-zinc-800/60 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
            <Image
              src={homeHeroBg}
              alt=""
              fill
              sizes="100vw"
              priority
              className="object-cover object-[center_28%] sm:object-[center_22%] [transform:scale(1.05)]"
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/70 via-black/48 to-black/82"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_88%_70%_at_50%_42%,rgba(0,0,0,0.22),rgba(0,0,0,0.5)_58%,rgba(0,0,0,0.78)_100%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] opacity-[0.04] [background-image:repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(200,155,60,0.12)_2px,rgba(200,155,60,0.12)_3px)]"
            aria-hidden
          />

          <div className="relative z-20 mx-auto w-full max-w-4xl px-1 sm:px-3">
            <div className="text-center">
              <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C89B3C] sm:text-[11px] sm:tracking-[0.24em] [text-shadow:0_1px_10px_rgba(0,0,0,0.92)]">
                Trình tạo nhân vật D&amp;D chính thức
              </p>

              <h1 className="mx-auto mt-4 max-w-[min(96vw,44rem)] text-pretty text-center [font-family:var(--font-cinzel),serif] text-[clamp(1.6rem,4.5vw+0.35rem,3.2rem)] font-bold leading-[1.14] tracking-[0.015em] text-white sm:mt-5 sm:leading-[1.1] [text-shadow:0_2px_20px_rgba(0,0,0,0.88)]">
                Tạo nhân vật nhanh chóng, chơi mọi nơi, bắt đầu miễn phí.
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-pretty text-sm font-normal leading-relaxed text-zinc-100/95 sm:mt-6 sm:text-[15px] sm:leading-relaxed [text-shadow:0_1px_12px_rgba(0,0,0,0.9)]">
                Tạo nhân vật trong vài giây và chơi ngay. Bắt đầu với sáu bảng
                nhân vật miễn phí và quyền truy cập vào tất cả 12 lớp cốt lõi.
              </p>

              <div className="mx-auto mt-11 max-w-md">
                <GoldOrnament />
                <div className="py-4">
                  <Link
                    href="/create"
                    className="group relative mx-auto flex min-h-[56px] w-full max-w-[360px] flex-col items-center justify-center px-8 py-2.5 text-center text-white shadow-lg transition hover:brightness-110"
                    style={{
                      backgroundColor: CTA_RED,
                      border: `2px solid ${GOLD}`,
                      clipPath:
                        "polygon(8% 0%, 92% 0%, 100% 50%, 92% 100%, 8% 100%, 0% 50%)",
                    }}
                  >
                    <span className="text-[13px] font-bold uppercase tracking-[0.14em] sm:text-sm sm:tracking-[0.16em]">
                      Bắt đầu xây dựng
                    </span>
                  </Link>
                </div>
                <GoldOrnament />
              </div>
            </div>
          </div>
        </section>

        {/* 12 classes — full-bleed section bg (swap `classesSectionBg` source above) */}
        <section
          id="classes"
          className="relative isolate overflow-hidden border-b border-zinc-800/60 px-4 py-14 sm:px-6 lg:px-8"
        >
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
            <Image
              src={classesSectionBg}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-[center_40%]"
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/78 via-black/64 to-black/84"
            aria-hidden
          />
          <div className="relative z-10 mx-auto max-w-7xl rounded-2xl border border-[#C89B3C]/35 bg-zinc-950/60 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm sm:p-8 lg:p-10">
            <h2 className="text-balance text-center text-base font-semibold text-[#fafafa] [text-shadow:0_2px_14px_rgba(0,0,0,0.9)] sm:text-lg">
              Bắt đầu với bất kỳ lớp nào trong số 12 lớp D&amp;D cốt lõi
            </h2>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {CLASSES.map((c) => (
                <article
                  key={c.id}
                  className="group relative flex min-h-[168px] flex-col overflow-hidden rounded-xl border border-[#C89B3C]/45 bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-black p-4 shadow-lg transition hover:border-[#C89B3C]/80 hover:shadow-[0_0_24px_rgba(200,155,60,0.12)]"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="relative z-10 flex flex-1 flex-col">
                    <div className="flex items-start gap-3">
                      <ClassIconCircle ring={c.ring}>{c.icon}</ClassIconCircle>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium leading-snug text-zinc-50 [text-shadow:0_1px_8px_rgba(0,0,0,0.92)]">
                          {c.tag}
                        </p>
                      </div>
                    </div>
                    <div className="mt-auto pt-4">
                      <h3 className="[font-family:var(--font-cinzel),serif] text-lg font-semibold tracking-wide text-[#fefefe] [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]">
                        {c.name}
                      </h3>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Cross-platform — full-bleed section bg (same art as page backdrop; swap import if you add a 4th asset) */}
        <section className="relative isolate overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
            <Image
              src={homeBackdrop}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-[center_35%]"
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/75 via-black/62 to-black/86"
            aria-hidden
          />
          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl rounded-2xl border border-white/15 bg-black/55 px-5 py-8 text-center shadow-xl backdrop-blur-md sm:px-8">
              <h2 className="text-balance [font-family:var(--font-cinzel),serif] text-2xl font-semibold text-[#fefefe] [text-shadow:0_2px_16px_rgba(0,0,0,0.92)] sm:text-3xl">
                Lấy nhân vật của bạn bất cứ nơi nào bạn phiêu lưu
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-sm font-medium leading-relaxed text-zinc-50 sm:text-base [text-shadow:0_1px_12px_rgba(0,0,0,0.92)]">
                Chơi liền mạch cho dù bạn đang ở bàn hay trực tuyến. Truy cập
                bảng nhân vật của bạn thông qua trình duyệt hoặc ứng dụng di
                động D&amp;D Beyond, được đồng bộ hóa ngay lập tức trên các
                thiết bị.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-[#C89B3C]/40 bg-zinc-950/55 p-6 backdrop-blur-sm sm:p-8 lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-10 lg:p-10">
              <div className="space-y-5">
                <h3 className="text-balance [font-family:var(--font-cinzel),serif] text-lg font-semibold text-[#fafafa] sm:text-xl">
                  Hãy để trang tính của bạn xử lý các chi tiết
                </h3>
                <ul className="space-y-4 text-sm font-medium text-zinc-50">
                  {[
                    "Tạo tối đa sáu nhân vật miễn phí",
                    "Đồng bộ hóa nhân vật của bạn với Maps VTT",
                    "Theo dõi Điểm sinh lực, phép thuật, tính năng lớp và hành trang",
                    "Tự động tính toán chữa trị và sát thương",
                  ].map((line) => (
                    <li key={line} className="flex gap-3">
                      <span
                        className="mt-1.5 size-2 shrink-0 rounded-full border border-[#C89B3C]/80 bg-[#C89B3C]/25"
                        aria-hidden
                      />
                      <span className="[text-shadow:0_1px_10px_rgba(0,0,0,0.9)]">
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative mt-10 aspect-[4/3] min-h-[220px] overflow-hidden rounded-xl border border-zinc-700/50 bg-black/40 lg:mt-0">
                <Image
                  src={characterIllustration}
                  alt="Minh họa bảng nhân vật"
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-contain object-center p-2"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <nav
        className="fixed right-2 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-1 rounded-full border border-zinc-800/80 bg-black/70 p-1.5 shadow-xl backdrop-blur-md md:flex"
        aria-label="Công cụ nhanh"
      >
        {[
          {
            label: "Trợ giúp",
            d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z",
          },
          {
            label: "Sách",
            d: "M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12V2zm-7 2v5l2.5-1.5L18 9V4h-7z",
          },
          {
            label: "Xúc xắc",
            d: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm3 3v2h2V6H8zm5 0v2h2V6h-2zm5 0v2h2V6h-2zM8 11v2h2v-2H8zm5 0v2h2v-2h-2zm5 0v2h2v-2h-2zM8 16v2h2v-2H8zm5 0v2h2v-2h-2zm5 0v2h2v-2h-2z",
          },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            className="flex size-10 items-center justify-center rounded-full text-zinc-200 transition hover:bg-zinc-800 hover:text-[#f0d090]"
            aria-label={item.label}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
              <path d={item.d} />
            </svg>
          </button>
        ))}
      </nav>
    </div>
  );
}
