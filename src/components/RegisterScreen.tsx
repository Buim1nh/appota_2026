"use client";

/**
 * Đăng ký: sidebar ảnh trái (full-height), cột trắng phải — form căn giữa ngang + dọc (`items-center` + `justify-center`) giống D&D Beyond.
 */
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import registerBackground from "../../public/asset/background register.png";
import brandLogo from "../../public/asset/logo.png";
import { writeSessionAccount } from "@/lib/session-account";
import { Header } from "./Header";

export function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  return (
    <div className="relative flex min-h-svh w-full flex-col bg-white text-neutral-900">
      <Header hideAuth />
      <div className="flex flex-1 w-full flex-col items-stretch md:flex-row">
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
              Create account · Đăng ký để lưu tiến độ nhân vật (bản demo lưu
              trên trình duyệt).
            </p>

            <form
              className="flex w-full flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                setFormError(null);
                if (password !== confirmPassword) {
                  setFormError(
                    "Mật khẩu xác nhận không khớp · Passwords do not match",
                  );
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
                <p
                  className="text-left text-sm font-medium text-red-600 md:text-center"
                  role="alert"
                >
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
                <div
                  className="absolute inset-x-0 top-1/2 border-t border-neutral-200"
                  aria-hidden
                />
                <p className="relative mx-auto w-max bg-white px-3 text-center text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Hoặc · Or
                </p>
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
