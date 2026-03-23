"use client";

import { useState } from "react";
import { IdCard, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AuthField from "@/components/auth/Authfield";
import { LoginFormState, Mode } from "@/components/auth/authTypes";

// ─────────────────────────────────────────────────────────────────────────────
// LoginForm
// Employee ID + Password fields, show/hide toggle, forgot password link,
// and Sign In button with .hris-btn gradient hover.
// ─────────────────────────────────────────────────────────────────────────────

interface LoginFormProps {
  onSuccess: (title: string, body: string) => void;
  onSwitchMode: (m: Mode) => void;
}

const EMPTY: LoginFormState = { employeeId: "", password: "" };

export default function LoginForm({ onSuccess, onSwitchMode }: LoginFormProps) {
  const [form,   setForm]   = useState<LoginFormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<LoginFormState>>({});
  const [showPw, setShowPw] = useState(false);

  const setF = (k: keyof LoginFormState) => (v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    const e: Partial<LoginFormState> = {};
    if (!form.employeeId.trim()) e.employeeId = "Employee ID is required.";
    if (!form.password.trim())   e.password   = "Password is required.";
    setErrors(e);
    if (Object.keys(e).length) return;
    onSuccess("Welcome Back!", "You have successfully logged in to the HRIS portal.");
  };

  return (
    <Card
      className="border-0 shadow-xl rounded-2xl overflow-hidden"
      style={{ animation: "hris-in 0.45s ease 0.1s both" }}
    >
      <CardContent className="px-6 py-7 sm:px-8 space-y-4">

        <AuthField
          label="Employee ID" id="l_id" placeholder="e.g. EMP-2024-001"
          icon={IdCard} value={form.employeeId} onChange={setF("employeeId")}
          error={errors.employeeId}
        />

        <AuthField
          label="Password" id="l_pw"
          type={showPw ? "text" : "password"}
          placeholder="Enter your password"
          icon={Lock} value={form.password} onChange={setF("password")}
          error={errors.password}
          right={
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        {/* Forgot password */}
        <div className="flex justify-end">
          <button
            className="text-xs font-medium hover:underline"
            style={{ color: "#1976D2" }}
            onClick={() => onSwitchMode("changePassword")}
          >
            Forgot password?
          </button>
        </div>

        <Button
          onClick={handleSubmit}
          className="hris-btn w-full h-10 text-white font-semibold gap-2 border-0"
          style={{ backgroundColor: "#1976D2" }}
        >
          Sign In <ArrowRight className="w-4 h-4" />
        </Button>

      </CardContent>
    </Card>
  );
}