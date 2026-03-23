"use client";

import { HandHeart, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { VoluntaryWorkFormState } from "@/lib/constants";

// ─── Shared field ─────────────────────────────────────────────────────────────

function Field({
  label, id, placeholder, type = "text", required = false, value, onChange, error,
}: {
  label: string; id: string; placeholder?: string; type?: string;
  required?: boolean; value: string | number;
  onChange: (v: string) => void; error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-bold uppercase tracking-wide" style={{ color: "#1976D2" }}>
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <Input
        id={id} type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-9 text-sm focus-visible:ring-2 focus-visible:ring-blue-300 ${
          error ? "border-destructive ring-1 ring-destructive/30" : ""
        }`}
      />
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />{error}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VoluntaryDialog
// ─────────────────────────────────────────────────────────────────────────────

interface VoluntaryDialogProps {
  open: boolean;
  form: VoluntaryWorkFormState;
  errors: Partial<Record<keyof VoluntaryWorkFormState, string>>;
  onClose: () => void;
  onSave: () => void;
  onFieldChange: (k: keyof VoluntaryWorkFormState) => (v: string) => void;
}

export default function VoluntaryDialog({
  open, form, errors, onClose, onSave, onFieldChange,
}: VoluntaryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#1CA7EC 0%,#1F2F98 100%)" }}
            >
              <HandHeart className="w-3.5 h-3.5" />
            </div>
            Add Voluntary Work
          </DialogTitle>
        </DialogHeader>

        <p className="text-xs text-muted-foreground -mt-1">
          Once saved, this record cannot be edited.
        </p>

        <div className="space-y-4 py-1">

          <Field label="Organization Name" id="org_name"
            placeholder="e.g. Red Cross Philippines" required
            value={form.organization_name} onChange={onFieldChange("organization_name")}
            error={errors.organization_name} />

          <Field label="Organization Address" id="org_address"
            placeholder="e.g. Bonifacio Drive, Manila" required
            value={form.organization_address} onChange={onFieldChange("organization_address")}
            error={errors.organization_address} />

          <Field label="Position / Nature of Work" id="pos_work"
            placeholder="e.g. Medical Relief Volunteer" required
            value={form.position_nature_of_work} onChange={onFieldChange("position_nature_of_work")}
            error={errors.position_nature_of_work} />

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <Field label="Date From" id="date_from" type="date" required
              value={form.date_from} onChange={onFieldChange("date_from")}
              error={errors.date_from} />
            <Field label="Date To" id="date_to" type="date" required
              value={form.date_to} onChange={onFieldChange("date_to")}
              error={errors.date_to} />
          </div>

          <Field label="Number of Hours" id="no_hours" type="number"
            placeholder="e.g. 80" required
            value={form.no_hours === 0 ? "" : form.no_hours}
            onChange={onFieldChange("no_hours")}
            error={errors.no_hours} />

        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" className="rounded-xl" onClick={onClose}>Cancel</Button>
          <Button
            onClick={onSave}
            className="hris-btn text-white gap-1.5 rounded-xl border-0"
            style={{ backgroundColor: "#1976D2" }}
          >
            Save Record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}