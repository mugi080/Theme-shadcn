"use client";

import { Award, Calendar, MapPin, ShieldCheck } from "lucide-react";

interface Eligibility {
  eligibility_id: string;
  cse_particular: string;
  rating: string;
  exam_date_conferment: string;
  exam_place_conferment: string;
  license_no: string;
  validity_date: string | null;
  status: string;
}

interface Props {
  data: Eligibility[];
}

const formatValue = (value: string | null | undefined): string => {
  if (!value || value.trim() === "" || value.toLowerCase() === "n/a") return "—";
  return value;
};

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch {
    return dateStr;
  }
};

export default function EligibilitySectionUI({ data }: Props) {
  const eligibilities = data ?? [];

  return (
    <div className="p-4 md:p-8 bg-background min-h-screen text-foreground">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Civil Service Eligibility
        </h2>

        {eligibilities.length === 0 && (
          <p className="text-muted-foreground italic">
            No eligibility records found.
          </p>
        )}

        {eligibilities.map((elig) => (
          <div
            key={elig.eligibility_id}
            className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 
                       flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
          >

            {/* Left Section: Icon + Title + Place + Status */}
            <div className="flex items-center gap-4 md:gap-5 flex-[1.5] min-w-0">
              <div className="p-3 md:p-4 bg-violet-50 dark:bg-violet-900/40 rounded-xl md:rounded-2xl shrink-0">
                <Award
                  className="text-violet-500 dark:text-violet-400 w-6 h-6 md:w-8 md:h-8"
                  strokeWidth={1.5}
                />
              </div>

              <div className="min-w-0 space-y-1">
                <h3 className="text-base md:text-lg font-bold text-foreground leading-tight truncate">
                  {formatValue(elig.cse_particular)}
                </h3>
                
                <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs md:text-sm">
                  <div className="flex items-center gap-1 truncate">
                    <MapPin size={14} className="shrink-0" />
                    <span className="truncate">
                      {formatValue(elig.exam_place_conferment)}
                    </span>
                  </div>
                  
                  {elig.status && elig.status.trim() !== "" && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide shrink-0 ${
                      elig.status.toLowerCase() === "active"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {formatValue(elig.status)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section: Details Grid (Rating, License, Date, Validity) */}
            <div className="grid grid-cols-2 md:grid-cols-4 flex-[2] gap-4 md:gap-6 border-t md:border-t-0 pt-4 md:pt-0">
              
              {/* Rating */}
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                    Rating
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground">
                  {formatValue(elig.rating)}{elig.rating && !elig.rating.endsWith("%") ? "%" : ""}
                </p>
              </div>

              {/* License */}
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award size={16} />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                    License
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground font-mono truncate w-full">
                  {formatValue(elig.license_no)}
                </p>
              </div>

              {/* Date */}
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar size={16} />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                    Date
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground">
                  {formatDate(elig.exam_date_conferment)}
                </p>
              </div>

              {/* Validity */}
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar size={16} />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                    Valid Until
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground">
                  {formatDate(elig.validity_date)}
                </p>
              </div>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
}