import React from "react";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";

/**
 * Reusable MainLayout Template
 * Wraps all BNHS pages with the sticky institutional Navbar, main content area,
 * and DepEd-compliant Footer.
 */
export default function MainLayout({
  children,
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  searchResults,
  onSelectSearchResult,
  schoolInfo,
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF8] text-slate-800">
      <Navbar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchResults={searchResults}
        onSelectSearchResult={onSelectSearchResult}
        schoolInfo={schoolInfo}
      />
      <main className="flex-1 pt-24 sm:pt-28 lg:pt-32">{children}</main>
      <Footer activeTab={activeTab} onSelectTab={onSelectTab} schoolInfo={schoolInfo} />
    </div>
  );
}
