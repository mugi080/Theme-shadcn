"use client";

import { useState } from "react";
import { IdCard, Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AuthField from "@/components/auth/Authfield";
import { ChangePasswordFormState, Mode } from "@/components/auth/authTypes";

// ─────────────────────────────────────────────────────────────────────────────
// ChangePasswordForm
// Web Credential ID + New Password fields with strength hint,
// show/hide toggle, and Update Password button.
// ─────────────────────────────────────────────────────────────────────────────

interface ChangePasswordFormProps {
  onSuccess: (title: string, body: string) => void;
  onSwitchMode: (m: Mode) => void;
}

const EMPTY: ChangePasswordFormState = { web_credential_id: "", password: "" };

export default function ChangePasswordForm({ onSuccess, onSwitchMode }: ChangePasswordFormProps) {
  const [form,   setForm]   = useState<ChangePasswordFormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<ChangePasswordFormState>>({});
  const [showPw, setShowPw] = useState(false);

  const setF = (k: keyof ChangePasswordFormState) => (v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    const e: Partial<ChangePasswordFormState> = {};
    if (!form.web_credential_id.trim()) e.web_credential_id = "Web Credential ID is required.";
    if (!form.password.trim())          e.password = "New password is required.";
    else if (form.password.length < 8)  e.password = "Minimum 8 characters.";
    setErrors(e);
    if (Object.keys(e).length) return;
    onSuccess("Password Changed!", "Your password has been updated successfully.");
  };

  return (
    <Card
      className="border-0 shadow-xl rounded-2xl overflow-hidden"
      style={{ animation: "hris-in 0.45s ease 0.1s both" }}
    >
      <CardContent className="px-6 py-7 sm:px-8 space-y-4">

        <AuthField
          label="Web Credential ID" id="c_cred"
          placeholder="Enter your Web Credential ID"
          icon={IdCard} value={form.web_credential_id} onChange={setF("web_credential_id")}
          error={errors.web_credential_id}
        />

        <Separator />

        <AuthField
          label="New Password" id="c_pw"
          type={showPw ? "text" : "password"}
          placeholder="Minimum 8 characters"
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

        <Button
          onClick={handleSubmit}
          className="hris-btn w-full h-10 text-white font-semibold gap-2 border-0 mt-1"
          style={{ backgroundColor: "#1976D2" }}
        >
          Update Password <KeyRound className="w-4 h-4" />
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Remember your password?{" "}
          <button
            className="font-semibold hover:underline"
            style={{ color: "#1976D2" }}
            onClick={() => onSwitchMode("login")}
          >
            Sign in here
          </button>
        </p>

      </CardContent>
    </Card>
  );
}