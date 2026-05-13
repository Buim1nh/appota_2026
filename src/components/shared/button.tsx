"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-linear-to-r from-[#c8a24a] via-[#e4c377] to-[#8a6429] px-5 py-2.5 text-[#1f1409] shadow-[0_4px_20px_rgba(204,160,80,0.35)] hover:brightness-110",
        secondary:
          "bg-[#741f1f] px-4 py-2.5 text-white shadow-[0_2px_12px_rgba(116,31,31,0.3)] hover:bg-[#8b2525]",
        ghost:
          "border border-[#5f5a49] bg-transparent px-4 py-2.5 text-[#d9d4c6] hover:bg-[#2a261f]",
      },
      size: {
        default: "h-10",
        sm: "h-8 px-3 text-xs",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  asChild = false,
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
