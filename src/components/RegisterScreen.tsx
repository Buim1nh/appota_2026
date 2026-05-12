"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { writeSessionAccount } from "@/lib/session-account";

export function RegisterScreen() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="relative min-h-svh w-full bg-white text-neutral-900">
      <div className="mx-auto flex min-h-svh max-w-lg flex-col justify-center px-8 py-12">
        <div className="mb-10 flex items-baseline gap-0.5">
          <span className="text-2xl font-bold tracking-tight text-[#ff5a00]">
            VNG
          </span>
          <span className="text-2xl font-bold tracking-tight text-neutral-800">
            GAMES
          </span>
        </div>

        <h1 className="mb-2 text-3xl font-bold tracking-tight text-black">
          Tạo tài khoản
        </h1>
        <p className="mb-8 text-sm text-neutral-600">
          Create account · Đăng ký để lưu tiến độ nhân vật (bản demo lưu trên
          trình duyệt).
        </p>

        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            const name = displayName.trim() || "Adventurer";
            writeSessionAccount({ displayName: name });
            router.push("/character");
            router.refresh();
          }}
        >
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Tên hiển thị · Display name
            </span>
            <input
              name="displayName"
              autoComplete="nickname"
              placeholder="TÊN CỦA BẠN"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="h-12 w-full rounded border border-black px-4 text-sm font-medium uppercase tracking-wide text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500">
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

          <button
            type="submit"
            className="mt-2 h-12 w-full rounded-full bg-neutral-900 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Tạo tài khoản và tiếp tục
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-neutral-600">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="font-semibold text-neutral-900 underline underline-offset-2 hover:text-[#ff5a00]"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
