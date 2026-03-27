"use client";

import { useState } from "react";
import {
  Star, Trophy, Users, Plus, Trash2, ChevronDown,
  HelpCircle, CheckCircle2, XCircle,
  User,CreditCard, Calendar as CalendarIcon, ChevronLeft, ChevronRight,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger
} from "@/components/ui/popover"; // Fix: Don't import from radix-ui directly
import { Button } from "@/components/ui/button"; // Fix: Don't import from react-day-picker
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

const BLANK_SKILL       = { description: "", order: 0 };
const BLANK_RECOGNITION = { description: "", order: 0 };
const BLANK_MEMBERSHIP  = { description: "", order: 0 };

interface OtherInfoSectionProps {
  formData: any;
  isOpen: boolean;
  onToggle: () => void;
  onArrayChange: (section: string, index: number, field: string, value: any) => void;
  onAdd: (section: string, blank: object) => void;
  onDelete: (section: string, index: number) => void;
}

function FloatingDatePicker({ id, label, value, onChange, className = "", error }: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  className?: string; error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(() => {
    if (value) {
      const [y, m, d] = value.split("-").map(Number);
      return new Date(y, m - 1, d || 1);
    }
    return new Date();
  });

  const selected = value ? (() => { 
    const [y, m, d] = value.split("-").map(Number); 
    return new Date(y, m - 1, d); 
  })() : undefined;

  const isFloated = !!value || open;
  
  // Year range for the selector
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 80 + i).reverse();

  return (
    <div className={`relative ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            type="button"
            className={`w-full h-[48px] justify-start text-left font-normal bg-card border-input rounded-[10px] transition-all duration-200 ${
              isFloated ? "pt-4 pb-1 px-3" : "px-3"
            } ${!selected ? "text-transparent" : "text-sm text-foreground"}`}
          >
            <span className="flex-1 truncate">
              {selected ? format(selected, "MMM d, yyyy") : ""}
            </span>
            <CalendarIcon className="ml-2 h-3.5 w-3.5 opacity-40" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-[280px] p-0 z-[100] rounded-xl shadow-2xl border-border" align="start">
          {/* COMPACT HEADER WITH YEAR PICKER */}
          <div className="flex items-center gap-1 px-3 py-2 bg-muted/20 border-b">
            {/* Month Select */}
            <Select 
              value={String(viewDate.getMonth())} 
              onValueChange={(v) => setViewDate(new Date(viewDate.getFullYear(), Number(v), 1))}
            >
              <SelectTrigger className="h-8 flex-[2] text-[11px] font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[110]">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                  <SelectItem key={m} value={String(i)} className="text-xs">{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year Select - THIS WAS MISSING */}
            <Select 
              value={String(viewDate.getFullYear())} 
              onValueChange={(v) => setViewDate(new Date(Number(v), viewDate.getMonth(), 1))}
            >
              <SelectTrigger className="h-8 flex-1 text-[11px] font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[110]">
                <ScrollArea className="h-48">
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)} className="text-xs">{y}</SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          <CalendarComponent 
            mode="single" selected={selected} month={viewDate} onMonthChange={setViewDate} onSelect={(d: Date | undefined) => { 
              if (d) {
                onChange(format(d, "yyyy-MM-dd")); 
                setOpen(false); 
              }
            }}
            // Disable the default navigation since we built a custom one above
            showOutsideDays={false}
            className="p-2" 
          />
        </PopoverContent>
      </Popover>

      <label className={`absolute left-3 pointer-events-none z-20 transition-all duration-200 ${
          isFloated 
            ? "top-0 -translate-y-1/2 text-[9px] font-bold uppercase tracking-widest bg-card px-1 text-muted-foreground" 
            : "top-1/2 -translate-y-1/2 text-sm font-normal text-muted-foreground/60"
        }`}>
        {label}
      </label>
    </div>
  );
}
// ── Floating Label Input ─────────────────────────────────────────
function FloatingInput({ id, label, value, onChange, className = "" }: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; className?: string;
}) {
  const isFloated = !!value;
  return (
    <div className={`relative ${className}`}>
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder=" "
        className={`peer w-full bg-card text-foreground border-input placeholder:text-transparent transition-all duration-200 focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none ${isFloated ? "pt-5 pb-1.5" : "pt-3 pb-3"}`}
      />
      <Label htmlFor={id}
        className={`absolute left-3 pointer-events-none transition-all duration-200 ease-in-out peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wide peer-focus:bg-card peer-focus:px-1 peer-focus:z-10 ${isFloated ? "top-0 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wide bg-card px-1 z-10" : "top-1/2 -translate-y-1/2 text-sm font-normal"} text-muted-foreground peer-focus:text-ring`}>
        {label}
      </Label>
    </div>
  );
}

// ── Sub-section collapsible ──────────────────────────────────────
function SubSection({ label, Icon, iconGradient, count, isOpen, onToggle, children }: {
  label: string; Icon: any; iconGradient: string;
  count: number; isOpen: boolean; onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[12px] border border-border overflow-hidden bg-card">
      <button type="button" onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 bg-card hover:bg-muted/40 transition-colors text-left"
        style={{ borderBottom: isOpen ? "1px solid var(--border)" : "none" }}>
        <span className={`w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${iconGradient}`}>
          <Icon size={15} className="text-white" />
        </span>
        <span className="font-semibold text-sm text-foreground flex-1">{label}</span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground mr-1">{count}</span>
        <ChevronDown size={14} className="text-muted-foreground transition-transform duration-200 flex-shrink-0"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>
      {isOpen && <div className="px-4 pb-4 pt-3 bg-background">{children}</div>}
    </div>
  );
}

// ── List editor ──────────────────────────────────────────────────
function ListEditor({ section, records, idKey, placeholder, addLabel, onArrayChange, onAdd, onDelete, blank }: {
  section: string; records: any[]; idKey: string;
  placeholder: string; addLabel: string;
  onArrayChange: (section: string, index: number, field: string, value: any) => void;
  onAdd: (section: string, blank: object) => void;
  onDelete: (section: string, index: number) => void;
  blank: object;
}) {
  return (
    <div className="flex flex-col gap-3">
      {records.map((item: any, i: number) => (
        <div key={item[idKey] ?? i} className="relative p-4 rounded-[12px] border border-border bg-card">
          <button className="absolute top-3 right-3 p-1.5 rounded-[8px] hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
            onClick={() => onDelete(section, i)} title="Remove">
            <Trash2 size={14} />
          </button>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Record #{i + 1}</p>
          <FloatingInput id={`${section}_desc_${i}`} label={placeholder}value={item.description ?? ""}
            onChange={(v) => onArrayChange(section, i, "description", v)}
          />
        </div>
      ))}
      <button
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] border-[1.5px] border-dashed border-input hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-sm font-medium text-muted-foreground hover:text-primary"
        onClick={() => onAdd(section, { ...blank, [idKey]: `new-${Date.now()}` })}>
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );
}

// ── Questions editor — uses emp_addtl ────────────────────────────
function QuestionsEditor({ questions, onArrayChange }: {
  questions: any[];
  onArrayChange: (section: string, index: number, field: string, value: any) => void;
}) {
  if (!questions || questions.length === 0) {
    return <p className="text-xs text-muted-foreground italic">No questions found.</p>;
  }

  const sorted = [...questions].sort((a, b) => {
    const pdsNoA = a.questions?.pds_no ?? 0;
    const pdsNoB = b.questions?.pds_no ?? 0;
    if (pdsNoA !== pdsNoB) return pdsNoA - pdsNoB;
    return (a.questions?.pds_order ?? 0) - (b.questions?.pds_order ?? 0);
  });

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((item: any, i: number) => {
        // ✅ Use emp_addtl as section key + match by addtl_id
        const originalIndex = questions.findIndex(q => q.addtl_id === item.addtl_id);
        if (originalIndex === -1) return null;
        const normalizeBool = (val: any) => val === true || val === "true";
        const isYes = normalizeBool(item.answer);
        

        return (
          <div key={item.addtl_id ?? i} className="rounded-[12px] border border-border bg-card p-4">
            <div className="flex items-start gap-3 mb-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold shrink-0 mt-0.5">
                {item.questions?.pds_no ?? i + 1}
              </span>
              <p className="text-sm font-semibold text-foreground leading-snug flex-1">
                {item.questions?.question ?? "Question"}
              </p>
            </div>

            {/* Yes / No toggle */}
            <div className="flex items-center gap-2 mb-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1">Answer:</p>
              <button type="button"
                onClick={() => onArrayChange("emp_addtl", originalIndex, "answer", true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 border ${
                  isYes
                    ? "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700"
                    : "bg-muted text-muted-foreground border-border hover:border-emerald-300 hover:bg-emerald-50"
                }`}>
                <CheckCircle2 size={13} /> Yes
              </button>
              <button type="button"
                onClick={() => onArrayChange("emp_addtl", originalIndex, "answer", false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 border ${
                  !isYes
                    ? "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-900/50 dark:text-rose-300 dark:border-rose-700"
                    : "bg-muted text-muted-foreground border-border hover:border-rose-300 hover:bg-rose-50"
                }`}>
                <XCircle size={13} /> No
              </button>
            </div>

            {/* Details textarea — shown when Yes */}
            {isYes && (
              <div className="relative">
                <Textarea
                  id={`addtl_details_${originalIndex}`}
                  value={item.answer_details ?? ""}
                  onChange={(e) => onArrayChange("emp_addtl", originalIndex, "answer_details", e.target.value)}
                  placeholder="Provide details..."
                  rows={2}
                  className="w-full bg-card text-foreground border-input text-sm resize-none focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none pt-4 pb-2 px-3 rounded-lg"
                />
                <label className="absolute left-3 top-0 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wide bg-card px-1 text-muted-foreground pointer-events-none z-10">
                  Details
                </label>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ReferencesEditor({
  references,
  onArrayChange,onAdd,onDelete,
}: {
  references: any[];
  onArrayChange: (section: string, index: number, field: string, value: any) => void;
  onAdd: (section: string, blank: object) => void;
  onDelete: (section: string, index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {references.map((ref: any, i: number) => (
        <div key={ref.reference_id ?? i} className="p-4 rounded-[12px] border bg-card relative">

          {/* DELETE */}
          <button onClick={() => onDelete("emp_references", i)}
            className="absolute top-3 right-3 p-1.5 hover:bg-destructive/10 rounded">
            <Trash2 size={14} />
          </button>

          <p className="text-xs font-bold mb-2">Reference #{i + 1}</p>

          <FloatingInput id={`ref_name_${i}`}label="Full Name"value={ref.name ?? ""}
            onChange={(v) => onArrayChange("emp_references", i, "name", v)}/>
          <FloatingInput id={`ref_address_${i}`}label="Address"value={ref.address ?? ""}
            onChange={(v) => onArrayChange("emp_references", i, "address", v)}className="mt-2"/>
          <FloatingInput id={`ref_tel_${i}`}label="Contact Number"value={ref.tel_no ?? ""}
            onChange={(v) => onArrayChange("emp_references", i, "tel_no", v)}className="mt-2"/>
        </div>
      ))}

      {<button type="button"onClick={() =>onAdd("emp_references", {reference_id: `new-${Date.now()}`,name: "",address: "",tel_no: "",})}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] border-[1.5px] border-dashed border-input hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-sm font-medium text-muted-foreground hover:text-primary">
        <Plus size={14} /> Add Reference
      </button>}
    </div>
  );
}

function IdentificationsEditor({
  identifications,
  onArrayChange,onAdd,onDelete,
}: {
  identifications: any[];
  onArrayChange: (section: string, index: number, field: string, value: any) => void;
  onAdd: (section: string, blank: object) => void;
  onDelete: (section: string, index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {identifications.map((id: any, i: number) => (
        <div key={id.identification_id ?? i} className="p-4 rounded-[12px] border bg-card relative">

          {/* DELETE */}
          <button onClick={() => onDelete("emp_identifications", i)}
            className="absolute top-3 right-3 p-1.5 hover:bg-destructive/10 rounded">
            <Trash2 size={14} />
          </button>

          <p className="text-xs font-bold mb-2">ID #{i + 1}</p>

          <FloatingInput id={`id_type_${i}`}label="ID Type"value={id.govt_issued_id ?? ""}
            onChange={(v) => onArrayChange("emp_identifications", i, "govt_issued_id", v)}/>
          <FloatingInput id={`id_no_${i}`}label="ID Number"value={id.id_no ?? ""}
            onChange={(v) => onArrayChange("emp_identifications", i, "id_no", v)}className="mt-2"/>
          <FloatingDatePicker id={`id_date_${i}`}label="Issuance Date"value={id.issuance_date ?? ""}
            onChange={(v) => onArrayChange("emp_identifications", i, "issuance_date", v)}className="mt-2"/>
          <FloatingInput id={`id_place_${i}`}label="Issuance Place"value={id.issuance_place ?? ""}
            onChange={(v) => onArrayChange("emp_identifications", i, "issuance_place", v)}className="mt-2"/>
        </div>
      ))}

      {/* ADD BUTTON */}
      <button type="button"onClick={() => onAdd("emp_identifications", {
            identification_id: `new-${Date.now()}`,
            govt_issued_id: "",id_no: "",issuance_date: "",issuance_place: "",
          })
        }
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] border-[1.5px] border-dashed border-input hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-sm font-medium text-muted-foreground hover:text-primary"
      >
        <Plus size={14} /> Add ID
      </button>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────
export default function OtherInfoSection({
  formData, isOpen, onToggle, onArrayChange, onAdd, onDelete,
}: OtherInfoSectionProps) {
  const [openSub, setOpenSub] = useState<Record<string, boolean>>({
    questions:       true,
    skills:          true,
    recognitions:    true,
    memberships:     true,
    references:      true,
    identifications: true,
  });

  const toggleSub = (key: string) =>
    setOpenSub((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <Accordion type="single" collapsible
      value={isOpen ? "otherinfo" : ""}
      onValueChange={() => onToggle()}
      className="w-full">
      <AccordionItem value="otherinfo" className="border border-border rounded-[14px] overflow-hidden bg-card">
        <AccordionTrigger className="hover:no-underline hover:bg-muted/40 px-4 py-3.5 rounded-t-[14px] data-[state=open]:rounded-b-none data-[state=open]:border-b data-[state=open]:border-border">
          <div className="flex items-center gap-3 w-full text-left">
            <span className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-yellow-500 to-yellow-600">
              <Star size={17} className="text-white" />
            </span>
            <span className="font-semibold text-sm text-foreground">Other Information</span>
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 pb-4 pt-3 bg-background">
          <div className="flex flex-col gap-3">

            {/* ✅ emp_addtl — questions */}
            <SubSection label="Additional Questions"Icon={HelpCircle}
              iconGradient="from-indigo-500 to-indigo-600"count={(formData.emp_addtl ?? []).length}isOpen={!!openSub.questions}onToggle={() => toggleSub("questions")}><QuestionsEditor
              questions={formData.emp_addtl ?? []}onArrayChange={onArrayChange}/>
            </SubSection>

            {/* ✅ emp_skills */}
            <SubSection label="Special Skills & Hobbies"Icon={Star}iconGradient="from-yellow-500 to-yellow-600"count={(formData.emp_skills ?? []).length}isOpen={!!openSub.skills}onToggle={() => toggleSub("skills")}>
              <ListEditor section="emp_skills"records={formData.emp_skills ?? []}idKey="skill_id"placeholder="Skill or hobby"addLabel="Add Skill / Hobby"onArrayChange={onArrayChange}
              onAdd={onAdd}onDelete={onDelete}blank={BLANK_SKILL}/>
            </SubSection>

            {/* ✅ emp_recognitions */}
            <SubSection label="Non-Academic Distinction / Recognitions"Icon={Trophy}
              iconGradient="from-blue-500 to-blue-600"count={(formData.emp_recognitions ?? []).length}isOpen={!!openSub.recognitions}onToggle={() => toggleSub("recognitions")}>
              <ListEditor section="emp_recognitions"records={formData.emp_recognitions ?? []}idKey="recognition_id"placeholder="Recognition or distinction"addLabel="Add Recognition"
              onArrayChange={onArrayChange}onAdd={onAdd} onDelete={onDelete}blank={BLANK_RECOGNITION}/>
            </SubSection>

            {/* ✅ emp_memberships */}
            <SubSection label="Association / Organization Memberships"Icon={Users}iconGradient="from-emerald-500 to-emerald-600"count={(formData.emp_memberships ?? []).length}isOpen={!!openSub.memberships}
              onToggle={() => toggleSub("memberships")}>
              <ListEditor section="emp_memberships"records={formData.emp_memberships ?? []}idKey="membership_id"placeholder="Organization name"addLabel="Add Membership"
              onArrayChange={onArrayChange}onAdd={onAdd}onDelete={onDelete}blank={BLANK_MEMBERSHIP}/>
            </SubSection>

            {/* ✅ emp_references — read-only */}
            <SubSection label="References (Person not related by consanguinity or affinity to applicant /appointee)"Icon={User}iconGradient="from-orange-500 to-orange-600"count={(formData.emp_references ?? []).length}isOpen={!!openSub.references}
              onToggle={() => toggleSub("references")}>
              <ReferencesEditor references={formData.emp_references ?? []}onArrayChange={onArrayChange}onAdd={onAdd}onDelete={onDelete}/>
            </SubSection>

            {/* ✅ emp_identifications — read-only */}
            <SubSection label="Government IDs"Icon={CreditCard}iconGradient="from-slate-500 to-slate-700"count={(formData.emp_identifications ?? []).length}isOpen={!!openSub.identifications}
              onToggle={() => toggleSub("identifications")}>
              <IdentificationsEditor identifications={formData.emp_identifications ?? []} onArrayChange={onArrayChange}onAdd={onAdd} onDelete={onDelete}/>
            </SubSection>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}