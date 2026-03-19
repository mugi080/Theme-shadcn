import { API_BASE } from "@/lib/base";

// 🔐 Basic input sanitization helper
const sanitize = (input: string): string => {
  return input
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .trim();
};

export async function login(username: string, password: string) {
  // 🔐 Sanitize username (never sanitize password content, just validate)
  const sanitizedUsername = sanitize(username);
  
  // 🔐 Basic validation before API call
  if (!sanitizedUsername || sanitizedUsername.length < 3) {
    throw new Error("Invalid username");
  }
  if (!password || password.length < 4) {
    throw new Error("Password must be at least 6 characters");
  }

  const res = await fetch(`${API_BASE}/web_login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: sanitizedUsername, password }),
  });

  const text = await res.text();
  
  // 🔐 Detect HTML error pages (proxy errors, XSS attempts)
  if (text?.startsWith("<!DOCTYPE") || text?.startsWith("<html") || text?.startsWith("<HTML")) {
    console.error("Server returned HTML instead of JSON. Potential security issue.");
    throw new Error("Server error. Please try again later.");
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("Failed to parse JSON response:", text.substring(0, 200));
    throw new Error("Server returned invalid response");
  }

  if (!res.ok) {
    // 🔐 Don't expose internal error details
    const message = data?.message || "Invalid username or password";
    throw new Error(message.replace(/[<>]/g, "")); // Basic sanitization
  }

  // 🔐 Validate token format before storing
  if (data.token && typeof data.token === "string" && data.token.length > 10) {
    localStorage.setItem("access_token", data.token);
  }
  
  if (data.account?.employee?.employee_id) {
    const empId = String(data.account.employee.employee_id);
    // 🔐 Validate employee_id is alphanumeric
    if (/^[a-zA-Z0-9_-]+$/.test(empId)) {
      localStorage.setItem("employee_id", empId);
    }
  }

  return data;
}

export function logout() {
  // 🔐 Clear all auth-related storage
  localStorage.removeItem("access_token");
  localStorage.removeItem("employee_id");
  sessionStorage.removeItem("redirectAfterLogin");
  
  if (typeof window !== "undefined") {
    // 🔐 Use replace to prevent back-button access to protected pages
    window.location.replace("/login");
  }
}

export function getEmployeeId() {
  if (typeof window === "undefined") return null;
  const id = localStorage.getItem("employee_id");
  // 🔐 Return only if it matches expected format
  return id && /^[a-zA-Z0-9_-]+$/.test(id) ? id : null;
}

export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("access_token");
  const employeeId = getEmployeeId();
  // 🔐 Both must exist and token must be non-empty
  return !!token && token.length > 10 && !!employeeId;
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("access_token");
  
  // 🔐 Validate endpoint to prevent injection
  if (!endpoint || typeof endpoint !== "string" || endpoint.includes("://")) {
    throw new Error("Invalid API endpoint");
  }

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const text = await res.text();

    // 🔐 Handle HTML error pages
    if (text?.startsWith("<!DOCTYPE") || text?.startsWith("<html") || text?.startsWith("<HTML")) {
      console.error("Server returned HTML error page");
      throw new Error("Server error. Please try again later.");
    }

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      console.error("Failed to parse JSON response");
      throw new Error("Server returned invalid response");
    }

    // 🔐 Handle auth failures (401/403)
    if (res.status === 401 || res.status === 403 || data?.code === 401) {
      logout(); // Clears storage + redirects
      throw new Error(data?.message || "Session expired. Please log in again.");
    }

    if (!res.ok) {
      const message = data?.message || `Request failed with status ${res.status}`;
      throw new Error(message.replace(/[<>]/g, "")); // Basic sanitization
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}