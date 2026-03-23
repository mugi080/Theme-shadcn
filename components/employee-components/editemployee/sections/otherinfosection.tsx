// components/sections/OtherInfoSection.tsx
"use client";

import { useState } from "react";
import { Star, Trophy, Users, Plus, Trash2 } from "lucide-react";
import AccordionSection from "../accordionSection";
import Field from "../field";

// ── Blank templates ──────────────────────────────────────────────
const BLANK_SKILL       = { description: "", order: 0 };
const BLANK_RECOGNITION = { description: "", order: 0 };
const BLANK_MEMBERSHIP  = { description: "", order: 0 };

interface OtherInfoSectionProps {
  formData: any;
  isOpen: boolean;
  onToggle: () => void;
  onArrayChange: (section: string, index: number, field: string, value: any) => void;
  onAdd: (section: string, blank: object) => void;
  onDelete: (section: string, index: number) => void;
}

// ── Reusable list editor ─────────────────────────────────────────
function ListEditor({
  section,
  records,
  fieldKey,
  idKey,
  placeholder,
  onArrayChange,
  onAdd,
  onDelete,
  blank,
  addLabel,
}: {
  section: string;
  records: any[];
  fieldKey: string;
  idKey: string;
  placeholder: string;
  onArrayChange: (section: string, index: number, field: string, value: any) => void;
  onAdd: (section: string, blank: object) => void;
  onDelete: (section: string, index: number) => void;
  blank: object;
  addLabel: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {records.map((item: any, i: number) => (
        <div key={item[idKey] ?? i} className="record-card record-in">
          <button
            className="delete-btn"
            onClick={() => onDelete(section, i)}
            title="Remove"
          >
            <Trash2 size={13} />
          </button>
          <p className="record-index">Record #{i + 1}</p>
          <Field
            label={placeholder}
            value={item.description}
            onChange={(v) => onArrayChange(section, i, "description", v)}
          />
        </div>
      ))}

      <button
        className="add-btn"
        onClick={() => onAdd(section, { ...blank, [idKey]: `new-${Date.now()}` })}
      >
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────
export default function OtherInfoSection({
  formData,
  isOpen,
  onToggle,
  onArrayChange,
  onAdd,
  onDelete,
}: OtherInfoSectionProps) {
  const [openSub, setOpenSub] = useState<Record<string, boolean>>({
    skills: true,
    recognitions: true,
    memberships: true,
  });

  const toggleSub = (key: string) =>
    setOpenSub((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <AccordionSection
      sectionKey="otherinfo"
      label="Other Information"
      Icon={Star}
      gradient="from-yellow-500 to-yellow-600"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="flex flex-col gap-3">

        {/* ── Skills ── */}
        <SubSection
          sectionKey="skills"
          label="Special Skills & Hobbies"
          Icon={Star}
          color="text-yellow-500"
          iconBg="bg-yellow-50"
          count={(formData.emp_skills ?? []).length}
          isOpen={!!openSub.skills}
          onToggle={() => toggleSub("skills")}
        >
          <ListEditor
            section="emp_skills"
            records={formData.emp_skills ?? []}
            fieldKey="description"
            idKey="skill_id"
            placeholder="Skill or hobby"
            onArrayChange={onArrayChange}
            onAdd={onAdd}
            onDelete={onDelete}
            blank={BLANK_SKILL}
            addLabel="Add Skill / Hobby"
          />
        </SubSection>

        {/* ── Recognitions ── */}
        <SubSection
          sectionKey="recognitions"
          label="Non-Academic Recognitions"
          Icon={Trophy}
          color="text-blue-500"
          iconBg="bg-blue-50"
          count={(formData.emp_recognitions ?? []).length}
          isOpen={!!openSub.recognitions}
          onToggle={() => toggleSub("recognitions")}
        >
          <ListEditor
            section="emp_recognitions"
            records={formData.emp_recognitions ?? []}
            fieldKey="description"
            idKey="recognition_id"
            placeholder="Recognition or distinction"
            onArrayChange={onArrayChange}
            onAdd={onAdd}
            onDelete={onDelete}
            blank={BLANK_RECOGNITION}
            addLabel="Add Recognition"
          />
        </SubSection>

        {/* ── Memberships ── */}
        <SubSection
          sectionKey="memberships"
          label="Organization Memberships"
          Icon={Users}
          color="text-emerald-500"
          iconBg="bg-emerald-50"
          count={(formData.emp_memberships ?? []).length}
          isOpen={!!openSub.memberships}
          onToggle={() => toggleSub("memberships")}
        >
          <ListEditor
            section="emp_memberships"
            records={formData.emp_memberships ?? []}
            fieldKey="description"
            idKey="membership_id"
            placeholder="Organization name"
            onArrayChange={onArrayChange}
            onAdd={onAdd}
            onDelete={onDelete}
            blank={BLANK_MEMBERSHIP}
            addLabel="Add Membership"
          />
        </SubSection>

      </div>
    </AccordionSection>
  );
}

// ── SubSection collapsible card ───────────────────────────────────
function SubSection({
  sectionKey, label, Icon, color, iconBg, count, isOpen, onToggle, children,
}: {
  sectionKey: string; label: string; Icon: any;
  color: string; iconBg: string; count: number;
  isOpen: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: "1.5px solid #e9eef5",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: isOpen ? "0 2px 8px rgba(0,0,0,0.04)" : "none",
        transition: "box-shadow 0.2s",
      }}
    >
      {/* Sub-header */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "11px 14px",
          background: "#fff",
          border: "none",
          borderBottom: isOpen ? "1.5px solid #f1f5f9" : "none",
          cursor: "pointer",
          textAlign: "left",
          transition: "background 0.15s",
        }}
      >
        <span className={`p-2 ${iconBg} rounded-lg shrink-0`}>
          <Icon size={14} className={color} strokeWidth={1.5} />
        </span>
        <span style={{ fontWeight: 600, fontSize: 13, color: "#1e293b", flex: 1 }}>
          {label}
        </span>
        {/* Count badge */}
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 999,
            background: "#f1f5f9",
            color: "#64748b",
            marginRight: 6,
          }}
        >
          {count}
        </span>
        {/* Chevron */}
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.22s", flexShrink: 0 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Body */}
      {isOpen && (
        <div style={{ padding: 12, background: "#fff" }}>
          {children}
        </div>
      )}
    </div>
  );
}