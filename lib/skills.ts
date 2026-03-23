// =============================================================================
// SKILLS, RECOGNITIONS & MEMBERSHIPS — append to bottom of lib/constants.ts
// Pure data — NO React, NO Lucide imports.
// =============================================================================

export interface SkillRecord {
  skill_id: number;
  employee_id: number;
  description: string;
  order: number;
}

export interface RecognitionRecord {
  recognition_id: number;
  employee_id: number;
  description: string;
  order: number;
}

export interface MembershipRecord {
  membership_id: number;
  employee_id: number;
  description: string;
  order: number;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

export const SKILLS_SEED: SkillRecord[] = [
  { skill_id: 1, employee_id: 1001, description: "Microsoft Office Suite (Word, Excel, PowerPoint)", order: 1 },
  { skill_id: 2, employee_id: 1001, description: "HR Data Analysis & Workforce Planning", order: 2 },
  { skill_id: 3, employee_id: 1001, description: "Effective Written & Oral Communication", order: 3 },
];

export const RECOGNITIONS_SEED: RecognitionRecord[] = [
  { recognition_id: 1, employee_id: 1001, description: "Best Government Employee of the Year 2023 — City Government of Lucena", order: 1 },
  { recognition_id: 2, employee_id: 1001, description: "Promoted to Human Resource Officer I — Civil Service Commission (2022)", order: 2 },
  { recognition_id: 3, employee_id: 1001, description: "ISO 9001:2015 Quality Management Systems Internal Auditor — TÜV Rheinland (2021)", order: 3 },
];

export const MEMBERSHIPS_SEED: MembershipRecord[] = [
  { membership_id: 1, employee_id: 1001, description: "People Management Association of the Philippines (PMAP) — Active Member", order: 1 },
  { membership_id: 2, employee_id: 1001, description: "PhilHealth Government Wellness Program — Active", order: 2 },
  { membership_id: 3, employee_id: 1001, description: "Rotary Club of Lucena — Active Community Member", order: 3 },
];

// ─── Column config (no icon components — icons live in components) ─────────────

export const COLUMN_CONFIG = [
  {
    key: "skills" as const,
    title: "Skills",
    subtitle: "Abilities & knowledge",
    accentColor: "#1976D2",
    placeholder: "e.g. Microsoft Office Suite, Data Analysis, Communication...",
    addTitle: "Add Skill",
  },
  {
    key: "recognitions" as const,
    title: "Recognitions",
    subtitle: "Awards, certs & promotions",
    accentColor: "#FF6F00",
    placeholder: "e.g. Best Employee Award 2023 — City Government of Lucena",
    addTitle: "Add Recognition",
  },
  {
    key: "memberships" as const,
    title: "Memberships",
    subtitle: "Organizations & groups",
    accentColor: "#7B1FA2",
    placeholder: "e.g. People Management Association of the Philippines (PMAP)",
    addTitle: "Add Membership",
  },
] as const;

export type ColumnKey = (typeof COLUMN_CONFIG)[number]["key"];