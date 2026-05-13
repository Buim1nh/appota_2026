"use client";

/**
 * Đăng nhập: form trái / ảnh phải (lg+) — DOM [hero, form] + `lg:flex-row-reverse`; mobile chỉ form (hero ẩn).
 * Submit demo: localStorage session rồi về trang chủ — chưa gọi API thật.
 */

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import loginBackground from "../../public/asset/background login.jpg";
import brandLogo from "../../public/asset/logo.png";

import { writeSessionAccount } from "@/lib/session-account";
import { Header } from "./Header";

export function LoginScreen() {
  const router = useRouter();

  /** “Ghi nhớ” hiện chỉ là UI — chưa lưu persistence. */
  const [remember, setRemember] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="relative flex min-h-svh w-full flex-col bg-white text-neutral-900">
      <Header hideAuth />

      {/* Mobile: chỉ form (hero ẩn); lg+: form trái + ảnh phải */}
      <div className="flex flex-1 flex-col lg:flex-row-reverse">

        {/* Hero phải (desktop) */}
        <section
          className="relative hidden min-h-[280px] flex-1 overflow-hidden bg-[#121212] lg:block"
          aria-hidden
        >
          <div className="absolute inset-0 [-webkit-mask-image:radial-gradient(ellipse_103%_101%_at_50%_50%,#000_0%,#000_12%,rgba(0,0,0,0.72)_30%,rgba(0,0,0,0.22)_58%,transparent_86%)] [-webkit-mask-size:100%_100%] [mask-image:radial-gradient(ellipse_103%_101%_at_50%_50%,#000_0%,#000_12%,rgba(0,0,0,0.72)_30%,rgba(0,0,0,0.22)_58%,transparent_86%)] [mask-size:100%_100%]">
            <Image
              src={loginBackground}
              alt=""
              fill
              priority
              className="object-contain object-center brightness-[1.05] contrast-[1.03] saturate-[1.05]"
              sizes="(max-width: 1024px) 0px, 50vw"
            />
          </div>

          <div className="pointer-events-none absolute inset-0 bg-[#0a0a0a]/28" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(26,26,30,0.26)_0%,rgba(26,26,30,0.05)_52%,transparent_76%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.035)_0%,transparent_38%,rgba(0,0,0,0.08)_100%)]" />
          <div className="pointer-events-none absolute inset-0 mix-blend-soft-light bg-[radial-gradient(ellipse_90%_70%_at_14%_8%,rgba(255,200,140,0.22)_0%,transparent_50%),radial-gradient(ellipse_75%_60%_at_92%_88%,rgba(130,175,255,0.18)_0%,transparent_48%)]" />
          <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-[0.55] bg-[radial-gradient(ellipse_98%_96%_at_50%_50%,transparent_48%,rgba(255,245,235,0.14)_78%,transparent_100%)]" />
          <div className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-40 bg-[radial-gradient(ellipse_105%_100%_at_50%_52%,transparent_0%,rgba(8,8,12,0.55)_100%)]" />
        </section>

        {/* Form đăng nhập */}
        <section className="relative z-10 flex w-full flex-1 flex-col justify-between bg-white px-8 pb-8 pt-10 sm:px-12 lg:max-w-[min(100%,520px)] lg:shrink-0 lg:pb-12 lg:pt-14">
          <div>

            {/* Logo */}
            <div className="mb-12 w-full max-w-[min(100%,340px)] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,#000_10%,#000_90%,transparent_100%)] [-webkit-mask-size:100%_100%] [mask-image:linear-gradient(90deg,transparent_0%,#000_10%,#000_90%,transparent_100%)] [mask-size:100%_100%]">
              <Image
                src={brandLogo}
                alt="Dungeons & Dragons"
                priority
                className="h-auto w-full object-contain object-left"
                sizes="(max-width: 520px) 85vw, 340px"
              />
            </div>

            <h1 className="mb-10 text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Đăng nhập
            </h1>

            {/* Form */}
            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();

                const name = username.trim() || "Adventurer";

                writeSessionAccount({
                  displayName: name,
                });

                router.push("/");
                router.refresh();
              }}
            >
              {/* Username */}
              <label className="block">
                <span className="sr-only">Tên người dùng</span>

                <input
                  name="username"
                  autoComplete="username"
                  placeholder="TÊN NGƯỜI DÙNG"
                  suppressHydrationWarning
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 w-full rounded border border-black px-4 text-sm font-medium uppercase tracking-wide text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </label>

              {/* Password */}
              <label className="block">
                <span className="sr-only">Mật khẩu</span>

                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="MẬT KHẨU"
                  suppressHydrationWarning
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded bg-[#efefef] px-4 text-sm font-medium uppercase tracking-wide text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </label>

              {/* Remember */}
              <label className="flex cursor-pointer items-center gap-2.5 select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="size-4 rounded border-neutral-300 text-neutral-800 focus:ring-black/20"
                />

                <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  GHI NHỚ ĐĂNG NHẬP
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                className="mt-1 h-12 w-full rounded-full bg-neutral-900 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                Đăng nhập và tiếp tục
              </button>
            </form>

            {/* Register link */}
            <p className="mt-8 text-center text-sm text-neutral-600">
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="font-semibold text-neutral-900 underline underline-offset-2 hover:text-[#ff5a00]"
              >
                Tạo tài khoản
              </Link>
            </p>

          </div>
        </section>
      </div>
    </div>
  );
}