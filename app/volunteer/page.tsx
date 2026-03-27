"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { GLOBAL_STYLES } from "@/lib/styles";
import {
  VoluntaryWork, VoluntaryWorkFormState,
  VOLUNTARY_SEED, EMPTY_VOLUNTARY_FORM,
} from "@/lib/constants";

import VoluntarySummaryCards from "@/components/voluntary/VoluntarySummaryCards";
import VoluntaryTable        from "@/components/voluntary/VoluntaryTable";
import VoluntaryDialog       from "@/components/voluntary/VoluntaryDialog";

// ─────────────────────────────────────────────────────────────────────────────
// VoluntaryWorkPage
// Root page — owns all state and handlers, composes voluntary components.
// GLOBAL_STYLES injected once; child components use .hris-btn freely.
// ─────────────────────────────────────────────────────────────────────────────

export default function VoluntaryWorkPage() {
  const [records,       setRecords]       = useState<VoluntaryWork[]>(VOLUNTARY_SEED);
  const [dialogOpen,    setDialogOpen]    = useState(false);
  const [form,          setForm]          = useState<VoluntaryWorkFormState>(EMPTY_VOLUNTARY_FORM);
  const [errors,        setErrors]        = useState<Partial<Record<keyof VoluntaryWorkFormState, string>>>({});
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => { setTimeout(() => setHeaderVisible(true), 80); }, []);

  // ── Field setter ────────────────────────────────────────────────────────────
  const onFieldChange = (k: keyof VoluntaryWorkFormState) => (v: string) =>
    setForm((p) => ({ ...p, [k]: k === "no_hours" ? Number(v) : v }));

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e: Partial<Record<keyof VoluntaryWorkFormState, string>> = {};
    if (!form.organization_name.trim())        e.organization_name        = "Required";
    if (!form.organization_address.trim())     e.organization_address     = "Required";
    if (!form.date_from)                       e.date_from                = "Required";
    if (!form.date_to)                         e.date_to                  = "Required";
    if (!form.no_hours || form.no_hours <= 0)  e.no_hours                 = "Must be > 0";
    if (!form.position_nature_of_work.trim())  e.position_nature_of_work  = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!validate()) return;
    const newId = Math.max(0, ...records.map((r) => r.voluntary_work_id)) + 1;
    setRecords((prev) => [
      ...prev,
      { voluntary_work_id: newId, employee_id: 1001, ...form },
    ]);
    setDialogOpen(false);
    setForm(EMPTY_VOLUNTARY_FORM);
    setErrors({});
  };

  const openDialog = () => { setForm(EMPTY_VOLUNTARY_FORM); setErrors({}); setDialogOpen(true); };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen py-6 px-4 sm:py-10" style={{ backgroundColor: "#EEF3FA" }}>

      <style>{`
        ${GLOBAL_STYLES}
        @keyframes hris-in    { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes hris-float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
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
            <Badge variant="secondary" className="text-xs">Voluntary Work</Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Voluntary Work
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your community service and volunteer activities on record.
          </p>
        </div>

        {/* ── Summary chips ── */}
        <VoluntarySummaryCards records={records} />

        {/* ── Table card ── */}
        <VoluntaryTable records={records} onAdd={openDialog} />

      </div>

      {/* ── Add dialog ── */}
      <VoluntaryDialog
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