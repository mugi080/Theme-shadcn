// components/sections/EducationSection.tsx
"use client";

import { useState } from "react";
import { GraduationCap, ChevronDown, Plus, Trash2 } from "lucide-react";
import AccordionSection from "../accordionSection";
import Field from "../field";

const EDUCATION_LEVELS = [
  "Elementary",
  "Junior High School",
  "Senior High School",
  "Vocational / Technical",
  "College",
  "Post-Graduate",
];

const BLANK_EDUCATION = {
  education_level: "",
  school_name: "",
  basic_educ_degree_course: "",
  attendance_start_date: "",
  attendance_end_date: "",
  scholarship_academic_honors: "",
};

interface EducationSectionProps {
  records: any[];
  isOpen: boolean;
  onToggle: () => void;
  onArrayChange: (section: string, index: number, field: string, value: any) => void;
  onAdd: (section: string, blank: object) => void;
  onDelete: (section: string, index: number) => void;
}

// ── Floating label select (matches Field.tsx style) ──────────────
function FloatSelect({
  label,
  value,
  options,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  className?: string;
}) {
  const [focused, setFocused] = useState(false);
  const isFloated = focused || !!value;

  return (
    <div className={className} style={{ position: "relative", marginBottom: 4 }}>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          appearance: "none",
          background: "#f8fafc",
          border: `1.5px solid ${focused ? "#3b82f6" : "#e2e8f0"}`,
          borderRadius: 10,
          padding: isFloated ? "18px 36px 6px 12px" : "12px 36px 12px 12px",
          fontSize: 14,
          color: value ? "#1e293b" : "transparent",
          outline: "none",
          transition: "all 0.15s",
          boxShadow: focused ? "0 0 0 3px rgba(59,130,246,0.12)" : "none",
          fontFamily: "inherit",
          cursor: "pointer",
        }}
      >
        <option value="" disabled>Select level…</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>

      {/* Floating label */}
      <label
        style={{
          position: "absolute",
          left: 12,
          top: isFloated ? 0 : "50%",
          transform: "translateY(-50%)",
          fontSize: isFloated ? 10 : 14,
          fontWeight: isFloated ? 700 : 400,
          color: focused ? "#3b82f6" : isFloated ? "#64748b" : "#94a3b8",
          letterSpacing: isFloated ? "0.06em" : "0",
          textTransform: isFloated ? "uppercase" : "none",
          pointerEvents: "none",
          transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
          background: isFloated ? "#f8fafc" : "transparent",
          paddingLeft: isFloated ? 4 : 0,
          paddingRight: isFloated ? 4 : 0,
          whiteSpace: "nowrap",
          lineHeight: 1,
          zIndex: 1,
        }}
      >
        {label}
      </label>

      <ChevronDown
        size={14}
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: "#94a3b8",
        }}
      />
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────
export default function EducationSection({
  records,
  isOpen,
  onToggle,
  onArrayChange,
  onAdd,
  onDelete,
}: EducationSectionProps) {
  return (
    <AccordionSection
      sectionKey="education"
      label="Education"
      Icon={GraduationCap}
      gradient="from-violet-500 to-violet-600"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {records.map((edu: any, i: number) => (
        <div key={edu.education_id ?? i} className="record-card record-in">
          {/* Delete button */}
          <button
            className="delete-btn"
            onClick={() => onDelete("emp_education", i)}
            title="Remove record"
          >
            <Trash2 size={13} />
          </button>

          <p className="record-index">Record #{i + 1}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FloatSelect
              label="Education Level"
              value={edu.education_level || ""}
              options={EDUCATION_LEVELS}
              onChange={(v) => onArrayChange("emp_education", i, "education_level", v)}
              className="sm:col-span-2"
            />
            <Field
              label="School Name"
              value={edu.school_name}
              onChange={(v) => onArrayChange("emp_education", i, "school_name", v)}
              className="sm:col-span-2"
            />
            <Field
              label="Degree / Course"
              value={edu.basic_educ_degree_course}
              onChange={(v) => onArrayChange("emp_education", i, "basic_educ_degree_course", v)}
              className="sm:col-span-2"
            />
            <Field
              label="Start Date"
              value={edu.attendance_start_date}
              type="date"
              onChange={(v) => onArrayChange("emp_education", i, "attendance_start_date", v)}
            />
            <Field
              label="End Date"
              value={edu.attendance_end_date}
              type="date"
              onChange={(v) => onArrayChange("emp_education", i, "attendance_end_date", v)}
            />
            <Field
              label="Scholarship / Honors"
              value={edu.scholarship_academic_honors}
              onChange={(v) => onArrayChange("emp_education", i, "scholarship_academic_honors", v)}
              className="sm:col-span-2"
            />
          </div>
        </div>
      ))}

      {/* Add button */}
      <button
        className="add-btn"
        onClick={() =>
          onAdd("emp_education", {
            ...BLANK_EDUCATION,
            education_id: `new-${Date.now()}`,
          })
        }
      >
        <Plus size={14} /> Add Education Record
      </button>
    </AccordionSection>
  );
}