// ─────────────────────────────────────────────────────────────────────────────
// iconMap.ts
//
// Single place that imports Lucide icons and maps the string keys used in
// constants.ts to the actual React components.
// Add new icons here if you extend FEATURES or HERO_TICKER_ITEMS.
// ─────────────────────────────────────────────────────────────────────────────

import {
  Users, FileText, BarChart3, Shield,
  ClipboardList, Award, Calendar, Bell,
  Clock, LucideProps,
} from "lucide-react";
import React from "react";

export type IconKey =
  | "Users" | "FileText" | "BarChart3" | "Shield"
  | "ClipboardList" | "Award" | "Calendar" | "Bell" | "Clock";

export const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  Users,
  FileText,
  BarChart3,
  Shield,
  ClipboardList,
  Award,
  Calendar,
  Bell,
  Clock,
};

/** Returns the Lucide component for a key, falling back to FileText. */
export function getIcon(key: string): React.FC<LucideProps> {
  return ICON_MAP[key] ?? FileText;
}