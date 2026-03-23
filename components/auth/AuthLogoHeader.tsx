"use client";

import { Mode } from "@/components/auth/authTypes";

// ─────────────────────────────────────────────────────────────────────────────
// AuthLogoHeader
// Centred logo image + portal title + dynamic subtitle based on current mode.
// ─────────────────────────────────────────────────────────────────────────────

interface AuthLogoHeaderProps {
  mode: Mode;
}

export default function AuthLogoHeader({ mode }: AuthLogoHeaderProps) {
  return (
    <div
      className="flex flex-col items-center gap-3 text-center"
      style={{ animation: "hris-in 0.5s ease both" }}
    >
      <img
        src="/image6.png"
        alt="HRIS Logo"
        className="w-16 h-16 object-contain rounded-xl shadow-md"
      />
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          HRIS Employee Portal
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {mode === "login" ? "Sign in to your account" : "Update your password"}
        </p>
      </div>
    </div>
  );
}