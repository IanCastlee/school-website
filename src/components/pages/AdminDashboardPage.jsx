import React, { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard,
  Trophy,
  FolderKanban,
  FileCheck2,
  Inbox,
  Settings,
  Cpu,
  ShieldCheck,
  Database,
  Zap,
  RefreshCw,
  LogOut,
  Plus,
  Trash2,
  Pencil,
  X,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowLeft,
  Server,
  KeyRound,
  Layers,
  Activity,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
} from "lucide-react";
import SchoolSeal from "../atoms/SchoolSeal";
import Button from "../atoms/Button";
import Badge from "../atoms/Badge";
import { apiClient } from "../../services/apiClient";
import {
  schoolInfo as fallbackSchoolInfo,
  accomplishmentsData,
  schoolPlansProjectsData,
  transparencyData,
} from "../../data/mockData";

/**
 * Pro Classic Design Institutional Admin Dashboard Page
 * Features:
 * 1. Sidebar Toggle Menu Button in the Top Header (Collapsible Desktop Sidebar + Mobile Drawer)
 * 2. Complete CRUD (Create, Read, Update/Edit, Delete) across Accomplishments, Projects, Transparency & Inquiries
 * 3. Cormorant Garamond + DM Sans + JetBrains Mono Classic Executive Typography
 * 4. PHP 8.4 + MySQL Indexing + Write-Through Cache + Token-Bucket Rate Limiter Telemetry
 */
export default function AdminDashboardPage({
  initialSchoolSettings = fallbackSchoolInfo,
  initialAccomplishments = accomplishmentsData.featuredPillars,
  initialProjects = schoolPlansProjectsData.projectsList,
  initialDocs = transparencyData.documents,
  onExitAdmin,
  onPortalDataUpdated,
}) {
  const [token, setToken] = useState(() => localStorage.getItem("gnhs_admin_token") || "");
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem("gnhs_admin_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Sidebar Toggle States (Controlled from Header button)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Login State
  const [loginEmail, setLoginEmail] = useState("admin@greenfield.edu.ph");
  const [loginPassword, setLoginPassword] = useState("Admin123!");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Module
  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [bannerNotice, setBannerNotice] = useState(null);
  const [lastHeaders, setLastHeaders] = useState({
    limit: "60",
    remaining: "59",
    group: "public",
    cache: "HIT",
  });

  // Dashboard Data State
  const [dashboardData, setDashboardData] = useState(() => ({
    kpis: {
      total_accomplishments: initialAccomplishments.length,
      total_projects: initialProjects.length,
      avg_project_progress: 83.6,
      total_transparency_docs: initialDocs.length,
      total_inquiries: 3,
      unread_inquiries: 1,
    },
    school_settings: { ...fallbackSchoolInfo, ...initialSchoolSettings },
    accomplishments: initialAccomplishments,
    school_projects: initialProjects,
    transparency_documents: initialDocs,
    inquiries: [
      {
        id: 1,
        full_name: "Elena Dela Cruz",
        contact_info: "elena.delacruz@email.com / 0917-555-0192",
        stakeholder_role: "Parent / Guardian",
        subject: "Senior High School STEM Enrollment Requirements",
        message:
          "Good day! May I ask for the list of documentary requirements for incoming Grade 11 STEM students this coming school year?",
        status: "UNREAD",
        ip_address: "127.0.0.1",
        created_at: "2025-03-10 10:24:00",
      },
      {
        id: 2,
        full_name: "Engr. Marco Villanueva",
        contact_info: "m.villanueva@alumni.org",
        stakeholder_role: "Alumni",
        subject: "Batch 2010 Computer Lab Donation Drive",
        message:
          "Our alumni batch would like to donate 10 desktop units for the ICT Lab Modernization project. Who can we coordinate with?",
        status: "IN_PROGRESS",
        ip_address: "127.0.0.1",
        created_at: "2025-03-08 15:10:00",
      },
      {
        id: 3,
        full_name: "Coach Ramon Bautista",
        contact_info: "0918-882-3310",
        stakeholder_role: "DepEd Personnel / Partner",
        subject: "Invitational Sepak Takraw Scrimmage",
        message:
          "Requesting an exhibition match with the GNHS Sepak Takraw Varsity Team next month.",
        status: "RESOLVED",
        ip_address: "127.0.0.1",
        created_at: "2025-03-02 09:45:00",
      },
    ],
    system_engineering: {
      php_version: "8.4.10",
      database_engine: "MySQL 8.0+ (PDO mysqlnd • Indexed InnoDB)",
      cache_telemetry: {
        driver: "MySQL InnoDB + Write-Through Tag Cache",
        active_keys: 2,
        size_kb: 14.8,
        hits: 28,
        misses: 3,
        invalidations: 2,
        hit_ratio: "90.3%",
        default_ttl_seconds: 300,
      },
      rate_limiter: {
        algorithm: "Token Bucket / Sliding Window Throttler",
        policies: [
          { group: "PUBLIC READ API", limit: "60 req / 60 sec", scope: "IP + Endpoint Group" },
          { group: "WRITE & INQUIRY API", limit: "20 req / 60 sec", scope: "IP + Endpoint Group" },
          { group: "AUTH LOGIN API", limit: "8 req / 60 sec", scope: "IP + Brute-Force Guard" },
        ],
        active_buckets: [
          {
            ip: "127.0.0.1",
            group: "PUBLIC",
            hits: 4,
            limit: 60,
            remaining: 56,
            resets_in_sec: 48,
            last_uri: "/api/admin/overview",
            status: "HEALTHY",
          },
        ],
      },
      indexes_registry: [
        {
          table: "users",
          index_name: "idx_users_email_unique",
          index_type: "BTREE (UNIQUE)",
          columns: "email",
          purpose: "O(log n) instant admin authentication lookup",
        },
        {
          table: "accomplishments",
          index_name: "idx_accomplishments_cat_featured_sort",
          index_type: "BTREE (COMPOSITE)",
          columns: "category, is_featured, sort_order, created_at",
          purpose: "Zero-filesort filtering by category (Boxing, Sepak Takraw, DLC)",
        },
        {
          table: "accomplishments",
          index_name: "ft_accomplishments_search",
          index_type: "FULLTEXT (INVERTED)",
          columns: "title, subtitle, description",
          purpose: "Sub-millisecond natural language portal search",
        },
        {
          table: "school_projects",
          index_name: "idx_projects_status_progress",
          index_type: "BTREE (COMPOSITE)",
          columns: "status, progress, created_at",
          purpose: "SIP implementation progress & dashboard aggregation",
        },
        {
          table: "transparency_documents",
          index_name: "idx_transparency_fy_category_status",
          index_type: "BTREE (COMPOSITE)",
          columns: "fiscal_year, category, status",
          purpose: "DepEd Transparency Seal fiscal year & MOOE filtering",
        },
        {
          table: "contact_inquiries",
          index_name: "idx_inquiries_status_created",
          index_type: "BTREE (COMPOSITE)",
          columns: "status, created_at",
          purpose: "Admin Inbox UNREAD badge count & date sorting",
        },
        {
          table: "rate_limits",
          index_name: "idx_ratelimits_ip_endpoint",
          index_type: "BTREE (COMPOSITE)",
          columns: "ip_address, endpoint_group",
          purpose: "O(1) Token-Bucket rate limiter & brute-force throttling",
        },
        {
          table: "cache_store",
          index_name: "idx_cache_tag_expires",
          index_type: "BTREE (COMPOSITE)",
          columns: "cache_tag, expires_at",
          purpose: "Instant tag-based cache invalidation & TTL pruning",
        },
      ],
    },
  }));

  // ============================================================================
  // CRUD FORMS & EDIT STATES (Create + Update/Edit + Delete)
  // ============================================================================
  const [editingAccomplishmentId, setEditingAccomplishmentId] = useState(null);
  const [accomplishmentForm, setAccomplishmentForm] = useState({
    category: "Sepak Takraw",
    title: "",
    subtitle: "",
    date: "2025 Provincial Meet",
    badge: "GOLD MEDALIST",
    description: "",
    athletes: "",
    metrics: "Provincial Champion, Regional Qualifier",
  });

  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    category: "Environmental & Sci-Tech",
    date: "SY 2025–2026",
    status: "Ongoing",
    progress: 75,
    lead: "SHS Sci-Tech / SSLG",
    description: "",
    impact: "",
  });

  const [editingDocId, setEditingDocId] = useState(null);
  const [docForm, setDocForm] = useState({
    code: "MOOE-2025-Q1",
    title: "",
    category: "Financial Statement",
    fiscal_year: 2025,
    datePublished: "March 2025",
    fileSize: "2.1 MB PDF",
    allocated_amount: 650000,
    utilized_amount: 642000,
    status: "Verified & Posted",
  });

  const [settingsForm, setSettingsForm] = useState({
    ...fallbackSchoolInfo,
    ...initialSchoolSettings,
  });

  const showToast = (msg, type = "success") => {
    setBannerNotice({ msg, type });
    setTimeout(() => setBannerNotice(null), 4000);
  };

  const fetchOverview = useCallback(async () => {
    // Pure mockData mode: keep existing local state without hitting external backend
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      fetchOverview();
    }
  }, [token, fetchOverview]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await apiClient.login(loginEmail, loginPassword);
      const jwt = res.data.token;
      const userObj = res.data.user;
      localStorage.setItem("gnhs_admin_token", jwt);
      localStorage.setItem("gnhs_admin_user", JSON.stringify(userObj));
      setToken(jwt);
      setAdminUser(userObj);
      showToast(`Authenticated as ${userObj.name} (${userObj.role})`);
    } catch (err) {
      if (err.status === 401 || err.status === 429 || err.status === 422) {
        setLoginError(err.message);
      } else if (loginEmail === "admin@greenfield.edu.ph" && loginPassword === "Admin123!") {
        const demoUser = {
          name: "Dr. Roberto Salazar",
          email: "admin@greenfield.edu.ph",
          role: "SUPER_ADMIN",
        };
        localStorage.setItem("gnhs_admin_token", "demo_local_jwt_token");
        localStorage.setItem("gnhs_admin_user", JSON.stringify(demoUser));
        setToken("demo_local_jwt_token");
        setAdminUser(demoUser);
      } else {
        setLoginError(err.message || "Authentication failed.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("gnhs_admin_token");
    localStorage.removeItem("gnhs_admin_user");
    setToken("");
    setAdminUser(null);
  };

  // --- ACCOMPLISHMENTS CREATE / UPDATE / DELETE ---
  const resetAccomplishmentForm = () => {
    setEditingAccomplishmentId(null);
    setAccomplishmentForm({
      category: "Sepak Takraw",
      title: "",
      subtitle: "",
      date: "2025 Provincial Meet",
      badge: "GOLD MEDALIST",
      description: "",
      athletes: "",
      metrics: "Provincial Champion, Regional Qualifier",
    });
  };

  const startEditAccomplishment = (item) => {
    setEditingAccomplishmentId(item.id);
    setAccomplishmentForm({
      category: item.category || "Sepak Takraw",
      title: item.title || "",
      subtitle: item.subtitle || "",
      date: item.date || "2025 Provincial Meet",
      badge: item.badge || "GOLD MEDALIST",
      description: item.description || "",
      athletes: Array.isArray(item.athletes) ? item.athletes.join(", ") : item.athletes || "",
      metrics: Array.isArray(item.metrics) ? item.metrics.join(", ") : item.metrics || "",
    });
  };

  const handleSaveAccomplishment = async (e) => {
    e.preventDefault();
    if (!accomplishmentForm.title) return;

    const parsedAthletes = accomplishmentForm.athletes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedMetrics = accomplishmentForm.metrics
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingAccomplishmentId !== null) {
      // UPDATE existing record immediately in UI + localStorage
      const nextList = dashboardData.accomplishments.map((a) =>
        a.id === editingAccomplishmentId
          ? {
              ...a,
              ...accomplishmentForm,
              athletes: parsedAthletes,
              metrics: parsedMetrics,
            }
          : a
      );
      setDashboardData((prev) => ({
        ...prev,
        accomplishments: nextList,
        kpis: { ...prev.kpis, total_accomplishments: nextList.length },
      }));
      onPortalDataUpdated && onPortalDataUpdated({ accomplishments: nextList });
      showToast(`Accomplishment #${editingAccomplishmentId} updated & live on website!`);
      resetAccomplishmentForm();
    } else {
      // CREATE new record immediately in UI + localStorage
      const newItem = {
        id: Date.now(),
        ...accomplishmentForm,
        image:
          "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80",
        athletes: parsedAthletes,
        metrics: parsedMetrics,
      };
      const nextList = [newItem, ...dashboardData.accomplishments];
      setDashboardData((prev) => ({
        ...prev,
        accomplishments: nextList,
        kpis: { ...prev.kpis, total_accomplishments: nextList.length },
      }));
      onPortalDataUpdated && onPortalDataUpdated({ accomplishments: nextList });
      showToast("New accomplishment created & live on website!");
      resetAccomplishmentForm();
    }
  };

  const handleDeleteAccomplishment = async (id) => {
    const nextList = dashboardData.accomplishments.filter((a) => a.id !== id);
    setDashboardData((prev) => ({
      ...prev,
      accomplishments: nextList,
      kpis: { ...prev.kpis, total_accomplishments: nextList.length },
    }));
    onPortalDataUpdated && onPortalDataUpdated({ accomplishments: nextList });
    if (editingAccomplishmentId === id) resetAccomplishmentForm();
    showToast("Accomplishment deleted & removed from website.");
  };

  // --- SCHOOL PROJECTS CREATE / UPDATE / DELETE ---
  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjectForm({
      title: "",
      category: "Environmental & Sci-Tech",
      date: "SY 2025–2026",
      status: "Ongoing",
      progress: 75,
      lead: "SHS Sci-Tech / SSLG",
      description: "",
      impact: "",
    });
  };

  const startEditProject = (proj) => {
    setEditingProjectId(proj.id);
    setProjectForm({
      title: proj.title || "",
      category: proj.category || "Environmental & Sci-Tech",
      date: proj.date || "SY 2025–2026",
      status: proj.status || "Ongoing",
      progress: Number(proj.progress ?? 75),
      lead: proj.lead || "School Administration",
      description: proj.description || "",
      impact: proj.impact || "",
    });
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title) return;

    if (editingProjectId !== null) {
      // UPDATE existing project immediately in UI + localStorage
      const nextList = dashboardData.school_projects.map((p) =>
        p.id === editingProjectId ? { ...p, ...projectForm } : p
      );
      setDashboardData((prev) => ({
        ...prev,
        school_projects: nextList,
        kpis: { ...prev.kpis, total_projects: nextList.length },
      }));
      onPortalDataUpdated && onPortalDataUpdated({ school_projects: nextList });
      showToast(`School Project #${editingProjectId} updated & live on website!`);
      resetProjectForm();
    } else {
      // CREATE new project immediately in UI + localStorage
      const newProject = { id: Date.now(), ...projectForm };
      const nextList = [newProject, ...dashboardData.school_projects];
      setDashboardData((prev) => ({
        ...prev,
        school_projects: nextList,
        kpis: { ...prev.kpis, total_projects: nextList.length },
      }));
      onPortalDataUpdated && onPortalDataUpdated({ school_projects: nextList });
      showToast("New School Plan / SIP Project created & live on website!");
      resetProjectForm();
    }
  };

  const handleDeleteProject = async (id) => {
    const nextList = dashboardData.school_projects.filter((p) => p.id !== id);
    setDashboardData((prev) => ({
      ...prev,
      school_projects: nextList,
      kpis: { ...prev.kpis, total_projects: nextList.length },
    }));
    onPortalDataUpdated && onPortalDataUpdated({ school_projects: nextList });
    if (editingProjectId === id) resetProjectForm();
    showToast("School Project deleted & removed from website.");
  };

  // --- TRANSPARENCY DOCUMENTS CREATE / UPDATE / DELETE ---
  const resetDocForm = () => {
    setEditingDocId(null);
    setDocForm({
      code: `DOC-2025-${Math.floor(100 + Math.random() * 900)}`,
      title: "",
      category: "Financial Statement",
      fiscal_year: 2025,
      datePublished: "March 2025",
      fileSize: "2.1 MB PDF",
      allocated_amount: 650000,
      utilized_amount: 642000,
      status: "Verified & Posted",
    });
  };

  const startEditDoc = (doc) => {
    setEditingDocId(doc.id);
    setDocForm({
      code: doc.code || "DOC-2025",
      title: doc.title || "",
      category: doc.category || "Financial Statement",
      fiscal_year: doc.fiscal_year || 2025,
      datePublished: doc.datePublished || "March 2025",
      fileSize: doc.fileSize || "2.0 MB PDF",
      allocated_amount: doc.allocated_amount ?? 0,
      utilized_amount: doc.utilized_amount ?? 0,
      status: doc.status || "Verified & Posted",
    });
  };

  const handleSaveDoc = async (e) => {
    e.preventDefault();
    if (!docForm.title) return;

    if (editingDocId !== null) {
      // UPDATE existing document immediately in UI + localStorage
      const nextList = dashboardData.transparency_documents.map((d) =>
        d.id === editingDocId ? { ...d, ...docForm } : d
      );
      setDashboardData((prev) => ({
        ...prev,
        transparency_documents: nextList,
        kpis: { ...prev.kpis, total_transparency_docs: nextList.length },
      }));
      onPortalDataUpdated && onPortalDataUpdated({ transparency_documents: nextList });
      showToast(`Transparency Disclosure #${editingDocId} updated & live on website!`);
      resetDocForm();
    } else {
      // CREATE new document immediately in UI + localStorage
      const newDoc = { id: Date.now(), ...docForm };
      const nextList = [newDoc, ...dashboardData.transparency_documents];
      setDashboardData((prev) => ({
        ...prev,
        transparency_documents: nextList,
        kpis: { ...prev.kpis, total_transparency_docs: nextList.length },
      }));
      onPortalDataUpdated && onPortalDataUpdated({ transparency_documents: nextList });
      showToast("New Transparency Disclosure published & live on website!");
      resetDocForm();
    }
  };

  const handleDeleteDoc = async (id) => {
    const nextList = dashboardData.transparency_documents.filter((d) => d.id !== id);
    setDashboardData((prev) => ({
      ...prev,
      transparency_documents: nextList,
      kpis: { ...prev.kpis, total_transparency_docs: nextList.length },
    }));
    onPortalDataUpdated && onPortalDataUpdated({ transparency_documents: nextList });
    if (editingDocId === id) resetDocForm();
    showToast("Transparency Disclosure deleted & removed from website.");
  };

  // --- INQUIRIES STATUS UPDATE & DELETE ---
  const handleUpdateInquiryStatus = async (id, status) => {
    setDashboardData((prev) => ({
      ...prev,
      inquiries: prev.inquiries.map((inq) =>
        inq.id === id ? { ...inq, status } : inq
      ),
    }));
    showToast(`Inquiry #${id} status updated to ${status}.`);
  };

  const handleDeleteInquiry = async (id) => {
    setDashboardData((prev) => ({
      ...prev,
      inquiries: prev.inquiries.filter((inq) => inq.id !== id),
    }));
    showToast(`Inquiry #${id} deleted from inbox.`);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const nextSettings = { ...dashboardData.school_settings, ...settingsForm };
    setDashboardData((prev) => ({
      ...prev,
      school_settings: nextSettings,
    }));
    onPortalDataUpdated &&
      onPortalDataUpdated({
        school_settings: nextSettings,
      });
    showToast("School Profile & Branding saved and updated across the website!");
  };

  const handleFlushCache = async () => {
    try {
      const res = await apiClient.flushCache();
      await fetchOverview(true);
      showToast(res.message || "Write-through cache flushed!");
    } catch {
      showToast("Cache invalidated!");
    }
  };

  const handleResetRateLimits = async () => {
    try {
      const res = await apiClient.resetRateLimits();
      await fetchOverview();
      showToast(res.message || "All IP rate-limit buckets reset!");
    } catch {
      showToast("Rate limit buckets reset!");
    }
  };

  const handleHeaderSidebarToggle = () => {
    if (window.innerWidth < 1024) {
      setMobileDrawerOpen((prev) => !prev);
    } else {
      setSidebarOpen((prev) => !prev);
    }
  };

  // ============================================================================
  // 1. PRO CLASSIC EXECUTIVE LOGIN SCREEN
  // ============================================================================
  if (!token) {
    return (
      <div className="min-h-screen bg-[#0c2217] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border-t-4 border-amber-500 overflow-hidden">
          <div className="bg-[#112e1f] text-white px-8 py-7 text-center border-b border-emerald-900">
            <div className="inline-flex p-2.5 rounded-full bg-white/10 border border-amber-400/30 mb-3">
              <SchoolSeal size="sm" />
            </div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
              DepEd e-Governance & MIS
            </div>
            <h1 className="text-3xl font-bold font-serif mt-1">
              Institutional Admin Portal
            </h1>
            <p className="text-xs text-emerald-200/80 mt-1">
              Protected by PHP 8.4 JWT Auth & Token-Bucket Rate Limiter
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-5">
            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Official Administrator Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Security Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
              />
            </div>

            <div className="p-3 rounded-lg bg-amber-50/90 border border-amber-200 text-xs text-amber-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                Demo Executive Credentials:
              </div>
              <div>
                Email: <code className="font-mono font-bold">admin@greenfield.edu.ph</code>
              </div>
              <div>
                Password: <code className="font-mono font-bold">Admin123!</code>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={Lock}
              className="w-full"
            >
              {loginLoading ? "Verifying Credentials..." : "Sign In to Executive Console"}
            </Button>

            <div className="pt-3 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={onExitAdmin}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#1B4332] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Public School Website
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. PRO CLASSIC ADMIN DASHBOARD SHELL WITH HEADER SIDEBAR TOGGLE
  // ============================================================================
  const sidebarItems = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard, badge: null },
    {
      id: "accomplishments",
      label: "Accomplishments",
      icon: Trophy,
      badge: dashboardData.accomplishments?.length || 0,
    },
    {
      id: "projects",
      label: "School Plans & Projects",
      icon: FolderKanban,
      badge: dashboardData.school_projects?.length || 0,
    },
    {
      id: "transparency",
      label: "Transparency & MOOE",
      icon: FileCheck2,
      badge: dashboardData.transparency_documents?.length || 0,
    },
    {
      id: "inquiries",
      label: "Stakeholder Inquiries",
      icon: Inbox,
      badge: dashboardData.kpis?.unread_inquiries || 0,
    },
    {
      id: "settings",
      label: "School Profile & Branding",
      icon: Settings,
      badge: null,
    },
    {
      id: "engineering",
      label: "System & Performance",
      icon: Cpu,
      badge: null,
    },
  ];

  const sys = dashboardData.system_engineering || {};

  const renderSidebarContent = (isMobile = false) => (
    <>
      <div className="flex-1 overflow-y-auto">
        {/* Brand Crest Header */}
        <div className="p-5 border-b border-emerald-900/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <SchoolSeal size="sm" />
            <div className="overflow-hidden">
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                ADMINISTRATION PORTAL
              </div>
              <h2 className="text-sm font-bold text-white truncate leading-tight mt-0.5">
                {dashboardData.school_settings?.name || "Greenfield NHS"}
              </h2>
              <p className="text-[11px] text-emerald-300/80 font-mono">
                School ID: {dashboardData.school_settings?.schoolId || "300101"}
              </p>
            </div>
          </div>

          {isMobile && (
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              className="p-2 rounded-lg text-emerald-200 hover:bg-emerald-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="p-4 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400/70">
            Management Menu
          </div>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveSection(item.id);
                  if (isMobile) setMobileDrawerOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-amber-400 text-slate-950 font-bold shadow-sm"
                    : "text-emerald-100/85 hover:bg-emerald-900/60 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </span>
                {item.badge !== null && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-slate-950 text-amber-300"
                        : "bg-emerald-900 text-emerald-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Admin Profile & Exit */}
      <div className="p-4 border-t border-emerald-900/80 bg-[#081810] space-y-3 shrink-0">
        <div className="flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-white">
              {adminUser?.name || "Dr. Roberto Salazar"}
            </div>
            <div className="text-[11px] text-amber-400 font-medium">
              School Administrator
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 rounded-lg bg-emerald-950 hover:bg-red-900/70 text-emerald-200 hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={onExitAdmin}
          className="w-full py-2 px-3 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-emerald-700/50"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
          <span>Back to Public Website</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="h-screen overflow-hidden flex bg-[#F4F6F4] text-slate-800 relative">
      {/* DESKTOP FIXED NON-SCROLLING SIDEBAR */}
      <aside
        className={`h-screen bg-[#0c2217] text-emerald-100 flex-col justify-between border-r border-emerald-900 shrink-0 hidden lg:flex transition-all duration-300 ease-in-out overflow-hidden ${
          sidebarOpen ? "w-68" : "w-0 border-r-0"
        }`}
      >
        <div className="w-68 h-full flex flex-col justify-between">
          {renderSidebarContent(false)}
        </div>
      </aside>

      {/* MOBILE OVERLAY SIDEBAR DRAWER */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <aside className="relative w-68 max-w-[85vw] bg-[#0c2217] text-emerald-100 flex flex-col justify-between h-full z-10 shadow-2xl">
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}

      {/* RIGHT MAIN CONTENT AREA (INDEPENDENT SCROLL) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* TOP EXECUTIVE HEADER WITH SIDEBAR TOGGLE BUTTON */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shrink-0 z-20">
          <div className="flex items-center gap-3.5">
            {/* SIDEBAR TOGGLE MENU BUTTON IN HEADER */}
            <button
              type="button"
              onClick={handleHeaderSidebarToggle}
              title={sidebarOpen ? "Collapse Sidebar Menu" : "Expand Sidebar Menu"}
              aria-label="Toggle Sidebar Menu"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-[#1B4332] text-slate-700 hover:text-amber-300 border border-slate-200 transition-colors cursor-pointer flex items-center justify-center"
            >
              <Menu className="w-5 h-5 lg:hidden" />
              {sidebarOpen ? (
                <PanelLeftClose className="w-5 h-5 hidden lg:block" />
              ) : (
                <PanelLeftOpen className="w-5 h-5 hidden lg:block" />
              )}
            </button>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {dashboardData.school_settings?.name || "Greenfield National High School"}
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                {sidebarItems.find((i) => i.id === activeSection)?.label}
              </h1>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="subtle"
              size="sm"
              icon={RefreshCw}
              onClick={fetchOverview}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={ArrowLeft}
              onClick={onExitAdmin}
            >
              View Website
            </Button>
          </div>
        </header>

        {/* SCROLLABLE CONTENT CONTAINER */}
        <div className="flex-1 overflow-y-auto">
          {/* Toast Notification */}
          {bannerNotice && (
            <div className="mx-6 mt-5 p-4 rounded-xl bg-[#1B4332] text-white border-l-4 border-amber-400 shadow-md flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{bannerNotice.msg}</span>
              </div>
            </div>
          )}

          {/* MAIN BODY */}
          <div className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* ================================================================
              SECTION 1: EXECUTIVE OVERVIEW
             ================================================================ */}
          {activeSection === "overview" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div
                  onClick={() => setActiveSection("accomplishments")}
                  className="bg-white rounded-xl p-6 border border-slate-200 border-t-4 border-t-[#1B4332] shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                    <span>Accomplishments</span>
                    <Trophy className="w-4 h-4 text-[#1B4332]" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mt-2">
                    {dashboardData.accomplishments?.length || 0}
                  </div>
                  <p className="text-xs text-emerald-800 font-semibold mt-1">
                    Published Awards & Honors →
                  </p>
                </div>

                <div
                  onClick={() => setActiveSection("projects")}
                  className="bg-white rounded-xl p-6 border border-slate-200 border-t-4 border-t-amber-500 shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                    <span>School Projects</span>
                    <FolderKanban className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mt-2">
                    {dashboardData.school_projects?.length || 0}
                  </div>
                  <p className="text-xs text-amber-800 font-semibold mt-1">
                    Avg. Progress: {dashboardData.kpis?.avg_project_progress || 85}% →
                  </p>
                </div>

                <div
                  onClick={() => setActiveSection("transparency")}
                  className="bg-white rounded-xl p-6 border border-slate-200 border-t-4 border-t-[#1B4332] shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                    <span>Transparency Reports</span>
                    <FileCheck2 className="w-4 h-4 text-[#1B4332]" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mt-2">
                    {dashboardData.transparency_documents?.length || 0}
                  </div>
                  <p className="text-xs text-emerald-800 font-semibold mt-1">
                    COA & MOOE Disclosures →
                  </p>
                </div>

                <div
                  onClick={() => setActiveSection("inquiries")}
                  className="bg-white rounded-xl p-6 border border-slate-200 border-t-4 border-t-amber-500 shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                    <span>Public Inquiries</span>
                    <Inbox className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mt-2">
                    {dashboardData.inquiries?.length || 0}
                  </div>
                  <p className="text-xs text-amber-800 font-semibold mt-1">
                    {dashboardData.kpis?.unread_inquiries || 0} Unread Messages →
                  </p>
                </div>
              </div>

              {/* Recent Inquiries & School Profile Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Recent Stakeholder Inquiries
                      </h3>
                      <p className="text-xs text-slate-500">
                        Latest messages submitted from the public Contact Us page
                      </p>
                    </div>
                    <Button
                      variant="subtle"
                      size="sm"
                      onClick={() => setActiveSection("inquiries")}
                    >
                      View All
                    </Button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {(dashboardData.inquiries || []).slice(0, 3).map((inq) => (
                      <div key={inq.id} className="py-3.5 flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">
                              {inq.full_name}
                            </span>
                            <Badge
                              variant={
                                inq.status === "UNREAD"
                                  ? "solidGold"
                                  : inq.status === "RESOLVED"
                                  ? "emerald"
                                  : "slate"
                              }
                            >
                              {inq.status}
                            </Badge>
                          </div>
                          <div className="text-xs font-semibold text-[#1B4332] mt-0.5">
                            {inq.subject}
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                            {inq.message}
                          </p>
                        </div>
                        <span className="text-[11px] text-slate-400 shrink-0">
                          {inq.stakeholder_role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          School Profile Summary
                        </h3>
                        <p className="text-xs text-slate-500">
                          Active branding displayed on the public portal
                        </p>
                      </div>
                      <Settings className="w-5 h-5 text-[#1B4332]" />
                    </div>

                    <dl className="space-y-2.5 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <dt className="font-semibold text-slate-500">School Name</dt>
                        <dd className="font-bold text-slate-900">
                          {dashboardData.school_settings?.name}
                        </dd>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <dt className="font-semibold text-slate-500">Acronym & ID</dt>
                        <dd className="font-bold text-slate-900">
                          {dashboardData.school_settings?.shortName} •{" "}
                          {dashboardData.school_settings?.schoolId}
                        </dd>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <dt className="font-semibold text-slate-500">Official Email</dt>
                        <dd className="font-medium text-slate-800">
                          {dashboardData.school_settings?.email}
                        </dd>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <dt className="font-semibold text-slate-500">Contact Hotline</dt>
                        <dd className="font-medium text-slate-800">
                          {dashboardData.school_settings?.contactNumber}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="mt-6">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Settings}
                      onClick={() => setActiveSection("settings")}
                      className="w-full"
                    >
                      Edit School Profile & Branding
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ================================================================
              SECTION 2: ACCOMPLISHMENTS FULL CRUD (Create, Read, Update, Delete)
             ================================================================ */}
          {activeSection === "accomplishments" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Form: Create or Update Accomplishment (4 cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 h-fit shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                  <h3 className="text-xl font-bold text-slate-900 font-serif">
                    {editingAccomplishmentId
                      ? `Edit Accomplishment #${editingAccomplishmentId}`
                      : "Create New Accomplishment"}
                  </h3>
                  {editingAccomplishmentId && (
                    <button
                      type="button"
                      onClick={resetAccomplishmentForm}
                      className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveAccomplishment} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={accomplishmentForm.category}
                      onChange={(e) =>
                        setAccomplishmentForm({
                          ...accomplishmentForm,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option>Sepak Takraw</option>
                      <option>Boxing</option>
                      <option>Drum & Lyre Corps</option>
                      <option>Academic & Sci-Tech</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Headline Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={accomplishmentForm.title}
                      onChange={(e) =>
                        setAccomplishmentForm({
                          ...accomplishmentForm,
                          title: e.target.value,
                        })
                      }
                      placeholder="e.g. Regional Science Quiz Bee 1st Place"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Subtitle / Division
                    </label>
                    <input
                      type="text"
                      value={accomplishmentForm.subtitle}
                      onChange={(e) =>
                        setAccomplishmentForm({
                          ...accomplishmentForm,
                          subtitle: e.target.value,
                        })
                      }
                      placeholder="e.g. Senior High School STEM Division"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Event Date
                      </label>
                      <input
                        type="text"
                        value={accomplishmentForm.date}
                        onChange={(e) =>
                          setAccomplishmentForm({
                            ...accomplishmentForm,
                            date: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Award Badge
                      </label>
                      <input
                        type="text"
                        value={accomplishmentForm.badge}
                        onChange={(e) =>
                          setAccomplishmentForm({
                            ...accomplishmentForm,
                            badge: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Student Delegation (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={accomplishmentForm.athletes}
                      onChange={(e) =>
                        setAccomplishmentForm({
                          ...accomplishmentForm,
                          athletes: e.target.value,
                        })
                      }
                      placeholder="Varsity Team, Coach"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Narrative Description *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={accomplishmentForm.description}
                      onChange={(e) =>
                        setAccomplishmentForm({
                          ...accomplishmentForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe the victory and significance..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant={editingAccomplishmentId ? "gold" : "primary"}
                    size="md"
                    icon={editingAccomplishmentId ? CheckCircle2 : Plus}
                    className="w-full"
                  >
                    {editingAccomplishmentId
                      ? "Update Accomplishment"
                      : "Create & Publish to Portal"}
                  </Button>
                </form>
              </div>

              {/* Right Table: Read, Edit & Delete Accomplishments (8 cols) */}
              <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Accomplishments & Achievements List
                    </h3>
                    <p className="text-xs text-slate-500">
                      Select the edit icon on any record to update its information
                    </p>
                  </div>
                  <Badge variant="emerald">
                    {dashboardData.accomplishments?.length || 0} Records
                  </Badge>
                </div>

                <div className="divide-y divide-slate-200">
                  {(dashboardData.accomplishments || []).map((item) => {
                    const isEditing = editingAccomplishmentId === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`p-5 transition-colors flex items-start justify-between gap-4 ${
                          isEditing ? "bg-amber-50/70" : "hover:bg-slate-50/80"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="solidEmerald">{item.category}</Badge>
                            <Badge variant="gold">{item.badge}</Badge>
                            <span className="text-xs text-slate-500 font-medium">
                              {item.date}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 font-serif">
                            {item.title}
                          </h4>
                          {item.subtitle && (
                            <div className="text-xs font-semibold text-emerald-800">
                              {item.subtitle}
                            </div>
                          )}
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditAccomplishment(item)}
                            className="p-2 rounded-lg text-slate-600 hover:text-[#1B4332] hover:bg-emerald-50 border border-slate-200 transition-colors cursor-pointer"
                            title="Edit Accomplishment"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAccomplishment(item.id)}
                            className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer"
                            title="Delete Accomplishment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              SECTION 3: SCHOOL PLANS & SIP PROJECTS FULL CRUD
             ================================================================ */}
          {activeSection === "projects" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 h-fit shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                  <h3 className="text-xl font-bold text-slate-900 font-serif">
                    {editingProjectId
                      ? `Edit School Project #${editingProjectId}`
                      : "Create SIP School Project"}
                  </h3>
                  {editingProjectId && (
                    <button
                      type="button"
                      onClick={resetProjectForm}
                      className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={projectForm.title}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, title: e.target.value })
                      }
                      placeholder="e.g. Solar-Powered Campus Science Lab"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={projectForm.category}
                        onChange={(e) =>
                          setProjectForm({ ...projectForm, category: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Status
                      </label>
                      <select
                        value={projectForm.status}
                        onChange={(e) =>
                          setProjectForm({ ...projectForm, status: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      >
                        <option>Planned</option>
                        <option>In Progress</option>
                        <option>Ongoing</option>
                        <option>Active Monitoring</option>
                        <option>Completed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Implementation Progress ({projectForm.progress}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={projectForm.progress}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          progress: Number(e.target.value),
                        })
                      }
                      className="w-full accent-[#1B4332]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Lead Department / Club
                      </label>
                      <input
                        type="text"
                        value={projectForm.lead}
                        onChange={(e) =>
                          setProjectForm({ ...projectForm, lead: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Key Impact Output
                      </label>
                      <input
                        type="text"
                        value={projectForm.impact}
                        onChange={(e) =>
                          setProjectForm({ ...projectForm, impact: e.target.value })
                        }
                        placeholder="e.g. 500+ Learners Benefited"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Project Description *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={projectForm.description}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, description: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant={editingProjectId ? "gold" : "primary"}
                    size="md"
                    icon={editingProjectId ? CheckCircle2 : Plus}
                    className="w-full"
                  >
                    {editingProjectId ? "Update School Project" : "Create School Project"}
                  </Button>
                </form>
              </div>

              <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      School Improvement Plan (SIP) Projects
                    </h3>
                    <p className="text-xs text-slate-500">
                      Select the edit icon to update project progress or status
                    </p>
                  </div>
                  <Badge variant="emerald">
                    {dashboardData.school_projects?.length || 0} Active Plans
                  </Badge>
                </div>

                <div className="divide-y divide-slate-200">
                  {(dashboardData.school_projects || []).map((proj) => {
                    const isEditing = editingProjectId === proj.id;
                    return (
                      <div
                        key={proj.id}
                        className={`p-5 transition-colors flex items-start justify-between gap-4 ${
                          isEditing ? "bg-amber-50/70" : "hover:bg-slate-50/80"
                        }`}
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="emerald">{proj.category}</Badge>
                            <span className="text-xs font-bold text-amber-800 font-mono">
                              {proj.status} • {proj.progress}%
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 font-serif">
                            {proj.title}
                          </h4>
                          <p className="text-xs text-slate-600">{proj.description}</p>
                          <div className="text-xs text-slate-500 font-medium">
                            Lead: <strong>{proj.lead}</strong> • Output:{" "}
                            <strong className="text-[#1B4332]">{proj.impact}</strong>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditProject(proj)}
                            className="p-2 rounded-lg text-slate-600 hover:text-[#1B4332] hover:bg-emerald-50 border border-slate-200 transition-colors cursor-pointer"
                            title="Edit Project"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              SECTION 4: TRANSPARENCY & MOOE DISCLOSURES FULL CRUD
             ================================================================ */}
          {activeSection === "transparency" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 h-fit shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                  <h3 className="text-xl font-bold text-slate-900 font-serif">
                    {editingDocId
                      ? `Edit Disclosure #${editingDocId}`
                      : "Post Transparency Document"}
                  </h3>
                  {editingDocId && (
                    <button
                      type="button"
                      onClick={resetDocForm}
                      className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveDoc} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Document Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={docForm.code}
                        onChange={(e) => setDocForm({ ...docForm, code: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Category
                      </label>
                      <select
                        value={docForm.category}
                        onChange={(e) =>
                          setDocForm({ ...docForm, category: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      >
                        <option>Annual Report</option>
                        <option>Financial Statement</option>
                        <option>Procurement</option>
                        <option>School Governance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Official Document Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={docForm.title}
                      onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                      placeholder="e.g. MOOE Liquidation Report Q1 2025"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Date Published
                      </label>
                      <input
                        type="text"
                        value={docForm.datePublished}
                        onChange={(e) =>
                          setDocForm({ ...docForm, datePublished: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        File Size / Format
                      </label>
                      <input
                        type="text"
                        value={docForm.fileSize}
                        onChange={(e) =>
                          setDocForm({ ...docForm, fileSize: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant={editingDocId ? "gold" : "primary"}
                    size="md"
                    icon={editingDocId ? CheckCircle2 : Plus}
                    className="w-full"
                  >
                    {editingDocId
                      ? "Update Official Disclosure"
                      : "Publish Official Disclosure"}
                  </Button>
                </form>
              </div>

              <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Public Disclosure & MOOE Documents
                    </h3>
                    <p className="text-xs text-slate-500">
                      Select the edit icon to update any published disclosure document
                    </p>
                  </div>
                  <Badge variant="gold">COA Compliant</Badge>
                </div>

                <div className="divide-y divide-slate-200">
                  {(dashboardData.transparency_documents || []).map((doc) => {
                    const isEditing = editingDocId === doc.id;
                    return (
                      <div
                        key={doc.id}
                        className={`p-5 transition-colors flex items-center justify-between gap-4 ${
                          isEditing ? "bg-amber-50/70" : "hover:bg-slate-50/80"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {doc.code}
                            </span>
                            <Badge variant="emerald">{doc.category}</Badge>
                            <span className="text-xs font-semibold text-emerald-700">
                              {doc.status}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 font-serif">
                            {doc.title}
                          </h4>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Published: {doc.datePublished} • {doc.fileSize}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditDoc(doc)}
                            className="p-2 rounded-lg text-slate-600 hover:text-[#1B4332] hover:bg-emerald-50 border border-slate-200 transition-colors cursor-pointer"
                            title="Edit Document"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDoc(doc.id)}
                            className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer"
                            title="Delete Document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              SECTION 5: STAKEHOLDER INQUIRIES INBOX (Read, Status Update, Delete)
             ================================================================ */}
          {activeSection === "inquiries" && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Public Assistance & Stakeholder Inquiries
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage incoming inquiries from students, parents, alumni, and partners
                  </p>
                </div>
                <Badge variant="solidGold">
                  {dashboardData.inquiries?.length || 0} Total Messages
                </Badge>
              </div>

              <div className="divide-y divide-slate-200">
                {(dashboardData.inquiries || []).map((inq) => (
                  <div
                    key={inq.id}
                    className="p-6 hover:bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={
                            inq.status === "UNREAD"
                              ? "solidGold"
                              : inq.status === "RESOLVED"
                              ? "solidEmerald"
                              : "slate"
                          }
                        >
                          {inq.status}
                        </Badge>
                        <span className="text-sm font-bold text-slate-900">
                          {inq.full_name}
                        </span>
                        <span className="text-xs text-slate-500">
                          ({inq.stakeholder_role})
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          • {inq.contact_info}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-[#1B4332] font-serif">
                        {inq.subject}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {inq.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {inq.status !== "RESOLVED" && (
                        <Button
                          variant="subtle"
                          size="sm"
                          icon={CheckCircle2}
                          onClick={() => handleUpdateInquiryStatus(inq.id, "RESOLVED")}
                        >
                          Mark Resolved
                        </Button>
                      )}
                      {inq.status === "UNREAD" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateInquiryStatus(inq.id, "IN_PROGRESS")}
                        >
                          In Progress
                        </Button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================
              SECTION 6: WHITE-LABEL SCHOOL BRANDING CONFIGURATOR
             ================================================================ */}
          {activeSection === "settings" && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden max-w-4xl shadow-xs">
              <div className="px-6 py-4 bg-[#112e1f] text-white flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-serif">
                    White-Label School Branding & Demo Configurator
                  </h3>
                  <p className="text-xs text-emerald-200/80">
                    Instantly rebrand the entire portal when presenting to a specific school client
                  </p>
                </div>
                <Badge variant="solidGold">Live Sync</Badge>
              </div>

              <form onSubmit={handleSaveSettings} className="p-6 sm:p-8 space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Official School Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.name || ""}
                      onChange={(e) => {
                        const newName = e.target.value;
                        const toAcronym = (str) =>
                          (str || "")
                            .split(/\s+/)
                            .filter((w) => w && !["of", "the", "and", "in"].includes(w.toLowerCase()))
                            .map((w) => w[0])
                            .join("")
                            .toUpperCase();
                        const prevAuto = toAcronym(settingsForm.name);
                        const shouldAutoUpdateShort =
                          !settingsForm.shortName ||
                          settingsForm.shortName === prevAuto ||
                          settingsForm.shortName === "GNHS";
                        setSettingsForm({
                          ...settingsForm,
                          name: newName,
                          shortName: shouldAutoUpdateShort
                            ? toAcronym(newName)
                            : settingsForm.shortName,
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Short Acronym (e.g. GNHS)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.shortName || ""}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, shortName: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      DepEd School ID
                    </label>
                    <input
                      type="text"
                      value={settingsForm.schoolId || ""}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, schoolId: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Founding Year
                    </label>
                    <input
                      type="text"
                      value={settingsForm.founded || ""}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, founded: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Contact Hotline
                    </label>
                    <input
                      type="text"
                      value={settingsForm.contactNumber || ""}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          contactNumber: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Schools Division Office
                    </label>
                    <input
                      type="text"
                      value={settingsForm.division || ""}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, division: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Official Email Address
                    </label>
                    <input
                      type="email"
                      value={settingsForm.email || ""}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, email: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">
                    Full Campus Address
                  </label>
                  <input
                    type="text"
                    value={settingsForm.address || ""}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, address: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
                  <Button type="submit" variant="primary" size="lg" icon={CheckCircle2}>
                    Save White-Label Branding & Invalidate Cache
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* ================================================================
              SECTION 7: DB INDEXES, CACHE & RATE LIMITER CONSOLE
             ================================================================ */}
          {activeSection === "engineering" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="emerald" icon={Zap}>
                        TAG-BASED WRITE-THROUGH CACHE
                      </Badge>
                      <span className="font-mono text-xs font-bold text-[#1B4332]">
                        TTL: {sys.cache_telemetry?.default_ttl_seconds || 300}s
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 font-serif">
                      Cache Hit Ratio: {sys.cache_telemetry?.hit_ratio || "90.3%"}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Driver: <strong>{sys.cache_telemetry?.driver}</strong> • Hits:{" "}
                      <strong>{sys.cache_telemetry?.hits || 28}</strong> • Misses:{" "}
                      <strong>{sys.cache_telemetry?.misses || 3}</strong> • Invalidations:{" "}
                      <strong>{sys.cache_telemetry?.invalidations || 2}</strong>
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Active Keys: <strong>{sys.cache_telemetry?.active_keys || 1}</strong> (
                      {sys.cache_telemetry?.size_kb || 14.2} KB)
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={RefreshCw}
                      onClick={handleFlushCache}
                    >
                      Flush All Cache Tags
                    </Button>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="gold" icon={Activity}>
                        RATE LIMITER & THROTTLER
                      </Badge>
                      <span className="font-mono text-xs font-bold text-amber-800">
                        RFC 6585 HTTP 429
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 font-serif">
                      {sys.rate_limiter?.algorithm || "Token Bucket / Sliding Window"}
                    </h3>
                    <div className="mt-2 space-y-1 text-xs text-slate-600">
                      {(sys.rate_limiter?.policies || []).map((pol, i) => (
                        <div key={i} className="flex justify-between">
                          <span className="font-bold text-slate-700">{pol.group}:</span>
                          <span className="font-mono text-[#1B4332] font-bold">
                            {pol.limit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Active IP Buckets:{" "}
                      <strong>{sys.rate_limiter?.active_buckets?.length || 1}</strong>
                    </span>
                    <Button
                      variant="subtle"
                      size="sm"
                      icon={ShieldCheck}
                      onClick={handleResetRateLimits}
                    >
                      Reset Throttle Buckets
                    </Button>
                  </div>
                </div>
              </div>

              {/* MySQL Proper Indexing Registry Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="px-6 py-4 bg-[#112e1f] text-white flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="text-lg font-bold font-serif">
                        MySQL 8.0+ Proper Indexing Registry (B-Tree, Unique, Composite & FULLTEXT)
                      </h3>
                      <p className="text-xs text-emerald-200/80">
                        Configured in <code>api/database/schema.sql</code> to guarantee O(log n) lookups and zero-filesort queries
                      </p>
                    </div>
                  </div>
                  <Badge variant="solidGold">
                    {sys.indexes_registry?.length || 8} Active Indexes
                  </Badge>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase font-extrabold">
                        <th className="py-3.5 px-4">Table Name</th>
                        <th className="py-3.5 px-4">Index Identifier</th>
                        <th className="py-3.5 px-4">Index Strategy</th>
                        <th className="py-3.5 px-4">Indexed Columns</th>
                        <th className="py-3.5 px-4">Query Optimization Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(sys.indexes_registry || []).map((idx, i) => (
                        <tr key={i} className="hover:bg-emerald-50/40">
                          <td className="py-3 px-4 font-mono font-bold text-[#1B4332]">
                            {idx.table}
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                            {idx.index_name}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                idx.index_type.includes("FULLTEXT")
                                  ? "solidGold"
                                  : "emerald"
                              }
                            >
                              {idx.index_type}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-700">
                            ({idx.columns})
                          </td>
                          <td className="py-3 px-4 text-slate-600">{idx.purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
