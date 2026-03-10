// lib/auth.ts

import { API_BASE } from "@/lib/base"

/* LOGIN */
export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE}/web_login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })

  if (!res.ok) {
    throw new Error("Invalid login")
  }

  const data = await res.json()

  // store token
  localStorage.setItem("access_token", data.token)

  // store employee id
  if (data.account?.employee?.employee_id) {
    localStorage.setItem("employee_id", data.account.employee.employee_id)
  }

  return data
}

/* GET TOKEN */
export function getToken() {
  return localStorage.getItem("access_token")
}

/* GET EMPLOYEE ID */
export function getEmployeeId() {
  return localStorage.getItem("employee_id")
}

/* LOGOUT */
export function logout() {
  localStorage.removeItem("access_token")
  localStorage.removeItem("employee_id")

  if (typeof window !== "undefined") {
    window.location.href = "/login"
  }
}

/* AUTHENTICATED FETCH */
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getToken()

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (res.status === 401) {
    logout()
    throw new Error("Session expired")
  }

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "API request failed")
  }

  return res
}