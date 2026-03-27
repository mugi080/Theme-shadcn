// components/sections/LearningDevelopmentSection.tsx

import { BookOpen, Plus, Trash2 } from "lucide-react";
import AccordionSection from "../accordionSection";
import Field from "../field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ── Floating Label Select (copied from PersonalInfoSection) ─────
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
          className={`peer w-full bg-card text-foreground border-input transition-all duration-200 focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none ${isFloated ? "pt-5 pb-1.5" : "pt-3 pb-3"} ${error ? "border-destructive" : ""}`}>
          <SelectValue placeholder=" " className="text-foreground" />
        </SelectTrigger>
        <SelectContent position="popper" className="bg-popover text-popover-foreground border-border max-h-60 overflow-y-auto" align="start" sideOffset={4}>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt} className="text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer">{opt}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <label htmlFor={id}
        className={`absolute left-3 pointer-events-none transition-all duration-200 ease-in-out peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wide peer-focus:bg-card peer-focus:px-1 peer-focus:z-10 ${isFloated ? "top-0 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wide bg-card px-1 z-10" : "top-1/2 -translate-y-1/2 text-sm font-normal"} ${error ? "text-destructive" : "text-muted-foreground peer-focus:text-ring"}`}>
        {label}
      </label>
      {error && <p className="mt-1 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

// ✅ Predefined options for Type of L&D
const LD_TYPES = [
  "Managerial",
  "Supervisory", 
  "Technical",
  "Professional Development",
  "Leadership Training",
  "Compliance / Regulatory",
  "Soft Skills",
  "Digital / IT Skills",
  "Safety & Health",
  "Other"
];

const BLANK_LD = {
  title: "",
  conducted_by: "",
  type_name: "",         // ✅ Will store selected dropdown value
  date_from: "",
  date_to: "",
  no_hours: "",
};

interface LearningDevelopmentSectionProps {
  records: any[];
  isOpen: boolean;
  onToggle: () => void;
  onArrayChange: (
    section: string,
    index: number,
    field: string,
    value: any
  ) => void;
  onAdd: (section: string, blank: object) => void;
  onDelete: (section: string, index: number) => void;
}

export default function LearningDevelopmentSection({
  records,
  isOpen,
  onToggle,
  onArrayChange,
  onAdd,
  onDelete,
}: LearningDevelopmentSectionProps) {
  return (
    <AccordionSection
      sectionKey="ld"
      label="Learning & Development"
      Icon={BookOpen}
      gradient="from-cyan-500 to-cyan-600"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {/* RECORDS */}
      {records.map((ld: any, i: number) => {
        // ✅ Helper to get type_name from nested or flat structure
        const getTypeName = () => {
          if (ld.ldintervention_type?.type_name) return ld.ldintervention_type.type_name;
          if (ld.type_name) return ld.type_name;
          return "";
        };

        return (
          <div
            key={ld.ld_intervention_id ?? i}
            className="relative mb-4 p-4 rounded-[12px] border border-border bg-card"
          >
            <button
              className="absolute top-3 right-3 p-1.5 rounded-[8px] 
                         hover:bg-destructive/10 hover:text-destructive 
                         transition-colors duration-200"
              onClick={() => onDelete("emp_ldinterventions", i)}
            >
              <Trash2 size={14} />
            </button>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Record #{i + 1}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Title */}
              <Field
                label="Title"
                value={ld.title ?? ""}
                onChange={(v) =>
                  onArrayChange("emp_ldinterventions", i, "title", v)
                }
                className="sm:col-span-2"
              />
              
              {/* ✅ Conducted By — Free Text Input */}
              <Field
                label="Conducted By"
                value={ld.conducted_by ?? ""}
                onChange={(v) =>
                  onArrayChange("emp_ldinterventions", i, "conducted_by", v)
                }
                className="sm:col-span-2"
              />
              
              {/* ✅ Type of L&D — DROPDOWN with FloatingSelect (same design as PersonalInfo) */}
              <FloatingSelect
                id={`ld_type_${i}`}
                label="Type of L&D"
                value={getTypeName()}
                onValueChange={(v) =>
                  onArrayChange("emp_ldinterventions", i, "type_name", v)
                }
                options={LD_TYPES}
                className="sm:col-span-2"
              />
              
              {/* Date From */}
              <Field
                label="Date From"
                type="date"
                value={ld.date_from ?? ""}
                onChange={(v) =>
                  onArrayChange("emp_ldinterventions", i, "date_from", v)
                }
              />
              
              {/* Date To */}
              <Field
                label="Date To"
                type="date"
                value={ld.date_to ?? ""}
                onChange={(v) =>
                  onArrayChange("emp_ldinterventions", i, "date_to", v)
                }
              />
              
              {/* No. of Hours */}
              <Field
                label="No. of Hours"
                value={ld.no_hours ?? ""}
                onChange={(v) =>
                  onArrayChange("emp_ldinterventions", i, "no_hours", v)
                }
              />
            </div>
          </div>
        );
      })}
      
      {/* Add Button */}
      <div className="px-4 pb-4 pt-2 bg-background">
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 
                     rounded-[10px] border-[1.5px] border-dashed border-input 
                     hover:border-primary/50 hover:bg-primary/5 
                     transition-all duration-200 text-sm font-medium 
                     text-muted-foreground hover:text-primary"
          onClick={() =>
            onAdd("emp_ldinterventions", {
              ...BLANK_LD,
              ld_intervention_id: `new-${Date.now()}`,
            })
          }
        >
          <Plus size={14} /> Add Training Record
        </button>
      </div>
    </AccordionSection>
  );
}