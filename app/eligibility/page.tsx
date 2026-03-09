"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Award, Plus, ShieldCheck, AlertCircle, CheckCircle2, Clock } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Eligibility {
  eligibility_id: number;
  employee_id: number;
  cse_particular: string;
  rating: string;
  exam_date_conferment: string;
  exam_place_conferment: string;
  license_no: string;
  validitydate: string;
  status: "Active" | "Expired" | "Pending";
  order: number;
}

type NewEntry = Omit<Eligibility, "eligibility_id" | "employee_id">;

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED: Eligibility[] = [
  {
    eligibility_id: 1,
    employee_id: 1001,
    cse_particular: "Career Service Professional (Second Level)",
    rating: "81.35",
    exam_date_conferment: "2017-08-13",
    exam_place_conferment: "Lucena City, Quezon",
    license_no: "CSP-2017-08-1234",
    validitydate: "",
    status: "Active",
    order: 1,
  },
  {
    eligibility_id: 2,
    employee_id: 1001,
    cse_particular: "Career Service Subprofessional (First Level)",
    rating: "78.52",
    exam_date_conferment: "2015-03-22",
    exam_place_conferment: "Manila",
    license_no: "CSS-2015-03-5678",
    validitydate: "",
    status: "Active",
    order: 2,
  },
  {
    eligibility_id: 3,
    employee_id: 1001,
    cse_particular: "Registered Nurse (PRC)",
    rating: "85.00",
    exam_date_conferment: "2019-07-04",
    exam_place_conferment: "Quezon City",
    license_no: "0123456",
    validitydate: "2025-06-30",
    status: "Expired",
    order: 3,
  },
];

const EMPTY: NewEntry = {
  cse_particular: "",
  rating: "",
  exam_date_conferment: "",
  exam_place_conferment: "",
  license_no: "",
  validitydate: "",
  status: "Active",
  order: 0,
};

const CSE_OPTIONS = [
  "Career Service Professional (Second Level)",
  "Career Service Subprofessional (First Level)",
  "Career Executive Service (CES)",
  "Career Executive Service Officer (CESO)",
  "Registered Nurse (PRC)",
  "Registered Engineer (PRC)",
  "Registered Teacher (PRC)",
  "BAR / Board for Law",
  "Barangay Official",
  "Driver's License (Professional)",
  "RA 1080 (Board / Bar)",
  "MC 11, S. 1996 (Revised)",
  "Other Eligibility",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (d: string) =>
  d
    ? new Date(d).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

const statusConfig: Record<
  Eligibility["status"],
  { label: string; style: React.CSSProperties; icon: React.ElementType }
> = {
  Active: {
    label: "Active",
    style: { backgroundColor: "#E8F5E9", color: "#2E7D32", border: "1px solid #A5D6A7" },
    icon: CheckCircle2,
  },
  Expired: {
    label: "Expired",
    style: { backgroundColor: "#FFEBEE", color: "#C62828", border: "1px solid #EF9A9A" },
    icon: AlertCircle,
  },
  Pending: {
    label: "Pending",
    style: { backgroundColor: "#FFF8E1", color: "#E65100", border: "1px solid #FFCC80" },
    icon: Clock,
  },
};

// ─── Field ────────────────────────────────────────────────────────────────────

const Field = ({
  label,
  id,
  placeholder,
  type = "text",
  required = false,
  value,
  onChange,
  error,
}: {
  label: string;
  id: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  value: string | number;
  onChange: (v: string) => void;
  error?: string;
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
      {label}{required && <span className="text-destructive ml-0.5">*</span>}
    </Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-9 text-sm ${error ? "border-destructive" : ""}`}
    />
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: Eligibility["status"] }) => {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
      style={cfg.style}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function EmployeeEligibilityPage() {
  const [records, setRecords] = useState<Eligibility[]>(SEED);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<NewEntry>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof NewEntry, string>>>({});

  const setF = (key: keyof NewEntry) => (v: string) =>
    setForm((p) => ({ ...p, [key]: key === "order" ? Number(v) : v }));

  const validate = () => {
    const e: Partial<Record<keyof NewEntry, string>> = {};
    if (!form.cse_particular.trim()) e.cse_particular = "Required";
    if (!form.exam_date_conferment) e.exam_date_conferment = "Required";
    if (!form.exam_place_conferment.trim()) e.exam_place_conferment = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const newId = Math.max(0, ...records.map((r) => r.eligibility_id)) + 1;
    const newOrder = records.length + 1;
    setRecords((prev) => [
      ...prev,
      { eligibility_id: newId, employee_id: 1001, ...form, order: newOrder },
    ]);
    setDialogOpen(false);
    setForm(EMPTY);
    setErrors({});
  };

  const activeCount = records.filter((r) => r.status === "Active").length;
  const expiredCount = records.filter((r) => r.status === "Expired").length;

  return (
    <div className="min-h-screen bg-muted/40 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Page Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono">My Profile</Badge>
            <Badge variant="secondary" className="text-xs">Eligibility</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Civil Service Eligibility
          </h1>
          <p className="text-sm text-muted-foreground">
            Your eligibilities qualifying you for government positions.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-border shadow-sm">
            <CardContent className="px-4 py-4 flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: "#1976D2" }}
              >
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Total</p>
                <p className="text-sm font-bold text-foreground">{records.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="px-4 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#E8F5E9" }}>
                <CheckCircle2 className="w-4 h-4" style={{ color: "#2E7D32" }} />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Active</p>
                <p className="text-sm font-bold" style={{ color: "#2E7D32" }}>{activeCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="px-4 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#FFEBEE" }}>
                <AlertCircle className="w-4 h-4" style={{ color: "#C62828" }} />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Expired</p>
                <p className="text-sm font-bold" style={{ color: "#C62828" }}>{expiredCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Card */}
        <Card className="border-border shadow-sm overflow-hidden">
          <CardHeader className="px-6 pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-white"
                  style={{ backgroundColor: "#1976D2" }}
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Eligibility Records</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {records.length} {records.length === 1 ? "record" : "records"} on file · saved records cannot be edited
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => { setForm(EMPTY); setErrors({}); setDialogOpen(true); }}
                className="h-8 gap-1.5 text-xs text-white"
                style={{ backgroundColor: "#1976D2" }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Eligibility
              </Button>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="p-0">
            {records.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Award className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">No eligibility records yet</p>
                  <p className="text-xs text-muted-foreground">Click "Add Eligibility" to add your first record.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="text-xs uppercase tracking-wide font-semibold w-[46px] text-center">#</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide font-semibold min-w-[240px]">
                        Eligibility / CSE Particular
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wide font-semibold w-[80px] text-center">
                        Rating
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wide font-semibold min-w-[160px]">
                        Exam Date
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wide font-semibold min-w-[160px]">
                        Place of Exam
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wide font-semibold min-w-[140px]">
                        License No.
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wide font-semibold min-w-[140px]">
                        Valid Until
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wide font-semibold text-center w-[100px]">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records
                      .sort((a, b) => a.order - b.order)
                      .map((rec, index) => (
                        <TableRow
                          key={rec.eligibility_id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <TableCell className="text-center text-xs text-muted-foreground py-3">
                            {index + 1}
                          </TableCell>
                          <TableCell className="py-3">
                            <p className="text-sm font-medium" style={{ color: "#1976D2" }}>
                              {rec.cse_particular}
                            </p>
                          </TableCell>
                          <TableCell className="py-3 text-center">
                            {rec.rating ? (
                              <span className="text-sm font-semibold text-foreground">
                                {rec.rating}%
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="py-3 text-sm text-muted-foreground">
                            {fmt(rec.exam_date_conferment)}
                          </TableCell>
                          <TableCell className="py-3 text-sm text-muted-foreground">
                            {rec.exam_place_conferment || "—"}
                          </TableCell>
                          <TableCell className="py-3 text-sm font-mono text-foreground">
                            {rec.license_no || "—"}
                          </TableCell>
                          <TableCell className="py-3 text-sm text-muted-foreground">
                            {rec.validitydate ? fmt(rec.validitydate) : (
                              <span className="text-xs italic">No expiry</span>
                            )}
                          </TableCell>
                          <TableCell className="py-3 text-center">
                            <StatusBadge status={rec.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {records.length > 0 && (
              <div className="px-6 py-3 border-t border-border bg-muted/20">
                <p className="text-xs text-muted-foreground">
                  {records.length} {records.length === 1 ? "eligibility" : "eligibilities"} on record
                  &nbsp;·&nbsp;
                  <span style={{ color: "#2E7D32" }}>{activeCount} active</span>
                  {expiredCount > 0 && (
                    <> &nbsp;·&nbsp; <span style={{ color: "#C62828" }}>{expiredCount} expired</span></>
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* ── Add Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Award className="w-4 h-4" style={{ color: "#1976D2" }} />
              Add Eligibility Record
            </DialogTitle>
          </DialogHeader>

          <p className="text-xs text-muted-foreground -mt-1">
            Once saved, this record cannot be edited.
          </p>

          <div className="space-y-4 py-1">

            {/* CSE Particular */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Eligibility / CSE Particular <span className="text-destructive">*</span>
              </Label>
              <Select value={form.cse_particular} onValueChange={setF("cse_particular")}>
                <SelectTrigger className={`h-9 text-sm ${errors.cse_particular ? "border-destructive" : ""}`}>
                  <SelectValue placeholder="Select eligibility type" />
                </SelectTrigger>
                <SelectContent>
                  {CSE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.cse_particular && (
                <p className="text-xs text-destructive">{errors.cse_particular}</p>
              )}
            </div>

            {/* Rating */}
            <Field
              label="Rating (%)"
              id="rating"
              placeholder="e.g. 81.35"
              type="number"
              value={form.rating}
              onChange={setF("rating")}
              error={errors.rating}
            />

            <Separator />

            {/* Exam Date & Place */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Field
                  label="Exam / Conferment Date"
                  id="exam_date"
                  type="date"
                  required
                  value={form.exam_date_conferment}
                  onChange={setF("exam_date_conferment")}
                  error={errors.exam_date_conferment}
                />
              </div>
              <div>
                <Field
                  label="Place of Exam / Conferment"
                  id="exam_place"
                  placeholder="e.g. Lucena City"
                  required
                  value={form.exam_place_conferment}
                  onChange={setF("exam_place_conferment")}
                  error={errors.exam_place_conferment}
                />
              </div>
            </div>

            <Separator />

            {/* License */}
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="License No."
                id="license_no"
                placeholder="e.g. 0123456"
                value={form.license_no}
                onChange={setF("license_no")}
                error={errors.license_no}
              />
              <Field
                label="Validity Date"
                id="validitydate"
                type="date"
                value={form.validitydate}
                onChange={setF("validitydate")}
                error={errors.validitydate}
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Status
              </Label>
              <Select
                value={form.status}
                onValueChange={(v) => setF("status")(v)}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => { setDialogOpen(false); setErrors({}); }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="text-white"
              style={{ backgroundColor: "#1976D2" }}
            >
              Save Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}