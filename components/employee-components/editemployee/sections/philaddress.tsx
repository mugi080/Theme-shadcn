// components/PhAddressFields.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import rawData from "@/data/philippines.json";

// ── Types ────────────────────────────────────────────────────────
type BarangayList    = { barangay_list: string[] };
type MunicipalityMap = Record<string, BarangayList>;
type ProvinceEntry   = { municipality_list: MunicipalityMap };
type ProvinceMap     = Record<string, ProvinceEntry>;
type RegionEntry     = { region_name: string; province_list: ProvinceMap };
type PhilippinesData = Record<string, RegionEntry>;

const phData = rawData as unknown as PhilippinesData;
const DEFAULT_PROVINCE = "QUEZON";

// ── Helpers ──────────────────────────────────────────────────────
const ALL_PROVINCES: string[] = Object.values(phData)
  .flatMap((r) => Object.keys(r.province_list))
  .sort();

function getCities(province: string): string[] {
  if (!province) return [];
  for (const r of Object.values(phData)) {
    if (r.province_list[province])
      return Object.keys(r.province_list[province].municipality_list).sort();
  }
  return [];
}

function getBarangays(province: string, city: string): string[] {
  if (!province || !city) return [];
  for (const r of Object.values(phData)) {
    const p = r.province_list[province];
    if (p?.municipality_list[city])
      return [...p.municipality_list[city].barangay_list].sort();
  }
  return [];
}

// ── Floating label styles helper ─────────────────────────────────
function floatStyles(isFloated: boolean, focused: boolean) {
  return {
    wrapper: { position: "relative" as const },
    label: {
      position: "absolute" as const,
      left: 12,
      top: isFloated ? 0 : "50%",
      transform: "translateY(-50%)",
      fontSize: isFloated ? 10 : 14,
      fontWeight: isFloated ? 700 : 400,
      color: focused ? "#3b82f6" : isFloated ? "#64748b" : "#94a3b8",
      letterSpacing: isFloated ? "0.06em" : "0",
      textTransform: isFloated ? "uppercase" as const : "none" as const,
      pointerEvents: "none" as const,
      transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
      background: isFloated ? "#f8fafc" : "transparent",
      paddingLeft: isFloated ? 4 : 0,
      paddingRight: isFloated ? 4 : 0,
      whiteSpace: "nowrap" as const,
      lineHeight: 1,
      zIndex: 1,
    },
  };
}

// ── FloatInput ───────────────────────────────────────────────────
function FloatInput({
  label, value, onChange, className = "",
}: {
  label: string; value: string; onChange: (v: string) => void; className?: string;
}) {
  const [focused, setFocused] = useState(false);
  const isFloated = focused || !!value;
  const { wrapper, label: labelStyle } = floatStyles(isFloated, focused);

  return (
    <div className={className} style={{ ...wrapper, marginBottom: 4 }}>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=""
        style={{
          width: "100%",
          background: "#f8fafc",
          border: `1.5px solid ${focused ? "#3b82f6" : "#e2e8f0"}`,
          borderRadius: 10,
          padding: isFloated ? "18px 12px 6px 12px" : "12px 12px",
          fontSize: 14,
          color: "#1e293b",
          outline: "none",
          transition: "all 0.15s",
          boxShadow: focused ? "0 0 0 3px rgba(59,130,246,0.12)" : "none",
          fontFamily: "inherit",
        }}
      />
      <label style={labelStyle}>{label}</label>
    </div>
  );
}

// ── FloatSelect ──────────────────────────────────────────────────
function FloatSelect({
  label, value, options, onChange, disabled = false,
  placeholder = "Select…", className = "",
}: {
  label: string; value: string; options: string[];
  onChange: (v: string) => void; disabled?: boolean;
  placeholder?: string; className?: string;
}) {
  const [focused, setFocused] = useState(false);
  const isFloated = focused || !!value;
  const { wrapper, label: labelStyle } = floatStyles(isFloated, focused);

  return (
    <div className={className} style={{ ...wrapper, marginBottom: 4 }}>
      <select
        value={value || ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          appearance: "none" as const,
          background: "#f8fafc",
          border: `1.5px solid ${focused ? "#3b82f6" : "#e2e8f0"}`,
          borderRadius: 10,
          padding: isFloated ? "18px 36px 6px 12px" : "12px 36px 12px 12px",
          fontSize: 14,
          color: value ? "#1e293b" : "transparent",  // hide placeholder text (label covers it)
          outline: "none",
          transition: "all 0.15s",
          boxShadow: focused ? "0 0 0 3px rgba(59,130,246,0.12)" : "none",
          fontFamily: "inherit",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.45 : 1,
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>

      {/* Floating label */}
      <label style={labelStyle}>{label}</label>

      {/* Chevron */}
      <ChevronDown
        size={14}
        style={{
          position: "absolute",
          right: 10, top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: "#94a3b8",
        }}
      />
    </div>
  );
}

// ── Section divider ──────────────────────────────────────────────
function Divider({ label }: { label: string }) {
  if (!label) return null;
  return (
    <div className="sm:col-span-2 flex items-center gap-3 pt-1">
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8", whiteSpace: "nowrap" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: "#e9eef5" }} />
    </div>
  );
}

// ── Props ────────────────────────────────────────────────────────
export interface AddressValues {
  house_block_lotno: string;
  street: string;
  subdivision_village: string;
  barangay: string;
  city_municipality: string;
  province: string;
  zipcode: string;
}

interface PhAddressFieldsProps {
  prefix: "ra" | "pa";
  label: string;
  values: AddressValues;
  onChange: (field: string, value: string) => void;
}

// ── Main ─────────────────────────────────────────────────────────
export default function PhAddressFields({ prefix, label, values, onChange }: PhAddressFieldsProps) {
  const f = (field: string) => `${prefix}_${field}`;

  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const rawProv = values.province?.trim() ?? "";
    const rawCity = values.city_municipality?.trim() ?? "";
    const rawBrgy = values.barangay?.trim() ?? "";
    const normProv = rawProv.toUpperCase();
    const normCity = rawCity.toUpperCase();
    const normBrgy = rawBrgy.toUpperCase();
    if (rawProv === "") {
      onChange(f("province"), DEFAULT_PROVINCE);
    } else {
      if (normProv !== rawProv) onChange(f("province"),         normProv);
      if (normCity !== rawCity) onChange(f("city_municipality"), normCity);
      if (normBrgy !== rawBrgy) onChange(f("barangay"),          normBrgy);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cities    = useMemo(() => getCities(values.province),                              [values.province]);
  const barangays = useMemo(() => getBarangays(values.province, values.city_municipality), [values.province, values.city_municipality]);

  const handleProvinceChange = (v: string) => {
    onChange(f("province"), v);
    if (v !== values.province) { onChange(f("city_municipality"), ""); onChange(f("barangay"), ""); }
  };
  const handleCityChange = (v: string) => {
    onChange(f("city_municipality"), v);
    if (v !== values.city_municipality) onChange(f("barangay"), "");
  };

  return (
    <>
      <Divider label={label} />

      <FloatInput label="House / Block / Lot No." value={values.house_block_lotno} onChange={(v) => onChange(f("house_block_lotno"), v)} />
      <FloatInput label="Street"                  value={values.street}            onChange={(v) => onChange(f("street"), v)} />
      <FloatInput label="Subdivision / Village"   value={values.subdivision_village} onChange={(v) => onChange(f("subdivision_village"), v)} className="sm:col-span-2" />

      <FloatSelect
        label="Province"
        value={values.province}
        options={ALL_PROVINCES}
        onChange={handleProvinceChange}
        placeholder="Select province…"
      />
      <FloatSelect
        label="City / Municipality"
        value={values.city_municipality}
        options={cities}
        onChange={handleCityChange}
        disabled={!values.province}
        placeholder={values.province ? "Select city…" : "Select province first"}
      />
      <FloatSelect
        label="Barangay"
        value={values.barangay}
        options={barangays}
        onChange={(v) => onChange(f("barangay"), v)}
        disabled={!values.city_municipality}
        placeholder={values.city_municipality ? "Select barangay…" : "Select city first"}
        className="sm:col-span-2"
      />

      <FloatInput label="Zip Code" value={values.zipcode} onChange={(v) => onChange(f("zipcode"), v)} />
    </>
  );
}