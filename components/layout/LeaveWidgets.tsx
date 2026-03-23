"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// AnimatedCounter
// ─────────────────────────────────────────────────────────────────────────────

export function AnimatedCounter({ value, color }: { value: number; color: string }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const start = prev.current;
    const end   = value;
    prev.current = value;
    if (start === end) return;
    const steps = Math.max(10, Math.abs(end - start) * 3);
    let step = 0;
    const t = setInterval(() => {
      step++;
      setDisplay(Math.round(start + (end - start) * (1 - Math.pow(1 - step / steps, 3))));
      if (step >= steps) { clearInterval(t); setDisplay(end); }
    }, 16);
    return () => clearInterval(t);
  }, [value]);

  return <span style={{ color }}>{display}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// BalanceBar — coloured track, used in the File Leave dialog
// ─────────────────────────────────────────────────────────────────────────────

export function BalanceBar({
  balance, max = 30, color, delay = 0,
}: {
  balance: number; max?: number; color: string; delay?: number;
}) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(Math.min(100, (balance / max) * 100)), delay + 120);
    return () => clearTimeout(t);
  }, [balance, max, delay]);

  return (
    <div className="w-full h-2 rounded-full" style={{ backgroundColor: `${color}20` }}>
      <div
        className="h-full rounded-full"
        style={{
          width: `${w}%`,
          backgroundColor: color,
          transition: `width 0.8s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BalanceBarInline — white fill, used inside the gradient identity header
// ─────────────────────────────────────────────────────────────────────────────

export function BalanceBarInline({ balance, max = 30 }: { balance: number; max?: number }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(Math.min(100, (balance / max) * 100)), 500);
    return () => clearTimeout(t);
  }, [balance, max]);

  return (
    <div
      className="h-full rounded-full bg-white"
      style={{ width: `${w}%`, transition: "width 1s cubic-bezier(0.4,0,0.2,1)" }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LeaveField — labelled input with error state, used in the dialog
// ─────────────────────────────────────────────────────────────────────────────

export function LeaveField({
  label, id, type = "text", placeholder,
  required = false, value, onChange, error,
}: {
  label: string; id: string; type?: string; placeholder?: string;
  required?: boolean; value: string; onChange: (v: string) => void; error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-bold uppercase tracking-wide" style={{ color: "#1976D2" }}>
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <Input
        id={id} type={type} placeholder={placeholder} value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={`h-9 text-sm focus-visible:ring-2 focus-visible:ring-blue-300 ${
          error ? "border-destructive ring-1 ring-destructive/30" : ""
        }`}
      />
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />{error}
        </p>
      )}
    </div>
  );
}