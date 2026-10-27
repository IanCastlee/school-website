import React from "react";

/**
 * Reusable Button Atom
 * Supports primary (emerald), gold (accent), outline, subtle, and ghost variants.
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "right",
  onClick,
  type = "button",
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98]";

  const variants = {
    primary:
      "bg-[#1B4332] hover:bg-[#122e22] text-white shadow-md shadow-emerald-950/15 focus:ring-emerald-700",
    gold:
      "bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20 focus:ring-amber-500",
    outline:
      "border-2 border-[#1B4332] text-[#1B4332] hover:bg-[#1B4332] hover:text-white focus:ring-emerald-700",
    outlineLight:
      "border border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm focus:ring-white",
    subtle:
      "bg-emerald-50 hover:bg-emerald-100 text-[#1B4332] border border-emerald-200/80 focus:ring-emerald-600",
    ghost:
      "text-slate-600 hover:text-[#1B4332] hover:bg-emerald-50/70 focus:ring-emerald-600",
  };

  const sizes = {
    sm: "text-xs px-3.5 py-2",
    md: "text-sm px-5 py-2.5",
    lg: "text-base px-6 py-3.5",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === "right" && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
}
