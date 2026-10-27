import React, { useState } from "react";
import {
  ShieldCheck,
  PieChart,
  Building2,
  FileCheck2,
  CheckCircle2,
} from "lucide-react";
import PageHero from "../organisms/PageHero";
import SectionHeading from "../atoms/SectionHeading";
import Badge from "../atoms/Badge";
import TransparencyDocRow from "../molecules/TransparencyDocRow";
import { schoolInfo as defaultSchoolInfo, transparencyData } from "../../data/mockData";

export default function TransparencyPage({
  documents = transparencyData.documents,
  schoolInfo = defaultSchoolInfo,
}) {
  const [downloadToast, setDownloadToast] = useState(null);

  const handleDownload = (docTitle) => {
    setDownloadToast(`Opening official public disclosure copy: "${docTitle}"`);
    setTimeout(() => setDownloadToast(null), 4000);
  };

  const dynamicSchoolProfile = [
    { label: "Official School Name", value: `${schoolInfo.name} (${schoolInfo.shortName})` },
    { label: "School ID", value: schoolInfo.schoolId },
    { label: "Address", value: schoolInfo.address },
    { label: "Institution Type", value: "Public Secondary School (JHS & SHS)" },
    { label: "Mother Agency", value: `Department of Education (DepEd) — ${schoolInfo.division}` },
    { label: "Governance Framework", value: "School-Based Management (SBM) & Transparency Seal Compliant" },
  ];

  const dynamicIntroduction = `${schoolInfo.name} (${schoolInfo.shortName}) is committed to fostering a culture of transparency and accountability in all its operations. This report aims to provide our valued stakeholders – students, parents, faculty, staff, and community members – with clear and accessible information regarding the school's financial standing, operational activities, and overall performance during the calendar year. We believe that open communication and shared understanding are essential for building trust and fostering a collaborative environment that supports student success.`;

  // Dynamically compute MOOE financial totals from the database documents when available
  const totalAllocatedNum = documents.reduce(
    (sum, d) => sum + (Number(d.allocated_amount) || 0),
    0
  );
  const totalUtilizedNum = documents.reduce(
    (sum, d) => sum + (Number(d.utilized_amount) || 0),
    0
  );
  const dynamicTotalMOOE =
    totalAllocatedNum > 0
      ? `₱ ${totalAllocatedNum.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : transparencyData.financialSummary.totalAnnualMOOE;
  const dynamicUtilizationRate =
    totalAllocatedNum > 0
      ? `${((totalUtilizedNum / totalAllocatedNum) * 100).toFixed(1)}%`
      : transparencyData.financialSummary.utilizationRate;

  return (
    <div>
      {/* Hero Banner faithful to Screenshot 4 */}
      <PageHero
        variant="subpage"
        schoolInfo={schoolInfo}
        eyebrow="DEPED TRANSPARENCY SEAL & ACCOUNTABILITY"
        mainTitle={transparencyData.bannerTitle}
        subtitle={(schoolInfo.name || transparencyData.bannerSchool).toUpperCase()}
        scriptTitle={transparencyData.bannerScript}
        description={`Official Institutional Performance & Financial Accountability Report ${transparencyData.reportingPeriod}`}
        bgImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80"
      />

      {/* Toast Notification for Document Preview */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#1B4332] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-400/50 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{downloadToast}</span>
        </div>
      )}

      {/* Section I (Introduction) & Section II (School Profile) from Screenshot 4 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* I. Introduction (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <Badge variant="emerald" icon={ShieldCheck}>
                  SECTION I • INTRODUCTION
                </Badge>
                <span className="text-xs font-bold text-slate-500">
                  {transparencyData.reportingPeriod}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif mb-4">
                I. Introduction — Culture of Transparency & Accountability
              </h2>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {dynamicIntroduction}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60">
                <div className="text-xs font-bold text-emerald-800 uppercase">
                  Annual MOOE Budget
                </div>
                <div className="text-xl font-extrabold text-slate-900 font-serif mt-1">
                  {dynamicTotalMOOE}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60">
                <div className="text-xs font-bold text-emerald-800 uppercase">
                  Utilization Rate
                </div>
                <div className="text-xl font-extrabold text-[#1B4332] font-serif mt-1">
                  {dynamicUtilizationRate}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70">
                <div className="text-xs font-bold text-amber-900 uppercase">
                  Audit Standing
                </div>
                <div className="text-sm font-extrabold text-slate-900 mt-1.5">
                  {transparencyData.financialSummary.auditStatus}
                </div>
              </div>
            </div>
          </div>

          {/* II. School Profile (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm">
            <Badge variant="gold" icon={Building2} className="mb-4">
              SECTION II • SCHOOL PROFILE
            </Badge>

            <h2 className="text-2xl font-bold text-slate-900 font-serif mb-5">
              II. School Profile & Basic Information
            </h2>

            <dl className="divide-y divide-slate-100">
              {dynamicSchoolProfile.map((item, idx) => (
                <div key={idx} className="py-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {item.label}
                  </dt>
                  <dd className="text-sm font-semibold text-slate-900 sm:text-right">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Section III: Financial Standing & MOOE Allocation Breakdown */}
      <section className="bg-emerald-950/5 border-y border-emerald-900/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="SECTION III • FINANCIAL STANDING & OPERATIONS"
            title="MOOE Fund Allocation &"
            scriptAccent="Utilization"
            description="Clear breakdown of Maintenance and Other Operating Expenses (MOOE) supporting learners, teachers, and campus operations."
            className="mb-10"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {transparencyData.financialSummary.allocations.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="text-xs font-bold uppercase text-emerald-700">
                      {item.status}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 font-serif">
                      {item.category}
                    </h3>
                  </div>
                  <span className="text-lg font-extrabold text-[#1B4332] font-serif shrink-0">
                    {item.amount}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                  {item.details}
                </p>

                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#1B4332] to-amber-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="mt-1.5 text-right text-xs font-bold text-slate-500">
                  {item.percentage}% of Annual Allocation
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section IV: Public Disclosure Documents */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <SectionHeading
          eyebrow="PUBLIC DISCLOSURE REGISTRY"
          title="Downloadable Reports &"
          scriptAccent="Statements"
          description="Access verified liquidation reports, Annual Procurement Plans (APP), and School Report Cards (SRC)."
          className="mb-8"
        />

        <div className="space-y-4">
          {documents.map((doc) => (
            <TransparencyDocRow
              key={doc.id}
              {...doc}
              onDownload={handleDownload}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
