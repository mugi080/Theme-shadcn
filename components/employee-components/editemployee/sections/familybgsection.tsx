"use client";

import { useState } from "react";
import { Heart, ChevronDown, Plus, Trash2 } from "lucide-react";
import AccordionSection from "../accordionSection";
import Field from "../field";

const BLANK_CHILD = { child_name: "", child_birthdate: "", status: "" };

interface FamilyBackgroundSectionProps {
  family?: any;       // spouse, father, mother
  children?: any[];   // list of children
  isOpen: boolean;
  onToggle: () => void;
  onFamilyChange: (field: string, value: any) => void;
  onArrayChange: (section: string, index: number, field: string, value: any) => void;
  onAdd: (section: string, blank: object) => void;
  onDelete: (section: string, index: number) => void;
}

// ── Divider ──────────────────────────────────────────────────────
function Divider({ label }: { label: string }) {
  return (
    <div className="sm:col-span-2 flex items-center gap-3 pt-1">
      <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-[1px] bg-slate-200" />
    </div>
  );
}

// ── Floating Select ──────────────────────────────────────────────
function FloatSelect({
  label, value, options, onChange, className = "",
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
    <div className={className} style={{ position: "relative" }}>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-slate-50 border rounded-lg px-3 pr-8 text-sm outline-none"
        style={{
          paddingTop: isFloated ? 18 : 12,
          paddingBottom: isFloated ? 6 : 12,
        }}
      >
        <option value="" disabled>Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>

      <label
        className={`absolute left-3 transition-all ${
          isFloated
            ? "top-0 text-[10px] font-bold uppercase text-slate-500"
            : "top-1/2 -translate-y-1/2 text-sm text-slate-400"
        }`}
      >
        {label}
      </label>

      <ChevronDown
        size={14}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────
export default function FamilyBackgroundSection({
  family = {},
  children = [],
  isOpen,
  onToggle,
  onFamilyChange,
  onArrayChange,
  onAdd,
  onDelete,
}: FamilyBackgroundSectionProps) {

  return (
    <AccordionSection
      sectionKey="family"
      label="Family Background"
      Icon={Heart}
      gradient="from-pink-500 to-pink-600"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* ── Spouse ── */}
        <Divider label="Spouse" />
        <Field label="First Name"  value={family.spouse_firstname ?? ""}  onChange={(v) => onFamilyChange("spouse_firstname", v)} />
        <Field label="Middle Name" value={family.spouse_middlename ?? ""} onChange={(v) => onFamilyChange("spouse_middlename", v)} />
        <Field label="Last Name"   value={family.spouse_surname ?? ""}    onChange={(v) => onFamilyChange("spouse_surname", v)} />
        <Field label="Name Ext."   value={family.spouse_name_ext ?? ""}   onChange={(v) => onFamilyChange("spouse_name_ext", v)} />
        <Field label="Occupation"  value={family.spouse_occupation ?? ""} onChange={(v) => onFamilyChange("spouse_occupation", v)} className="sm:col-span-2" />
        <Field label="Employer / Business Name" value={family.spouse_employer_business_name ?? ""} onChange={(v) => onFamilyChange("spouse_employer_business_name", v)} className="sm:col-span-2" />
        <Field label="Business Address" value={family.spouse_business_address ?? ""} onChange={(v) => onFamilyChange("spouse_business_address", v)} className="sm:col-span-2" />
        <Field label="Telephone No." value={family.spouse_telephone_no ?? ""} onChange={(v) => onFamilyChange("spouse_telephone_no", v)} />

        {/* ── Father ── */}
        <Divider label="Father" />
        <Field label="First Name"  value={family.father_firstname ?? ""}  onChange={(v) => onFamilyChange("father_firstname", v)} />
        <Field label="Middle Name" value={family.father_middlename ?? ""} onChange={(v) => onFamilyChange("father_middlename", v)} />
        <Field label="Last Name"   value={family.father_surname ?? ""}    onChange={(v) => onFamilyChange("father_surname", v)} />
        <Field label="Name Ext."   value={family.father_name_ext ?? ""}   onChange={(v) => onFamilyChange("father_name_ext", v)} />

        {/* ── Mother ── */}
        <Divider label="Mother" />
        <Field label="First Name"  value={family.mother_firstname ?? ""}  onChange={(v) => onFamilyChange("mother_firstname", v)} />
        <Field label="Middle Name" value={family.mother_middlename ?? ""} onChange={(v) => onFamilyChange("mother_middlename", v)} />
        <Field label="Last Name"   value={family.mother_surname ?? ""}    onChange={(v) => onFamilyChange("mother_surname", v)} />

        {/* ── Children ── */}
        <Divider label={`Children (${children.length})`} />

        {children.length === 0 && (
          <p className="sm:col-span-2 text-xs text-slate-400 italic">No children records yet.</p>
        )}

        {children.map((child: any, i: number) => (
          <div key={child.children_id ?? i} className="record-card sm:col-span-2">
            <button className="delete-btn" onClick={() => onDelete("emp_children", i)}>
              <Trash2 size={13} />
            </button>
            <p className="record-index">Child #{i + 1}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Full Name" value={child.child_name ?? ""} onChange={(v) => onArrayChange("emp_children", i, "child_name", v)} className="sm:col-span-2" />
              <Field label="Birth Date" type="date" value={child.child_birthdate ?? ""} onChange={(v) => onArrayChange("emp_children", i, "child_birthdate", v)} />
              <FloatSelect label="Status" value={child.status ?? ""} options={["ACTIVE","INACTIVE"]} onChange={(v) => onArrayChange("emp_children", i, "status", v)} />
            </div>
          </div>
        ))}

        <div className="sm:col-span-2">
          <button className="add-btn" onClick={() => onAdd("emp_children", { ...BLANK_CHILD, children_id: `new-${Date.now()}` })}>
            <Plus size={14} /> Add Child
          </button>
        </div>
      </div>
    </AccordionSection>
  );
}