// components/sections/FamilyBackgroundSection.tsx
"use client";

import { Users, Plus, Trash2 } from "lucide-react";
import AccordionSection from "../accordionSection";
import Field from "../field";

const CHILD_STATUS_OPTIONS = ["ACTIVE", "INACTIVE", "Male", "Female", ""];

const BLANK_CHILD = {
  children_id: "",
  child_name: "",
  child_birthdate: "",
  status: "",
};

interface FamilyBackgroundSectionProps {
  formData: any;
  records: any[];
  isOpen: boolean;
  onToggle: () => void;
  onFieldChange: (field: string, value: any) => void;
  onArrayChange: (section: string, index: number, field: string, value: any) => void;
  onAdd: (section: string, blank: object) => void;
  onDelete: (section: string, index: number) => void;
}

export default function FamilyBackgroundSection({
  formData,
  records,
  isOpen,
  onToggle,
  onFieldChange,
  onArrayChange,
  onAdd,
  onDelete,
}: FamilyBackgroundSectionProps) {
  const family = formData || {};

  return (
    <AccordionSection
      sectionKey="family"
      label="Family Background"
      Icon={Users}
      gradient="from-black to-black/90"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {/* ── Spouse Information ── */}
      <div className="record-card">
        <p className="record-index">Spouse Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="First Name" value={family.spouse_firstname || ""} onChange={(v) => onFieldChange("spouse_firstname", v)} />
          <Field label="Middle Name" value={family.spouse_middlename || ""} onChange={(v) => onFieldChange("spouse_middlename", v)} />
          <Field label="Last Name" value={family.spouse_surname || ""} onChange={(v) => onFieldChange("spouse_surname", v)} />
          <Field label="Name Extension" value={family.spouse_name_ext || ""} onChange={(v) => onFieldChange("spouse_name_ext", v)} />
          <Field label="Occupation" value={family.spouse_occupation || ""} onChange={(v) => onFieldChange("spouse_occupation", v)} className="sm:col-span-2" />
          <Field label="Employer / Business Name" value={family.spouse_employer_business_name || ""} onChange={(v) => onFieldChange("spouse_employer_business_name", v)} className="sm:col-span-2" />
          <Field label="Business Address" value={family.spouse_business_address || ""} onChange={(v) => onFieldChange("spouse_business_address", v)} className="sm:col-span-2" />
          <Field label="Telephone / Mobile No." value={family.spouse_telephone_no || ""} onChange={(v) => onFieldChange("spouse_telephone_no", v)} className="sm:col-span-2" type="tel" />
        </div>
      </div>

      {/* ── Father's Information ── */}
      <div className="record-card">
        <p className="record-index">Father's Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="First Name" value={family.father_firstname || ""} onChange={(v) => onFieldChange("father_firstname", v)} />
          <Field label="Middle Name" value={family.father_middlename || ""} onChange={(v) => onFieldChange("father_middlename", v)} />
          <Field label="Last Name" value={family.father_surname || ""} onChange={(v) => onFieldChange("father_surname", v)} />
          <Field label="Name Extension" value={family.father_name_ext || ""} onChange={(v) => onFieldChange("father_name_ext", v)} />
        </div>
      </div>

      {/* ── Mother's Information ── */}
      <div className="record-card">
        <p className="record-index">Mother's Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="First Name" value={family.mother_firstname || ""} onChange={(v) => onFieldChange("mother_firstname", v)} />
          <Field label="Middle Name" value={family.mother_middlename || ""} onChange={(v) => onFieldChange("mother_middlename", v)} />
          <Field label="Last Name" value={family.mother_surname || ""} onChange={(v) => onFieldChange("mother_surname", v)} className="sm:col-span-2" />
        </div>
      </div>

      {/* ── Children Records (Array) ── */}
      {records.map((child: any, i: number) => (
        <div key={child.children_id ?? i} className="record-card record-in">
          <button
            className="delete-btn"
            onClick={() => onDelete("emp_children", i)}
            title="Remove child"
          >
            <Trash2 size={13} />
          </button>
          <p className="record-index">Child #{i + 1}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Child's Name" value={child.child_name || ""} onChange={(v) => onArrayChange("emp_children", i, "child_name", v)} className="sm:col-span-2" />
            <Field label="Birthdate" value={child.child_birthdate || ""} type="date" onChange={(v) => onArrayChange("emp_children", i, "child_birthdate", v)} />
            <Field label="Status / Sex" value={child.status || ""} onChange={(v) => onArrayChange("emp_children", i, "status", v)} className="sm:col-span-2" />
          </div>
        </div>
      ))}

      {/* Add Child Button */}
      <button
        className="add-btn"
        onClick={() => onAdd("emp_children", { ...BLANK_CHILD, children_id: `new-${Date.now()}` })}
      >
        <Plus size={14} /> Add Child
      </button>
    </AccordionSection>
  );
}