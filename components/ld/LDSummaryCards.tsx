"use client";

import { BookOpen, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LDIntervention, LD_TYPES, LD_TYPE_COLORS } from "@/lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// LDSummaryCards
// Programs count + Total Hours + By Type breakdown chips
// ─────────────────────────────────────────────────────────────────────────────

interface LDSummaryCardsProps {
  records: LDIntervention[];
}

export default function LDSummaryCards({ records }: LDSummaryCardsProps) {
  const totalHours = records.reduce((s, r) => s + r.no_hours, 0);
  const typeCounts = LD_TYPES
    .map((t) => ({ ...t, count: records.filter((r) => r.type_id === t.type_id).length }))
    .filter((t) => t.count > 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

      {/* Programs */}
      <Card className="border-border shadow-sm" style={{ animation: "hris-in 0.4s ease 0ms both" }}>
        <CardContent className="px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
            style={{ backgroundColor: "#1976D2" }}>
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Programs</p>
            <p className="text-sm font-bold text-foreground">{records.length}</p>
          </div>
        </CardContent>
      </Card>

      {/* Total Hours */}
      <Card className="border-border shadow-sm" style={{ animation: "hris-in 0.4s ease 80ms both" }}>
        <CardContent className="px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
            style={{ backgroundColor: "#1976D2" }}>
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Total Hours</p>
            <p className="text-sm font-bold text-foreground">{totalHours} hrs</p>
          </div>
        </CardContent>
      </Card>

      {/* By Type */}
      <Card className="border-border shadow-sm col-span-2" style={{ animation: "hris-in 0.4s ease 160ms both" }}>
        <CardContent className="px-4 py-4">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
            By Type
          </p>
          <div className="flex flex-wrap gap-1.5">
            {typeCounts.length === 0
              ? <span className="text-xs text-muted-foreground">No records yet</span>
              : typeCounts.map((t) => {
                  const s = LD_TYPE_COLORS[t.type_id] ?? { bg: "#F5F5F5", color: "#616161", border: "#E0E0E0" };
                  return (
                    <span
                      key={t.type_id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                    >
                      {t.type_name} <span className="font-bold">{t.count}</span>
                    </span>
                  );
                })
            }
          </div>
        </CardContent>
      </Card>

    </div>
  );
}