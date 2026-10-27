import React from "react";
import Badge from "./Badge";

/**
 * Reusable SectionHeading Atom
 * Provides consistent editorial hierarchy across all 5 BNHS pages.
 */
export default function SectionHeading({
  eyebrow,
  title,
  scriptAccent,
  description,
  align = "left",
  badgeVariant = "emerald",
  className = "",
}) {
  const alignmentClasses =
    align === "center"
      ? "text-center items-center mx-auto max-w-3xl"
      : "text-left items-start";

  return (
    <div className={`flex flex-col gap-3 ${alignmentClasses} ${className}`}>
      {eyebrow && <Badge variant={badgeVariant}>{eyebrow}</Badge>}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
        {title}{" "}
        {scriptAccent && (
          <span className="text-[#1B4332] font-bold">
            {scriptAccent}
          </span>
        )}
      </h2>
      {description && (
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
      <div className="h-1 w-16 rounded-full bg-gradient-to-r from-[#1B4332] to-amber-500 mt-1" />
    </div>
  );
}
