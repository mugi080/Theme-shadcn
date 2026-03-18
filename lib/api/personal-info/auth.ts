import { API_BASE } from "@/lib/base";

export const getToken = () => {
  // Function implementation
};

// Login via HospCoth API directly
export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE}/web_login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("Server returned HTML instead of JSON:");
    console.error(text);
    throw new Error("Server returned invalid response");
  }

  if (!res.ok) throw new Error(data.message || "Invalid login");

  // Save token and employee_id locally
  if (data.token) localStorage.setItem("access_token", data.token);
  if (data.account?.employee?.employee_id)
    localStorage.setItem("employee_id", data.account.employee.employee_id);

  return data;
}

// Logout helper
export function logout() {
  localStorage.removeItem("employee_id");
  localStorage.removeItem("access_token");
  window.location.href = "/login";
}

// Get employee ID helper
export function getEmployeeId() {
  return localStorage.getItem("employee_id");
}

// API fetch wrapper with token
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("access_token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Server returned invalid response");
  }
  return data;
}