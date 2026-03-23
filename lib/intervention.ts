// =============================================================================
// L&D INTERVENTIONS — append to bottom of lib/constants.ts
// Pure data — NO React, NO Lucide imports.
// =============================================================================

export interface LDType {
  type_id: number;
  type_name: string;
}

export interface LDIntervention {
  ld_intervention_id: number;
  employee_id: number;
  title: string;
  date_from: string;
  date_to: string;
  no_hours: number;
  conducted_by: string;
  type_id: number;
}

export type LDFormState = Omit<LDIntervention, "ld_intervention_id" | "employee_id">;

// ─── LD types ─────────────────────────────────────────────────────────────────

export const LD_TYPES: LDType[] = [
  { type_id: 1, type_name: "Training"           },
  { type_id: 2, type_name: "Seminar"            },
  { type_id: 3, type_name: "Workshop"           },
  { type_id: 4, type_name: "Conference"         },
  { type_id: 5, type_name: "Coaching / Mentoring" },
  { type_id: 6, type_name: "Online Course"      },
  { type_id: 7, type_name: "Orientation"        },
];

// ─── Empty form ───────────────────────────────────────────────────────────────

export const EMPTY_LD_FORM: LDFormState = {
  title: "", date_from: "", date_to: "", no_hours: 0, conducted_by: "", type_id: 0,
};

// ─── Type colour map (no React.CSSProperties — plain strings) ─────────────────

export const LD_TYPE_COLORS: Record<number, { bg: string; color: string; border: string }> = {
  1: { bg: "#E3F2FD", color: "#1565C0", border: "#90CAF9" }, // Training
  2: { bg: "#E8F5E9", color: "#2E7D32", border: "#A5D6A7" }, // Seminar
  3: { bg: "#F3E5F5", color: "#6A1B9A", border: "#CE93D8" }, // Workshop
  4: { bg: "#FFF8E1", color: "#E65100", border: "#FFCC80" }, // Conference
  5: { bg: "#FCE4EC", color: "#880E4F", border: "#F48FB1" }, // Coaching
  6: { bg: "#E0F7FA", color: "#006064", border: "#80DEEA" }, // Online
  7: { bg: "#F1F8E9", color: "#33691E", border: "#C5E1A5" }, // Orientation
};

// ─── Seed data ────────────────────────────────────────────────────────────────

export const LD_SEED: LDIntervention[] = [
  { ld_intervention_id: 1, employee_id: 1001,
    title: "Basic Computer Literacy Program",
    date_from: "2022-02-07", date_to: "2022-02-11", no_hours: 40,
    conducted_by: "DICT – Department of Information and Communications Technology", type_id: 1 },
  { ld_intervention_id: 2, employee_id: 1001,
    title: "Strategic Human Resource Management Seminar",
    date_from: "2022-09-15", date_to: "2022-09-16", no_hours: 16,
    conducted_by: "Civil Service Commission – Region IV-A", type_id: 2 },
  { ld_intervention_id: 3, employee_id: 1001,
    title: "Gender and Development (GAD) Workshop",
    date_from: "2023-03-08", date_to: "2023-03-09", no_hours: 16,
    conducted_by: "Local Government Unit – HR Department", type_id: 3 },
  { ld_intervention_id: 4, employee_id: 1001,
    title: "Leadership and Team Building",
    date_from: "2023-10-23", date_to: "2023-10-25", no_hours: 24,
    conducted_by: "Development Academy of the Philippines", type_id: 5 },
  { ld_intervention_id: 5, employee_id: 1001,
    title: "Public Service Ethics and Accountability",
    date_from: "2024-01-18", date_to: "2024-01-18", no_hours: 8,
    conducted_by: "Civil Service Commission", type_id: 7 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const fmtLDDate = (d: string) =>
  d ? new Date(d).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" }) : "—";

export const getLDTypeName = (id: number) =>
  LD_TYPES.find((t) => t.type_id === id)?.type_name ?? "—";

export const getLDDuration = (from: string, to: string) => {
  if (!from || !to) return null;
  const days = Math.ceil((new Date(to).getTime() - new Date(from).getTime()) / 86400000) + 1;
  return days === 1 ? "1 day" : `${days} days`;
};