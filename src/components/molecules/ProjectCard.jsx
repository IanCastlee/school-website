import React from "react";
import { Calendar, Users, Sparkles, CheckCircle2 } from "lucide-react";
import Badge from "../atoms/Badge";

/**
 * Reusable ProjectCard Molecule
 * Displays BNHS school plans, SIP initiatives, and student organization projects.
 */
export default function ProjectCard({
  title,
  category,
  date,
  status,
  progress = 100,
  lead,
  description,
  impact,
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-emerald-800/30 transition-all duration-300 flex flex-col justify-between gap-5">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <Badge variant="emerald">{category}</Badge>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {status}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 font-serif leading-snug mb-2">
          {title}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Implementation Progress</span>
            <span className="text-[#1B4332] font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#1B4332] to-amber-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Meta Footer */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#1B4332] shrink-0" />
            <span className="truncate font-medium">{lead}</span>
          </div>
          <div className="flex items-center justify-end gap-1.5 text-right">
            <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{date}</span>
          </div>
        </div>

        {impact && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs font-semibold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Key Output: {impact}</span>
          </div>
        )}
      </div>
    </div>
  );
}
