import React, { useState } from "react";
import { Trophy, Medal, Music, Award } from "lucide-react";
import PageHero from "../organisms/PageHero";
import SectionHeading from "../atoms/SectionHeading";
import SchoolSeal from "../atoms/SchoolSeal";
import AchievementCard from "../molecules/AchievementCard";
import { schoolInfo as defaultSchoolInfo, accomplishmentsData } from "../../data/mockData";

export default function AccomplishmentsPage({
  items = accomplishmentsData.featuredPillars,
  schoolInfo = defaultSchoolInfo,
}) {
  const [selectedCategory, setSelectedCategory] = useState("All Achievements");

  const filteredPillars =
    selectedCategory === "All Achievements"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const dynamicIntro1 = `${schoolInfo.name} (${schoolInfo.shortName}) stands as a notable educational institution within its community. While committed to providing quality secondary education, ${schoolInfo.shortName} has also garnered recognition for its participation and achievements in diverse extracurricular activities. Among these, the school has demonstrated consistent engagement and success in amateur boxing, the Drum and Lyre Corps (DLC), and sepak takraw. This overview explores the school's involvement in these three distinct areas, setting the stage for a closer look at ${schoolInfo.shortName}'s broader educational environment.`;
  const dynamicIntro2 = `${schoolInfo.name} is more than just a school; it is a community of learners, educators, and supporters who are united by a shared commitment to excellence and a belief in the transformative power of education. The school's success in boxing, the DLC, and sepak takraw is a testament to its holistic educational philosophy and its dedication to nurturing the multifaceted potential of its students. As ${schoolInfo.shortName} continues to empower future generations, it will undoubtedly remain a beacon of hope and opportunity for the youth of our community and beyond.`;

  return (
    <div>
      {/* Hero Banner faithful to "BLEEDING GREEN" */}
      <PageHero
        variant="subpage"
        schoolInfo={schoolInfo}
        eyebrow="STUDENT ACCOMPLISHMENTS & ACHIEVEMENTS"
        scriptTitle={accomplishmentsData.bannerTitle}
        mainTitle={accomplishmentsData.bannerSubtitle}
        subtitle="Championing Excellence in Boxing, Sepak Takraw, Drum & Lyre Corps, and Academics"
        bgImage="https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=80"
      />

      {/* Exact Introductory Narrative from Screenshot 2 with Watermark Seal */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        <div className="relative bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-md overflow-hidden">
          {/* Subtle Watermark Seal in center-right like Screenshot 2 */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none">
            <SchoolSeal size="xl" showWreath={true} />
          </div>

          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#1B4332] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              <Trophy className="w-4 h-4 text-amber-600" />
              Holistic Extracurricular & Athletic Philosophy
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
              Pride of Our School: Boxing, Drum & Lyre Corps (DLC), and Sepak Takraw
            </h2>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              {dynamicIntro1}
            </p>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              {dynamicIntro2}
            </p>

            {/* Three Highlight Badges matching the 3 areas mentioned in the text */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60">
                <div className="w-10 h-10 rounded-xl bg-[#1B4332] text-amber-400 flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-emerald-800">
                    Court Dominance
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    Sepak Takraw Champions
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                  <Medal className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-amber-900">
                    Ring Grit & Heart
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    Amateur Boxing Contenders
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60">
                <div className="w-10 h-10 rounded-xl bg-[#1B4332] text-amber-400 flex items-center justify-center shrink-0">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-emerald-800">
                    Rhythm & Pageantry
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    Drum & Lyre Corps (DLC)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Filter & Achievement Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <SectionHeading
            eyebrow="HALL OF HONOR"
            title="Featured School"
            scriptAccent="Victories"
            description="Filter through our school's championship titles, cultural exhibitions, and academic honors."
          />

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {accomplishmentsData.categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-[#1B4332] text-white shadow-sm"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPillars.map((pillar) => (
            <AchievementCard key={pillar.id} {...pillar} />
          ))}
        </div>
      </section>
    </div>
  );
}
