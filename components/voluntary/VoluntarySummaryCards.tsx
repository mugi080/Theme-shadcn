"use client";

import { HandHeart, Clock, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { VoluntaryWork } from "@/lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// VoluntarySummaryCards
// Three stat chips: Organizations / Total Hours / Latest Role
// ─────────────────────────────────────────────────────────────────────────────

interface VoluntarySummaryCardsProps {
  records: VoluntaryWork[];
}

export default function VoluntarySummaryCards({ records }: VoluntarySummaryCardsProps) {
  const totalHours = records.reduce((s, r) => s + r.no_hours, 0);
  const latestRole = records.length > 0
    ? records[records.length - 1].position_nature_of_work
    : "—";

  const cards = [
    {
      label: "Organizations",
      value: String(records.length),
      icon: <HandHeart className="w-4 h-4 text-white" />,
      delay: 0,
    },
    {
      label: "Total Hours",
      value: `${totalHours} hrs`,
      icon: <Clock className="w-4 h-4 text-white" />,
      delay: 80,
    },
    {
      label: "Latest Role",
      value: latestRole,
      icon: <Briefcase className="w-4 h-4 text-white" />,
      delay: 160,
      truncate: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {cards.map((c) => (
        <Card
          key={c.label}
          className={`border-border shadow-sm ${c.label === "Latest Role" ? "col-span-2 sm:col-span-1" : ""}`}
          style={{ animation: `hris-in 0.4s ease ${c.delay}ms both` }}
        >
          <CardContent className="px-4 py-4 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#1976D2" }}
            >
              {c.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                {c.label}
              </p>
              <p className={`text-sm font-semibold text-foreground ${c.truncate ? "truncate" : ""}`}>
                {c.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}