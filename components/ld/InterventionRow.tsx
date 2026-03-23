"use client";

import { useState } from "react";
import {
  BookOpen, GraduationCap, Users, Lightbulb,
  TrendingUp, ChevronDown, ChevronUp, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import {
  LDIntervention, LD_TYPE_COLORS, fmtLDDate, getLDTypeName, getLDDuration,
} from "@/lib/constants";

// ─── Type icon map — Lucide components defined here, not in constants.ts ──────

const TYPE_ICONS: Record<number, React.ElementType> = {
  1: GraduationCap,
  2: Users,
  3: Lightbulb,
  4: TrendingUp,
  5: Users,
  6: BookOpen,
  7: BookOpen,
};

// ─────────────────────────────────────────────────────────────────────────────
// InterventionRow
// Expandable table row — click anywhere to reveal full detail panel.
// ─────────────────────────────────────────────────────────────────────────────

interface InterventionRowProps {
  rec: LDIntervention;
  index: number;
}

export default function InterventionRow({ rec, index }: InterventionRowProps) {
  const [expanded, setExpanded] = useState(false);

  const TypeIcon = TYPE_ICONS[rec.type_id] ?? BookOpen;
  const s        = LD_TYPE_COLORS[rec.type_id] ?? { bg: "#F5F5F5", color: "#616161", border: "#E0E0E0" };
  const duration = getLDDuration(rec.date_from, rec.date_to);

  return (
    <>
      {/* ── Main row ── */}
      <TableRow
        className="hover:bg-muted/30 transition-colors cursor-pointer group"
        style={{ animation: `hris-in 0.35s ease ${index * 60}ms both` }}
        onClick={() => setExpanded((p) => !p)}
      >
        <TableCell className="text-center text-xs text-muted-foreground py-3 w-[46px]">
          {index + 1}
        </TableCell>

        <TableCell className="py-3 min-w-[260px]">
          <div className="flex items-start gap-2">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}
            >
              <TypeIcon className="w-3.5 h-3.5" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-sm font-medium leading-tight" style={{ color: "#1976D2" }}>
                {rec.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <Building2 className="w-3 h-3 flex-shrink-0" />
                {rec.conducted_by}
              </p>
            </div>
          </div>
        </TableCell>

        <TableCell className="py-3">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
            style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}
          >
            {getLDTypeName(rec.type_id)}
          </span>
        </TableCell>

        <TableCell className="py-3 text-sm text-muted-foreground whitespace-nowrap">
          {fmtLDDate(rec.date_from)}
          {rec.date_to !== rec.date_from && <> — {fmtLDDate(rec.date_to)}</>}
          {duration && <span className="text-xs text-muted-foreground/60 ml-1">({duration})</span>}
        </TableCell>

        <TableCell className="py-3 text-center">
          <span
            className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-semibold"
            style={{ backgroundColor: "#E3F2FD", color: "#1976D2", border: "1px solid #90CAF9" }}
          >
            {rec.no_hours} hrs
          </span>
        </TableCell>

        <TableCell className="py-3 text-center w-[40px]">
          <Button
            variant="ghost" size="icon"
            className="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {expanded
              ? <ChevronUp   className="w-3.5 h-3.5" />
              : <ChevronDown className="w-3.5 h-3.5" />}
          </Button>
        </TableCell>
      </TableRow>

      {/* ── Expanded detail panel ── */}
      {expanded && (
        <TableRow className="bg-muted/20 hover:bg-muted/20">
          <TableCell colSpan={6} className="px-8 py-4">
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-3"
              style={{ animation: "hris-expand 0.25s ease forwards" }}
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Type</p>
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                  style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                >
                  {getLDTypeName(rec.type_id)}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Date From</p>
                <p className="text-sm text-foreground">{fmtLDDate(rec.date_from)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Date To</p>
                <p className="text-sm text-foreground">{fmtLDDate(rec.date_to)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">No. of Hours</p>
                <p className="text-sm text-foreground">{rec.no_hours} hours</p>
              </div>
              <div className="col-span-2 sm:col-span-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Conducted By</p>
                <p className="text-sm text-foreground">{rec.conducted_by}</p>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}