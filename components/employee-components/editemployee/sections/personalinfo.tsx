// components/sections/PersonalInfoSection.tsx
"use client";

import { useEffect, useState } from "react";
import { User, ChevronDown, Copy } from "lucide-react";
import AccordionSection from "../accordionSection";
import Field from "../field";
import PhAddressFields from "./philaddress";

interface PersonalInfoSectionProps {
  formData: any;
  isOpen: boolean;
  onToggle: () => void;
  onFieldChange: (field: string, value: any) => void;
}

const SEX_OPTIONS      = ["Male", "Female"];
const CIVIL_OPTIONS    = ["Single", "Married", "Widowed", "Separated", "Divorced"];
const BLOOD_OPTIONS    = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];
const CITIZENSHIP_CATS = ["By Birth", "By Naturalization", "Dual Citizenship"];

const RA_FIELDS = [
  "house_block_lotno", "street", "subdivision_village",
  "barangay", "city_municipality", "province", "zipcode",
] as const;

function isSameAddress(fd: any) {
  return RA_FIELDS.every((f) => (fd[`ra_${f}`] ?? "") === (fd[`pa_${f}`] ?? ""));
}

// ── Floating label Select ────────────────────────────────────────
function SelectField({
  label, value, options, onChange, className = "",
}: {
  label: string; value: any; options: string[];
  onChange: (v: string) => void; className?: string;
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
        <option value="" disabled>Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>

      {/* Floating label */}
      <label style={{
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
      }}>
        {label}
      </label>

      <ChevronDown size={14} style={{
        position: "absolute", right: 10, top: "50%",
        transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8",
      }} />
    </div>
  );
}

// ── Section divider ──────────────────────────────────────────────
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="sm:col-span-2 flex items-center gap-3 pt-1">
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8", whiteSpace: "nowrap" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: "#e9eef5" }} />
    </div>
  );
}

// ── Toggle button ────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        background: checked ? "#eff6ff" : "#f8fafc",
        border: `1.5px solid ${checked ? "#93c5fd" : "#e2e8f0"}`,
        borderRadius: 10, padding: "7px 12px",
        cursor: "pointer", transition: "all 0.2s",
        userSelect: "none", width: "100%",
      }}
    >
      <div style={{
        width: 34, height: 18, borderRadius: 999,
        background: checked ? "#3b82f6" : "#cbd5e1",
        position: "relative", flexShrink: 0, transition: "background 0.2s",
      }}>
        <div style={{
          position: "absolute", top: 2,
          left: checked ? 16 : 2,
          width: 14, height: 14, borderRadius: "50%",
          background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          transition: "left 0.2s",
        }} />
      </div>
      <Copy size={13} color={checked ? "#3b82f6" : "#94a3b8"} />
      <span style={{
        fontSize: 12, fontWeight: 600,
        color: checked ? "#3b82f6" : "#64748b",
        letterSpacing: "0.03em", transition: "color 0.2s",
      }}>
        Same as Residential Address
      </span>
    </button>
  );
}

// ── Main ─────────────────────────────────────────────────────────
export default function PersonalInfoSection({
  formData, isOpen, onToggle, onFieldChange,
}: PersonalInfoSectionProps) {
  const [sameAsResidential, setSameAsResidential] = useState(() => isSameAddress(formData));

  const handleSameToggle = (checked: boolean) => {
    setSameAsResidential(checked);
    if (checked) RA_FIELDS.forEach((f) => onFieldChange(`pa_${f}`, formData[`ra_${f}`] ?? ""));
  };

  useEffect(() => {
    if (!sameAsResidential) return;
    RA_FIELDS.forEach((f) => onFieldChange(`pa_${f}`, formData[`ra_${f}`] ?? ""));
  }, [
    sameAsResidential,
    formData.ra_house_block_lotno, formData.ra_street,
    formData.ra_subdivision_village, formData.ra_barangay,
    formData.ra_city_municipality, formData.ra_province, formData.ra_zipcode,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AccordionSection
      sectionKey="personal" label="Personal Info"
      Icon={User} gradient="from-blue-500 to-blue-600"
      isOpen={isOpen} onToggle={onToggle}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        <SectionDivider label="Name" />
        <Field label="First Name"     value={formData.firstname}  onChange={(v) => onFieldChange("firstname", v)} />
        <Field label="Middle Name"    value={formData.middlename} onChange={(v) => onFieldChange("middlename", v)} />
        <Field label="Last Name"      value={formData.surname}    onChange={(v) => onFieldChange("surname", v)} />
        <Field label="Name Extension" value={formData.name_ext}   onChange={(v) => onFieldChange("name_ext", v)} />

        <SectionDivider label="Personal Details" />
        <Field       label="Birth Date"   value={formData.birthdate}    type="date" onChange={(v) => onFieldChange("birthdate", v)} />
        <Field       label="Birth Place"  value={formData.birthplace}               onChange={(v) => onFieldChange("birthplace", v)} />
        <SelectField label="Sex"          value={formData.sex}           options={SEX_OPTIONS}    onChange={(v) => onFieldChange("sex", v)} />
        <SelectField label="Civil Status" value={formData.civil_status}  options={CIVIL_OPTIONS}  onChange={(v) => onFieldChange("civil_status", v)} />
        <SelectField label="Blood Type"   value={formData.blood_type}    options={BLOOD_OPTIONS}  onChange={(v) => onFieldChange("blood_type", v)} />
        <Field       label="Height (cm)"  value={formData.height}                   onChange={(v) => onFieldChange("height", v)} />
        <Field       label="Weight (kg)"  value={formData.weight}                   onChange={(v) => onFieldChange("weight", v)} />

        <SectionDivider label="Contact" />
        <Field label="Mobile Number"  value={formData.mobile_no}     onChange={(v) => onFieldChange("mobile_no", v)} />
        <Field label="Telephone No."  value={formData.telephone_no}  onChange={(v) => onFieldChange("telephone_no", v)} />
        <Field label="Email Address"  value={formData.email_address} onChange={(v) => onFieldChange("email_address", v)} className="sm:col-span-2" />

        <SectionDivider label="Citizenship" />
        <Field       label="Citizenship"       value={formData.citizenship}          onChange={(v) => onFieldChange("citizenship", v)} />
        <SelectField label="Category"          value={formData.citizenship_category} options={CITIZENSHIP_CATS} onChange={(v) => onFieldChange("citizenship_category", v)} />
        <Field       label="Country (if Dual)" value={formData.citizenship_country}  onChange={(v) => onFieldChange("citizenship_country", v)} />

        <PhAddressFields
          prefix="ra" label="Residential Address"
          values={{
            house_block_lotno:   formData.ra_house_block_lotno   || "",
            street:              formData.ra_street              || "",
            subdivision_village: formData.ra_subdivision_village || "",
            barangay:            formData.ra_barangay            || "",
            city_municipality:   formData.ra_city_municipality   || "",
            province:            formData.ra_province            || "",
            zipcode:             formData.ra_zipcode             || "",
          }}
          onChange={onFieldChange}
        />

        <SectionDivider label="Permanent Address" />

        {/* Toggle — full width, clearly visible */}
        <div className="sm:col-span-2">
          <Toggle checked={sameAsResidential} onChange={handleSameToggle} />
        </div>

        {sameAsResidential ? (
          <div className="sm:col-span-2" style={{
            background: "#f0f9ff", border: "1.5px dashed #93c5fd",
            borderRadius: 10, padding: "10px 14px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <Copy size={13} color="#60a5fa" />
            <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>
              Permanent address will be copied from residential address.
            </span>
          </div>
        ) : (
          <PhAddressFields
            prefix="pa" label=""
            values={{
              house_block_lotno:   formData.pa_house_block_lotno   || "",
              street:              formData.pa_street              || "",
              subdivision_village: formData.pa_subdivision_village || "",
              barangay:            formData.pa_barangay            || "",
              city_municipality:   formData.pa_city_municipality   || "",
              province:            formData.pa_province            || "",
              zipcode:             formData.pa_zipcode             || "",
            }}
            onChange={onFieldChange}
          />
        )}

        <SectionDivider label="Government IDs" />
        <Field label="GSIS No."        value={formData.gsis_no}        onChange={(v) => onFieldChange("gsis_no", v)} />
        <Field label="PAG-IBIG No."    value={formData.pagibig_no}     onChange={(v) => onFieldChange("pagibig_no", v)} />
        <Field label="PhilHealth No."  value={formData.philhealth_no}  onChange={(v) => onFieldChange("philhealth_no", v)} />
        <Field label="SSS No."         value={formData.sss_no}         onChange={(v) => onFieldChange("sss_no", v)} />
        <Field label="TIN No."         value={formData.tin_no}         onChange={(v) => onFieldChange("tin_no", v)} />
        <Field label="Agency Emp. No." value={formData.agency_emp_no}  onChange={(v) => onFieldChange("agency_emp_no", v)} />

      </div>
    </AccordionSection>
  );
}