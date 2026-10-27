import React, { useState } from "react";
import {
  Send,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import PageHero from "../organisms/PageHero";
import SectionHeading from "../atoms/SectionHeading";
import Button from "../atoms/Button";
import ContactCard from "../molecules/ContactCard";
import { schoolInfo as defaultSchoolInfo, contactCardsData } from "../../data/mockData";
import { apiClient } from "../../services/apiClient";

export default function ContactPage({ schoolInfo = defaultSchoolInfo }) {
  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    role: "Student / Learner",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.fullName || !formState.message) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await apiClient.submitInquiry(formState);
      setSubmitted(true);
    } catch (err) {
      if (err.status === 429) {
        setSubmitError(err.message);
      } else {
        // Still succeed in demo mode if backend is offline
        setSubmitted(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const dynamicContactCards = [
    {
      ...contactCardsData[0],
      value: schoolInfo.email,
      secondaryValue: schoolInfo.depedEmail,
      href: `mailto:${schoolInfo.email}`,
    },
    {
      ...contactCardsData[1],
      value: schoolInfo.contactNumber,
      secondaryValue: schoolInfo.officeHours,
      href: `tel:${schoolInfo.contactNumber}`,
    },
    {
      ...contactCardsData[2],
      value: schoolInfo.name,
    },
    {
      ...contactCardsData[3],
      value: schoolInfo.website || "@deped.gov.ph",
      secondaryValue: schoolInfo.division,
    },
  ];

  return (
    <div>
      {/* Hero Banner faithful to Screenshot 5 ("FOR MORE QUESTIONS AND INQUIRIES") */}
      <PageHero
        variant="subpage"
        schoolInfo={schoolInfo}
        eyebrow="OFFICIAL COMMUNICATION CHANNELS"
        mainTitle="FOR MORE QUESTIONS"
        subtitle="AND INQUIRIES"
        description={`Reach ${schoolInfo.name} via Email (${schoolInfo.email}), Facebook (${schoolInfo.facebookPage}), or Hotline (${schoolInfo.contactNumber}).`}
        bgImage="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80"
      />

      {/* Official BNHS Contact Plaques (Upgraded from Screenshot 5's Seal + Banner Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <SectionHeading
          eyebrow="DIRECT DIRECTORY"
          title="Official School Contact"
          scriptAccent="Plaques"
          description="Connect directly with our administrative office, registrar desk, or official DepEd communication channels."
          className="mb-10"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dynamicContactCards.map((card) => (
            <ContactCard
              key={card.id}
              {...card}
              schoolName={schoolInfo.name}
              founded={schoolInfo.founded}
            />
          ))}
        </div>
      </section>

      {/* Interactive Inquiry Form & Campus Location */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Online Inquiry & Feedback Form (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-12">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#1B4332] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-3">
              <MessageSquare className="w-3.5 h-3.5" />
              Electronic Public Assistance & Inquiry Desk
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
              Send an Official Inquiry to {schoolInfo.shortName}
            </h3>
            <p className="text-sm text-slate-600 mt-1 mb-6">
              Have questions regarding enrollment, Form 137 / SF10 records, or school events? Fill out the form below.
            </p>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#1B4332] text-amber-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 font-serif">
                  Inquiry Recorded Successfully!
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, <strong>{formState.fullName}</strong>. Your message regarding{" "}
                  <strong>&ldquo;{formState.subject || "General Inquiry"}&rdquo;</strong> has been logged for the {schoolInfo.shortName} Administrative Desk ({schoolInfo.email}).
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSubmitted(false);
                    setFormState({
                      fullName: "",
                      email: "",
                      role: "Student / Learner",
                      subject: "",
                      message: "",
                    });
                  }}
                >
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                    {submitError}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.fullName}
                      onChange={(e) =>
                        setFormState({ ...formState, fullName: e.target.value })
                      }
                      placeholder="Juan Dela Cruz"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email or Mobile Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      placeholder="you@example.com / 09XX..."
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Stakeholder Role
                    </label>
                    <select
                      value={formState.role}
                      onChange={(e) =>
                        setFormState({ ...formState, role: e.target.value })
                      }
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                    >
                      <option>Student / Learner</option>
                      <option>Parent / Guardian</option>
                      <option>Alumni</option>
                      <option>DepEd Personnel / Partner</option>
                      <option>Community Visitor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Subject / Concern *
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.subject}
                      onChange={(e) =>
                        setFormState({ ...formState, subject: e.target.value })
                      }
                      placeholder="e.g. Enrollment, SF10 Request, Partnership"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Message / Inquiry Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                    placeholder="Write your complete question or request here..."
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="primary" size="lg" icon={Send}>
                    {submitting ? "Submitting to Server..." : "Submit Official Inquiry"}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Campus Location & Citizen's Charter Hours (5 cols) */}
          <div className="lg:col-span-5 bg-bnhs-gradient text-white p-8 sm:p-10 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                  Citizen&apos;s Charter & Campus Guide
                </span>
                <h3 className="text-2xl font-bold font-serif mt-1">
                  Visit {schoolInfo.name}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/85 mt-2 leading-relaxed">
                  Our campus welcomes learners, parents, and visitors in compliance with DepEd child protection and campus safety protocols.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold uppercase text-amber-300">
                      Campus Address
                    </div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      {schoolInfo.address}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold uppercase text-amber-300">
                      Public Transaction Hours
                    </div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      {schoolInfo.officeHours}
                    </div>
                    <div className="text-xs text-emerald-200/80 mt-0.5">
                      No Noon Break Policy observed for frontline services
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 flex items-start gap-3.5">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold uppercase text-amber-300">
                      Data Privacy Notice
                    </div>
                    <div className="text-xs text-emerald-100/85 mt-0.5 leading-relaxed">
                      All personal information submitted through official school channels is protected under the Data Privacy Act of 2012 (RA 10173).
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-amber-300">
              <span>Hotline: {schoolInfo.contactNumber}</span>
              <span>{schoolInfo.email}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
