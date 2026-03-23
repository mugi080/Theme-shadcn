// =============================================================================
// VOLUNTARY WORK — append this block to the bottom of your existing lib/constants.ts
// Pure data — NO React, NO Lucide imports.
// =============================================================================

export interface VoluntaryWork {
  voluntary_work_id: number;
  employee_id: number;
  organization_name: string;
  organization_address: string;
  date_from: string;
  date_to: string;
  no_hours: number;
  position_nature_of_work: string;
}

export type VoluntaryWorkFormState = Omit<VoluntaryWork, "voluntary_work_id" | "employee_id">;

// ─── Empty form ───────────────────────────────────────────────────────────────

export const EMPTY_VOLUNTARY_FORM: VoluntaryWorkFormState = {
  organization_name: "",
  organization_address: "",
  date_from: "",
  date_to: "",
  no_hours: 0,
  position_nature_of_work: "",
};

// ─── Seed data ────────────────────────────────────────────────────────────────

export const VOLUNTARY_SEED: VoluntaryWork[] = [
  {
    voluntary_work_id: 1,
    employee_id: 1001,
    organization_name: "Red Cross Philippines",
    organization_address: "Bonifacio Drive, Manila",
    date_from: "2019-07-01",
    date_to: "2019-12-31",
    no_hours: 120,
    position_nature_of_work: "Medical Relief Volunteer",
  },
  {
    voluntary_work_id: 2,
    employee_id: 1001,
    organization_name: "Gawad Kalinga",
    organization_address: "Diliman, Quezon City",
    date_from: "2021-03-15",
    date_to: "2021-09-15",
    no_hours: 80,
    position_nature_of_work: "Community Development Assistant",
  },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

export const fmtVoluntaryDate = (d: string) =>
  d
    ? new Date(d).toLocaleDateString("en-PH", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "—";