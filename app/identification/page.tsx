"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { GLOBAL_STYLES } from "@/lib/styles";
import { EmployeeIdentification, IDENTIFICATION_SEED } from "@/lib/constants";

import IdentificationSummaryCards from "@/components/identification/IdentificationSummaryCards";
import IdentificationTable        from "@/components/identification/IdentificationTable";

// ─────────────────────────────────────────────────────────────────────────────
// EmployeeIdentificationPage
// Root page — read-only; no add/edit dialog (HR-managed records).
// GLOBAL_STYLES injected once; child components use .hris-btn freely.
// ─────────────────────────────────────────────────────────────────────────────

export default function EmployeeIdentificationPage() {
  const [records,       setRecords]       = useState<EmployeeIdentification[]>(IDENTIFICATION_SEED);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => { setTimeout(() => setHeaderVisible(true), 80); }, []);

  return (
    <div className="min-h-screen py-6 px-4 sm:py-10" style={{ backgroundColor: "#EEF3FA" }}>

      <style>{`
        ${GLOBAL_STYLES}
        @keyframes hris-in    { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes hris-float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-5">

        {/* ── Page header ── */}
        <div style={{
          opacity:   headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(-14px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant="outline" className="text-xs font-mono">CS Form 212</Badge>
            <Badge variant="secondary" className="text-xs">Personal Data Sheet</Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Employee Identification
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Government-issued identification documents on record.
          </p>
        </div>

        {/* ── Summary chips ── */}
        <IdentificationSummaryCards records={records} />

        {/* ── Table card ── */}
        <IdentificationTable records={records} />

      </div>
    </div>
  );
}