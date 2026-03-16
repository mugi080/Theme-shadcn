"use client";

import { BookOpen, Calendar, Clock, Building2, Tag } from "lucide-react";

interface LDInterventionType {
  type_id: string;
  type_name: string;
}

interface LDIntervention {
  ld_intervention_id: string;
  title: string;
  date_from: string;
  date_to: string;
  no_hours: number;
  conducted_by: string;
  ldintervention_type: LDInterventionType | null;
}

interface Props {
  data: LDIntervention[];
}

const formatValue = (value: string | null | undefined): string => {
  if (!value || value.trim() === "" || value.toLowerCase() === "n/a") return "—";
  return value;
};

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "Present";
  try {
    return new Date(dateStr).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short"
    });
  } catch {
    return dateStr;
  }
};

export default function LDInterventionSectionUI({ data }: Props) {
  const interventions = data ?? [];

  return (
    <div className="p-4 md:p-8 bg-background min-h-screen text-foreground">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Learning & Development
        </h2>

        {interventions.length === 0 && (
          <p className="text-muted-foreground italic">
            No training records found.
          </p>
        )}

        {interventions.map((ld) => (
          <div
            key={ld.ld_intervention_id}
            className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 
                       flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
          >
            {/* Left Section: Icon + Title + Conducted By */}
            <div className="flex items-center gap-4 md:gap-5 flex-[1.5] min-w-0">
              <div className="p-3 md:p-4 bg-orange-50 dark:bg-orange-900/40 rounded-xl md:rounded-2xl shrink-0">
                <BookOpen
                  className="text-orange-500 dark:text-orange-400 w-6 h-6 md:w-8 md:h-8"
                  strokeWidth={1.5}
                />
              </div>

              <div className="min-w-0 space-y-0.5">
                <h3 className="text-base md:text-lg font-bold text-foreground leading-tight truncate">
                  {formatValue(ld.title)}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm">
                  <Building2 size={14} className="shrink-0" />
                  <span className="truncate">
                    {formatValue(ld.conducted_by)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section: Details in One Row */}
            <div className="grid grid-cols-3 md:flex md:flex-[2] gap-4 md:gap-0 border-t md:border-t-0 pt-4 md:pt-0">

              {/* Duration */}
              <div className="flex flex-col items-start gap-1 md:flex-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar size={16} />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                    Dates
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground">
                  {formatDate(ld.date_from)} — {formatDate(ld.date_to)}
                </p>
              </div>

              {/* Hours */}
              <div className="flex flex-col items-start gap-1 md:flex-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={16} />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                    Hours
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground">
                  {ld.no_hours ? `${ld.no_hours} hrs` : "—"}
                </p>
              </div>

              {/* Type */}
              <div className="flex flex-col items-start gap-1 md:flex-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Tag size={16} />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                    Type
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground truncate w-full">
                  {ld.ldintervention_type?.type_name || "—"}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}