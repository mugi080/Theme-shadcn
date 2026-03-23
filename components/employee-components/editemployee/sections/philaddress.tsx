// components/PhAddressFields.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import rawData from "@/data/philippines.json";

/* Shadcn UI Primitives */
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
  FieldSeparator,
} from "@/components/ui/field";

// ── Types ────────────────────────────────────────────────────────
type BarangayList = { barangay_list: string[] };
type MunicipalityMap = Record<string, BarangayList>;
type ProvinceEntry = { municipality_list: MunicipalityMap };
type ProvinceMap = Record<string, ProvinceEntry>;
type RegionEntry = { region_name: string; province_list: ProvinceMap };
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

// ── Theme-Aware Floating Input ───────────────────────────────────
function FloatInput({
  id,
  label,
  value,
  onChange,
  className = "",
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  error?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const isFloated = !!value || isFocused;

  return (
    <Field className={cn("relative", className)} data-slot="field-group">
      <div className="relative">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder=" "
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "peer bg-background placeholder:text-transparent",
            isFloated ? "pt-5 pb-1.5" : "pt-3 pb-3",
            error && "aria-invalid:border-destructive"
          )}
        />
        <FieldLabel
          htmlFor={id}
          className={cn(
            "absolute left-3 pointer-events-none transition-all duration-200 ease-in-out",
            "text-muted-foreground peer-focus:text-ring",
            isFloated
              ? "top-0 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wide bg-background px-1"
              : "top-1/2 -translate-y-1/2 text-sm font-normal peer-placeholder-shown:text-muted-foreground/80"
          )}
        >
          {label}
        </FieldLabel>
      </div>
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </Field>
  );
}

// ── Theme-Aware Floating Select ──────────────────────────────────
function FloatSelect({
  id,
  label,
  value,
  options,
  onChange,
  disabled = false,
  placeholder = "Select…",
  className = "",
  error,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  error?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const isFloated = !!value || isFocused;

  return (
    <Field className={cn("relative", className)} data-slot="field-group">
      <div className="relative">
        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger
            id={id}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={cn(
              "peer bg-background",
              isFloated ? "pt-5 pb-1.5 pr-8" : "pt-3 pb-3 pr-8",
              disabled && "opacity-60 cursor-not-allowed",
              error && "aria-invalid:border-destructive"
            )}
          >
            <SelectValue placeholder={placeholder} className="text-foreground" />
          </SelectTrigger>
          <SelectContent
            position="popper"
            className="bg-popover text-popover-foreground border-border max-h-60 overflow-y-auto"
            align="start"
            sideOffset={4}
          >
            {options.map((opt) => (
              <SelectItem
                key={opt}
                value={opt}
                className="text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer truncate"
              >
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <FieldLabel
          htmlFor={id}
          className={cn(
            "absolute left-3 pointer-events-none transition-all duration-200 ease-in-out z-10",
            "text-muted-foreground peer-focus:text-ring",
            isFloated
              ? "top-0 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wide bg-background px-1"
              : "top-1/2 -translate-y-1/2 text-sm font-normal peer-placeholder-shown:text-muted-foreground/80"
          )}
        >
          {label}
        </FieldLabel>

        {/* Chevron for visual cue */}
        <ChevronDown
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none",
            "text-muted-foreground transition-colors",
            disabled && "opacity-40"
          )}
        />
      </div>
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </Field>
  );
}

// ── Theme-Aware Section Divider ──────────────────────────────────
function Divider({ label }: { label: string }) {
  if (!label) return null;
  return (
    <FieldSeparator className="sm:col-span-2">
      <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground">
        {label}
      </span>
    </FieldSeparator>
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
  prefix,
  label,
  values,
  onChange,
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

  const cities = useMemo(
    () => getCities(values.province),
    [values.province]
  );
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
      <FloatInput
        id={`${prefix}_subdivision_village`}
        label="Subdivision / Village"
        value={values.subdivision_village}
        onChange={(v) => onChange(f("subdivision_village"), v)}
        className="sm:col-span-2"
      />

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

// ── Utility ──────────────────────────────────────────────────────
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}