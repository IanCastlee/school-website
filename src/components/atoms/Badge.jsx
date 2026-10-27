import React from "react";

/**
 * Reusable Badge Atom for status pills, category tags, and Laboynon highlights.
 */
export default function Badge({
  children,
  variant = "emerald",
  icon: Icon,
  className = "",
}) {
  const variants = {
    emerald:
      "bg-emerald-900/10 text-[#1B4332] border border-emerald-800/20",
    solidEmerald:
      "bg-[#1B4332] text-white border border-emerald-900",
    gold:
      "bg-amber-500/15 text-amber-800 border border-amber-500/30",
    solidGold:
      "bg-amber-400 text-slate-950 font-bold border border-amber-500",
    glass:
      "bg-white/15 text-white border border-white/25 backdrop-blur-md",
    slate:
      "bg-slate-100 text-slate-700 border border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
        variants[variant] || variants.emerald
      } ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  );
}
