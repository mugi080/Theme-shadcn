"use client";

import { useState } from "react";
import { Award, CalendarIcon, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
const BLANK_ELIGIBILITY = { cse_particular:"", rating:"", exam_date_conferment:"", exam_place:"", license_no:"", license_validity_date:"" };

interface EligibilitySectionProps {
  records: any[]; isOpen: boolean; onToggle: () => void;
  onArrayChange: (section: string, index: number, field: string, value: any) => void;
  onAdd: (section: string, blank: object) => void;
  onDelete: (section: string, index: number) => void;
}

function FloatingInput({ id, label, value, onChange, type = "text", className = "", error }: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  type?: string; className?: string; error?: string;
}) {
  const isFloated = !!value;
  return (
    <div className={`relative ${className}`}>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder=" "
        className={`peer w-full bg-card text-foreground border-input placeholder:text-transparent transition-all duration-200 focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none ${isFloated ? "pt-5 pb-1.5" : "pt-3 pb-3"} ${error ? "border-destructive" : ""}`} />
      <Label htmlFor={id}
        className={`absolute left-3 pointer-events-none transition-all duration-200 ease-in-out peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wide peer-focus:bg-card peer-focus:px-1 peer-focus:z-10 ${isFloated ? "top-0 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wide bg-card px-1 z-10" : "top-1/2 -translate-y-1/2 text-sm font-normal"} ${error ? "text-destructive" : "text-muted-foreground peer-focus:text-ring"}`}>
        {label}
      </Label>
      {error && <p className="mt-1 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

function FloatingDatePicker({ id, label, value, onChange, className = "", error }: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  className?: string; error?: string;
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
          <Button variant="outline" id={id} role="combobox" aria-invalid={!!error}
            className={`w-full justify-start text-left font-normal bg-card border-input hover:bg-muted/50 hover:border-ring transition-all duration-200 focus:border-ring focus:ring-2 focus:ring-ring/20 ${isFloated ? "pt-5 pb-1.5 px-3" : "pt-3 pb-3 px-3"} ${!selected ? "text-transparent" : "text-foreground"} ${error ? "border-destructive" : ""}`}>
            <span className="flex-1 truncate">{selected ? format(selected, "MMM d, yyyy") : "\u00A0"}</span>
            <CalendarIcon className="ml-2 h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-popover border-border shadow-lg overflow-visible" align="start">
          <div className="flex items-center gap-1.5 px-2 pt-2 pb-1">
            <button type="button" onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><ChevronLeft size={13} /></button>
            <Select value={String(viewDate.getMonth())} onValueChange={(v) => setViewDate((d) => new Date(d.getFullYear(), Number(v), 1))}>
              <SelectTrigger className="h-7 flex-1 text-xs font-semibold bg-card border-input px-2"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                {MONTHS.map((m, idx) => <SelectItem key={m} value={String(idx)} className="text-xs focus:bg-accent cursor-pointer">{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Popover open={yearOpen} onOpenChange={setYearOpen}>
              <PopoverTrigger asChild>
                <button type="button" className="h-7 px-2 rounded-md border border-input bg-card text-xs font-bold hover:bg-muted transition-colors min-w-[52px] text-center">{viewDate.getFullYear()}</button>
              </PopoverTrigger>
              <PopoverContent className="w-[72px] p-0 bg-popover border-border shadow-xl z-50" align="center" sideOffset={4} onInteractOutside={(e) => e.preventDefault()}>
                <ScrollArea className="h-44 rounded-md">
                  <div className="py-1">
                    {years.map((y) => (
                      <button key={y} type="button" onClick={() => { setViewDate((d) => new Date(y, d.getMonth(), 1)); setYearOpen(false); }}
                        className={`w-full px-2 py-1.5 text-xs text-center transition-colors hover:bg-accent hover:text-accent-foreground ${y === viewDate.getFullYear() ? "bg-primary text-primary-foreground font-bold" : "text-popover-foreground"}`}>{y}</button>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
            <button type="button" onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><ChevronRight size={13} /></button>
          </div>
          <CalendarComponent mode="single" selected={selected} month={viewDate} onMonthChange={setViewDate} hideNavigation
            onSelect={(d) => { if (!d) return; onChange(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`); setOpen(false); }}
            className="bg-popover text-popover-foreground pt-0" />
        </PopoverContent>
      </Popover>
      <label htmlFor={id}
        className={`absolute left-3 pointer-events-none z-10 transition-all duration-200 ease-in-out ${isFloated ? "top-0 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wide bg-card px-1 text-muted-foreground" : "top-1/2 -translate-y-1/2 text-sm font-normal text-muted-foreground"} ${error ? "text-destructive" : ""}`}>
        {label}
      </label>
      {error && <p className="mt-1 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="sm:col-span-2 flex items-center gap-3 pt-1">
      <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground whitespace-nowrap">{label}</span>
      <div className="flex-1 h-[1px] bg-border" />
    </div>
  );
}

export default function EligibilitySection({ records, isOpen, onToggle, onArrayChange, onAdd, onDelete }: EligibilitySectionProps) {
  return (
    <Accordion type="single" collapsible value={isOpen ? "eligibility" : ""} onValueChange={() => onToggle()} className="w-full">
      <AccordionItem value="eligibility" className="border border-border rounded-[14px] overflow-hidden bg-card">
        <AccordionTrigger className="hover:no-underline hover:bg-muted/40 px-4 py-3.5 rounded-t-[14px] data-[state=open]:rounded-b-none data-[state=open]:border-b data-[state=open]:border-border">
          <div className="flex items-center gap-3 w-full text-left">
            <span className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-amber-500 to-amber-600"><Award size={17} className="text-white" /></span>
            <span className="font-semibold text-sm text-foreground">Civil Service Eligibility</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-2 bg-background">
          {records.map((elig: any, i: number) => (
            <div key={elig.eligibility_id ?? i} className="relative mb-4 p-4 rounded-[12px] border border-border bg-card">
              <button className="absolute top-3 right-3 p-1.5 rounded-[8px] hover:bg-destructive/10 hover:text-destructive transition-colors duration-200" onClick={() => onDelete("emp_eligibility", i)}><Trash2 size={14} /></button>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Record #{i + 1}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SectionDivider label="Eligibility Details" />
                <FloatingInput id={`cse_particular_${i}`} label="Career Service / Eligibility" value={elig.cse_particular ?? ""} onChange={(v) => onArrayChange("emp_eligibility", i, "cse_particular", v)} className="sm:col-span-2" />
                <FloatingInput id={`rating_${i}`} label="Rating" value={elig.rating ?? ""} onChange={(v) => onArrayChange("emp_eligibility", i, "rating", v)} />
                <FloatingInput id={`exam_place_${i}`} label="Place of Examination / Conferment" value={elig.exam_place ?? ""} onChange={(v) => onArrayChange("emp_eligibility", i, "exam_place", v)} />
                <SectionDivider label="Examination Date" />
                <FloatingDatePicker id={`exam_date_${i}`} label="Date of Examination / Conferment" value={elig.exam_date_conferment ?? ""} onChange={(v) => onArrayChange("emp_eligibility", i, "exam_date_conferment", v)} className="sm:col-span-2" />
                <SectionDivider label="License" />
                <FloatingInput id={`license_no_${i}`} label="License No." value={elig.license_no ?? ""} onChange={(v) => onArrayChange("emp_eligibility", i, "license_no", v)} />
                <FloatingDatePicker id={`license_validity_${i}`} label="License Validity Date" value={elig.license_validity_date ?? ""} onChange={(v) => onArrayChange("emp_eligibility", i, "license_validity_date", v)} />
              </div>
            </div>
          ))}
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] border-[1.5px] border-dashed border-input hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-sm font-medium text-muted-foreground hover:text-primary" onClick={() => onAdd("emp_eligibility", { ...BLANK_ELIGIBILITY, eligibility_id: `new-${Date.now()}` })}>
            <Plus size={14} /> Add Eligibility Record
          </button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}