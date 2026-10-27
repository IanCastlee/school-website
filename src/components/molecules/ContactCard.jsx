import React from "react";
import { Mail, Phone, Globe, ArrowUpRight, Share2 } from "lucide-react";
import SchoolSeal from "../atoms/SchoolSeal";

function FacebookIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

const iconMap = {
  Mail,
  Phone,
  Facebook: FacebookIcon,
  Globe,
  Share2,
};

/**
 * Reusable ContactCard Molecule
 * Inspired directly by the original screenshot's BNHS Seal + Gold/Green Contact plaques,
 * elevated into a sleek, interactive institutional card.
 */
export default function ContactCard({
  label,
  value,
  secondaryValue,
  description,
  icon = "Mail",
  actionText,
  href,
  onAction,
  schoolName,
  founded,
}) {
  const IconComponent = iconMap[icon] || Mail;

  const handleClick = (e) => {
    if (onAction) {
      e.preventDefault();
      onAction();
    }
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-bnhs-gradient text-white p-6 sm:p-7 shadow-lg border border-emerald-700/40 hover:border-amber-400/60 transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start gap-6">
      {/* Decorative Gold Rule Lines inspired by the original Contact Banner */}
      <div className="absolute top-3 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
      <div className="absolute bottom-3 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

      {/* Left: Official Seal */}
      <div className="shrink-0 relative">
        <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 group-hover:scale-105 transition-transform">
          <SchoolSeal size="md" schoolName={schoolName} founded={founded} />
        </div>
      </div>

      {/* Right: Contact Details */}
      <div className="flex-1 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-extrabold uppercase tracking-widest mb-1.5">
          <IconComponent className="w-4 h-4" />
          <span>{label}</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight break-all sm:break-normal">
          {value}
        </h3>

        {secondaryValue && (
          <p className="text-xs font-semibold text-emerald-200 mt-0.5">
            {secondaryValue}
          </p>
        )}

        {description && (
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-2.5 leading-relaxed">
            {description}
          </p>
        )}

        {actionText && (
          <div className="mt-4">
            <a
              href={href || "#"}
              onClick={handleClick}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors shadow-sm"
            >
              <span>{actionText}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
