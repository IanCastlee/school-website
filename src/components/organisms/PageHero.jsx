import React from "react";
import { Sparkles, ShieldCheck } from "lucide-react";
import SchoolSeal from "../atoms/SchoolSeal";
import Badge from "../atoms/Badge";

/**
 * Reusable PageHero Organism
 * Dynamically renders the active schoolInfo (Name, School ID, Founded Year, Tagline, Seal)
 * across Home and Subpages.
 */
export default function PageHero({
  variant = "home",
  eyebrow,
  scriptTitle,
  mainTitle,
  subtitle,
  description,
  schoolInfo,
  bgImage = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80",
  actions,
}) {
  const fullName = schoolInfo?.name || "Greenfield National High School";
  const founded = schoolInfo?.founded || "2000";
  const schoolId = schoolInfo?.schoolId || "300101";
  const tagline = schoolInfo?.tagline || "Scholars Bleeding Green: Standing to its Cause";

  // Split school name nicely so "High School" or the last two words get the gold gradient highlight
  const words = fullName.trim().split(/\s+/);
  const highlightWordCount = words.length > 2 ? 2 : 1;
  const primaryNamePart = words.slice(0, words.length - highlightWordCount).join(" ");
  const goldNamePart = words.slice(words.length - highlightWordCount).join(" ");

  return (
    <section className="relative overflow-hidden bg-bnhs-gradient text-white border-b-4 border-amber-500">
      {/* Subtle Campus/Nature Background Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-luminosity scale-105"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#071a10]/85 via-[#133524]/80 to-[#0a2316]/95" />

      {/* Decorative Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Half-Visible Background Blurred Official School Seal (Watermark Ambient Accent) */}
      <div className="absolute -bottom-24 sm:-bottom-32 md:-bottom-44 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0 opacity-20 sm:opacity-25 blur-[1.5px] scale-110 sm:scale-125 transition-all">
        <SchoolSeal
          size="xl"
          showWreath={true}
          schoolName={fullName}
          founded={founded}
          className="w-72 h-72 sm:w-96 sm:h-96 md:w-[440px] md:h-[440px] drop-shadow-2xl"
        />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0a2316]/30 to-[#0a2316]/90" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 z-10">
        {variant === "home" ? (
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
            {/* Left Column: Institutional Welcome */}
            <div className="flex-1 text-center lg:text-left max-w-2xl">
              {/* Sleek Dual Status Pills */}
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/35 text-amber-300 text-[11px] sm:text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Est. {founded} • Excellence in Education</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-100 text-[11px] sm:text-xs font-mono font-medium backdrop-blur-md shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span>DepEd School ID: <strong className="text-white font-bold">{schoolId}</strong></span>
                </span>
              </div>

              {/* Dignified Institutional Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.14] text-white font-serif drop-shadow-sm">
                {primaryNamePart ? `${primaryNamePart} ` : ""}
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent block sm:inline">
                  {goldNamePart}
                </span>
              </h1>

              {/* Classical Motto Accent */}
              <p className="text-base sm:text-xl font-serif italic text-amber-200/95 mt-3.5 tracking-tight font-medium">
                &ldquo;{tagline}&rdquo;
              </p>

              {/* Sub-description with Refined Line Height */}
              {description && (
                <p className="text-emerald-100/85 text-xs sm:text-sm lg:text-base mt-3 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                  {description}
                </p>
              )}

              {/* Call-to-Action Group */}
              {actions && (
                <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 w-full sm:w-auto">
                  {actions}
                </div>
              )}
            </div>

            {/* Right Column: Prominent Official Seal with Laurel Wreath (Desktop Only, since mobile has the ambient blurred half-seal watermark in the background) */}
            <div className="hidden lg:flex shrink-0 flex-col items-center">
              <div className="relative p-5 sm:p-7 rounded-full bg-white/5 backdrop-blur-md border border-white/15 shadow-2xl">
                <div className="absolute inset-0 rounded-full border-2 border-amber-400/30 animate-pulse" />
                <SchoolSeal
                  size="xl"
                  showWreath={true}
                  schoolName={fullName}
                  founded={founded}
                />
              </div>
              <span className="mt-3 text-xs font-bold uppercase tracking-widest text-amber-300/90">
                Official Institutional Crest
              </span>
            </div>
          </div>
        ) : (
          /* Subpage Banner Layout */
          <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
            {eyebrow && (
              <div className="mb-3">
                <Badge variant="solidGold">{eyebrow}</Badge>
              </div>
            )}

            {scriptTitle && (
              <span className="text-lg sm:text-2xl font-bold uppercase tracking-widest text-amber-300 mb-1 z-10">
                {scriptTitle}
              </span>
            )}

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase text-white drop-shadow-sm">
              {mainTitle}
            </h1>

            {subtitle && (
              <p className="text-sm sm:text-lg font-bold uppercase tracking-[0.2em] text-amber-400 mt-2">
                {subtitle}
              </p>
            )}

            {description && (
              <p className="text-emerald-100/90 text-sm sm:text-base mt-4 max-w-2xl leading-relaxed">
                {description}
              </p>
            )}

            {/* Decorative Gold Rule with Laurel Accent */}
            <div className="w-full max-w-md flex items-center gap-3 mt-7">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/70 to-amber-400" />
              <SchoolSeal size="xs" schoolName={fullName} founded={founded} />
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-400/70 to-amber-400" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
