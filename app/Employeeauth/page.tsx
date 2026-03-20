"use client";

import { useState, useEffect } from "react";
import { GLOBAL_STYLES } from "@/lib/styles";
import { Mode } from "@/components/auth/authTypes";

import AuthLogoHeader    from "@/components/auth/AuthLogoHeader";
import AuthTabToggle     from "@/components/auth/Authtabtoggle";
import LoginForm         from "@/components/auth/Loginform";
import ChangePasswordForm from "@/components/auth/Changepasswordform";
import AuthSuccessCard   from "@/components/auth/Authsuccesscard";

// ─────────────────────────────────────────────────────────────────────────────
// EmployeeAuthPage
// Root page — owns mode state and success message, composes auth components.
// GLOBAL_STYLES injected once here; child components use .hris-btn freely.
// ─────────────────────────────────────────────────────────────────────────────

export default function EmployeeAuthPage() {
  const [mode,           setMode]           = useState<Mode>("login");
  const [successTitle,   setSuccessTitle]   = useState("");
  const [successBody,    setSuccessBody]    = useState("");
  const [pageVisible,    setPageVisible]    = useState(false);

  useEffect(() => { setTimeout(() => setPageVisible(true), 60); }, []);

  const handleSuccess = (title: string, body: string) => {
    setSuccessTitle(title);
    setSuccessBody(body);
    setMode("success");
  };

  const handleSwitchMode = (m: Mode) => setMode(m);

  const handleBackToLogin = () => setMode("login");

  // ── Success screen ──────────────────────────────────────────────────────────
  if (mode === "success") {
    return (
      <>
        <style>{`
          ${GLOBAL_STYLES}
          @keyframes hris-in  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
          @keyframes hris-pop { 0% { opacity:0; transform:scale(0.88); } 65% { transform:scale(1.03); } 100% { opacity:1; transform:scale(1); } }
        `}</style>
        <AuthSuccessCard
          title={successTitle}
          body={successBody}
          onBack={handleBackToLogin}
        />
      </>
    );
  }

  // ── Login / Change Password ─────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ backgroundColor: "#EEF3FA" }}
    >
      {/* Global button + animation styles injected once */}
      <style>{`
        ${GLOBAL_STYLES}
        @keyframes hris-in  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes hris-pop { 0% { opacity:0; transform:scale(0.88); } 65% { transform:scale(1.03); } 100% { opacity:1; transform:scale(1); } }
      `}</style>

      <div
        className="w-full max-w-md space-y-5"
        style={{
          opacity:   pageVisible ? 1 : 0,
          transform: pageVisible ? "translateY(0)" : "translateY(-12px)",
          transition: "opacity 0.45s ease, transform 0.45s ease",
        }}
      >
        {/* ── Logo + title ── */}
        <AuthLogoHeader mode={mode} />

        {/* ── Tab toggle ── */}
        <AuthTabToggle mode={mode} onSwitch={handleSwitchMode} />

        {/* ── Active form ── */}
        {mode === "login" && (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchMode={handleSwitchMode}
          />
        )}
        {mode === "changePassword" && (
          <ChangePasswordForm
            onSuccess={handleSuccess}
            onSwitchMode={handleSwitchMode}
          />
        )}

        {/* ── Footer ── */}
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Human Resource Information System. All rights reserved.
        </p>
      </div>
    </div>
  );
}