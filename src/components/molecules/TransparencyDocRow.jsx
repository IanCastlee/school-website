import React from "react";
import { FileText, Download, CheckCircle2, Calendar } from "lucide-react";
import Badge from "../atoms/Badge";
import Button from "../atoms/Button";

/**
 * Reusable TransparencyDocRow Molecule
 * Displays downloadable/viewable public disclosure documents and financial statements.
 */
export default function TransparencyDocRow({
  code,
  title,
  category,
  datePublished,
  fileSize,
  status,
  onDownload,
}) {
  return (
    <div className="group bg-white hover:bg-emerald-50/40 rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-emerald-800/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-emerald-950/5 border border-emerald-900/15 flex items-center justify-center text-[#1B4332] shrink-0 mt-0.5 group-hover:bg-[#1B4332] group-hover:text-amber-400 transition-colors">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {code}
            </span>
            <Badge variant="emerald">{category}</Badge>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {status}
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#1B4332] transition-colors">
            {title}
          </h4>
          <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Published: {datePublished}
            </span>
            <span>•</span>
            <span className="font-medium text-slate-600">{fileSize}</span>
          </div>
        </div>
      </div>

      <div className="w-full sm:w-auto flex justify-end shrink-0">
        <Button
          variant="subtle"
          size="sm"
          icon={Download}
          onClick={() => onDownload && onDownload(title)}
          className="w-full sm:w-auto"
        >
          View Disclosure
        </Button>
      </div>
    </div>
  );
}
