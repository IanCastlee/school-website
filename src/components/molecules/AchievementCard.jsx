import React from "react";
import { Trophy, Users, Calendar, CheckCircle2 } from "lucide-react";
import Badge from "../atoms/Badge";

/**
 * Reusable AchievementCard Molecule
 * Displays BNHS extracurricular & academic highlights (Sepak Takraw, Boxing, DLC, Sci-Tech).
 */
export default function AchievementCard({
  category,
  title,
  subtitle,
  date,
  badge,
  image,
  description,
  athletes = [],
  metrics = [],
}) {
  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-800/35 transition-all duration-300 flex flex-col">
      {/* Image Header */}
      <div className="relative h-56 overflow-hidden bg-emerald-950">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/30 to-transparent" />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <Badge variant="solidEmerald">{category}</Badge>
          {badge && <Badge variant="solidGold">{badge}</Badge>}
        </div>
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-emerald-100/90">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            {date}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-amber-300">
            <Trophy className="w-3.5 h-3.5" />
            School Pride
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col justify-between gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
            {subtitle}
          </p>
          <h3 className="text-xl font-bold text-slate-900 font-serif group-hover:text-[#1B4332] transition-colors leading-snug">
            {title}
          </h3>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">{description}</p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          {athletes.length > 0 && (
            <div className="flex items-start gap-2.5">
              <Users className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700">
                <span className="font-bold text-slate-900">Featured Delegation: </span>
                {athletes.join(" • ")}
              </div>
            </div>
          )}

          {metrics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {metrics.map((metric, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-[#1B4332] border border-emerald-200/60"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  {metric}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
