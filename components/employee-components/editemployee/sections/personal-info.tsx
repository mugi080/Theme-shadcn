"use client";

import { useEffect, useState } from "react";
import { User, Copy, ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";

import PhAddressFields from "./philaddress";

interface PersonalInfoSectionProps {
  formData: any;
  isOpen: boolean;
  onToggle: () => void;
  onFieldChange: (field: string, value: any) => void;
}

const SEX_OPTIONS        = ["Male", "Female"];
const CIVIL_OPTIONS      = ["Single", "Married", "Widowed", "Separated", "Divorced"];
const BLOOD_OPTIONS      = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];
const CITIZENSHIP_CATS   = ["By Birth", "By Naturalization", "Dual Citizenship"];
const MONTHS             = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const RA_FIELDS = [
  "house_block_lotno", "street", "subdivision_village",
  "barangay", "city_municipality", "province", "zipcode",
] as const;

function isSameAddress(fd: any) {
  return RA_FIELDS.every((f) => (fd[`ra_${f}`] ?? "") === (fd[`pa_${f}`] ?? ""));
}

// ── Floating Label Input ─────────────────────────────────────────
function FloatingInput({
  id, label, value, onChange, type = "text", className = "", error,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  type?: string; className?: string; error?: string;
}) {
  const isFloated = !!value;
  return (
    <div className={`relative ${className}`}>
      <Input id={id} type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        aria-invalid={!!error}
        className={`peer w-full bg-background text-foreground border-input placeholder:text-transparent transition-all duration-200 focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none ${isFloated ? "pt-5 pb-1.5" : "pt-3 pb-3"} ${error ? "border-destructive" : ""}`}
      />
      <Label htmlFor={id}
        className={`absolute left-3 pointer-events-none transition-all duration-200 ease-in-out peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wide peer-focus:bg-background peer-focus:px-1 peer-focus:z-10 ${isFloated ? "top-0 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wide bg-background px-1 z-10" : "top-1/2 -translate-y-1/2 text-sm font-normal"} ${error ? "text-destructive" : "text-muted-foreground peer-focus:text-ring"}`}>
        {label}
      </Label>
      {error && <p className="mt-1 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

// ── Floating Label Select ────────────────────────────────────────
function FloatingSelect({
  id, label, value, onValueChange, options, className = "", error,
}: {
  id: string; label: string; value: string; onValueChange: (v: string) => void;
  options: string[]; className?: string; error?: string;
}) {
  const isFloated = !!value;
  return (
    <div className={`relative ${className}`}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} aria-invalid={!!error}
          className={`peer w-full bg-background text-foreground border-input transition-all duration-200 focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none ${isFloated ? "pt-5 pb-1.5" : "pt-3 pb-3"} ${error ? "border-destructive" : ""}`}>
          <SelectValue placeholder=" " className="text-foreground" />
        </SelectTrigger>
        <SelectContent position="popper" className="bg-popover text-popover-foreground border-border max-h-60 overflow-y-auto" align="start" sideOffset={4}>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt} className="text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer">{opt}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Label htmlFor={id}
        className={`absolute left-3 pointer-events-none transition-all duration-200 ease-in-out peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wide peer-focus:bg-background peer-focus:px-1 peer-focus:z-10 ${isFloated ? "top-0 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wide bg-background px-1 z-10" : "top-1/2 -translate-y-1/2 text-sm font-normal"} ${error ? "text-destructive" : "text-muted-foreground peer-focus:text-ring"}`}>
        {label}
      </Label>
      {error && <p className="mt-1 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

// ── Floating Date Picker — same as Education ─────────────────────
function FloatingDatePicker({
  id, label, value, onChange, className = "", error,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  className?: string; error?: string;
}) {
  const [open, setOpen]         = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  const [viewDate, setViewDate] = useState<Date>(() => {
    if (value) { const [y, m] = value.split("-").map(Number); return new Date(y, m - 1, 1); }
    return new Date();
  });

  const selected = value
    ? (() => { const [y, m, d] = value.split("-").map(Number); return new Date(y, m - 1, d); })()
    : undefined;

  const isFloated  = !!value;
  const fromYear   = 1950;
  const toYear     = new Date().getFullYear() + 5;
  const years      = Array.from({ length: toYear - fromYear + 1 }, (_, i) => fromYear + i);

  return (
    <div className={`relative ${className}`}>
      <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setYearOpen(false); }}>
        <PopoverTrigger asChild>
          <Button variant="outline" id={id} role="combobox" aria-invalid={!!error}
            className={`w-full justify-start text-left font-normal bg-background border-input hover:bg-muted/50 hover:border-ring transition-all duration-200 focus:border-ring focus:ring-2 focus:ring-ring/20 ${isFloated ? "pt-5 pb-1.5 px-3" : "pt-3 pb-3 px-3"} ${!selected ? "text-transparent" : "text-foreground"} ${error ? "border-destructive" : ""}`}>
            <span className="flex-1 truncate">{selected ? format(selected, "MMM d, yyyy") : "\u00A0"}</span>
            <CalendarIcon className="ml-2 h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 bg-popover border-border shadow-lg overflow-visible" align="start">
          {/* ── Custom header ── */}
          <div className="flex items-center gap-1.5 px-2 pt-2 pb-1">
            <button type="button"
              onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
              className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft size={13} />
            </button>

            <Select value={String(viewDate.getMonth())} onValueChange={(v) => setViewDate((d) => new Date(d.getFullYear(), Number(v), 1))}>
              <SelectTrigger className="h-7 flex-1 text-xs font-semibold bg-popover border-input px-2 focus:ring-1 focus:ring-ring/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                {MONTHS.map((m, idx) => (
                  <SelectItem key={m} value={String(idx)} className="text-xs focus:bg-accent cursor-pointer">{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover open={yearOpen} onOpenChange={setYearOpen}>
              <PopoverTrigger asChild>
                <button type="button" className="h-7 px-2 rounded-md border border-input bg-popover text-xs font-bold hover:bg-muted transition-colors min-w-[52px] text-center">
                  {viewDate.getFullYear()}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[72px] p-0 bg-popover border-border shadow-xl z-50" align="center" sideOffset={4} onInteractOutside={(e) => e.preventDefault()}>
                <ScrollArea className="h-44 rounded-md">
                  <div className="py-1">
                    {years.map((y) => (
                      <button key={y} type="button"
                        onClick={() => { setViewDate((d) => new Date(y, d.getMonth(), 1)); setYearOpen(false); }}
                        className={`w-full px-2 py-1.5 text-xs text-center transition-colors hover:bg-accent hover:text-accent-foreground ${y === viewDate.getFullYear() ? "bg-primary text-primary-foreground font-bold" : "text-popover-foreground"}`}>
                        {y}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>

            <button type="button"
              onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
              className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <ChevronRight size={13} />
            </button>
          </div>

          <CalendarComponent
            mode="single" selected={selected} month={viewDate}
            onMonthChange={setViewDate} hideNavigation
            onSelect={(d) => {
              if (!d) return;
              const y   = d.getFullYear();
              const m   = String(d.getMonth() + 1).padStart(2, "0");
              const day = String(d.getDate()).padStart(2, "0");
              onChange(`${y}-${m}-${day}`);
              setOpen(false);
            }}
            className="bg-popover text-popover-foreground pt-0"
          />
        </PopoverContent>
      </Popover>

      {/* ✅ Label on border line — same as FloatingInput */}
      <label htmlFor={id}
        className={`absolute left-3 pointer-events-none z-10 transition-all duration-200 ease-in-out ${isFloated ? "top-0 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wide bg-background px-1 text-muted-foreground" : "top-1/2 -translate-y-1/2 text-sm font-normal text-muted-foreground"} ${error ? "text-destructive" : ""}`}>
        {label}
      </label>
      {error && <p className="mt-1 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

// ── Section Divider ──────────────────────────────────────────────
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="sm:col-span-2 flex items-center gap-3 pt-1">
      <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground whitespace-nowrap">{label}</span>
      <div className="flex-1 h-[1px] bg-border" />
    </div>
  );
}

// ── Toggle Button ────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-[10px] border-[1.5px] transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-ring/20 ${checked ? "bg-primary/10 border-primary/50 hover:bg-primary/15" : "bg-background border-input hover:bg-muted/30"}`}>
      <span className={`relative w-[34px] h-[18px] rounded-full flex-shrink-0 transition-colors duration-200 ${checked ? "bg-primary" : "bg-muted"}`}>
        <span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-background shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all duration-200 ${checked ? "left-[16px]" : "left-[2px]"}`} />
      </span>
      <Copy className={`w-[13px] h-[13px] transition-colors duration-200 ${checked ? "text-primary" : "text-muted-foreground"}`} />
      <span className={`text-[12px] font-semibold tracking-[0.03em] transition-colors duration-200 ${checked ? "text-primary" : "text-muted-foreground"}`}>
        Same as Residential Address
      </span>
    </button>
  );
}

// ── Main Component ───────────────────────────────────────────────
export default function PersonalInfoSection({
  formData, isOpen, onToggle, onFieldChange,
}: PersonalInfoSectionProps) {
  const [sameAsResidential, setSameAsResidential] = useState(() => isSameAddress(formData));

  const handleSameToggle = (checked: boolean) => {
    setSameAsResidential(checked);
    if (checked) RA_FIELDS.forEach((f) => onFieldChange(`pa_${f}`, formData[`ra_${f}`] ?? ""));
  };

  useEffect(() => {
    if (!sameAsResidential) return;
    RA_FIELDS.forEach((f) => onFieldChange(`pa_${f}`, formData[`ra_${f}`] ?? ""));
  }, [
    sameAsResidential,
    formData.ra_house_block_lotno, formData.ra_street,
    formData.ra_subdivision_village, formData.ra_barangay,
    formData.ra_city_municipality, formData.ra_province, formData.ra_zipcode,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Accordion type="single" collapsible
      value={isOpen ? "personal" : ""}
      onValueChange={(v) => v === "personal" && onToggle()}
      className="w-full">
      <AccordionItem value="personal"
        className="border border-border rounded-[14px] overflow-hidden bg-card data-[state=open]:shadow-[0_2px_12px_color-mix(in_oklch,var(--foreground)_6%,transparent)]">

        <AccordionTrigger className="hover:no-underline hover:bg-muted/40 px-4 py-3.5 rounded-t-[14px] data-[state=open]:rounded-b-none data-[state=open]:border-b data-[state=open]:border-border">
          <div className="flex items-center gap-3 w-full text-left">
            <span className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-primary to-primary/90">
              <User size={17} className="text-primary-foreground" />
            </span>
            <span className="font-semibold text-sm text-foreground">Personal Info</span>
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 pb-4 pt-2 bg-background">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* ── Name ── */}
            <SectionDivider label="Name" />
            <FloatingInput id="firstname"  label="First Name"      value={formData.firstname || ""}  onChange={(v) => onFieldChange("firstname", v)} />
            <FloatingInput id="middlename" label="Middle Name"     value={formData.middlename || ""} onChange={(v) => onFieldChange("middlename", v)} />
            <FloatingInput id="surname"    label="Last Name"       value={formData.surname || ""}    onChange={(v) => onFieldChange("surname", v)} />
            <FloatingInput id="name_ext"   label="Name Extension"  value={formData.name_ext || ""}   onChange={(v) => onFieldChange("name_ext", v)} />

            {/* ── Personal Details ── */}
            <SectionDivider label="Personal Details" />

            {/* ✅ Updated date picker — same as Education */}
            <FloatingDatePicker id="birthdate" label="Birth Date" value={formData.birthdate || ""} onChange={(v) => onFieldChange("birthdate", v)} />
            <FloatingInput id="birthplace" label="Birth Place" value={formData.birthplace || ""} onChange={(v) => onFieldChange("birthplace", v)} />

            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FloatingSelect id="sex"          label="Sex"          value={formData.sex || ""}          onValueChange={(v) => onFieldChange("sex", v)}          options={SEX_OPTIONS} />
              <FloatingSelect id="civil_status" label="Civil Status" value={formData.civil_status || ""} onValueChange={(v) => onFieldChange("civil_status", v)} options={CIVIL_OPTIONS} />
              <FloatingSelect id="blood_type"   label="Blood Type"   value={formData.blood_type || ""}   onValueChange={(v) => onFieldChange("blood_type", v)}   options={BLOOD_OPTIONS} />
            </div>

            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FloatingInput id="height" label="Height (cm)" value={formData.height || ""} onChange={(v) => onFieldChange("height", v)} />
              <FloatingInput id="weight" label="Weight (kg)" value={formData.weight || ""} onChange={(v) => onFieldChange("weight", v)} />
            </div>

            {/* ── Contact ── */}
            <SectionDivider label="Contact" />
            <FloatingInput id="mobile_no"     label="Mobile Number"  value={formData.mobile_no || ""}     onChange={(v) => onFieldChange("mobile_no", v)} />
            <FloatingInput id="telephone_no"  label="Telephone No."  value={formData.telephone_no || ""}  onChange={(v) => onFieldChange("telephone_no", v)} />
            <FloatingInput id="email_address" label="Email Address"  value={formData.email_address || ""} onChange={(v) => onFieldChange("email_address", v)} className="sm:col-span-2" type="email" />

            {/* ── Citizenship ── */}
            <SectionDivider label="Citizenship" />
            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FloatingInput   id="citizenship"          label="Citizenship"       value={formData.citizenship || ""}          onChange={(v) => onFieldChange("citizenship", v)}          className="sm:col-span-2" />
              <FloatingSelect  id="citizenship_category" label="Category"          value={formData.citizenship_category || ""} onValueChange={(v) => onFieldChange("citizenship_category", v)} options={CITIZENSHIP_CATS} />
              <FloatingInput   id="citizenship_country"  label="Country (if Dual)" value={formData.citizenship_country || ""}  onChange={(v) => onFieldChange("citizenship_country", v)}  className="sm:col-span-2" />
            </div>

            {/* ── Residential Address ── */}
            <PhAddressFields
              prefix="ra"
              label="Residential Address"
              values={{
                house_block_lotno:   formData.ra_house_block_lotno || "",
                street:              formData.ra_street || "",
                subdivision_village: formData.ra_subdivision_village || "",
                barangay:            formData.ra_barangay || "",
                city_municipality:   formData.ra_city_municipality || "",
                province:            formData.ra_province || "",
                zipcode:             formData.ra_zipcode || "",
              }}
              onChange={onFieldChange}
            />

            {/* ── Permanent Address ── */}
            <SectionDivider label="Permanent Address" />
            <div className="sm:col-span-2">
              <Toggle checked={sameAsResidential} onChange={handleSameToggle} />
            </div>

            {sameAsResidential ? (
              <Card className="sm:col-span-2 flex items-center gap-2 px-3.5 py-2.5 border-primary/50 bg-primary/10">
                <Copy className="w-[13px] h-[13px] text-primary" />
                <span className="text-[12px] font-medium text-primary">
                  Permanent address will be copied from residential address.
                </span>
              </Card>
            ) : (
              <PhAddressFields
                prefix="pa"
                label=""
                values={{
                  house_block_lotno:   formData.pa_house_block_lotno || "",
                  street:              formData.pa_street || "",
                  subdivision_village: formData.pa_subdivision_village || "",
                  barangay:            formData.pa_barangay || "",
                  city_municipality:   formData.pa_city_municipality || "",
                  province:            formData.pa_province || "",
                  zipcode:             formData.pa_zipcode || "",
                }}
                onChange={onFieldChange}
              />
            )}

            {/* ── Government IDs ── */}
            <SectionDivider label="Government IDs" />
            <FloatingInput id="gsis_no"       label="GSIS No."       value={formData.gsis_no || ""}       onChange={(v) => onFieldChange("gsis_no", v)} />
            <FloatingInput id="pagibig_no"    label="PAG-IBIG No."   value={formData.pagibig_no || ""}    onChange={(v) => onFieldChange("pagibig_no", v)} />
            <FloatingInput id="philhealth_no" label="PhilHealth No." value={formData.philhealth_no || ""} onChange={(v) => onFieldChange("philhealth_no", v)} />
            <FloatingInput id="sss_no"        label="SSS No."        value={formData.sss_no || ""}        onChange={(v) => onFieldChange("sss_no", v)} />
            <FloatingInput id="tin_no"        label="TIN No."        value={formData.tin_no || ""}        onChange={(v) => onFieldChange("tin_no", v)} />
            <FloatingInput id="agency_emp_no" label="Agency Emp. No." value={formData.agency_emp_no || ""} onChange={(v) => onFieldChange("agency_emp_no", v)} />

          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}