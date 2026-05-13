"use client";

/**
 * Đăng ký: sidebar ảnh trái (full-height), cột trắng phải — form căn giữa ngang + dọc (`items-center` + `justify-center`) giống D&D Beyond.
 */
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import registerBackground from "@/asset/background register.png";
import brandLogo from "@/asset/logo.png";
import { writeSessionAccount } from "@/lib/session-account";

function SocialIconFacebook() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5 shrink-0" fill="currentColor">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function SocialIconGoogle() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5 shrink-0">
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

export function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  return (
    <div className="relative min-h-svh w-full bg-white text-neutral-900">
      <div className="flex min-h-svh w-full flex-col items-stretch md:flex-row">
        <section
          className="relative hidden shrink-0 overflow-hidden bg-[#0a0a0a] md:block md:min-h-svh md:w-[clamp(300px,28vw,420px)] md:min-w-[300px]"
          aria-hidden
        >
          <div className="absolute inset-0">
            <Image
              src={registerBackground}
              alt=""
              fill
              priority
              className="object-cover object-center brightness-[1.02] contrast-[1.02] saturate-[1.04]"
              sizes="(max-width: 767px) 0px, min(420px, 28vw)"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[#0a0a0a]/20" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.08)_60%,rgba(0,0,0,0.24)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,transparent_40%,rgba(0,0,0,0.12)_100%)]" />
        </section>

        <section className="relative z-10 flex min-h-svh min-h-0 min-w-0 flex-1 flex-col items-center justify-center overflow-y-auto bg-white px-8 py-12 sm:px-12 md:px-10 md:py-16">
          <div className="w-full max-w-[min(100%,480px)] md:text-center">
            <div className="mb-10 w-full max-w-[min(100%,440px)] md:mx-auto [-webkit-mask-image:linear-gradient(90deg,transparent_0%,#000_8%,#000_92%,transparent_100%)] [-webkit-mask-size:100%_100%] [mask-image:linear-gradient(90deg,transparent_0%,#000_8%,#000_92%,transparent_100%)] [mask-size:100%_100%]">
              <Image
                src={brandLogo}
                alt="Dungeons & Dragons"
                priority
                className="h-auto w-full object-contain object-center"
                sizes="(max-width: 768px) 90vw, 440px"
              />
            </div>

            <h1 className="mb-2 text-3xl font-bold tracking-tight text-black">
              Tạo tài khoản
            </h1>
            <p className="mb-8 text-sm text-neutral-600 md:mx-auto md:max-w-md">
              Create account · Đăng ký để lưu tiến độ nhân vật (bản demo lưu trên
              trình duyệt).
            </p>

          <form
            className="flex w-full flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              setFormError(null);
              if (password !== confirmPassword) {
                setFormError("Mật khẩu xác nhận không khớp · Passwords do not match");
                return;
              }
              const name = username.trim() || "Adventurer";
              writeSessionAccount({ displayName: name });
              router.push("/");
              router.refresh();
            }}
          >
            <label className="block text-left">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500 md:text-center">
                Tên người dùng · Username
              </span>
              <input
                name="username"
                autoComplete="username"
                placeholder="TÊN NGƯỜI DÙNG"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 w-full rounded border border-black px-4 text-sm font-medium uppercase tracking-wide text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </label>

            <label className="block text-left">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500 md:text-center">
                Mật khẩu · Password
              </span>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="MẬT KHẨU"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded bg-[#efefef] px-4 text-sm font-medium uppercase tracking-wide text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </label>

            <label className="block text-left">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500 md:text-center">
                Xác nhận mật khẩu · Confirm password
              </span>
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="NHẬP LẠI MẬT KHẨU"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 w-full rounded bg-[#efefef] px-4 text-sm font-medium uppercase tracking-wide text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </label>

            {formError ? (
              <p className="text-left text-sm font-medium text-red-600 md:text-center" role="alert">
                {formError}
              </p>
            ) : null}

            <button
              type="submit"
              className="mt-1 h-12 w-full rounded-full bg-neutral-900 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Tạo tài khoản và tiếp tục
            </button>

            <div className="relative py-2">
              <div className="absolute inset-x-0 top-1/2 border-t border-neutral-200" aria-hidden />
              <p className="relative mx-auto w-max bg-white px-3 text-center text-xs font-medium uppercase tracking-wide text-neutral-400">
                Hoặc · Or
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="flex min-h-12 w-full flex-wrap items-center justify-center gap-2 rounded-md bg-white px-2 py-2 text-xs font-semibold text-neutral-800 ring-1 ring-neutral-200 transition hover:bg-neutral-50 sm:text-sm"
              >
                <SocialIconGoogle />
                <span className="text-center leading-snug">
                  Đăng ký với Google · Sign up with Google
                </span>
              </button>
              <button
                type="button"
                className="flex min-h-12 w-full flex-wrap items-center justify-center gap-2 rounded-md bg-[#1877f2] px-2 py-2 text-xs font-semibold text-white transition hover:bg-[#166fe5] sm:text-sm"
              >
                <SocialIconFacebook />
                <span className="text-center leading-snug">
                  Đăng ký với Facebook · Sign up with Facebook
                </span>
              </button>
            </div>
          </form>

          <p className="mt-8 w-full text-center text-sm text-neutral-600">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="font-semibold text-neutral-900 underline underline-offset-2 hover:text-[#ff5a00]"
              >
                Đăng nhập
              </Link>
          </p>
          </div>
        </section>
      </div>
    </div>
  );
}
