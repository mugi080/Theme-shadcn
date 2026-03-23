"use client";

import { ShieldCheck, CreditCard, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmployeeIdentification } from "@/lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// IdentificationSummaryCards
// Three stat chips: Total IDs / Latest ID / Latest Issuing Place
// ─────────────────────────────────────────────────────────────────────────────

interface IdentificationSummaryCardsProps {
  records: EmployeeIdentification[];
}

export default function IdentificationSummaryCards({ records }: IdentificationSummaryCardsProps) {
  const latest      = records.length > 0 ? records[records.length - 1] : null;
  const latestId    = latest?.govt_issued_id ?? "—";
  const latestPlace = latest?.issuance_place ?? "—";

  const cards = [
    {
      label: "Total IDs",
      value: String(records.length),
      icon: <ShieldCheck className="w-4 h-4 text-white" />,
      delay: 0,
    },
    {
      label: "Latest ID",
      value: latestId,
      icon: <CreditCard className="w-4 h-4 text-white" />,
      delay: 80,
      truncate: true,
    },
    {
      label: "Issued At",
      value: latestPlace,
      icon: <MapPin className="w-4 h-4 text-white" />,
      delay: 160,
      truncate: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {cards.map((c) => (
        <Card
          key={c.label}
          className="border-border shadow-sm"
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