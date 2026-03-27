// components/sections/LearningDevelopmentSection.tsx

import { BookOpen, Plus, Trash2 } from "lucide-react";
import AccordionSection from "../accordionSection";
import Field from "../field";

const BLANK_LD = {
  title: "",
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
      {records.map((ld: any, i: number) => (
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
            <Field
              label="Title"
              value={ld.title}
              onChange={(v) =>
                onArrayChange("emp_ldinterventions", i, "title", v)
              }
              className="sm:col-span-2"
            />
            <Field
              label="Date From"
              type="date"
              value={ld.date_from}
              onChange={(v) =>
                onArrayChange("emp_ldinterventions", i, "date_from", v)
              }
            />
            <Field
              label="Date To"
              type="date"
              value={ld.date_to}
              onChange={(v) =>
                onArrayChange("emp_ldinterventions", i, "date_to", v)
              }
            />
            <Field
              label="No. of Hours"
              value={ld.no_hours}
              onChange={(v) =>
                onArrayChange("emp_ldinterventions", i, "no_hours", v)
              }
            />
          </div>
        </div>
      ))}
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