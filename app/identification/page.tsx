"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShieldCheck } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EmployeeIdentification {
  identification_id: number;
  employee_id: number;
  govt_issued_id: string;
  id_no: string;
  issuance_date: string;
  issuance_place: string;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const RECORDS: EmployeeIdentification[] = [
  {
    identification_id: 1,
    employee_id: 1001,
    govt_issued_id: "Philippine Passport",
    id_no: "P1234567A",
    issuance_date: "2021-03-15",
    issuance_place: "DFA Manila",
  },
  {
    identification_id: 2,
    employee_id: 1001,
    govt_issued_id: "SSS ID",
    id_no: "34-5678901-2",
    issuance_date: "2018-07-22",
    issuance_place: "SSS Lucena Branch",
  },
  {
    identification_id: 3,
    employee_id: 1001,
    govt_issued_id: "PhilHealth ID",
    id_no: "19-012345678-9",
    issuance_date: "2019-01-10",
    issuance_place: "PhilHealth Quezon City",
  },
  {
    identification_id: 4,
    employee_id: 1001,
    govt_issued_id: "Pag-IBIG ID",
    id_no: "1234-5678-9012",
    issuance_date: "2019-04-05",
    issuance_place: "HDMF Makati",
  },
  {
    identification_id: 5,
    employee_id: 1001,
    govt_issued_id: "Driver's License",
    id_no: "N01-23-456789",
    issuance_date: "2020-09-30",
    issuance_place: "LTO Calamba",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (d: string) =>
  d
    ? new Date(d).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function EmployeeIdentificationPage() {
  return (
    <div className="min-h-screen bg-muted/40 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Page Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono">CS Form 212</Badge>
            <Badge variant="secondary" className="text-xs">Personal Data Sheet</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Employee Identification
          </h1>
          <p className="text-sm text-muted-foreground">
            Government-issued identification documents on record.
          </p>
        </div>

        {/* Table Card */}
        <Card className="border-border shadow-sm overflow-hidden">
          <CardHeader className="px-6 pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-lg text-white"
                style={{ backgroundColor: "#1976D2" }}
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Government-Issued IDs
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {RECORDS.length} {RECORDS.length === 1 ? "record" : "records"} on file
                </p>
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="p-0">
            {RECORDS.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <ShieldCheck className="w-8 h-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No identification records found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="text-xs uppercase tracking-wide font-semibold w-[50px] text-center">
                        #
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wide font-semibold">
                        Government-Issued ID
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wide font-semibold">
                        ID No.
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wide font-semibold">
                        Date of Issuance
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wide font-semibold">
                        Place of Issuance
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {RECORDS.map((rec, index) => (
                      <TableRow
                        key={rec.identification_id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="text-center text-xs text-muted-foreground py-3">
                          {index + 1}
                        </TableCell>
                        <TableCell className="py-3">
                          <span
                            className="text-sm font-medium"
                            style={{ color: "#1976D2" }}
                          >
                            {rec.govt_issued_id}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 text-sm font-mono text-foreground">
                          {rec.id_no || "—"}
                        </TableCell>
                        <TableCell className="py-3 text-sm text-muted-foreground">
                          {formatDate(rec.issuance_date)}
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
          </CardContent>
        </Card>

      </div>
    </div>
  );
}