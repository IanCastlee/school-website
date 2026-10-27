const PRIMARY_API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const FALLBACK_API_BASE = "/api";

async function fetchFromBase(baseUrl, endpoint, options, method, headers) {
  const url =
    method === "GET"
      ? `${baseUrl}${endpoint}${endpoint.includes("?") ? "&" : "?"}_t=${Date.now()}`
      : `${baseUrl}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    cache: "no-store",
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("Non-JSON response from API base");
  }

  return res;
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("gnhs_admin_token");
  const method = (options.method || "GET").toUpperCase();
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  let res;
  try {
    res = await fetchFromBase(PRIMARY_API_BASE, endpoint, options, method, headers);
  } catch {
    res = await fetchFromBase(FALLBACK_API_BASE, endpoint, options, method, headers);
  }

  const rateLimitInfo = {
    limit: res.headers.get("X-RateLimit-Limit"),
    remaining: res.headers.get("X-RateLimit-Remaining"),
    reset: res.headers.get("X-RateLimit-Reset"),
    group: res.headers.get("X-RateLimit-Group"),
    cache: res.headers.get("X-Cache") || "MISS",
  };

  const json = await res.json();
  if (!res.ok || json.success === false) {
    const err = new Error(json.message || `HTTP Error ${res.status}`);
    err.status = res.status;
    err.errors = json.errors;
    err.rateLimitInfo = rateLimitInfo;
    throw err;
  }

  return {
    ...json,
    rateLimitInfo,
  };
}

export const apiClient = {
  getBootstrap: () => request("/portal/bootstrap"),
  submitInquiry: (payload) =>
    request("/portal/inquiries", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  getAdminOverview: () => request("/admin/overview"),
  updateSettings: (payload) =>
    request("/admin/settings", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  createAccomplishment: (payload) =>
    request("/admin/accomplishments", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateAccomplishment: (id, payload) =>
    request(`/admin/accomplishments/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteAccomplishment: (id) =>
    request(`/admin/accomplishments/${id}`, {
      method: "DELETE",
    }),
  createProject: (payload) =>
    request("/admin/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateProject: (id, payload) =>
    request(`/admin/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteProject: (id) =>
    request(`/admin/projects/${id}`, {
      method: "DELETE",
    }),
  createTransparencyDoc: (payload) =>
    request("/admin/transparency", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateTransparencyDoc: (id, payload) =>
    request(`/admin/transparency/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteTransparencyDoc: (id) =>
    request(`/admin/transparency/${id}`, {
      method: "DELETE",
    }),
  updateInquiryStatus: (id, status) =>
    request(`/admin/inquiries/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  deleteInquiry: (id) =>
    request(`/admin/inquiries/${id}`, {
      method: "DELETE",
    }),
  flushCache: () =>
    request("/admin/system/flush-cache", {
      method: "POST",
    }),
  resetRateLimits: () =>
    request("/admin/system/reset-ratelimits", {
      method: "POST",
    }),
};
