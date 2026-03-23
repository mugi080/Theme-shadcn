"use client";

import { TrendingUp, BookOpen, Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { LDIntervention } from "@/lib/constants";
import InterventionRow from "@/components/ld/InterventionRow";

// ─────────────────────────────────────────────────────────────────────────────
// LDTable
// Card with expandable intervention rows + Add Program button.
// ─────────────────────────────────────────────────────────────────────────────

interface LDTableProps {
  records: LDIntervention[];
  onAdd: () => void;
}

export default function LDTable({ records, onAdd }: LDTableProps) {
  const totalHours = records.reduce((s, r) => s + r.no_hours, 0);

  return (
    <Card
      className="border-border shadow-sm overflow-hidden"
      style={{ animation: "hris-in 0.5s ease 0.25s both" }}
    >
      {/* ── Card header ── */}
      <CardHeader className="px-6 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-lg text-white flex-shrink-0"
              style={{ backgroundColor: "#1976D2" }}
            >
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Intervention Records</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {records.length} {records.length === 1 ? "program" : "programs"} · click a row to expand · saved records cannot be edited
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={onAdd}
            className="hris-btn h-8 gap-1.5 text-xs text-white rounded-lg border-0"
            style={{ backgroundColor: "#1976D2" }}
          >
            <Plus className="w-3.5 h-3.5" /> Add Program
          </Button>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        {records.length === 0 ? (

          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md"
              style={{
                background: "linear-gradient(135deg,#EEF3FA 0%,#DAEAF8 100%)",
                border: "1px solid #B3D1F0",
                animation: "hris-float 3s ease-in-out infinite",
              }}
            >
              <BookOpen className="w-6 h-6" style={{ color: "#1976D2" }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">No programs recorded yet</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Click <strong>"Add Program"</strong> to log your first L&D intervention.
              </p>
            </div>
          </div>

        ) : (

          /* ── Table ── */
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-xs uppercase tracking-wide font-semibold text-center w-[46px]">#</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide font-semibold min-w-[280px]">
                    Program / Training Title
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wide font-semibold min-w-[120px]">Type</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide font-semibold min-w-[220px]">Period</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide font-semibold text-center w-[90px]">Hours</TableHead>
                  <TableHead className="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((rec, i) => (
                  <InterventionRow key={rec.ld_intervention_id} rec={rec} index={i} />
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* ── Footer ── */}
        {records.length > 0 && (
          <div className="px-6 py-3 border-t border-border bg-muted/20 flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              {records.length} {records.length === 1 ? "program" : "programs"} listed
            </p>
            <p className="text-xs font-semibold text-foreground">
              Total: <span style={{ color: "#1976D2" }}>{totalHours} hours</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}