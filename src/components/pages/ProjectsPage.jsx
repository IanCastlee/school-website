import React from "react";
import {
  TreePine,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import PageHero from "../organisms/PageHero";
import SectionHeading from "../atoms/SectionHeading";
import Badge from "../atoms/Badge";
import ProjectCard from "../molecules/ProjectCard";
import { schoolInfo as defaultSchoolInfo, schoolPlansProjectsData } from "../../data/mockData";

export default function ProjectsPage({
  projectsList = schoolPlansProjectsData.projectsList,
  schoolInfo = defaultSchoolInfo,
}) {
  const baseFeatured = schoolPlansProjectsData.featuredProject;
  const primaryProject = projectsList[0] || {};
  const featuredProject = {
    ...baseFeatured,
    title: primaryProject.title || baseFeatured.title,
    date: primaryProject.date || baseFeatured.date,
    status: primaryProject.status || baseFeatured.status,
    organization: primaryProject.lead
      ? `${primaryProject.lead} — ${schoolInfo.shortName}`
      : baseFeatured.organization,
  };
  const dynamicNarrative =
    primaryProject.description ||
    `On March 1, 2025, the Chemi-Calc Club of ${schoolInfo.name} (${schoolInfo.shortName}), a dedicated organization within the Senior High School's Science and Technology (Sci-Tech) strand, spearheaded the environmental advocacy initiative titled 'Planting Trees to Green the Earth: Going Easy Towards a Greener Output.' Working hand-in-hand with local community elders, forest stewards, and faculty mentors, student leaders trekked into the upland greenery to plant native tree seedlings, reinforcing watershed protection and climate resilience.`;

  return (
    <div>
      {/* Hero Banner faithful to Screenshot 3 ("STANDING TO ITS CAUSE") */}
      <PageHero
        variant="subpage"
        schoolInfo={schoolInfo}
        eyebrow="SCHOOL IMPROVEMENT PLAN (SIP) & STUDENT INITIATIVES"
        mainTitle={schoolPlansProjectsData.bannerTitle}
        subtitle={schoolPlansProjectsData.bannerSubtitle}
        description="Translating classroom learning into community action, environmental stewardship, and sustainable campus development."
        bgImage={featuredProject.image}
      />

      {/* Spotlight Feature: March 1, 2025 Chemi-Calc Club Tree Planting (Screenshot 3) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden">
          {/* Top Wide Banner Image with Overlay Caption */}
          <div className="relative h-72 sm:h-96 lg:h-[420px] bg-emerald-950 overflow-hidden">
            <img
              src={featuredProject.image}
              alt={featuredProject.title}
              className="w-full h-full object-cover object-center opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071a10] via-[#071a10]/40 to-transparent" />

            <div className="absolute top-5 left-5 right-5 flex flex-wrap items-center justify-between gap-2">
              <Badge variant="solidGold" icon={TreePine}>
                FLAGSHIP ENVIRONMENTAL INITIATIVE
              </Badge>
              <Badge variant="glass">{featuredProject.status}</Badge>
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-300 mb-1">
                {featuredProject.organization}
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-serif leading-tight">
                {featuredProject.title}
              </h2>
            </div>
          </div>

          {/* Story Content & Objectives */}
          <div className="p-7 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Narrative (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 pb-4 border-b border-slate-100">
                <span className="inline-flex items-center gap-1.5 text-[#1B4332]">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  {featuredProject.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#1B4332]" />
                  {featuredProject.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#1B4332]" />
                  {featuredProject.participants}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 font-serif">
                Project Narrative & Community Immersion
              </h3>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {dynamicNarrative}
              </p>

              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#1B4332] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                  <strong>Banner Theme:</strong> &ldquo;Planting Trees to Green the Earth — Going Easy Towards a Greener Output&rdquo; demonstrates how Senior High School Sci-Tech learners unite scientific inquiry with grassroots ecological care.
                </p>
              </div>
            </div>

            {/* Right Key Objectives Box (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 sm:p-7 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#1B4332]">
                  Key Program Objectives
                </span>
                <h4 className="text-lg font-bold text-slate-900 font-serif mt-1 mb-4">
                  Standing to its Cause for Mother Nature
                </h4>

                <ul className="space-y-3">
                  {featuredProject.objectives.map((obj, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#1B4332] shrink-0 mt-1" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-[#1B4332]">
                <span>Lead Unit: SHS Sci-Tech / Chemi-Calc Club</span>
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                  100% Accomplished
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Directory of School Plans & SIP Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <SectionHeading
          eyebrow="SCHOOL IMPROVEMENT PLAN (SIP) PORTFOLIO"
          title="Ongoing School Plans &"
          scriptAccent="Action Projects"
          description="Explore our school's continuous improvement programs across curriculum, athletics, campus sustainability, and ICT modernization."
          className="mb-10"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsList.map((proj) => (
            <ProjectCard key={proj.id} {...proj} />
          ))}
        </div>
      </section>
    </div>
  );
}
