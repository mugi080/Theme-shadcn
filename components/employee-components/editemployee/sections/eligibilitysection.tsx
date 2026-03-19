// components/sections/EligibilitySection.tsx

import { Award, Plus, Trash2 } from "lucide-react";
import AccordionSection from "../accordionSection";
import Field from "../field";

const BLANK_ELIGIBILITY = {
  cse_particular: "",
  rating: "",
  exam_date_conferment: "",
  license_no: "",
};

interface EligibilitySectionProps {
  records: any[];
  isOpen: boolean;
  onToggle: () => void;
  onArrayChange: (section: string, index: number, field: string, value: any) => void;
  onAdd: (section: string, blank: object) => void;
  onDelete: (section: string, index: number) => void;
}

export default function EligibilitySection({
  records,
  isOpen,
  onToggle,
  onArrayChange,
  onAdd,
  onDelete,
}: EligibilitySectionProps) {
  return (
    <AccordionSection
      sectionKey="eligibility"
      label="Civil Service Eligibility"
      Icon={Award}
      gradient="from-amber-500 to-amber-600"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {records.map((elig: any, i: number) => (
        <div key={elig.eligibility_id ?? i} className="record-card record-in">
          <button
            className="delete-btn"
            onClick={() => onDelete("emp_eligibility", i)}
            title="Remove record"
          >
            <Trash2 size={13} />
          </button>
          <p className="record-index">Record #{i + 1}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Eligibility" value={elig.cse_particular}       onChange={(v) => onArrayChange("emp_eligibility", i, "cse_particular", v)} className="sm:col-span-2" />
            <Field label="Rating"      value={elig.rating}               onChange={(v) => onArrayChange("emp_eligibility", i, "rating", v)} />
            <Field label="Exam Date"   value={elig.exam_date_conferment} type="date" onChange={(v) => onArrayChange("emp_eligibility", i, "exam_date_conferment", v)} />
            <Field label="License No." value={elig.license_no}           onChange={(v) => onArrayChange("emp_eligibility", i, "license_no", v)} />
          </div>
        </div>
      ))}

      <button
        className="add-btn"
        onClick={() => onAdd("emp_eligibility", { ...BLANK_ELIGIBILITY, eligibility_id: `new-${Date.now()}` })}
      >
        <Plus size={14} /> Add Eligibility Record
      </button>
    </AccordionSection>
  );
}