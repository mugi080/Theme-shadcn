"use client";

import { HandHeart, Plus, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { VoluntaryWork, fmtVoluntaryDate } from "@/lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// VoluntaryTable
// Card with table of all voluntary work records + Add button in header.
// ─────────────────────────────────────────────────────────────────────────────

interface VoluntaryTableProps {
  records: VoluntaryWork[];
  onAdd: () => void;
}

export default function VoluntaryTable({ records, onAdd }: VoluntaryTableProps) {
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
              <HandHeart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Volunteer Records</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {records.length} {records.length === 1 ? "record" : "records"} on file · saved records cannot be edited
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={onAdd}
            className="hris-btn h-8 gap-1.5 text-xs text-white rounded-lg border-0"
            style={{ backgroundColor: "#1976D2" }}
          >
            <Plus className="w-3.5 h-3.5" /> Add Record
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
              <HandHeart className="w-6 h-6" style={{ color: "#1976D2" }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">No records yet</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Click <strong>"Add Record"</strong> to log your volunteer work.
              </p>
            </div>
          </div>

        ) : (

          /* ── Table ── */
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-xs uppercase tracking-wide font-semibold w-[46px] text-center">#</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide font-semibold min-w-[200px]">Organization</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide font-semibold min-w-[160px]">Address</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide font-semibold min-w-[180px]">Position / Nature of Work</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide font-semibold min-w-[200px]">Period</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide font-semibold text-center w-[90px]">Hours</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {records.map((rec, index) => (
                  <TableRow
                    key={rec.voluntary_work_id}
                    className="hover:bg-muted/30 transition-colors"
                    style={{ animation: `hris-in 0.35s ease ${index * 60}ms both` }}
                  >
                    <TableCell className="text-center text-xs text-muted-foreground py-3">
                      {index + 1}
                    </TableCell>
                    <TableCell className="py-3">
                      <p className="text-sm font-medium" style={{ color: "#1976D2" }}>
                        {rec.organization_name}
                      </p>
                    </TableCell>
                    <TableCell className="py-3">
                      <p className="text-sm text-muted-foreground flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        {rec.organization_address}
                      </p>
                    </TableCell>
                    <TableCell className="py-3 text-sm text-foreground">
                      {rec.position_nature_of_work}
                    </TableCell>
                    <TableCell className="py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {fmtVoluntaryDate(rec.date_from)} — {fmtVoluntaryDate(rec.date_to)}
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <span
                        className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-semibold"
                        style={{ backgroundColor: "#E3F2FD", color: "#1976D2", border: "1px solid #90CAF9" }}
                      >
                        {rec.no_hours} hrs
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* ── Footer ── */}
        {records.length > 0 && (
          <div className="px-6 py-3 border-t border-border bg-muted/20 flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              {records.length} {records.length === 1 ? "organization" : "organizations"} listed
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