// =============================================================================
// EMPLOYEE IDENTIFICATION — append to bottom of lib/constants.ts
// Pure data — NO React, NO Lucide imports.
// =============================================================================

export interface EmployeeIdentification {
  identification_id: number;
  employee_id: number;
  govt_issued_id: string;
  id_no: string;
  issuance_date: string;
  issuance_place: string;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

export const IDENTIFICATION_SEED: EmployeeIdentification[] = [
  {
    identification_id: 1,
    employee_id: 1001,
    govt_issued_id: "Philippine Passport",
    id_no: "P1234567A",
    issuance_date: "2021-03-15",
    issuance_place: "DFA Manila",
  },
  {
    identification_id: 2,
    employee_id: 1001,
    govt_issued_id: "SSS ID",
    id_no: "34-5678901-2",
    issuance_date: "2018-07-22",
    issuance_place: "SSS Lucena Branch",
  },
  {
    identification_id: 3,
    employee_id: 1001,
    govt_issued_id: "PhilHealth ID",
    id_no: "19-012345678-9",
    issuance_date: "2019-01-10",
    issuance_place: "PhilHealth Quezon City",
  },
  {
    identification_id: 4,
    employee_id: 1001,
    govt_issued_id: "Pag-IBIG ID",
    id_no: "1234-5678-9012",
    issuance_date: "2019-04-05",
    issuance_place: "HDMF Makati",
  },
  {
    identification_id: 5,
    employee_id: 1001,
    govt_issued_id: "Driver's License",
    id_no: "N01-23-456789",
    issuance_date: "2020-09-30",
    issuance_place: "LTO Calamba",
  },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

export const fmtIdDate = (d: string) =>
  d
    ? new Date(d).toLocaleDateString("en-PH", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "—";