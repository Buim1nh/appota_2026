import Link from "next/link";
import React from "react";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
  onClick,
  disabled = false,
  type = "button",
}: ButtonProps) {
  const base = "btn-ornate";
  const variantClass =
    variant === "primary"
      ? "btn-primary-ornate"
      : variant === "ghost"
        ? "btn-ghost-ornate"
        : "btn-ghost-ornate";
  const classes = `${base} ${variantClass} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes}>
        <span className="relative z-10">{children}</span>
      </Link>
    );
  }

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
