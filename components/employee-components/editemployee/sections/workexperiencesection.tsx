// components/sections/WorkExperienceSection.tsx

import { Briefcase, Plus, Trash2 } from "lucide-react";
import AccordionSection from "../accordionSection";
import Field from "../field";

const BLANK_WORK = {
  position_title: "",
  department_company: "",
  date_from: "",
  date_to: "",
  salary_monthly: "",
};

interface WorkExperienceSectionProps {
  records: any[];
  isOpen: boolean;
  onToggle: () => void;
  onArrayChange: (section: string, index: number, field: string, value: any) => void;
  onAdd: (section: string, blank: object) => void;
  onDelete: (section: string, index: number) => void;
}

export default function WorkExperienceSection({
  records,
  isOpen,
  onToggle,
  onArrayChange,
  onAdd,  
  onDelete,
}: WorkExperienceSectionProps) {
  return (
    <AccordionSection
      sectionKey="work"
      label="Work Experience"
      Icon={Briefcase}
      gradient="from-emerald-500 to-emerald-600"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {records.map((work: any, i: number) => (
        <div key={work.work_id ?? i} className="record-card record-in">
          <button
            className="delete-btn"
            onClick={() => onDelete("emp_work_exp", i)}
            title="Remove record"
          >
            <Trash2 size={13} />
          </button>
          <p className="record-index">Record #{i + 1}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Position Title"     value={work.position_title}     onChange={(v) => onArrayChange("emp_work_exp", i, "position_title", v)} className="sm:col-span-2" />
            <Field label="Company/Department" value={work.department_company} onChange={(v) => onArrayChange("emp_work_exp", i, "department_company", v)} className="sm:col-span-2" />
            <Field label="Date From"          value={work.date_from} type="date" onChange={(v) => onArrayChange("emp_work_exp", i, "date_from", v)} />
            <Field label="Date To"            value={work.date_to}   type="date" onChange={(v) => onArrayChange("emp_work_exp", i, "date_to", v)} />
            <Field label="Monthly Salary"     value={work.salary_monthly}     onChange={(v) => onArrayChange("emp_work_exp", i, "salary_monthly", v)} />
          </div>
        </div>
      ))}

      <button
        className="add-btn"
        onClick={() => onAdd("emp_work_exp", { ...BLANK_WORK, work_id: `new-${Date.now()}` })}
      >
        <Plus size={14} /> Add Work Experience
      </button>
    </AccordionSection>
  );
}