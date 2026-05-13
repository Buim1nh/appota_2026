"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import brandLogo from "../../public/asset/logo.png";

import {
  ACCOUNT_STORAGE_KEY,
  clearSessionAccount,
  readSessionAccount,
  type SessionAccount,
} from "@/lib/session-account";

export function Header({ hideAuth = false }: { hideAuth?: boolean }) {
  const [account, setAccount] = useState<SessionAccount | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setAccount(readSessionAccount());
    });

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
    <header className="relative border-b border-zinc-800/90 bg-black px-4 py-3 sm:px-8">
      <div className="mx-auto flex min-h-[44px] max-w-7xl items-center justify-end sm:min-h-[48px]">

        {/* Logo */}
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-md bg-black px-4 py-2 ring-1 ring-white/10 transition hover:bg-neutral-900"
          aria-label="Trang chủ"
        >
          <Image
            src={brandLogo}
            alt="Logo D&D"
            width={180}
            height={50}
            className="h-7 w-auto object-contain sm:h-8"
            priority
          />

          <span className="mt-0.5 text-[11px] font-black uppercase tracking-[0.28em] text-white sm:text-xs">
            Builder
          </span>
        </Link>

        {/* Auth */}
        {!hideAuth && (
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
                className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4"
                aria-label="Tài khoản"
              >
                <Link
                  href="/login"
                  className="text-[11px] font-semibold text-zinc-100 underline-offset-2 hover:text-white hover:underline"
                >
                  Đăng nhập
                </Link>

                <Link
                  href="/register"
                  className="rounded border border-[#C89B3C]/50 bg-amber-950/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-100 transition hover:border-[#C89B3C] hover:bg-amber-900/50"
                >
                  Tạo tài khoản
                </Link>
              </nav>
            )}
          </div>
        )}
      </div>
    </header>
  );
}