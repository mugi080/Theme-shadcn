"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { UserCircle, Plus, Phone, MapPin, ContactRound, Briefcase } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Reference {
  reference_id: number;
  employee_id: number;
  name: string;
  position: string;
  address: string;
  tel_no: string;
  order: number;
}

type NewEntry = Omit<Reference, "reference_id" | "employee_id" | "order">;

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED: Reference[] = [];

const EMPTY: NewEntry = {
  name: "",
  position: "",
  address: "",
  tel_no: "",
};

// ─── Field ────────────────────────────────────────────────────────────────────

const Field = ({
  label,
  id,
  placeholder,
  required = false,
  value,
  onChange,
  error,
}: {
  label: string;
  id: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  error?: string;
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
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-9 text-sm ${error ? "border-destructive" : ""}`}
    />
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

// ─── Avatar Initials ──────────────────────────────────────────────────────────

const Avatar = ({ name }: { name: string }) => {
  const parts = name.replace(/,/g, "").trim().split(/\s+/);
  const initials =
    parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`
      : parts[0]?.slice(0, 2) ?? "?";
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
      style={{ backgroundColor: "#1976D2" }}
    >
      {initials.toUpperCase()}
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function EmployeeReferencesPage() {
  const [records, setRecords] = useState<Reference[]>(SEED);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<NewEntry>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof NewEntry, string>>>({});

  const setF = (key: keyof NewEntry) => (v: string) =>
    setForm((p) => ({ ...p, [key]: v }));

  const validate = () => {
    const e: Partial<Record<keyof NewEntry, string>> = {};
    if (!form.name.trim())     e.name = "Required";
    if (!form.position.trim()) e.position = "Required";
    if (!form.address.trim())  e.address = "Required";
    if (!form.tel_no.trim())   e.tel_no = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const newId = Math.max(0, ...records.map((r) => r.reference_id)) + 1;
    setRecords((prev) => [
      ...prev,
      { reference_id: newId, employee_id: 1001, order: prev.length + 1, ...form },
    ]);
    setDialogOpen(false);
    setForm(EMPTY);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-muted/40 py-10 px-6">
      <div className="w-full max-w-4xl mx-auto space-y-5">

        {/* Page Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono">My Profile</Badge>
            <Badge variant="secondary" className="text-xs">References</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Character References
          </h1>
          <p className="text-sm text-muted-foreground">
            People who can vouch for your character and professional conduct.
          </p>
        </div>

        {/* Summary Card */}
        <Card className="border-border shadow-sm">
          <CardContent className="px-5 py-4 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
              style={{ backgroundColor: "#1976D2" }}
            >
              <ContactRound className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Total References
              </p>
              <p className="text-sm font-bold text-foreground">{records.length}</p>
            </div>
          </CardContent>
        </Card>

        {/* Table Card */}
        <Card className="border-border shadow-sm overflow-hidden">
          <CardHeader className="px-6 pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-white"
                  style={{ backgroundColor: "#1976D2" }}
                >
                  <UserCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Reference Records</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {records.length} {records.length === 1 ? "reference" : "references"} on file · saved records cannot be edited
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
                Add Reference
              </Button>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="p-0">
            {records.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">No references yet</p>
                  <p className="text-xs text-muted-foreground">
                    Click "Add Reference" to add your first reference.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {[...records]
                  .sort((a, b) => a.order - b.order)
                  .map((rec, index) => (
                    <div
                      key={rec.reference_id}
                      className="flex items-stretch hover:bg-muted/30 transition-colors"
                    >
                      {/* Order number */}
                      <div className="w-12 flex items-center justify-center flex-shrink-0 border-r border-border">
                        <span className="text-xs font-bold text-muted-foreground">{index + 1}</span>
                      </div>

                      {/* Name column */}
                      <div className="flex-1 px-5 py-4 border-r border-border min-w-0">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
                          Name
                        </p>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={rec.name} />
                          <p className="text-sm font-semibold leading-tight" style={{ color: "#1976D2" }}>
                            {rec.name}
                          </p>
                        </div>
                      </div>

                      {/* Position column */}
                      <div className="flex-[1.2] px-5 py-4 border-r border-border min-w-0">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
                          Position
                        </p>
                        <p className="text-sm text-foreground flex items-start gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-muted-foreground" />
                          <span className="break-words">{rec.position || "—"}</span>
                        </p>
                      </div>

                      {/* Address column */}
                      <div className="flex-[1.4] px-5 py-4 border-r border-border min-w-0">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
                          Address
                        </p>
                        <p className="text-sm text-foreground flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-muted-foreground" />
                          <span className="break-words">{rec.address}</span>
                        </p>
                      </div>

                      {/* Telephone column */}
                      <div className="w-[200px] flex-shrink-0 px-5 py-4 min-w-0">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
                          Telephone No.
                        </p>
                        <p className="text-sm text-foreground flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
                          {rec.tel_no}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {records.length > 0 && (
              <div className="px-6 py-3 border-t border-border bg-muted/20">
                <p className="text-xs text-muted-foreground">
                  {records.length} {records.length === 1 ? "character reference" : "character references"} on record
                </p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* ── Add Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <UserCircle className="w-4 h-4" style={{ color: "#1976D2" }} />
              Add Reference
            </DialogTitle>
          </DialogHeader>

          <p className="text-xs text-muted-foreground -mt-1">
            Once saved, this record cannot be edited.
          </p>

          <div className="space-y-4 py-1">
            <Field
              label="Full Name"
              id="ref_name"
              placeholder="e.g. DELA CRUZ, JUAN P."
              required
              value={form.name}
              onChange={setF("name")}
              error={errors.name}
            />
            <Field
              label="Position"
              id="ref_position"
              placeholder="e.g. Division Chief, Administrative Division"
              required
              value={form.position}
              onChange={setF("position")}
              error={errors.position}
            />
            <Field
              label="Address"
              id="ref_address"
              placeholder="e.g. 123 Rizal St., Lucena City"
              required
              value={form.address}
              onChange={setF("address")}
              error={errors.address}
            />
            <Field
              label="Telephone No."
              id="ref_tel"
              placeholder="e.g. +63 917 123 4567"
              required
              value={form.tel_no}
              onChange={setF("tel_no")}
              error={errors.tel_no}
            />
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
              Save Reference
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}