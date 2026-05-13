"use client";

/**
 * Đăng nhập: form trái / ảnh phải (lg+) — DOM [hero, form] + `lg:flex-row-reverse`; mobile chỉ form (hero ẩn).
 * Submit demo: localStorage session rồi về trang chủ — chưa gọi API thật.
 */
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import loginBackground from "@/asset/background login.jpg";
import brandLogo from "@/asset/logo.png";
import { writeSessionAccount } from "@/lib/session-account";

/** Icon SVG đăng nhập xã hội — dùng inline để khỏi phụ thuộc file ảnh. */
function SocialIconFacebook() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="currentColor">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

/** Google “G” logo nhiều path màu chuẩn thương hiệu. */
function SocialIconGoogle() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}



/** Nút submit dạng tròn — mũi tên tiếp tục. */
function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-7 text-neutral-600">
      <path
        fill="currentColor"
        d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
      />
    </svg>
  );
}



export function LoginScreen() {
  const router = useRouter();
  /** “Ghi nhớ” hiện chỉ là UI — chưa lưu persistence. */
  const [remember, setRemember] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="relative min-h-svh w-full bg-white text-neutral-900">
      {/* Mobile: chỉ form (hero ẩn); lg+: form trái + ảnh phải — DOM [hero, form] + row-reverse */}
      <div className="flex min-h-svh flex-col lg:flex-row-reverse">
        {/* Hero phải (desktop): đặt trước trong DOM, hiển thị bên phải nhờ flex-row-reverse */}
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

        {/* Cột form (trái desktop): sau hero trong DOM → bên trái khi row-reverse */}
        <section className="relative z-10 flex w-full flex-1 flex-col justify-between bg-white px-8 pb-8 pt-10 sm:px-12 lg:max-w-[min(100%,520px)] lg:shrink-0 lg:pb-12 lg:pt-14">
          <div>
            {/* mask-image: hai mép trái/phải logo mờ dần (hòa nền trắng) */}
            <div
              className="mb-12 w-full max-w-[min(100%,340px)] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,#000_10%,#000_90%,transparent_100%)] [-webkit-mask-size:100%_100%] [mask-image:linear-gradient(90deg,transparent_0%,#000_10%,#000_90%,transparent_100%)] [mask-size:100%_100%]"
            >
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

            {/* Gửi form: lưu cookie session + điều hướng; CharacterLanding đọc tên */}
            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                const name = username.trim() || "Adventurer";
                writeSessionAccount({ displayName: name });
                router.push("/");
                router.refresh();
              }}
            >
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

              <div className="flex flex-wrap gap-2.5">
                {/* Nút social: map cấu hình label + class nền + component icon */}
                {[
                  { label: "Facebook", bg: "bg-[#1877f2] text-white", Icon: SocialIconFacebook },
                  { label: "Google", bg: "bg-white text-neutral-800 ring-1 ring-neutral-200", Icon: SocialIconGoogle },
                 
                ].map(({ label, bg, Icon }) => (
                  <button
                    key={label}
                    type="button"
                    aria-label={`Đăng nhập với ${label}`}
                    className={`flex size-11 items-center justify-center rounded-md transition hover:opacity-90 ${bg}`}
                  >
                    <Icon />
                  </button>
                ))}
              </div>

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

              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  className="flex size-16 items-center justify-center rounded-full bg-[#e8e8e8] text-neutral-700 shadow-inner transition hover:bg-[#dedede] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800"
                  aria-label="Tiếp tục đăng nhập"
                >
                  <ArrowRightIcon />
                </button>
              </div>
            </form>
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
