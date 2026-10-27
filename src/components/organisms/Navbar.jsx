import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Search, ShieldCheck, MapPin, Phone, ArrowUpRight, Lock } from "lucide-react";
import SchoolSeal from "../atoms/SchoolSeal";
import SearchInput from "../atoms/SearchInput";
import { schoolInfo as defaultSchoolInfo, navigationLinks } from "../../data/mockData";

/**
 * Reusable Navbar Organism
 * Clean, single-line desktop header layout with auto hide-on-scroll-down, show-on-scroll-up.
 */
export default function Navbar({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  searchResults = [],
  onSelectSearchResult,
  schoolInfo = defaultSchoolInfo,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Auto hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show at the top of the page
      if (currentScrollY < 40) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current + 8) {
        // Scrolling down -> hide navbar (unless mobile menu or search is open)
        if (!mobileMenuOpen && !searchOpen) {
          setIsVisible(false);
        }
      } else if (currentScrollY < lastScrollY.current - 8) {
        // Scrolling up -> show navbar
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen, searchOpen]);

  const handleNavClick = (tabId) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const mobileAcronym =
    schoolInfo.shortName?.trim() ||
    (schoolInfo.name || "GNHS")
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* Top DepEd Institutional Ribbon - Hides on scroll down, shows on scroll up */}
      <div
        className={`bg-[#0a2316] text-emerald-100/90 text-[11px] sm:text-xs border-b border-emerald-900/60 overflow-hidden transition-all duration-300 ease-in-out ${
          isVisible ? "max-h-40 sm:max-h-12 opacity-100 py-1.5 sm:py-0" : "max-h-0 opacity-0 py-0 border-transparent pointer-events-none"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:h-9 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
          {/* Official DepEd Header & Division Information */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-emerald-200/90">
            <span className="inline-flex items-center gap-1.5 font-semibold text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>Republic of the Philippines • {schoolInfo.region}</span>
            </span>
            <span className="text-emerald-700">|</span>
            <span>
              {schoolInfo.division} • School ID: <strong className="text-white font-mono">{schoolInfo.schoolId}</strong>
            </span>
          </div>

          {/* Location & Contact Info */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-emerald-200/90 pt-0.5 sm:pt-0 border-t border-emerald-900/40 sm:border-t-0">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{schoolInfo.location}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-100">
              <Phone className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{schoolInfo.contactNumber}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Always visible and accessible */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          {/* Left: Brand Logo + Acronym on Mobile / Full Name on Desktop */}
          <button
            type="button"
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-3 sm:gap-3.5 text-left group cursor-pointer focus:outline-none min-w-0"
          >
            <SchoolSeal
              size="sm"
              schoolName={schoolInfo.name}
              founded={schoolInfo.founded}
              className="group-hover:scale-105 transition-transform duration-200 shrink-0"
            />
            <div className="flex flex-col min-w-0">
              {/* Mobile: Show Acronym Only so header never gets cramped */}
              <span className="md:hidden text-lg font-extrabold text-slate-900 font-serif tracking-tight group-hover:text-[#1B4332] transition-colors whitespace-nowrap">
                {mobileAcronym}
              </span>
              {/* Tablet/Desktop: Show Full Official School Name */}
              <span className="hidden md:inline text-lg lg:text-xl font-extrabold text-slate-900 font-serif tracking-tight group-hover:text-[#1B4332] transition-colors whitespace-nowrap">
                {schoolInfo.name}
              </span>
              {/* Subtitle: Short on mobile to prevent ellipsis cut-off ("SCHO..."), full on desktop */}
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-emerald-800/80 whitespace-nowrap">
                <span className="sm:hidden">Est. {schoolInfo.founded} • Official Portal</span>
                <span className="hidden sm:inline">Est. {schoolInfo.founded} • Official School Portal</span>
              </span>
            </div>
          </button>

          {/* Center: Clean Pill Navigation Dock (Desktop) */}
          <nav
            className="hidden lg:flex items-center bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/70"
            aria-label="Main Navigation"
          >
            {navigationLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#1B4332] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Search + Quick Inquiry CTA + Mobile Menu Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label="Search portal"
              title="Search Portal"
              className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                searchOpen
                  ? "bg-[#1B4332] text-white border-[#1B4332]"
                  : "bg-slate-50 hover:bg-emerald-50/70 text-slate-600 hover:text-[#1B4332] border-slate-200/90"
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden xl:inline">Search</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick("contact")}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs whitespace-nowrap"
            >
              <span>Inquire</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Menu"
              className="lg:hidden p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 border border-slate-200 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Expandable Global Search Bar */}
        {searchOpen && (
          <div className="border-t border-slate-200/80 bg-slate-50/95 py-3.5 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <SearchInput
                value={searchQuery}
                onChange={onSearchChange}
                onClear={() => onSearchChange("")}
                placeholder="Search achievements (Boxing, Sepak Takraw, DLC), Sci-Tech Tree Planting, Transparency MOOE, or Contact..."
                autoFocus
              />
              {searchQuery.trim().length > 0 && (
                <div className="mt-2 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden max-h-72 overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No matching content found for &ldquo;{searchQuery}&rdquo;.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {searchResults.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            onSelectSearchResult(item.tabId);
                            setSearchOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-emerald-50/70 transition-colors flex items-center justify-between gap-4 cursor-pointer"
                        >
                          <div>
                            <div className="text-xs font-bold text-[#1B4332] uppercase">
                              {item.section}
                            </div>
                            <div className="text-sm font-semibold text-slate-900">
                              {item.title}
                            </div>
                            <div className="text-xs text-slate-500 line-clamp-1">
                              {item.snippet}
                            </div>
                          </div>
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg shrink-0">
                            View →
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile / Tablet Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1.5 shadow-xl">
            {navigationLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#1B4332] text-white"
                      : "text-slate-700 hover:bg-emerald-50"
                  }`}
                >
                  <span>{link.fullLabel || link.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
