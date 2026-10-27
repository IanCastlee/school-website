import React from "react";
import { Calendar, Users, Award, Trophy, ShieldCheck } from "lucide-react";

const iconMap = {
  Calendar,
  Users,
  Award,
  Trophy,
  ShieldCheck,
};

/**
 * Reusable StatCard Molecule
 * Displays key school metrics with an icon, value, suffix, and short description.
 */
export default function StatCard({ label, value, suffix, icon = "Award", description }) {
  const IconComponent = iconMap[icon] || Award;

  return (
    <div className="group bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-800/30 transition-all duration-300 relative overflow-hidden">
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-emerald-900/5 group-hover:bg-emerald-900/10 transition-colors" />
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-950/5 border border-emerald-900/15 flex items-center justify-center text-[#1B4332] group-hover:bg-[#1B4332] group-hover:text-amber-400 transition-colors">
          <IconComponent className="w-6 h-6" />
        </div>
        {suffix && (
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            {suffix}
          </span>
        )}
      </div>
      <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
        {value}
      </div>
      <div className="text-sm font-bold text-[#1B4332] mt-1">{label}</div>
      {description && (
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
