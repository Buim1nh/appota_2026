"use client";

import React from "react";
import Card from "../Card";

type RuleCardProps = {
  title: string;
  description?: string;
  selected?: boolean;
  disabled?: boolean;
  onSelect: () => void;
  footer?: React.ReactNode;
};

export default function RuleCard({
  title,
  description,
  selected = false,
  disabled = false,
  onSelect,
  footer,
}: RuleCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className="group w-full text-left transition duration-200 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Card
        title={title}
        className={[
          "h-full transition duration-200",
          selected
            ? "shadow-[0_0_0_2px_rgba(182,139,42,0.9),0_0_24px_rgba(182,139,42,0.28)] translate-y-[-1px]"
            : "group-hover:-translate-y-0.5 group-hover:shadow-[0_10px_24px_rgba(0,0,0,0.28)]",
        ].join(" ")}
      >
        {description ? (
          <p className="text-sm leading-6 text-ink/90">{description}</p>
        ) : null}
        {footer ? <div className="mt-3">{footer}</div> : null}
      </Card>
    </button>
  );
}
