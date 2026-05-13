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

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logout = useCallback(() => {
    clearSessionAccount();
    setAccount(null);
    setIsMenuOpen(false);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;
    const close = () => setIsMenuOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [isMenuOpen]);

  return (
    <header className="relative border-b border-zinc-800/90 bg-black px-4 py-3 sm:px-8">
      <div className="mx-auto flex min-h-[44px] max-w-7xl items-center justify-end sm:min-h-[48px]">

        {/* Logo */}
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
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
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                  }}
                  className="flex items-center gap-2 rounded border border-zinc-800 bg-black px-3 py-1.5 text-[11px] font-semibold text-zinc-100 transition hover:bg-zinc-900 hover:text-white sm:text-xs"
                >
                  {account.displayName}
                  <svg 
                    viewBox="0 0 20 20" 
                    fill="currentColor" 
                    className={`size-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                  >
                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 p-1 shadow-2xl animate-in fade-in zoom-in duration-150">
                    <button
                      type="button"
                      onClick={logout}
                      className="flex w-full items-center px-3 py-2 text-left text-[11px] font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-red-400"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                      </svg>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
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