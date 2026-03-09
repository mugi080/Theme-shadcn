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
import { HandHeart, Plus, MapPin, Clock, Briefcase } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VoluntaryWork {
  voluntary_work_id: number;
  employee_id: number;
  organization_name: string;
  organization_address: string;
  date_from: string;
  date_to: string;
  no_hours: number;
  position_nature_of_work: string;
}

type NewEntry = Omit<VoluntaryWork, "voluntary_work_id" | "employee_id">;

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED: VoluntaryWork[] = [
  {
    voluntary_work_id: 1,
    employee_id: 1001,
    organization_name: "Red Cross Philippines",
    organization_address: "Bonifacio Drive, Manila",
    date_from: "2019-07-01",
    date_to: "2019-12-31",
    no_hours: 120,
    position_nature_of_work: "Medical Relief Volunteer",
  },
  {
    voluntary_work_id: 2,
    employee_id: 1001,
    organization_name: "Gawad Kalinga",
    organization_address: "Diliman, Quezon City",
    date_from: "2021-03-15",
    date_to: "2021-09-15",
    no_hours: 80,
    position_nature_of_work: "Community Development Assistant",
  },
];

const EMPTY: NewEntry = {
  organization_name: "",
  organization_address: "",
  date_from: "",
  date_to: "",
  no_hours: 0,
  position_nature_of_work: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (d: string) =>
  d
    ? new Date(d).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

// ─── Field ────────────────────────────────────────────────────────────────────

const Field = ({
  label,
  id,
  placeholder,
  type = "text",
  required = false,
  value,
  onChange,
}: {
  label: string;
  id: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  value: string | number;
  onChange: (v: string) => void;
}) => (
  <div className="space-y-1.5">
    <Label
      htmlFor={id}
      className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
    >
      {label}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 text-sm"
    />
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function VoluntaryWorkPage() {
  const [records, setRecords] = useState<VoluntaryWork[]>(SEED);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<NewEntry>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof NewEntry, string>>>({});

  const setF = (key: keyof NewEntry) => (v: string) =>
    setForm((p) => ({ ...p, [key]: key === "no_hours" ? Number(v) : v }));

  const validate = () => {
    const e: Partial<Record<keyof NewEntry, string>> = {};
    if (!form.organization_name.trim()) e.organization_name = "Required";
    if (!form.organization_address.trim()) e.organization_address = "Required";
    if (!form.date_from) e.date_from = "Required";
    if (!form.date_to) e.date_to = "Required";
    if (!form.no_hours || form.no_hours <= 0) e.no_hours = "Must be > 0";
    if (!form.position_nature_of_work.trim()) e.position_nature_of_work = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    const newId = Math.max(0, ...records.map((r) => r.voluntary_work_id)) + 1;
    setRecords((prev) => [
      ...prev,
      { voluntary_work_id: newId, employee_id: 1001, ...form },
    ]);
    setDialogOpen(false);
    setForm(EMPTY);
    setErrors({});
  };

  const openDialog = () => {
    setForm(EMPTY);
    setErrors({});
    setDialogOpen(true);
  };

  const totalHours = records.reduce((sum, r) => sum + r.no_hours, 0);

  return (
    <div className="min-h-screen bg-muted/40 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Page Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono">My Profile</Badge>
            <Badge variant="secondary" className="text-xs">Voluntary Work</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Voluntary Work
          </h1>
          <p className="text-sm text-muted-foreground">
            Your community service and volunteer activities on record.
          </p>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Card className="border-border shadow-sm">
            <CardContent className="px-4 py-4 flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: "#1976D2" }}
              >
                <HandHeart className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Organizations
                </p>
                <p className="text-sm font-semibold text-foreground">{records.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="px-4 py-4 flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: "#1976D2" }}
              >
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Total Hours
                </p>
                <p className="text-sm font-semibold text-foreground">{totalHours} hrs</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm col-span-2 sm:col-span-1">
            <CardContent className="px-4 py-4 flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: "#1976D2" }}
              >
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Latest Role
                </p>
                <p className="text-sm font-semibold text-foreground truncate">
                  {records.length > 0 ? records[records.length - 1].position_nature_of_work : "—"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Records Table */}
        <Card className="border-border shadow-sm overflow-hidden">
          <CardHeader className="px-6 pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-white"
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
                onClick={openDialog}
                className="h-8 gap-1.5 text-xs text-white"
                style={{ backgroundColor: "#1976D2" }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Record
              </Button>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="p-0">
            {records.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <HandHeart className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">No records yet</p>
                  <p className="text-xs text-muted-foreground">
                    Click "Add Record" to log your volunteer work.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="text-xs uppercase tracking-wide font-semibold w-[46px] text-center">
                        #
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wide font-semibold min-w-[200px]">
                        Organization
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wide font-semibold min-w-[160px]">
                        Address
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wide font-semibold min-w-[180px]">
                        Position / Nature of Work
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wide font-semibold min-w-[200px]">
                        Period
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wide font-semibold text-center w-[90px]">
                        Hours
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((rec, index) => (
                      <TableRow
                        key={rec.voluntary_work_id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="text-center text-xs text-muted-foreground py-3">
                          {index + 1}
                        </TableCell>
                        <TableCell className="py-3">
                          <p
                            className="text-sm font-medium"
                            style={{ color: "#1976D2" }}
                          >
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
                          {fmt(rec.date_from)} — {fmt(rec.date_to)}
                        </TableCell>
                        <TableCell className="py-3 text-center">
                          <span
                            className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-semibold"
                            style={{
                              backgroundColor: "#E3F2FD",
                              color: "#1976D2",
                              border: "1px solid #90CAF9",
                            }}
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

            {/* Total footer */}
            {records.length > 0 && (
              <div className="px-6 py-3 border-t border-border bg-muted/20 flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  {records.length} {records.length === 1 ? "organization" : "organizations"} listed
                </p>
                <p className="text-xs font-semibold text-foreground">
                  Total:{" "}
                  <span style={{ color: "#1976D2" }}>{totalHours} hours</span>
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
              <HandHeart className="w-4 h-4" style={{ color: "#1976D2" }} />
              Add Voluntary Work
            </DialogTitle>
          </DialogHeader>

          <p className="text-xs text-muted-foreground -mt-1">
            Once saved, this record cannot be edited.
          </p>

          <div className="space-y-4 py-1">
            <Field
              label="Organization Name"
              id="org_name"
              placeholder="e.g. Red Cross Philippines"
              required
              value={form.organization_name}
              onChange={setF("organization_name")}
            />
            {errors.organization_name && (
              <p className="text-xs text-destructive -mt-2">{errors.organization_name}</p>
            )}

            <Field
              label="Organization Address"
              id="org_address"
              placeholder="e.g. Bonifacio Drive, Manila"
              required
              value={form.organization_address}
              onChange={setF("organization_address")}
            />
            {errors.organization_address && (
              <p className="text-xs text-destructive -mt-2">{errors.organization_address}</p>
            )}

            <Field
              label="Position / Nature of Work"
              id="pos_work"
              placeholder="e.g. Medical Relief Volunteer"
              required
              value={form.position_nature_of_work}
              onChange={setF("position_nature_of_work")}
            />
            {errors.position_nature_of_work && (
              <p className="text-xs text-destructive -mt-2">{errors.position_nature_of_work}</p>
            )}

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Field
                  label="Date From"
                  id="date_from"
                  type="date"
                  required
                  value={form.date_from}
                  onChange={setF("date_from")}
                />
                {errors.date_from && (
                  <p className="text-xs text-destructive mt-1">{errors.date_from}</p>
                )}
              </div>
              <div>
                <Field
                  label="Date To"
                  id="date_to"
                  type="date"
                  required
                  value={form.date_to}
                  onChange={setF("date_to")}
                />
                {errors.date_to && (
                  <p className="text-xs text-destructive mt-1">{errors.date_to}</p>
                )}
              </div>
            </div>

            <div>
              <Field
                label="Number of Hours"
                id="no_hours"
                type="number"
                placeholder="e.g. 80"
                required
                value={form.no_hours === 0 ? "" : form.no_hours}
                onChange={setF("no_hours")}
              />
              {errors.no_hours && (
                <p className="text-xs text-destructive mt-1">{errors.no_hours}</p>
              )}
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
              onClick={handleAdd}
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