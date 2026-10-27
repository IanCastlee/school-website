import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Search, ShieldCheck, MapPin, Phone, ArrowUpRight, Lock, ChevronDown } from "lucide-react";
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
  const [topRibbonExpanded, setTopRibbonExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );
  const lastScrollY = useRef(0);

  // Sync isDesktop on resize
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) {
        setIsVisible(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto hide on scroll down, show on scroll up (MOBILE ONLY: width < 1024px)
  useEffect(() => {
    const handleScroll = () => {
      // NEVER hide on desktop screens (>= 1024px)
      if (window.innerWidth >= 1024) {
        setIsVisible(true);
        return;
      }

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
      {/* Top DepEd Institutional Ribbon (Always visible on desktop >= 1024px; auto hides on mobile on scroll down) */}
      <div
        className={`bg-[#0a2316] text-emerald-100/90 text-[11px] sm:text-xs overflow-hidden transition-all duration-300 ease-in-out lg:!max-h-12 lg:!h-9 lg:!opacity-100 lg:!py-0 lg:border-b lg:border-emerald-900/60 lg:!pointer-events-auto ${
          isDesktop || isVisible
            ? topRibbonExpanded
              ? "max-h-52 opacity-100 py-2 sm:py-0 border-b border-emerald-900/60"
              : "max-h-12 opacity-100 py-1.5 sm:py-0 border-b border-emerald-900/60"
            : "max-h-0 h-0 opacity-0 py-0 border-0 border-none m-0 pointer-events-none"
        }`}
        style={
          !isDesktop && !isVisible
            ? {
                height: 0,
                minHeight: 0,
                maxHeight: 0,
                border: "none",
                borderWidth: 0,
                borderBottomWidth: 0,
                padding: 0,
                margin: 0,
                overflow: "hidden",
                lineHeight: 0,
                fontSize: 0,
              }
            : undefined
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Top Bar Row - Flex justify-between to keep left and right separated */}
          <div className="h-7 sm:h-9 flex items-center justify-between gap-3 w-full">
            {/* Left: Republic of the Philippines Header */}
            <div className="flex items-center gap-1.5 sm:gap-3 text-emerald-200/90 min-w-0 flex-1">
              <span className="inline-flex items-center gap-1.5 font-semibold text-amber-400 min-w-0 truncate">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span className="truncate">
                  <span className="sm:hidden">Republic of the Philippines</span>
                  <span className="hidden sm:inline">Republic of the Philippines • {schoolInfo.region}</span>
                </span>
              </span>
              <span className="hidden sm:inline text-emerald-700 shrink-0">|</span>
              <span className="hidden sm:inline truncate text-emerald-200/90">
                {schoolInfo.division} • School ID: <strong className="text-white font-mono">{schoolInfo.schoolId}</strong>
              </span>
            </div>

            {/* Right on Desktop: Location & Contact */}
            <div className="hidden sm:flex items-center gap-x-4 text-[11px] text-emerald-200/90 shrink-0 ml-auto">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{schoolInfo.location}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-100">
                <Phone className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{schoolInfo.contactNumber}</span>
              </span>
            </div>

            {/* Mobile Dropdown Arrow Button to Expand All Info (Positioned on far right) */}
            <button
              type="button"
              onClick={() => setTopRibbonExpanded((prev) => !prev)}
              aria-label="Toggle institutional information"
              className="sm:hidden inline-flex items-center justify-center p-1 rounded-md text-amber-400 hover:text-white bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 transition-colors shrink-0 cursor-pointer ml-auto"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  topRibbonExpanded ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
          </div>

          {/* Mobile Expanded Drawer: Division Office, School ID, Location, Hotline */}
          {topRibbonExpanded && (
            <div className="sm:hidden pt-2 pb-1.5 border-t border-emerald-900/60 mt-1 space-y-1.5 text-[11px] text-emerald-200/90 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center justify-between gap-2 text-amber-300 font-medium">
                <span className="truncate">{schoolInfo.region}</span>
                <span className="font-mono font-bold text-white bg-emerald-900/90 px-2 py-0.5 rounded text-[10px] shrink-0 border border-emerald-700/60">
                  ID: {schoolInfo.schoolId}
                </span>
              </div>
              <div className="text-emerald-200/90">
                <span>{schoolInfo.division}</span>
              </div>
              <div className="flex items-center justify-between gap-2 pt-0.5 text-[11px]">
                <div className="flex items-center gap-1.5 min-w-0 truncate">
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">{schoolInfo.location}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Phone className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="font-semibold text-white">{schoolInfo.contactNumber}</span>
                </div>
              </div>
            </div>
          )}
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
