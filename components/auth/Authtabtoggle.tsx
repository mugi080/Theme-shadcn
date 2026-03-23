"use client";

import { Mode } from "@/components/auth/authTypes";

// ─────────────────────────────────────────────────────────────────────────────
// AuthTabToggle
// Two-tab pill bar: Sign In / Change Password.
// Active tab fills with #1976D2; inactive is plain white with muted text.
// ─────────────────────────────────────────────────────────────────────────────

interface AuthTabToggleProps {
  mode: Mode;
  onSwitch: (m: Mode) => void;
}

const TABS: [Mode, string][] = [
  ["login",          "Sign In"],
  ["changePassword", "Change Password"],
];

export default function AuthTabToggle({ mode, onSwitch }: AuthTabToggleProps) {
  return (
    <div className="flex rounded-xl overflow-hidden border border-border bg-white shadow-sm">
      {TABS.map(([m, label]) => (
        <button
          key={m}
          onClick={() => onSwitch(m)}
          className={`flex-1 py-2.5 text-sm font-semibold transition-all ${
            mode === m ? "text-white" : "text-muted-foreground hover:text-foreground"
          }`}
          style={mode === m ? { backgroundColor: "#1976D2" } : {}}
        >
          {label}
        </button>
      ))}
    </div>
  );
}