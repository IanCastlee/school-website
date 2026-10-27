import React, { useState, useMemo, useEffect, useCallback } from "react";
import MainLayout from "./components/templates/MainLayout";
import HomePage from "./components/pages/HomePage";
import AccomplishmentsPage from "./components/pages/AccomplishmentsPage";
import ProjectsPage from "./components/pages/ProjectsPage";
import TransparencyPage from "./components/pages/TransparencyPage";
import ContactPage from "./components/pages/ContactPage";
import AdminDashboardPage from "./components/pages/AdminDashboardPage";
import { apiClient } from "./services/apiClient";
import {
  schoolInfo as fallbackSchoolInfo,
  accomplishmentsData,
  schoolPlansProjectsData,
  transparencyData,
  contactCardsData,
} from "./data/mockData";

const STORAGE_KEYS = {
  SETTINGS: "gnhs_portal_school_settings_v2",
  ACCOMPLISHMENTS: "gnhs_portal_accomplishments_v2",
  PROJECTS: "gnhs_portal_projects_v2",
  DOCS: "gnhs_portal_transparency_docs_v2",
  INQUIRIES: "gnhs_portal_inquiries_v2",
  LOCAL_OVERRIDE: "gnhs_portal_has_local_edits_v2",
};

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace("#", "").toLowerCase();
    const path = window.location.pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
    if (hash === "admin" || path === "admin") return "admin";
    return "home";
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Dynamic Portal State initialized from mockData + localStorage edits
  const [liveSchoolInfo, setLiveSchoolInfo] = useState(() => ({
    ...fallbackSchoolInfo,
    ...readStorage(STORAGE_KEYS.SETTINGS, fallbackSchoolInfo),
  }));

  const [liveAccomplishments, setLiveAccomplishments] = useState(() =>
    readStorage(STORAGE_KEYS.ACCOMPLISHMENTS, accomplishmentsData.featuredPillars)
  );

  const [liveProjects, setLiveProjects] = useState(() =>
    readStorage(STORAGE_KEYS.PROJECTS, schoolPlansProjectsData.projectsList)
  );

  const [liveDocs, setLiveDocs] = useState(() =>
    readStorage(STORAGE_KEYS.DOCS, transparencyData.documents)
  );

  // Listen to URL hash/popstate AND cross-tab localStorage changes
  useEffect(() => {
    const syncRoute = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      const path = window.location.pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
      if (hash === "admin" || path === "admin") {
        setActiveTab("admin");
      }
    };

    const syncStorageAcrossTabs = (e) => {
      if (!e.key || e.key === STORAGE_KEYS.SETTINGS) {
        const savedSettings = readStorage(STORAGE_KEYS.SETTINGS, null);
        if (savedSettings) {
          setLiveSchoolInfo((prev) => ({ ...prev, ...savedSettings }));
        }
      }
      if (!e.key || e.key === STORAGE_KEYS.ACCOMPLISHMENTS) {
        const savedAcc = readStorage(STORAGE_KEYS.ACCOMPLISHMENTS, null);
        if (Array.isArray(savedAcc)) setLiveAccomplishments(savedAcc);
      }
      if (!e.key || e.key === STORAGE_KEYS.PROJECTS) {
        const savedProj = readStorage(STORAGE_KEYS.PROJECTS, null);
        if (Array.isArray(savedProj)) setLiveProjects(savedProj);
      }
      if (!e.key || e.key === STORAGE_KEYS.DOCS) {
        const savedDocs = readStorage(STORAGE_KEYS.DOCS, null);
        if (Array.isArray(savedDocs)) setLiveDocs(savedDocs);
      }
    };

    window.addEventListener("hashchange", syncRoute);
    window.addEventListener("popstate", syncRoute);
    window.addEventListener("storage", syncStorageAcrossTabs);
    return () => {
      window.removeEventListener("hashchange", syncRoute);
      window.removeEventListener("popstate", syncRoute);
      window.removeEventListener("storage", syncStorageAcrossTabs);
    };
  }, []);

  // Update browser tab title whenever school name changes
  useEffect(() => {
    if (liveSchoolInfo?.name) {
      document.title = `${liveSchoolInfo.name} | Official Institutional Portal`;
    }
  }, [liveSchoolInfo?.name]);

  // Unified callback triggered immediately whenever Admin creates, updates, or deletes anything
  const handleAdminDataMutation = useCallback((mutationPayload = {}) => {
    if (mutationPayload.school_settings) {
      setLiveSchoolInfo((prev) => {
        const next = { ...prev, ...mutationPayload.school_settings };
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(next));
        return next;
      });
    }

    if (Array.isArray(mutationPayload.accomplishments)) {
      setLiveAccomplishments(mutationPayload.accomplishments);
      localStorage.setItem(
        STORAGE_KEYS.ACCOMPLISHMENTS,
        JSON.stringify(mutationPayload.accomplishments)
      );
    }

    if (Array.isArray(mutationPayload.school_projects)) {
      setLiveProjects(mutationPayload.school_projects);
      localStorage.setItem(
        STORAGE_KEYS.PROJECTS,
        JSON.stringify(mutationPayload.school_projects)
      );
    }

    if (Array.isArray(mutationPayload.transparency_documents)) {
      setLiveDocs(mutationPayload.transparency_documents);
      localStorage.setItem(
        STORAGE_KEYS.DOCS,
        JSON.stringify(mutationPayload.transparency_documents)
      );
    }
  }, []);

  // Build searchable index across all 5 pages
  const searchableIndex = useMemo(() => {
    const items = [
      {
        tabId: "home",
        section: "Home",
        title: `WELCOME TO ${(liveSchoolInfo.name || "").toUpperCase()}`,
        snippet: liveSchoolInfo.welcomeParagraph1,
      },
      ...liveAccomplishments.map((p) => ({
        tabId: "accomplishments",
        section: "Accomplishments & Achievements",
        title: p.title,
        snippet: p.description,
      })),
      {
        tabId: "projects",
        section: "School Plans / Projects",
        title: schoolPlansProjectsData.featuredProject.title,
        snippet: schoolPlansProjectsData.featuredProject.narrative,
      },
      ...liveProjects.map((proj) => ({
        tabId: "projects",
        section: "School Plans / Projects",
        title: proj.title,
        snippet: proj.description,
      })),
      {
        tabId: "transparency",
        section: "Transparency Page",
        title: "Annual Financial & Accountability Report (2023–2025)",
        snippet: transparencyData.introduction,
      },
      ...liveDocs.map((doc) => ({
        tabId: "transparency",
        section: "Transparency Page",
        title: doc.title,
        snippet: `${doc.code} • ${doc.category} • ${doc.status}`,
      })),
      ...contactCardsData.map((c) => ({
        tabId: "contact",
        section: "Contact Information",
        title: `${c.label}: ${c.value}`,
        snippet: c.description,
      })),
    ];
    return items;
  }, [liveSchoolInfo, liveAccomplishments, liveProjects, liveDocs]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return searchableIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.snippet.toLowerCase().includes(q) ||
        item.section.toLowerCase().includes(q)
    );
  }, [searchQuery, searchableIndex]);

  const handleSelectSearchResult = (tabId) => {
    setActiveTab(tabId);
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Render Admin Dashboard when activeTab === "admin"
  if (activeTab === "admin") {
    return (
      <AdminDashboardPage
        initialSchoolSettings={liveSchoolInfo}
        initialAccomplishments={liveAccomplishments}
        initialProjects={liveProjects}
        initialDocs={liveDocs}
        onExitAdmin={() => {
          if (window.location.hash === "#admin" || window.location.pathname.includes("/admin")) {
            window.history.pushState({}, "", "/");
          }
          setActiveTab("home");
        }}
        onPortalDataUpdated={handleAdminDataMutation}
      />
    );
  }

  const renderPage = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomePage
            onNavigate={setActiveTab}
            schoolInfo={liveSchoolInfo}
            accomplishmentsList={liveAccomplishments}
            projectsList={liveProjects}
          />
        );
      case "accomplishments":
        return (
          <AccomplishmentsPage
            items={liveAccomplishments}
            schoolInfo={liveSchoolInfo}
          />
        );
      case "projects":
        return (
          <ProjectsPage
            projectsList={liveProjects}
            schoolInfo={liveSchoolInfo}
          />
        );
      case "transparency":
        return (
          <TransparencyPage
            documents={liveDocs}
            schoolInfo={liveSchoolInfo}
          />
        );
      case "contact":
        return <ContactPage schoolInfo={liveSchoolInfo} />;
      default:
        return (
          <HomePage
            onNavigate={setActiveTab}
            schoolInfo={liveSchoolInfo}
            accomplishmentsList={liveAccomplishments}
            projectsList={liveProjects}
          />
        );
    }
  };

  return (
    <MainLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchResults={searchResults}
      onSelectSearchResult={handleSelectSearchResult}
      schoolInfo={liveSchoolInfo}
    >
      {renderPage()}
    </MainLayout>
  );
}
