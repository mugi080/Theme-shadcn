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
  onArrayChange: (section: string, index: number, field: string, value: any) => void;
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
      {records.map((ld: any, i: number) => (
        <div key={ld.ld_intervention_id ?? i} className="record-card record-in">
          <button
            className="delete-btn"
            onClick={() => onDelete("emp_ldinterventions", i)}
            title="Remove record"
          >
            <Trash2 size={13} />
          </button>
          <p className="record-index">Record #{i + 1}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Title"        value={ld.title}     onChange={(v) => onArrayChange("emp_ldinterventions", i, "title", v)} className="sm:col-span-2" />
            <Field label="Date From"    value={ld.date_from} type="date" onChange={(v) => onArrayChange("emp_ldinterventions", i, "date_from", v)} />
            <Field label="Date To"      value={ld.date_to}   type="date" onChange={(v) => onArrayChange("emp_ldinterventions", i, "date_to", v)} />
            <Field label="No. of Hours" value={ld.no_hours}  onChange={(v) => onArrayChange("emp_ldinterventions", i, "no_hours", v)} />
          </div>
        </div>
      ))}

      <button
        className="add-btn"
        onClick={() => onAdd("emp_ldinterventions", { ...BLANK_LD, ld_intervention_id: `new-${Date.now()}` })}
      >
        <Plus size={14} /> Add Training Record
      </button>
    </AccordionSection>
  );
}