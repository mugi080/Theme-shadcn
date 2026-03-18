// components/sections/VoluntaryWorkSection.tsx

import { Heart, Plus, Trash2 } from "lucide-react";
import AccordionSection from "../accordionSection";
import Field from "../field";

const BLANK_VOLUNTARY = {
  organization_name: "",
  position_nature_of_work: "",
  date_from: "",
  date_to: "",
  no_hours: "",
};

interface VoluntaryWorkSectionProps {
  records: any[];
  isOpen: boolean;
  onToggle: () => void;
  onArrayChange: (section: string, index: number, field: string, value: any) => void;
  onAdd: (section: string, blank: object) => void;
  onDelete: (section: string, index: number) => void;
}

export default function VoluntaryWorkSection({
  records,
  isOpen,
  onToggle,
  onArrayChange,
  onAdd,
  onDelete,
}: VoluntaryWorkSectionProps) {
  return (
    <AccordionSection
      sectionKey="voluntary"
      label="Voluntary Work"
      Icon={Heart}
      gradient="from-rose-500 to-rose-600"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {records.map((vol: any, i: number) => (
        <div key={vol.voluntary_work_id ?? i} className="record-card record-in">
          <button
            className="delete-btn"
            onClick={() => onDelete("emp_voluntary_work", i)}
            title="Remove record"
          >
            <Trash2 size={13} />
          </button>
          <p className="record-index">Record #{i + 1}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Organization" value={vol.organization_name}       onChange={(v) => onArrayChange("emp_voluntary_work", i, "organization_name", v)} className="sm:col-span-2" />
            <Field label="Position"     value={vol.position_nature_of_work} onChange={(v) => onArrayChange("emp_voluntary_work", i, "position_nature_of_work", v)} className="sm:col-span-2" />
            <Field label="Date From"    value={vol.date_from} type="date"   onChange={(v) => onArrayChange("emp_voluntary_work", i, "date_from", v)} />
            <Field label="Date To"      value={vol.date_to}   type="date"   onChange={(v) => onArrayChange("emp_voluntary_work", i, "date_to", v)} />
            <Field label="No. of Hours" value={vol.no_hours}                onChange={(v) => onArrayChange("emp_voluntary_work", i, "no_hours", v)} />
          </div>
        </div>
      ))}

      <button
        className="add-btn"
        onClick={() => onAdd("emp_voluntary_work", { ...BLANK_VOLUNTARY, voluntary_work_id: `new-${Date.now()}` })}
      >
        <Plus size={14} /> Add Voluntary Work
      </button>
    </AccordionSection>
  );
}