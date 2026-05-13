import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";

import { cn } from "@/utils/cn";

export function Field({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#d7cfb7]">
        {label}
      </span>
      {description ? (
        <span className="text-xs text-[#9b9688]">{description}</span>
      ) : null}
      {children}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 rounded-xl border border-[#5a5446] bg-[#0f0d0a] px-3 text-sm text-[#f0ece0] outline-none transition placeholder:text-[#706a5b] focus-visible:ring-2 focus-visible:ring-[#b19456]",
        props.className,
      )}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-11 rounded-xl border border-[#5a5446] bg-[#0f0d0a] px-3 text-sm text-[#f0ece0] outline-none transition focus-visible:ring-2 focus-visible:ring-[#b19456]",
        props.className,
      )}
    />
  );
}
