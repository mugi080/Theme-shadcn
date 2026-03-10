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

  return data
}

/* GET TOKEN */
export function getToken() {
  return localStorage.getItem("access_token")
}

/* LOGOUT */
export function logout() {
  localStorage.removeItem("access_token")
}

/* AUTHENTICATED FETCH */
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getToken()

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  })

  if (res.status === 401) {
    logout()
    window.location.href = "/login"
  }

  return res
}