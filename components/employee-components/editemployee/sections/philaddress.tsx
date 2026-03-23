"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import rawData from "@/data/philippines.json";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

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

// ── Floating Label Input ─────────────────────────────────────────
function FloatInput({
  id, label, value, onChange, className = "",
}: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; className?: string;
}) {
  const isFloated = !!value;
  return (
    <div className={`relative ${className}`}>
      <Input
        id={id} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className={`peer w-full bg-background text-foreground border-input placeholder:text-transparent transition-all duration-200 focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none ${isFloated ? "pt-5 pb-1.5" : "pt-3 pb-3"}`}
      />
      <Label htmlFor={id}
        className={`absolute left-3 pointer-events-none transition-all duration-200 ease-in-out peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wide peer-focus:bg-background peer-focus:px-1 peer-focus:z-10 ${isFloated ? "top-0 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wide bg-background px-1 z-10" : "top-1/2 -translate-y-1/2 text-sm font-normal"} text-muted-foreground peer-focus:text-ring`}>
        {label}
      </Label>
    </div>
  );
}

// ── Floating Label Select ────────────────────────────────────────
// ✅ NO manual ChevronDown — SelectTrigger already has one built in
function FloatSelect({
  id, label, value, options, onChange,
  disabled = false, placeholder = "Select…", className = "",
}: {
  id: string; label: string; value: string; options: string[];
  onChange: (v: string) => void; disabled?: boolean;
  placeholder?: string; className?: string;
}) {
  const isFloated = !!value;
  return (
    <div className={`relative ${className}`}>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        {/* ✅ h-auto + padding match FloatingInput exactly */}
        <SelectTrigger
          id={id}
          className={`peer w-full h-auto bg-background text-foreground border-input transition-all duration-200 focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none ${isFloated ? "pt-5 pb-1.5" : "pt-3 pb-3"} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}>
          <SelectValue placeholder={placeholder} className="text-foreground" />
        </SelectTrigger>
        <SelectContent
          position="popper"
          className="bg-popover text-popover-foreground border-border max-h-60 overflow-y-auto"
          align="start"
          sideOffset={4}>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}
              className="text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer truncate">
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* ✅ Label on border line — same pattern as FloatingInput */}
      <Label htmlFor={id}
        className={`absolute left-3 pointer-events-none transition-all duration-200 ease-in-out z-10 ${isFloated ? "top-0 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wide bg-background px-1" : "top-1/2 -translate-y-1/2 text-sm font-normal"} text-muted-foreground`}>
        {label}
      </Label>
    </div>
  );
}

// ── Section Divider ──────────────────────────────────────────────
function Divider({ label }: { label: string }) {
  if (!label) return null;
  return (
    <div className="sm:col-span-2 flex items-center gap-3 pt-1">
      <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-[1px] bg-border" />
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

// ── Main Component ───────────────────────────────────────────────
export default function PhAddressFields({
  prefix, label, values, onChange,
}: PhAddressFieldsProps) {
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
      if (normProv !== rawProv) onChange(f("province"), normProv);
      if (normCity !== rawCity) onChange(f("city_municipality"), normCity);
      if (normBrgy !== rawBrgy) onChange(f("barangay"), normBrgy);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cities = useMemo(() => getCities(values.province), [values.province]);
  const barangays = useMemo(
    () => getBarangays(values.province, values.city_municipality),
    [values.province, values.city_municipality]
  );

  const handleProvinceChange = (v: string) => {
    onChange(f("province"), v);
    if (v !== values.province) {
      onChange(f("city_municipality"), "");
      onChange(f("barangay"), "");
    }
  };

  const handleCityChange = (v: string) => {
    onChange(f("city_municipality"), v);
    if (v !== values.city_municipality) onChange(f("barangay"), "");
  };

  return (
    <>
      <Divider label={label} />

      {/* Row 1 — House + Street */}
      <FloatInput
        id={`${prefix}_house_block_lotno`}
        label="House / Block / Lot No."
        value={values.house_block_lotno}
        onChange={(v) => onChange(f("house_block_lotno"), v)}
      />
      <FloatInput
        id={`${prefix}_street`}
        label="Street"
        value={values.street}
        onChange={(v) => onChange(f("street"), v)}
      />

      {/* Row 2 — Subdivision (full width) */}
      <FloatInput
        id={`${prefix}_subdivision_village`}
        label="Subdivision / Village"
        value={values.subdivision_village}
        onChange={(v) => onChange(f("subdivision_village"), v)}
        className="sm:col-span-2"
      />

      {/* Row 3 — Province + City */}
      <FloatSelect
        id={`${prefix}_province`}
        label="Province"
        value={values.province}
        options={ALL_PROVINCES}
        onChange={handleProvinceChange}
        placeholder="Select province…"
      />
      <FloatSelect
        id={`${prefix}_city_municipality`}
        label="City / Municipality"
        value={values.city_municipality}
        options={cities}
        onChange={handleCityChange}
        disabled={!values.province}
        placeholder={values.province ? "Select city…" : "Select province first"}
      />

      {/* Row 4 — Barangay + Zip */}
      <FloatSelect
        id={`${prefix}_barangay`}
        label="Barangay"
        value={values.barangay}
        options={barangays}
        onChange={(v) => onChange(f("barangay"), v)}
        disabled={!values.city_municipality}
        placeholder={values.city_municipality ? "Select barangay…" : "Select city first"}
      />
      <FloatInput
        id={`${prefix}_zipcode`}
        label="Zip Code"
        value={values.zipcode}
        onChange={(v) => onChange(f("zipcode"), v)}
      />
    </>
  );
}