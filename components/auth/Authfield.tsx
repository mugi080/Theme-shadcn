"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ─────────────────────────────────────────────────────────────────────────────
// AuthField
// Labelled input with left icon, optional right slot (show/hide toggle),
// and inline error message. Used in both Login and ChangePassword forms.
// ─────────────────────────────────────────────────────────────────────────────

interface AuthFieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  icon: React.ElementType;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  right?: React.ReactNode;
}

export default function AuthField({
  label, id, type = "text", placeholder,
  icon: Icon, value, onChange, error, right,
}: AuthFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-bold uppercase tracking-wide" style={{ color: "#1976D2" }}>
        {label}
      </Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`pl-9 ${right ? "pr-10" : "pr-3"} h-10 text-sm focus-visible:ring-2 focus-visible:ring-blue-300 ${
            error ? "border-destructive ring-1 ring-destructive/30" : ""
          }`}
        />
        {right && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}