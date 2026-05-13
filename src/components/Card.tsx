import React from "react";

type CardProps = {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
};

export default function Card({
  title,
  children,
  className = "",
  dark = false,
}: CardProps) {
  const frameClass = dark ? "ornate-dark" : "ornate-border";

  return (
    <article className={`dossier ${frameClass} ${className}`}>
      <div
        className={
          dark ? "dossier-inner text-bright" : "dossier-inner ornate-inner"
        }
      >
        {title ? <div className="mb-2 dossier-title">{title}</div> : null}
        <div className={dark ? "text-bright" : "text-ink"}>{children}</div>
      </div>
    </article>
  );
}
