// components/sections/EducationSection.tsx

import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { GraduationCap } from "lucide-react";
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
  onDelete: (section: string, id: string) => void;
}

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
        <div key={edu.education_id} className="record-card record-in">
          
          {/* ✅ DELETE BY ID */}
          <button
            className="delete-btn"
            onClick={() => onDelete("emp_education", edu.education_id)}
            title="Remove record"
            type="button"
          >
            <Trash2 size={13} />
          </button>

          <p className="record-index">Record #{i + 1}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* Education Level */}
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#64748b",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Education Level
              </label>

              <div className="select-wrapper">
                <select
                  value={edu.education_level?.level_id || ""}
                  onChange={(e) =>
                    onArrayChange(
                      "emp_education",
                      i,
                      "education_level",
                      { level_id: e.target.value }
                    )
                  }
                  className="field-select pr-8"
                >
                  <option value="" disabled>
                    Select level...
                  </option>
                  {EDUCATION_LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>

                <ChevronDown size={14} className="select-chevron" />
              </div>
            </div>

            <Field
              label="School Name"
              value={edu.school_name || ""}
              onChange={(v) =>
                onArrayChange("emp_education", i, "school_name", v)
              }
              className="sm:col-span-2"
            />

            <Field
              label="Degree/Course"
              value={edu.basic_educ_degree_course || ""}
              onChange={(v) =>
                onArrayChange(
                  "emp_education",
                  i,
                  "basic_educ_degree_course",
                  v
                )
              }
              className="sm:col-span-2"
            />

            <Field
              label="Start Date"
              type="date"
              value={edu.attendance_start_date || ""}
              onChange={(v) =>
                onArrayChange(
                  "emp_education",
                  i,
                  "attendance_start_date",
                  v
                )
              }
            />

            <Field
              label="End Date"
              type="date"
              value={edu.attendance_end_date || ""}
              onChange={(v) =>
                onArrayChange(
                  "emp_education",
                  i,
                  "attendance_end_date",
                  v
                )
              }
            />

            <Field
              label="Honors"
              value={edu.scholarship_academic_honors || ""}
              onChange={(v) =>
                onArrayChange(
                  "emp_education",
                  i,
                  "scholarship_academic_honors",
                  v
                )
              }
              className="sm:col-span-2"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
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