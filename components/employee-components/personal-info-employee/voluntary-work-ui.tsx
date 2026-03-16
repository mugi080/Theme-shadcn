"use client";

import { Heart, Calendar, Clock, MapPin } from "lucide-react";

interface VoluntaryWork {
  voluntary_work_id: string;
  organization_name: string;
  organization_address: string;
  date_from: string;
  date_to: string | null;
  no_hours: number;
  position_nature_of_work: string;
}

interface Props {
  data: VoluntaryWork[];
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

export default function VoluntaryWorkSectionUI({ data }: Props) {
  const volunteers = data ?? [];

  return (
    <div className="p-4 md:p-8 bg-background min-h-screen text-foreground">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Voluntary Work
        </h2>

        {volunteers.length === 0 && (
          <p className="text-muted-foreground italic">
            No voluntary work records found.
          </p>
        )}

        {volunteers.map((work) => (
          <div
            key={work.voluntary_work_id}
            className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 
                       flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
          >
            {/* Left Section: Icon + Organization + Position */}
            <div className="flex items-center gap-4 md:gap-5 flex-[1.5] min-w-0">
              <div className="p-3 md:p-4 bg-rose-50 dark:bg-rose-900/40 rounded-xl md:rounded-2xl shrink-0">
                <Heart
                  className="text-rose-500 dark:text-rose-400 w-6 h-6 md:w-8 md:h-8"
                  strokeWidth={1.5}
                />
              </div>

              <div className="min-w-0 space-y-0.5">
                <h3 className="text-base md:text-lg font-bold text-foreground leading-tight truncate">
                  {formatValue(work.organization_name)}
                </h3>
                <p className="text-rose-500 dark:text-rose-400 text-xs md:text-sm font-medium truncate">
                  {formatValue(work.position_nature_of_work)}
                </p>
              </div>
            </div>

            {/* Right Section: All Details in One Row */}
            <div className="grid grid-cols-3 md:flex md:flex-[2] gap-4 md:gap-6 border-t md:border-t-0 pt-4 md:pt-0">
              
              {/* Duration */}
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar size={16} />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                    Duration
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground">
                  {formatDate(work.date_from)} — {formatDate(work.date_to)}
                </p>
              </div>

              {/* Total Hours */}
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={16} />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                    Hours
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground">
                  {work.no_hours ? `${work.no_hours} hrs` : "—"}
                </p>
              </div>

              {/* Address */}
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={16} />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                    Address
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground truncate">
                  {formatValue(work.organization_address)}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}