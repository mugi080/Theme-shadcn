// ─────────────────────────────────────────────────────────────────────────────
// constants.ts
//
// Pure data — NO React, NO Lucide imports here.
// Icon references are string keys; each consuming component maps them to the
// actual Lucide component locally.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Accent colour ────────────────────────────────────────────────────────────

export const ACCENT = "#1976D2";

// ─── Theme tokens ─────────────────────────────────────────────────────────────

export const LIGHT = {
  bg:           "#ffffff",
  heroBg:       "linear-gradient(135deg, #EEF3FA 0%, #DAEAF8 50%, #EEF3FA 100%)",
  announceBg:   "#EEF3FA",
  navBg:        "rgba(255,255,255,0.93)",
  navBorder:    "#e2e8f0",
  cardBg:       "#ffffff",
  cardBorder:   "#e2e8f0",
  cardRowHover: "#f1f5f9",
  cardRowBase:  "#f8fafc",
  text:         "#0f172a",
  muted:        "#64748b",
  sep:          "#e2e8f0",
  toggleBg:     "#EEF3FA",
  toggleColor:  "#1976D2",
  menuBg:       "#ffffff",
};

export const DARK = {
  bg:           "#0f172a",
  heroBg:       "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
  announceBg:   "#1e293b",
  navBg:        "rgba(15,23,42,0.95)",
  navBorder:    "#334155",
  cardBg:       "#1e293b",
  cardBorder:   "#334155",
  cardRowHover: "#334155",
  cardRowBase:  "#0f172a",
  text:         "#f1f5f9",
  muted:        "#94a3b8",
  sep:          "#334155",
  toggleBg:     "#334155",
  toggleColor:  "#fbbf24",
  menuBg:       "#1e293b",
};

// Derive the Theme type from LIGHT so both objects stay in sync
export type Theme = typeof LIGHT;

// ─── Nav links ────────────────────────────────────────────────────────────────

export const NAV_LINKS = ["Home", "Announcements", "Features", "About"] as const;
export type NavLink = (typeof NAV_LINKS)[number];

// ─── Stats bar ────────────────────────────────────────────────────────────────

export const STATS: { value: string; label: string }[] = [
  { value: "2,400+", label: "City Employees" },
  { value: "38",     label: "Departments"    },
  { value: "99.8%",  label: "Data Accuracy"  },
  { value: "24/7",   label: "Portal Access"  },
];

// ─── Hero ticker items ────────────────────────────────────────────────────────
// `iconKey` maps to a Lucide icon name; HeroSection does the icon look-up.

export interface TickerItem {
  iconKey: string;
  label: string;
  sub: string;
}

export const HERO_TICKER_ITEMS: TickerItem[] = [
  { iconKey: "FileText",      label: "Personal Data Sheet", sub: "CS Form 212 — Updated"    },
  { iconKey: "Calendar",      label: "Leave Application",   sub: "3 pending requests"        },
  { iconKey: "Bell",          label: "Announcements",       sub: "4 new city advisories"     },
  { iconKey: "Clock",         label: "Service Record",      sub: "Complete history"          },
  { iconKey: "Users",         label: "Employee Records",    sub: "Profile up to date"        },
  { iconKey: "ClipboardList", label: "Leave Balance",       sub: "15 vacation days left"     },
  { iconKey: "Award",         label: "Eligibility",         sub: "CS Prof — Passed"          },
  { iconKey: "BarChart3",     label: "Attendance",          sub: "No absences this month"    },
];

// ─── Features ─────────────────────────────────────────────────────────────────
// `iconKey` maps to a Lucide icon name; FeaturesSection / FlipCard do the look-up.

export interface Feature {
  iconKey: string;
  title: string;
  desc: string;
  image: string;
  tag: string;
  backTitle: string;
  backColor: string;
  details: string[];
}

export const FEATURES: Feature[] = [
  {
    iconKey: "Users",
    title: "Employee Records",
    desc: "Manage complete employee profiles, personal data sheets, and employment history in one secure place.",
    image: "/employeerecord.jpg",
    tag: "Employee Records",
    backTitle: "Your Complete Profile",
    backColor: "#1565C0",
    details: [
      "View & update your Personal Data Sheet (CS Form 212)",
      "Access your full employment history and appointments",
      "Manage government IDs, eligibilities, and education records",
      "Update family background and character references",
    ],
  },
  {
    iconKey: "ClipboardList",
    title: "Leave Forms",
    desc: "File and track leave requests, approvals, and balances with automated workflows.",
    image: "/leave.jpg",
    tag: "Leave Management",
    backTitle: "Hassle-Free Leave Filing",
    backColor: "#1565C0",
    details: [
      "File vacation, sick, maternity, and other leave types online",
      "Track real-time approval status of your requests",
      "View remaining leave balance per leave type",
      "Receive notifications on approvals or rejections instantly",
    ],
  },
  {
    iconKey: "BarChart3",
    title: "Real-Time Attendance",
    desc: "Monitor daily attendance, tardiness, and absences with live dashboard updates.",
    image: "/Attendance.jpg",
    tag: "Attendance Tracking",
    backTitle: "Always Know Your Status",
    backColor: "#1565C0",
    details: [
      "View your daily time-in and time-out records",
      "Monitor tardiness, absences, and undertime at a glance",
      "Access monthly attendance summary and DTR reports",
      "Biometric integration for accurate real-time tracking",
    ],
  },
  {
    iconKey: "Award",
    title: "Payroll",
    desc: "Automated payroll computation with deductions, allowances, and payslip generation.",
    image: "/payroll.jpg",
    tag: "Payroll System",
    backTitle: "Transparent Pay Management",
    backColor: "#1565C0",
    details: [
      "View detailed payslips with all deductions and allowances",
      "Track GSIS, PhilHealth, and Pag-IBIG contributions",
      "Access historical payroll records anytime",
      "Automated 13th month pay and year-end benefit computation",
    ],
  },
  {
    iconKey: "FileText",
    title: "Loans & Benefits",
    desc: "Track employee loans, GSIS, Pag-IBIG, and government benefit applications in one place.",
    image: "/loan.jpg",
    tag: "Loans & Benefits",
    backTitle: "Benefits at Your Fingertips",
    backColor: "#1565C0",
    details: [
      "Monitor outstanding GSIS and Pag-IBIG loan balances",
      "Apply for government loans directly through the portal",
      "Track monthly amortization and remaining loan terms",
      "View all benefit entitlements and availment history",
    ],
  },
  {
    iconKey: "Shield",
    title: "Secure & Compliant",
    desc: "Built with government data privacy standards and CSC compliance requirements in mind.",
    image: "/securecomp.jpg",
    tag: "Secure & Compliant",
    backTitle: "Your Data Is Protected",
    backColor: "#1565C0",
    details: [
      "Fully compliant with the Data Privacy Act of 2012 (RA 10173)",
      "Role-based access control for all HR data",
      "Encrypted data transmission and secure cloud storage",
      "Regular security audits aligned with CSC standards",
    ],
  },
];

// ─── Announcements ────────────────────────────────────────────────────────────

export interface Announcement {
  id: number;
  category: string;
  badge: string;
  badgeColor: string;
  date: string;
  title: string;
  body: string;
  author: string;
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    category: "HR Advisory",
    badge: "New",
    badgeColor: "#1565C0",
    date: "June 10, 2026",
    title: "Submission of Updated Personal Data Sheet (CS Form 212)",
    body: "All city government employees are hereby directed to submit an updated CS Form 212 to the Human Resource Management Office on or before June 30, 2025. Failure to comply may affect the processing of your benefits and salary adjustments.",
    author: "City Human Resource Management Office",
  },
  {
    id: 2,
    category: "Memorandum",
    badge: "Urgent",
    badgeColor: "#1565C0",
    date: "June 5, 2026",
    title: "Mandatory Anti-Sexual Harassment Seminar for All City Employees",
    body: "Pursuant to Republic Act No. 7877, all city government employees are required to attend the scheduled Anti-Sexual Harassment Seminar. Schedule and venue will be announced per department through the HRIS portal.",
    author: "Office of the City Mayor",
  },
  {
    id: 3,
    category: "General Announcement",
    badge: "Open",
    badgeColor: "#1565C0",
    date: "May 28, 2026",
    title: "Job Vacancy: Administrative Officer II (Human Resource)",
    body: "The City Government is accepting applications for the position of Administrative Officer II in the HRMO. Interested and qualified applicants must submit complete documentary requirements to the HRMO not later than June 20, 2025.",
    author: "City Human Resource Management Office",
  },
  {
    id: 4,
    category: "Wellness Program",
    badge: "Upcoming",
    badgeColor: "#1565C0",
    date: "May 20, 2027",
    title: "Annual Medical and Dental Mission for City Employees",
    body: "The City Health Office, in partnership with the HRMO, will conduct its Annual Medical and Dental Mission for all permanent and casual city employees. Registration is now open through the HRIS Employee Portal.",
    author: "City Health Office",
  },
];

// ─── Footer links ─────────────────────────────────────────────────────────────

export const FOOTER_LINKS = ["Privacy Policy", "Terms", "Contact HRMO"] as const;

// =============================================================================
// LEAVE REQUEST — appended below, same file, same rules (no React/Lucide)
// =============================================================================

export type LeaveStatus = "pending" | "approved" | "rejected";
export type FilterTab   = "all" | LeaveStatus;

export interface LeaveRequest {
  leave_id: number;
  employee_id: number;
  leave_type_id: number;
  date_from: string;
  date_to: string;
  number_of_days: number;
  reason: string;
  status: LeaveStatus;
  remarks?: string;
  filed_date: string;
}

export interface LeaveType {
  leave_type_id: number;
  leave_type_name: string;
}

export interface LeaveBalance {
  leave_type_id: number;
  leave_type_name: string;
  balance: number;
}

export type LeaveFormState = Omit<
  LeaveRequest,
  "leave_id" | "employee_id" | "status" | "filed_date" | "remarks"
>;

export const CURRENT_EMPLOYEE = {
  employee_id: 1001,
  name: "Juan Dela Cruz",
  department: "Office of the City Mayor",
};

export const LEAVE_TYPES: LeaveType[] = [
  { leave_type_id: 1,  leave_type_name: "Vacation Leave"          },
  { leave_type_id: 2,  leave_type_name: "Sick Leave"              },
  { leave_type_id: 3,  leave_type_name: "Maternity Leave"         },
  { leave_type_id: 4,  leave_type_name: "Paternity Leave"         },
  { leave_type_id: 5,  leave_type_name: "Special Leave Benefit"   },
  { leave_type_id: 6,  leave_type_name: "Solo Parent Leave"       },
  { leave_type_id: 7,  leave_type_name: "Study Leave"             },
  { leave_type_id: 8,  leave_type_name: "VAWC Leave"              },
  { leave_type_id: 9,  leave_type_name: "Rehabilitation Leave"    },
  { leave_type_id: 10, leave_type_name: "Special Emergency Leave" },
  { leave_type_id: 11, leave_type_name: "Adoption Leave"          },
];

export const LEAVE_BALANCES: LeaveBalance[] = [
  { leave_type_id: 1, leave_type_name: "Vacation Leave", balance: 15 },
  { leave_type_id: 2, leave_type_name: "Sick Leave",     balance: 15 },
];

export const EMPTY_LEAVE_FORM: LeaveFormState = {
  leave_type_id: 0,
  date_from: "",
  date_to: "",
  number_of_days: 0,
  reason: "",
};

export const LEAVE_TYPE_COLORS: Record<number, { bg: string; color: string; border: string }> = {
  1:  { bg: "#E3F2FD", color: "#1565C0", border: "#90CAF9" },
  2:  { bg: "#FCE4EC", color: "#880E4F", border: "#F48FB1" },
  3:  { bg: "#F3E5F5", color: "#6A1B9A", border: "#CE93D8" },
  4:  { bg: "#E8F5E9", color: "#2E7D32", border: "#A5D6A7" },
  5:  { bg: "#FFF8E1", color: "#E65100", border: "#FFCC80" },
  6:  { bg: "#E0F7FA", color: "#006064", border: "#80DEEA" },
  7:  { bg: "#F1F8E9", color: "#33691E", border: "#C5E1A5" },
  8:  { bg: "#FBE9E7", color: "#BF360C", border: "#FFAB91" },
  9:  { bg: "#EDE7F6", color: "#4527A0", border: "#B39DDB" },
  10: { bg: "#E8EAF6", color: "#283593", border: "#9FA8DA" },
  11: { bg: "#FFF3E0", color: "#E65100", border: "#FFCC02" },
};

export const LEAVE_STATUS_CONFIG = {
  pending:  { label: "Pending",  bg: "#FFF8E1", color: "#F57F17", border: "#FFD54F" },
  approved: { label: "Approved", bg: "#E8F5E9", color: "#2E7D32", border: "#A5D6A7" },
  rejected: { label: "Rejected", bg: "#FFEBEE", color: "#C62828", border: "#EF9A9A" },
} as const;

export const FILTER_TABS: { key: FilterTab; label: string; color: string }[] = [
  { key: "all",      label: "All",      color: "#1976D2" },
  { key: "pending",  label: "Pending",  color: "#F57F17" },
  { key: "approved", label: "Approved", color: "#2E7D32" },
  { key: "rejected", label: "Rejected", color: "#C62828" },
];

export const fmtDate = (d: string) =>
  d
    ? new Date(d).toLocaleDateString("en-PH", {
        year: "numeric", month: "short", day: "numeric",
      })
    : "—";

export const calcLeaveDays = (from: string, to: string) =>
  !from || !to
    ? 0
    : Math.max(
        0,
        Math.round(
          (new Date(to).getTime() - new Date(from).getTime()) / 86400000
        ) + 1
      );

export const getLeaveTypeName = (id: number) =>
  LEAVE_TYPES.find((t) => t.leave_type_id === id)?.leave_type_name ?? "—";

// =============================================================================
// ELIGIBILITY — same file, same rules (no React/Lucide)
// =============================================================================

export type EligibilityStatus = "Active" | "Expired" | "Pending";

export interface Eligibility {
  eligibility_id: number;
  employee_id: number;
  cse_particular: string;
  rating: string;
  exam_date_conferment: string;
  exam_place_conferment: string;
  license_no: string;
  validitydate: string;
  status: EligibilityStatus;
  order: number;
}

export type EligibilityFormState = Omit<Eligibility, "eligibility_id" | "employee_id">;

export const EMPTY_ELIGIBILITY_FORM: EligibilityFormState = {
  cse_particular: "",
  rating: "",
  exam_date_conferment: "",
  exam_place_conferment: "",
  license_no: "",
  validitydate: "",
  status: "Active",
  order: 0,
};

export const CSE_OPTIONS: string[] = [
  "Career Service Professional (Second Level)",
  "Career Service Subprofessional (First Level)",
  "Career Executive Service (CES)",
  "Career Executive Service Officer (CESO)",
  "Registered Nurse (PRC)",
  "Registered Engineer (PRC)",
  "Registered Teacher (PRC)",
  "BAR / Board for Law",
  "Barangay Official",
  "Driver's License (Professional)",
  "RA 1080 (Board / Bar)",
  "MC 11, S. 1996 (Revised)",
  "Other Eligibility",
];

export const ELIGIBILITY_STATUS_CONFIG = {
  Active:  { label: "Active",  bg: "#E8F5E9", color: "#2E7D32", border: "#A5D6A7" },
  Expired: { label: "Expired", bg: "#FFEBEE", color: "#C62828", border: "#EF9A9A" },
  Pending: { label: "Pending", bg: "#FFF8E1", color: "#E65100", border: "#FFCC80" },
} as const;

export const ELIGIBILITY_SEED: Eligibility[] = [
  {
    eligibility_id: 1,
    employee_id: 1001,
    cse_particular: "Career Service Professional (Second Level)",
    rating: "81.35",
    exam_date_conferment: "2017-08-13",
    exam_place_conferment: "Lucena City, Quezon",
    license_no: "CSP-2017-08-1234",
    validitydate: "",
    status: "Active",
    order: 1,
  },
  {
    eligibility_id: 2,
    employee_id: 1001,
    cse_particular: "Career Service Subprofessional (First Level)",
    rating: "78.52",
    exam_date_conferment: "2015-03-22",
    exam_place_conferment: "Manila",
    license_no: "CSS-2015-03-5678",
    validitydate: "",
    status: "Active",
    order: 2,
  },
  {
    eligibility_id: 3,
    employee_id: 1001,
    cse_particular: "Registered Nurse (PRC)",
    rating: "85.00",
    exam_date_conferment: "2019-07-04",
    exam_place_conferment: "Quezon City",
    license_no: "0123456",
    validitydate: "2025-06-30",
    status: "Expired",
    order: 3,
  },
];

export const fmtEligibilityDate = (d: string) =>
  d
    ? new Date(d).toLocaleDateString("en-PH", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "—";