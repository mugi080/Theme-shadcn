// components/sections/EducationSection.tsx
"use client";

import { useState } from "react";
import { GraduationCap, CalendarIcon, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

/* Shadcn UI Primitives */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";

const EDUCATION_LEVELS = [
  "Elementary",
  "Junior High School",
  "Senior High School",
  "Vocational / Technical",
  "College",
  "Post-Graduate",
];

const UNITS_EARNED_OPTIONS = [
  "Undergraduate",
  "Graduate",
  "Post-Graduate",
  "Completed",
];

const BLANK_EDUCATION = {
  education_level: "",
  school_name: "",
  basic_educ_degree_course: "",
  attendance_start_date: "",
  attendance_end_date: "",
  highest_level_units_earned: "",
  year_graduated: "",
  scholarship_academic_honors: "",
};

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

interface EducationSectionProps {
  records: any[];
  isOpen: boolean;
  onToggle: () => void;
  onArrayChange: (section: string, index: number, field: string, value: any) => void;
  onAdd: (section: string, blank: object) => void;
  onDelete: (section: string, index: number) => void;
}

function resolveEducationLevel(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object" && val.level_name) return val.level_name;
  return "";
}

// ── Floating Label Input ─────────────────────────────────────────────────
function FloatingInput({
  id, label, value, onChange, type = "text", className = "", error,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  type?: string; className?: string; error?: string;
}) {
  const isFloated = !!value;
  return (
    <div className={`relative ${className}`}>
      <Input
        id={id} type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`peer w-full bg-card text-foreground border-input placeholder:text-transparent transition-all duration-200 focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none ${isFloated ? "pt-5 pb-1.5" : "pt-3 pb-3"} ${error ? "border-destructive" : ""}`}
      />
      <Label
        htmlFor={id}
        className={`absolute left-3 pointer-events-none transition-all duration-200 ease-in-out peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wide peer-focus:bg-card peer-focus:px-1 peer-focus:z-10 ${isFloated ? "top-0 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wide bg-card px-1 z-10" : "top-1/2 -translate-y-1/2 text-sm font-normal"} ${error ? "text-destructive" : "text-muted-foreground peer-focus:text-ring"}`}
      >
        {label}
      </Label>
      {error && <p id={`${id}-error`} className="mt-1 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

// ── Floating Label Select ────────────────────────────────────────────────
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
        <SelectTrigger
          id={id}
          aria-invalid={!!error}
          className={`peer w-full bg-card text-foreground border-input transition-all duration-200 focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none ${isFloated ? "pt-5 pb-1.5" : "pt-3 pb-3"} ${error ? "border-destructive" : ""}`}
        >
          <SelectValue placeholder=" ">{value || ""}</SelectValue>
        </SelectTrigger>
        <SelectContent
          position="popper"
          className="bg-popover text-popover-foreground border-border max-h-60 overflow-y-auto"
          align="start"
          sideOffset={4}
        >
          {options.map((opt) => (
            <SelectItem
              key={opt}
              value={opt}
              className="text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
            >
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Label
        htmlFor={id}
        className={`absolute left-3 pointer-events-none transition-all duration-200 ease-in-out z-10 ${isFloated ? "top-0 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wide bg-card px-1" : "top-1/2 -translate-y-1/2 text-sm font-normal"} ${error ? "text-destructive" : "text-muted-foreground"}`}
      >
        {label}
      </Label>
      {error && <p className="mt-1 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

// ── Date Picker — custom header built outside Calendar, no double row ────
function FloatingDatePicker({
  id, label, value, onChange, className = "", error,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  className?: string; error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  // Current view month (what the calendar is showing)
  const [viewDate, setViewDate] = useState<Date>(() => {
    if (value) {
      const [y, m] = value.split("-").map(Number);
      return new Date(y, m - 1, 1);
    }
    return new Date();
  });

  // Selected date (the actual value)
  const selected = value
    ? (() => { const [y, m, d] = value.split("-").map(Number); return new Date(y, m - 1, d); })()
    : undefined;

  const isFloated = !!value;

  const fromYear = 1950;
  const toYear = new Date().getFullYear() + 5;
  const years = Array.from({ length: toYear - fromYear + 1 }, (_, i) => fromYear + i);

  const goToPrevMonth = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const goToNextMonth = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  return (
    <div className={`relative ${className}`}>
      <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setYearOpen(false); }}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            role="combobox"
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`peer w-full justify-start text-left font-normal bg-card border-input hover:bg-muted/50 hover:border-ring transition-all duration-200 focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none ${isFloated ? "pt-5 pb-1.5" : "pt-3 pb-3"} ${!selected ? "text-muted-foreground" : "text-foreground"} ${error ? "border-destructive" : ""}`}
          >
            {selected ? format(selected, "MMM d, yyyy") : "Select date"}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0 bg-popover border-border shadow-lg overflow-visible"
          align="start"
        >
          {/* ── Custom header: prev | month select | year scroll | next ── */}
          <div className="flex items-center gap-1.5 px-2 pt-2 pb-1">
            {/* Prev */}
            <button
              type="button"
              onClick={goToPrevMonth}
              className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft size={13} />
            </button>

            {/* Month select */}
            <Select
              value={String(viewDate.getMonth())}
              onValueChange={(v) =>
                setViewDate((d) => new Date(d.getFullYear(), Number(v), 1))
              }
            >
              <SelectTrigger className="h-7 flex-1 text-xs font-semibold bg-card border-input px-2 focus:ring-1 focus:ring-ring/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                {MONTHS.map((m, idx) => (
                  <SelectItem key={m} value={String(idx)} className="text-xs focus:bg-accent cursor-pointer">
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year — shadcn ScrollArea in a nested Popover */}
            <Popover open={yearOpen} onOpenChange={setYearOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="h-7 px-2 rounded-md border border-input bg-card text-xs font-bold hover:bg-muted transition-colors min-w-[52px] text-center"
                >
                  {viewDate.getFullYear()}
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[72px] p-0 bg-popover border-border shadow-xl z-50"
                align="center"
                sideOffset={4}
                // Prevent the outer Popover from closing when interacting here
                onInteractOutside={(e) => e.preventDefault()}
              >
                <ScrollArea className="h-44 rounded-md">
                  <div className="py-1">
                    {years.map((y) => (
                      <button
                        key={y}
                        type="button"
                        onClick={() => {
                          setViewDate((d) => new Date(y, d.getMonth(), 1));
                          setYearOpen(false);
                        }}
                        className={`w-full px-2 py-1.5 text-xs text-center transition-colors hover:bg-accent hover:text-accent-foreground ${
                          y === viewDate.getFullYear()
                            ? "bg-primary text-primary-foreground font-bold"
                            : "text-popover-foreground"
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>

            {/* Next */}
            <button
              type="button"
              onClick={goToNextMonth}
              className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <ChevronRight size={13} />
            </button>
          </div>

          {/* ── Calendar body — hideNavigation removes its own nav row ── */}
          <CalendarComponent
            mode="single"
            selected={selected}
            month={viewDate}
            onMonthChange={setViewDate}
            hideNavigation
            onSelect={(d) => {
              if (!d) return;
              const y = d.getFullYear();
              const m = String(d.getMonth() + 1).padStart(2, "0");
              const day = String(d.getDate()).padStart(2, "0");
              onChange(`${y}-${m}-${day}`);
              setOpen(false);
            }}
            className="bg-popover text-popover-foreground pt-0"
          />
        </PopoverContent>
      </Popover>

      <Label
        htmlFor={id}
        className={`absolute left-3 pointer-events-none transition-all duration-200 ease-in-out z-10 ${isFloated ? "top-0 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wide bg-card px-1" : "top-1/2 -translate-y-1/2 text-sm font-normal"} ${error ? "text-destructive" : "text-muted-foreground"}`}
      >
        {label}
      </Label>
      {error && <p id={`${id}-error`} className="mt-1 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

// ── Section Divider ──────────────────────────────────────────────────────
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="sm:col-span-2 flex items-center gap-3 pt-1">
      <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-[1px] bg-border" />
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────
export default function EducationSection({
  records, isOpen, onToggle, onArrayChange, onAdd, onDelete,
}: EducationSectionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      value={isOpen ? "education" : ""}
      onValueChange={() => onToggle()}
      className="w-full"
    >
      <AccordionItem
        value="education"
        className="border border-border rounded-[14px] overflow-hidden bg-card"
      >
        <AccordionTrigger className="hover:no-underline hover:bg-muted/40 px-4 py-3.5 rounded-t-[14px] data-[state=open]:rounded-b-none data-[state=open]:border-b data-[state=open]:border-border">
          <div className="flex items-center gap-3 w-full text-left">
            <span className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-foreground to-foreground/70">
              <GraduationCap size={17} className="text-background" />
            </span>
            <span className="font-semibold text-sm text-foreground">Education</span>
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 pb-4 pt-2 bg-background">
          {records.map((edu: any, i: number) => {
            const levelValue = resolveEducationLevel(edu.education_level);
            return (
              <div
                key={edu.education_id ?? i}
                className="relative mb-4 p-4 rounded-[12px] border border-border bg-card"
              >
                <button
                  className="absolute top-3 right-3 p-1.5 rounded-[8px] hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
                  onClick={() => onDelete("emp_education", i)}
                  title="Remove record"
                >
                  <Trash2 size={14} />
                </button>

                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Record #{i + 1}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SectionDivider label="Education Details" />

                  <FloatingSelect
                    id={`education_level_${i}`}
                    label="Education Level"
                    value={levelValue}
                    onValueChange={(v) => onArrayChange("emp_education", i, "education_level", v)}
                    options={EDUCATION_LEVELS}
                    className="sm:col-span-2"
                  />
                  <FloatingInput
                    id={`school_name_${i}`}
                    label="School Name"
                    value={edu.school_name || ""}
                    onChange={(v) => onArrayChange("emp_education", i, "school_name", v)}
                    className="sm:col-span-2"
                  />
                  <FloatingInput
                    id={`degree_${i}`}
                    label="Degree / Course"
                    value={edu.basic_educ_degree_course || ""}
                    onChange={(v) => onArrayChange("emp_education", i, "basic_educ_degree_course", v)}
                    className="sm:col-span-2"
                  />

                  <SectionDivider label="Attendance Period" />

                  <FloatingDatePicker
                    id={`start_date_${i}`}
                    label="Start Date"
                    value={edu.attendance_start_date || ""}
                    onChange={(v) => onArrayChange("emp_education", i, "attendance_start_date", v)}
                  />
                  <FloatingDatePicker
                    id={`end_date_${i}`}
                    label="End Date"
                    value={edu.attendance_end_date || ""}
                    onChange={(v) => onArrayChange("emp_education", i, "attendance_end_date", v)}
                  />

                  <SectionDivider label="Academic Info" />

                  <FloatingSelect
                    id={`units_${i}`}
                    label="Units Earned"
                    value={edu.highest_level_units_earned || ""}
                    onValueChange={(v) => onArrayChange("emp_education", i, "highest_level_units_earned", v)}
                    options={UNITS_EARNED_OPTIONS}
                  />
                  <FloatingInput
                    id={`year_grad_${i}`}
                    label="Year Graduated"
                    value={edu.year_graduated || ""}
                    onChange={(v) => onArrayChange("emp_education", i, "year_graduated", v)}
                  />
                  <FloatingInput
                    id={`honors_${i}`}
                    label="Scholarship / Honors"
                    value={edu.scholarship_academic_honors || ""}
                    onChange={(v) => onArrayChange("emp_education", i, "scholarship_academic_honors", v)}
                    className="sm:col-span-2"
                  />
                </div>
              </div>
            );
          })}

          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] border-[1.5px] border-dashed border-input hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-sm font-medium text-muted-foreground hover:text-primary"
            onClick={() => onAdd("emp_education", { ...BLANK_EDUCATION, education_id: `new-${Date.now()}` })}
          >
            <Plus size={14} /> Add Education Record
          </button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}