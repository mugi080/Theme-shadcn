// ─────────────────────────────────────────────────────────────────────────────
// authTypes.ts
// Shared types for the auth page components.
// Pure TypeScript — no React, no Lucide imports.
// ─────────────────────────────────────────────────────────────────────────────

export type Mode = "login" | "changePassword" | "success";

export interface LoginFormState {
  employeeId: string;
  password: string;
}

export interface ChangePasswordFormState {
  web_credential_id: string;
  password: string;
}