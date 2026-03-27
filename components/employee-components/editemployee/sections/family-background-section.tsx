"use client";

import { useState } from "react";
import { Users, CalendarIcon, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const CHILD_STATUS_OPTIONS = ["DECEASED", "ALIVE"];
const BLANK_CHILD = { children_id: "", child_name: "", child_birthdate: "", status: "" };

interface FamilyBackgroundSectionProps {
  formData: any;
  records: any[];
  isOpen: boolean;
  onToggle: () => void;
  onFieldChange: (field: string, value: any) => void;
  onArrayChange: (section: string, index: number, field: string, value: any) => void;
  onAdd: (section: string, blank: object) => void;
  onDelete: (section: string, index: number) => void;
}

// ── Floating Label Input ─────────────────────────────────────────
function FloatingInput({ id, label, value, onChange, type = "text", className = "" }: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  type?: string; className?: string;
}) {
  const isFloated = !!value;
  return (
    <div className={`relative ${className}`}>
      <Input id={id} type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className={`peer w-full bg-card text-foreground border-input placeholder:text-transparent transition-all duration-200 focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none ${isFloated ? "pt-5 pb-1.5" : "pt-3 pb-3"}`}
      />
      <Label htmlFor={id}
        className={`absolute left-3 pointer-events-none transition-all duration-200 ease-in-out peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wide peer-focus:bg-card peer-focus:px-1 peer-focus:z-10 ${isFloated ? "top-0 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wide bg-card px-1 z-10" : "top-1/2 -translate-y-1/2 text-sm font-normal"} text-muted-foreground peer-focus:text-ring`}>
        {label}
      </Label>
    </div>
  );
}

// ── Floating Label Select ────────────────────────────────────────
function FloatingSelect({ id, label, value, onValueChange, options, className = "" }: {
  id: string; label: string; value: string; onValueChange: (v: string) => void;
  options: string[]; className?: string;
}) {
  const isFloated = !!value;
  return (
    <div className={`relative ${className}`}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id}
          className={`peer w-full bg-card text-foreground border-input transition-all duration-200 focus:border-ring focus:ring-2 focus:ring-ring/20 ${isFloated ? "pt-5 pb-1.5" : "pt-3 pb-3"}`}>
          <SelectValue placeholder=" ">{value || ""}</SelectValue>
        </SelectTrigger>
        <SelectContent position="popper" className="bg-popover text-popover-foreground border-border" align="start" sideOffset={4}>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt} className="text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer">
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Label htmlFor={id}
        className={`absolute left-3 pointer-events-none transition-all duration-200 ease-in-out z-10 ${isFloated ? "top-0 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wide bg-card px-1" : "top-1/2 -translate-y-1/2 text-sm font-normal"} text-muted-foreground`}>
        {label}
      </Label>
    </div>
  );
}

// ── Floating Date Picker ─────────────────────────────────────────
function FloatingDatePicker({ id, label, value, onChange, className = "" }: {
  id: string; label: string; value: string; onChange: (v: string) => void; className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(() => {
    if (value) { const [y, m] = value.split("-").map(Number); return new Date(y, m - 1, 1); }
    return new Date();
  });
  const selected = value
    ? (() => { const [y, m, d] = value.split("-").map(Number); return new Date(y, m - 1, d); })()
    : undefined;
  const isFloated = !!value;
  const years = Array.from({ length: new Date().getFullYear() + 5 - 1950 + 1 }, (_, i) => 1950 + i);

  return (
    <div className={`relative ${className}`}>
      <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setYearOpen(false); }}>
        <PopoverTrigger asChild>
          <Button variant="outline" id={id} role="combobox"
            className={`w-full justify-start text-left font-normal bg-card border-input hover:bg-muted/50 hover:border-ring transition-all duration-200 focus:border-ring focus:ring-2 focus:ring-ring/20 ${isFloated ? "pt-5 pb-1.5 px-3" : "pt-3 pb-3 px-3"} ${!selected ? "text-transparent" : "text-foreground"}`}>
            <span className="flex-1 truncate">{selected ? format(selected, "MMM d, yyyy") : "\u00A0"}</span>
            <CalendarIcon className="ml-2 h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-popover border-border shadow-lg overflow-visible" align="start">
          <div className="flex items-center gap-1.5 px-2 pt-2 pb-1">
            <button type="button"
              onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
              className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft size={13} />
            </button>
            <Select value={String(viewDate.getMonth())} onValueChange={(v) => setViewDate((d) => new Date(d.getFullYear(), Number(v), 1))}>
              <SelectTrigger className="h-7 flex-1 text-xs font-semibold bg-card border-input px-2"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                {MONTHS.map((m, idx) => (
                  <SelectItem key={m} value={String(idx)} className="text-xs focus:bg-accent cursor-pointer">{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover open={yearOpen} onOpenChange={setYearOpen}>
              <PopoverTrigger asChild>
                <button type="button" className="h-7 px-2 rounded-md border border-input bg-card text-xs font-bold hover:bg-muted transition-colors min-w-[52px] text-center">
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
              onChange(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`);
              setOpen(false);
            }}
            className="bg-popover text-popover-foreground pt-0"
          />
        </PopoverContent>
      </Popover>
      {/* ✅ Label on border line */}
      <label htmlFor={id}
        className={`absolute left-3 pointer-events-none z-10 transition-all duration-200 ease-in-out ${isFloated ? "top-0 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wide bg-card px-1 text-muted-foreground" : "top-1/2 -translate-y-1/2 text-sm font-normal text-muted-foreground"}`}>
        {label}
      </label>
    </div>
  );
}

// ── Person Card — no color props, uses neutral primary/60 ────────
function PersonCard({ title, children }: {
  title: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-[12px] border border-border bg-card p-4">
      {/* ✅ Neutral accent bar + bottom border separator */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <div className="w-1 h-5 rounded-full bg-primary/60" />
        <p className="text-xs font-bold uppercase tracking-widest text-foreground">{title}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {children}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────
export default function FamilyBackgroundSection({
  formData, records, isOpen, onToggle,
  onFieldChange, onArrayChange, onAdd, onDelete,
}: FamilyBackgroundSectionProps) {
  const family = formData || {};

  return (
    <Accordion type="single" collapsible value={isOpen ? "family" : ""} onValueChange={() => onToggle()} className="w-full">
      <AccordionItem value="family" className="border border-border rounded-[14px] overflow-hidden bg-card">
        <AccordionTrigger className="hover:no-underline hover:bg-muted/40 px-4 py-3.5 rounded-t-[14px] data-[state=open]:rounded-b-none data-[state=open]:border-b data-[state=open]:border-border">
          <div className="flex items-center gap-3 w-full text-left">
            <span className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-slate-700 to-slate-900">
              <Users size={17} className="text-white" />
            </span>
            <span className="font-semibold text-sm text-foreground">Family Background</span>
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 pb-4 pt-3 bg-background space-y-3">

          {/* ── Spouse ── */}
          <PersonCard title="Spouse Information">
            <FloatingInput id="spouse_fn"   label="First Name"               value={family.spouse_firstname ?? ""}              onChange={(v) => onFieldChange("spouse_firstname", v)} />
            <FloatingInput id="spouse_mn"   label="Middle Name"              value={family.spouse_middlename ?? ""}             onChange={(v) => onFieldChange("spouse_middlename", v)} />
            <FloatingInput id="spouse_ln"   label="Last Name"                value={family.spouse_surname ?? ""}                onChange={(v) => onFieldChange("spouse_surname", v)} />
            <FloatingInput id="spouse_ext"  label="Name Extension"           value={family.spouse_name_ext ?? ""}               onChange={(v) => onFieldChange("spouse_name_ext", v)} />
            <FloatingInput id="spouse_occ"  label="Occupation"               value={family.spouse_occupation ?? ""}             onChange={(v) => onFieldChange("spouse_occupation", v)}              className="sm:col-span-2" />
            <FloatingInput id="spouse_emp"  label="Employer / Business Name" value={family.spouse_employer_business_name ?? ""} onChange={(v) => onFieldChange("spouse_employer_business_name", v)} className="sm:col-span-2" />
            <FloatingInput id="spouse_addr" label="Business Address"         value={family.spouse_business_address ?? ""}       onChange={(v) => onFieldChange("spouse_business_address", v)}        className="sm:col-span-2" />
            <FloatingInput id="spouse_tel"  label="Telephone / Mobile No."   value={family.spouse_telephone_no ?? ""}           onChange={(v) => onFieldChange("spouse_telephone_no", v)}            className="sm:col-span-2" type="tel" />
          </PersonCard>

          {/* ── Father ── */}
          <PersonCard title="Father's Information">
            <FloatingInput id="father_fn"  label="First Name"     value={family.father_firstname ?? ""}  onChange={(v) => onFieldChange("father_firstname", v)} />
            <FloatingInput id="father_mn"  label="Middle Name"    value={family.father_middlename ?? ""} onChange={(v) => onFieldChange("father_middlename", v)} />
            <FloatingInput id="father_ln"  label="Last Name"      value={family.father_surname ?? ""}    onChange={(v) => onFieldChange("father_surname", v)} />
            <FloatingInput id="father_ext" label="Name Extension" value={family.father_name_ext ?? ""}   onChange={(v) => onFieldChange("father_name_ext", v)} />
          </PersonCard>

          {/* ── Mother ── */}
          <PersonCard title="Mother's Information">
            <FloatingInput id="mother_fn" label="First Name"  value={family.mother_firstname ?? ""}  onChange={(v) => onFieldChange("mother_firstname", v)} />
            <FloatingInput id="mother_mn" label="Middle Name" value={family.mother_middlename ?? ""} onChange={(v) => onFieldChange("mother_middlename", v)} />
            <FloatingInput id="mother_ln" label="Last Name"   value={family.mother_surname ?? ""}    onChange={(v) => onFieldChange("mother_surname", v)} className="sm:col-span-2" />
          </PersonCard>

          {/* ── Children ── */}
          <div className="rounded-[12px] border border-border bg-card p-4">
            {/* ✅ Children header with same neutral style */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <div className="w-1 h-5 rounded-full bg-primary/60" />
              <p className="text-xs font-bold uppercase tracking-widest text-foreground flex-1">Children</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {records.length}
              </span>
            </div>

            {records.length === 0 && (
              <p className="text-xs text-muted-foreground italic mb-3">No children records yet.</p>
            )}

            <div className="space-y-3">
              {records.map((child: any, i: number) => (
                <div key={child.children_id ?? i} className="relative p-4 rounded-[12px] border border-border bg-background">
                  <button
                    className="absolute top-3 right-3 p-1.5 rounded-[8px] hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
                    onClick={() => onDelete("emp_children", i)}
                    title="Remove child">
                    <Trash2 size={14} />
                  </button>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Child #{i + 1}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FloatingInput id={`child_name_${i}`} label="Child's Full Name"value={child.child_name ?? ""}
                      onChange={(v) => onArrayChange("emp_children", i, "child_name", v)}className="sm:col-span-2"/>
                    <FloatingDatePicker id={`child_bdate_${i}`} label="Birth Date"value={child.child_birthdate ?? ""}
                      onChange={(v) => onArrayChange("emp_children", i, "child_birthdate", v)}/>
                    <FloatingSelect id={`child_status_${i}`} label="Status"value={child.status ?? ""}
                      onValueChange={(v) => onArrayChange("emp_children", i, "status", v)}options={CHILD_STATUS_OPTIONS}/>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] border-[1.5px] border-dashed border-input hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => onAdd("emp_children", { ...BLANK_CHILD, children_id: `new-${Date.now()}` })}>
              <Plus size={14} /> Add Child
            </button>
          </div>

        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}