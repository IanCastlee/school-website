import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  ShieldCheck,
  Clock,
  ArrowUp,
  ExternalLink,
} from "lucide-react";
import SchoolSeal from "../atoms/SchoolSeal";
import { schoolInfo as defaultSchoolInfo, navigationLinks } from "../../data/mockData";

function FacebookIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

/**
 * Reusable Professional Institutional Footer Organism
 * Designed specifically for Bulusan National High School (BNHS) with DepEd
 * Transparency Seal compliance, Quick Navigation, Official Contact Channels,
 * and Scroll-to-Top action.
 */
export default function Footer({ activeTab, onSelectTab, schoolInfo = defaultSchoolInfo }) {
  const handleNav = (tabId) => {
    onSelectTab(tabId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#081c12] text-emerald-100/85 border-t-4 border-amber-500 relative overflow-hidden">
      {/* Subtle Top Gold/Green Gradient Glow */}
      <div className="  absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-48 bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Upper Call-to-Action Strip */}
      <div className="border-b border-emerald-900/80 bg-[#0c2619]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left flex-col sm:flex-row">
            <SchoolSeal
              size="md"
              showWreath={false}
              schoolName={schoolInfo.name}
              founded={schoolInfo.founded}
            />
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                Scholars Bleeding Green • Standing to its Cause
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-serif mt-0.5">
                Have Questions or Official School Inquiries?
              </h3>
              <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
                Reach out to the {schoolInfo.shortName} Registrar and Administration Desk during official DepEd hours.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleNav("contact")}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-colors cursor-pointer shadow-md"
            >
              Contact Inquiry Desk
            </button>
            <button
              type="button"
              onClick={() => handleNav("transparency")}
              className="px-5 py-2.5 rounded-xl bg-emerald-900/70 hover:bg-emerald-800 text-white border border-emerald-700/60 font-semibold text-sm transition-colors cursor-pointer"
            >
              Transparency Seal
            </button>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Column 1: Institutional Profile (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <SchoolSeal
                size="sm"
                schoolName={schoolInfo.name}
                founded={schoolInfo.founded}
              />
              <div>
                <h4 className="text-lg font-bold text-white font-serif leading-tight">
                  {schoolInfo.name}
                </h4>
                <p className="text-xs text-amber-400 font-semibold">
                  Founded {schoolInfo.founded} • School ID: {schoolInfo.schoolId}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
              An institution that stands as a cornerstone of secondary education and a vibrant hub of opportunity within the heart of our community—nurturing potential, igniting passions, and shaping futures.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{schoolInfo.region} • {schoolInfo.division}</span>
            </div>
          </div>

          {/* Column 2: Portal Navigation (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Portal Sections
            </h5>
            <ul className="space-y-2 text-sm">
              {navigationLinks.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleNav(item.id)}
                    className={`inline-flex items-center gap-2 transition-colors cursor-pointer ${
                      activeTab === item.id
                        ? "text-amber-300 font-bold"
                        : "text-emerald-100/80 hover:text-white"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{item.fullLabel || item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Programs & Extracurriculars (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Student Pride
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-100/80">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav("accomplishments")}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  Sepak Takraw Varsity
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav("accomplishments")}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  Amateur Boxing Team
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav("accomplishments")}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  Drum & Lyre Corps (DLC)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav("projects")}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  SHS Sci-Tech & Chemi-Calc
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav("transparency")}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  MOOE & SBM Disclosures
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Contact Directory (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Official Contact Information
            </h5>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{schoolInfo.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href={`mailto:${schoolInfo.email}`}
                  className="hover:text-amber-300 transition-colors break-all"
                >
                  {schoolInfo.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href={`tel:${schoolInfo.contactNumber}`}
                  className="hover:text-amber-300 transition-colors font-semibold text-white"
                >
                  {schoolInfo.contactNumber}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <FacebookIcon className="w-4 h-4 text-amber-400 shrink-0" />
                <span>FB: {schoolInfo.facebookPage}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Website: {schoolInfo.website}</span>
              </li>
              <li className="flex items-center gap-2.5 text-emerald-300/80 text-xs pt-1">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{schoolInfo.officeHours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Republic of the Philippines Bar */}
      <div className="border-t border-emerald-900/90 bg-[#05120b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/70">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span>
              © {new Date().getFullYear()} <strong className="text-white">{schoolInfo.name}</strong>. All Rights Reserved.
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1 text-amber-400/90">
              Republic of the Philippines — Department of Education
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800/70 transition-colors cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>
    </footer>
  );
}
