"use client";

import { ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { EmployeeIdentification, fmtIdDate } from "@/lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// IdentificationTable
// Read-only card table of government-issued IDs. No Add button — HR-managed.
// ─────────────────────────────────────────────────────────────────────────────

interface IdentificationTableProps {
  records: EmployeeIdentification[];
}

export default function IdentificationTable({ records }: IdentificationTableProps) {
  return (
    <Card
      className="border-border shadow-sm overflow-hidden"
      style={{ animation: "hris-in 0.5s ease 0.25s both" }}
    >
      {/* ── Card header ── */}
      <CardHeader className="px-6 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-lg text-white flex-shrink-0"
            style={{ backgroundColor: "#1976D2" }}
          >
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Government-Issued IDs</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {records.length} {records.length === 1 ? "record" : "records"} on file · managed by HR
            </p>
          </div>
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
              <ShieldCheck className="w-6 h-6" style={{ color: "#1976D2" }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">No identification records found</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Contact HR to update your government-issued IDs.
              </p>
            </div>
          </div>

        ) : (

          /* ── Table ── */
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-xs uppercase tracking-wide font-semibold w-[50px] text-center">#</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide font-semibold min-w-[180px]">
                    Government-Issued ID
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wide font-semibold min-w-[160px]">
                    ID No.
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wide font-semibold min-w-[160px]">
                    Date of Issuance
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wide font-semibold min-w-[160px]">
                    Place of Issuance
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {records.map((rec, index) => (
                  <TableRow
                    key={rec.identification_id}
                    className="hover:bg-muted/30 transition-colors"
                    style={{ animation: `hris-in 0.35s ease ${index * 60}ms both` }}
                  >
                    <TableCell className="text-center text-xs text-muted-foreground py-3">
                      {index + 1}
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="text-sm font-medium" style={{ color: "#1976D2" }}>
                        {rec.govt_issued_id}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 text-sm font-mono text-foreground">
                      {rec.id_no || "—"}
                    </TableCell>
                    <TableCell className="py-3 text-sm text-muted-foreground">
                      {fmtIdDate(rec.issuance_date)}
                    </TableCell>
                    <TableCell className="py-3 text-sm text-muted-foreground">
                      {rec.issuance_place || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* ── Footer ── */}
        {records.length > 0 && (
          <div className="px-6 py-3 border-t border-border bg-muted/20">
            <p className="text-xs text-muted-foreground">
              {records.length} government-issued {records.length === 1 ? "ID" : "IDs"} on record
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}