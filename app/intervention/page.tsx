"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { GLOBAL_STYLES } from "@/lib/styles";
import {
  LDIntervention, LDFormState,
  LD_SEED, EMPTY_LD_FORM,
} from "@/lib/constants";

import LDSummaryCards from "@/components/ld/LDSummaryCards";
import LDTable        from "@/components/ld/LDTable";
import LDDialog       from "@/components/ld/LDDialog";

// ─────────────────────────────────────────────────────────────────────────────
// LDInterventionsPage
// Root page — owns all state and handlers, composes LD components.
// GLOBAL_STYLES injected once; child components use .hris-btn freely.
// ─────────────────────────────────────────────────────────────────────────────

export default function LDInterventionsPage() {
  const [records,       setRecords]       = useState<LDIntervention[]>(LD_SEED);
  const [dialogOpen,    setDialogOpen]    = useState(false);
  const [form,          setForm]          = useState<LDFormState>(EMPTY_LD_FORM);
  const [errors,        setErrors]        = useState<Partial<Record<keyof LDFormState, string>>>({});
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => { setTimeout(() => setHeaderVisible(true), 80); }, []);

  // ── Field setter ────────────────────────────────────────────────────────────
  const onFieldChange = (k: keyof LDFormState) => (v: string) =>
    setForm((p) => ({
      ...p,
      [k]: k === "no_hours" || k === "type_id" ? Number(v) : v,
    }));

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e: Partial<Record<keyof LDFormState, string>> = {};
    if (!form.title.trim())        e.title        = "Required";
    if (!form.date_from)           e.date_from    = "Required";
    if (!form.date_to)             e.date_to      = "Required";
    if (!form.no_hours || form.no_hours <= 0) e.no_hours = "Must be greater than 0";
    if (!form.conducted_by.trim()) e.conducted_by = "Required";
    if (!form.type_id)             e.type_id      = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!validate()) return;
    const newId = Math.max(0, ...records.map((r) => r.ld_intervention_id)) + 1;
    setRecords((prev) => [
      ...prev,
      { ld_intervention_id: newId, employee_id: 1001, ...form },
    ]);
    setDialogOpen(false);
    setForm(EMPTY_LD_FORM);
    setErrors({});
  };

  const openDialog = () => { setForm(EMPTY_LD_FORM); setErrors({}); setDialogOpen(true); };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen py-6 px-4 sm:py-10" style={{ backgroundColor: "#EEF3FA" }}>

      <style>{`
        ${GLOBAL_STYLES}
        @keyframes hris-in     { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes hris-expand { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes hris-float  { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
      `}</style>

      <div className="max-w-5xl mx-auto space-y-5">

        {/* ── Page header ── */}
        <div style={{
          opacity:   headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(-14px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant="outline" className="text-xs font-mono">My Profile</Badge>
            <Badge variant="secondary" className="text-xs">Learning & Development</Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            L&D Interventions
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Trainings, seminars, and programs that enhance your skills and performance.
          </p>
        </div>

        {/* ── Summary cards ── */}
        <LDSummaryCards records={records} />

        {/* ── Table card ── */}
        <LDTable records={records} onAdd={openDialog} />

      </div>

      {/* ── Add dialog ── */}
      <LDDialog
        open={dialogOpen}
        form={form}
        errors={errors}
        onClose={() => { setDialogOpen(false); setErrors({}); }}
        onSave={handleSave}
        onFieldChange={onFieldChange}
      />
    </div>
  );
}