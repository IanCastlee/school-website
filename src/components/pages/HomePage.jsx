import React from "react";
import {
  ArrowRight,
  BookOpen,
  Trophy,
  TreePine,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import PageHero from "../organisms/PageHero";
import SectionHeading from "../atoms/SectionHeading";
import Button from "../atoms/Button";
import Badge from "../atoms/Badge";
import SchoolSeal from "../atoms/SchoolSeal";
import StatCard from "../molecules/StatCard";
import AchievementCard from "../molecules/AchievementCard";
import {
  schoolInfo as defaultSchoolInfo,
  quickStats,
  academicTracks,
  accomplishmentsData as defaultAccomplishmentsData,
  schoolPlansProjectsData as defaultProjectsData,
} from "../../data/mockData";

export default function HomePage({
  onNavigate,
  schoolInfo = defaultSchoolInfo,
  accomplishmentsList = defaultAccomplishmentsData.featuredPillars,
  projectsList = defaultProjectsData.projectsList,
}) {
  const featuredProject = projectsList[0] || defaultProjectsData.featuredProject;
  const welcomeTitle = `WELCOME TO ${(schoolInfo.name || "GREENFIELD NATIONAL HIGH SCHOOL").toUpperCase()}`;
  const welcomeParagraph1 = `Welcome to ${schoolInfo.name} (${schoolInfo.shortName}), an institution that stands as a cornerstone of education and a vibrant hub of opportunity within the heart of our municipality. As you cross our threshold, whether as a new student embarking on an exciting chapter, a returning member of our cherished community, or a visitor eager to experience the spirit of ${schoolInfo.shortName}, know that you are entering a space meticulously crafted to nurture potential, ignite passions, and shape futures.`;
  const welcomeParagraph2 = `More than simply a collection of classrooms and buildings, ${schoolInfo.shortName} is a dynamic ecosystem of learning, a place where the pursuit of knowledge is intertwined with the development of character, the cultivation of skills, and the fostering of lifelong connections. We are a community united by a shared commitment to excellence, a deep-seated belief in the transformative power of education, and a collective desire to make a positive and lasting impact on the world around us.`;

  return (
    <div>
      {/* Hero Banner with Official Seal & Laurel Wreath */}
      <PageHero
        variant="home"
        schoolInfo={schoolInfo}
        description={schoolInfo.motto}
        actions={
          <>
            <Button
              variant="gold"
              size="lg"
              icon={Trophy}
              onClick={() => onNavigate("accomplishments")}
            >
              Explore Student Achievements
            </Button>
            <Button
              variant="outlineLight"
              size="lg"
              icon={ShieldCheck}
              onClick={() => onNavigate("transparency")}
            >
              Transparency Seal & Report
            </Button>
          </>
        }
      />

      {/* Quick Institutional Metrics Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickStats.map((stat) => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </div>
      </section>

      {/* Welcome to Bulusan National High School — Exact Text from Screenshot 1 in Editorial Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Editorial Content (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
            <Badge variant="emerald" icon={Sparkles} className="w-fit mb-4">
              INSTITUTIONAL CHARTER & MESSAGE
            </Badge>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif tracking-tight leading-tight">
              {welcomeTitle}
            </h2>

            <div className="h-1 w-20 bg-gradient-to-r from-[#1B4332] to-amber-500 rounded-full my-5" />

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p className="first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:text-[#1B4332] first-letter:mr-2 first-letter:float-left">
                {welcomeParagraph1}
              </p>
              <p>{welcomeParagraph2}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <SchoolSeal
                  size="xs"
                  schoolName={schoolInfo.name}
                  founded={schoolInfo.founded}
                />
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    The {schoolInfo.shortName} Academic Community
                  </div>
                  <div className="text-xs text-slate-500">
                    {schoolInfo.location} • Founded {schoolInfo.founded}
                  </div>
                </div>
              </div>

              <Button
                variant="subtle"
                size="sm"
                icon={ArrowRight}
                onClick={() => onNavigate("contact")}
              >
                Connect With Us
              </Button>
            </div>
          </div>

          {/* Right Visual Showcase (5 cols) */}
          <div className="lg:col-span-5 bg-bnhs-gradient text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
              <SchoolSeal size="xl" showWreath={true} />
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                Core Institutional Pillars
              </span>
              <h3 className="text-2xl font-bold font-serif mt-2">
                A Dynamic Ecosystem of Learning & Character
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 leading-relaxed">
                Where the pursuit of knowledge is intertwined with character development, skill cultivation, and community service.
              </p>
            </div>

            <div className="space-y-4 my-8">
              {[
                {
                  title: "Academic & Sci-Tech Excellence",
                  desc: "Rigorous Junior & Senior High School instruction led by passionate DepEd educators.",
                },
                {
                  title: "Athletic & Cultural Mastery",
                  desc: "Home of champions in Sepak Takraw, Boxing, and the celebrated Drum & Lyre Corps.",
                },
                {
                  title: "Environmental Stewardship",
                  desc: "Active reforestation and ecological initiatives anchored by the SHS Chemi-Calc Club.",
                },
                {
                  title: "Transparent Governance",
                  desc: "Full accountability and open stakeholder communication across all school operations.",
                },
              ].map((pillar, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{pillar.title}</h4>
                    <p className="text-xs text-emerald-100/80 mt-0.5">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-xs text-amber-300/90 font-semibold flex items-center justify-between pt-4 border-t border-white/15">
              <span>{schoolInfo.division}</span>
              <span>{schoolInfo.region}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Programs & Curricular Offerings */}
      <section className="bg-emerald-950/5 border-y border-emerald-900/10 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="K TO 12 CURRICULUM"
            title="Academic Offerings &"
            scriptAccent="Learning Pathways"
            description={`${schoolInfo.name} empowers learners across both Junior High School and Senior High School tracks.`}
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {academicTracks.map((track) => (
              <div
                key={track.id}
                className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-800/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-emerald-900/10 text-[#1B4332] flex items-center justify-center mb-4">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
                    {track.level}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 font-serif mt-1 mb-3">
                    {track.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {track.description}
                  </p>
                </div>

                <ul className="space-y-2 mt-6 pt-5 border-t border-slate-100">
                  {track.highlights.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#1B4332] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spotlight Preview: Bleeding Green Accomplishments & Chemi-Calc Reforestation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <SectionHeading
            eyebrow="SCHOLARS BLEEDING GREEN"
            title="Recent Triumphs &"
            scriptAccent="Community Impact"
            description={`Discover how ${schoolInfo.shortName} students excel in provincial sports, cultural arts, and environmental action.`}
          />
          <Button
            variant="outline"
            icon={ArrowRight}
            onClick={() => onNavigate("accomplishments")}
          >
            View All Achievements
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {accomplishmentsList.slice(0, 2).map((pillar) => (
            <AchievementCard key={pillar.id} {...pillar} />
          ))}
        </div>

        {/* Highlight Banner for School Plans / Chemi-Calc Tree Planting */}
        <div className="mt-10 rounded-3xl bg-bnhs-gradient text-white p-8 sm:p-10 shadow-xl border border-emerald-700/40 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <Badge variant="solidGold" icon={TreePine}>
                FEATURED SCHOOL PROJECT
              </Badge>
              <span className="text-xs font-semibold text-emerald-200">
                {featuredProject.date || "March 1, 2025"} • {featuredProject.lead || "SHS Sci-Tech"}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif">
              {featuredProject.title}
            </h3>
            <p className="text-sm text-emerald-100/85 leading-relaxed line-clamp-2">
              {featuredProject.description || defaultProjectsData.featuredProject.narrative}
            </p>
          </div>

          <div className="shrink-0">
            <Button
              variant="gold"
              size="lg"
              icon={ArrowRight}
              onClick={() => onNavigate("projects")}
            >
              Read Full Project Story
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
