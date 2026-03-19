"use client";

import { Calendar, Briefcase, Banknote, ShieldCheck, Building2 } from "lucide-react";

interface WorkExperience {
  work_id: string;
  position_title: string;
  department_company: string;
  date_from: string;
  date_to: string | null;
  salary_monthly: string;
  govt_service: boolean;
  appointment_status: string;
}

interface Props {
  data: WorkExperience[];
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

const formatCurrency = (amount: string | null | undefined): string => {
  if (!amount || isNaN(parseFloat(amount))) return "—";
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0
  }).format(parseFloat(amount));
};

export default function WorkExperienceSectionUI({ data }: Props) {
  const experiences = data ?? [];

  return (
    <div className="p-4 md:p-8 bg-background min-h-screen text-foreground">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Work Experience
        </h2>

        {experiences.length === 0 && (
          <p className="text-muted-foreground italic">
            No work experience records found.
          </p>
        )}

        {experiences.map((exp) => (
          <div
            key={exp.work_id}
            className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 
                       flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
          >
            {/* Left Section: Icon + Position + Company */}
            <div className="flex items-center gap-4 md:gap-5 flex-[1.5] min-w-0">
              <div className="p-3 md:p-4 bg-blue-50 dark:bg-blue-900/40 rounded-xl md:rounded-2xl shrink-0">
                <Briefcase
                  className="text-blue-500 dark:text-blue-400 w-6 h-6 md:w-8 md:h-8"
                  strokeWidth={1.5}
                />
              </div>

              <div className="min-w-0 space-y-0.5">
                <h3 className="text-base md:text-lg font-bold text-foreground leading-tight truncate">
                  {formatValue(exp.position_title)}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm">
                  <Building2 size={14} className="shrink-0" />
                  <span className="truncate">
                    {formatValue(exp.department_company)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section: Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 flex-[2] gap-4 md:gap-6 border-t md:border-t-0 pt-4 md:pt-0">
              
              {/* Duration */}
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar size={16} />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                    Duration
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground">
                  {formatDate(exp.date_from)} — {formatDate(exp.date_to)}
                </p>
              </div>

              {/* Salary */}
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Banknote size={16} />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                    Salary/ month
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground">
                  {formatCurrency(exp.salary_monthly)}
                </p>
              </div>

              {/* Appointment Status */}
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                    Status
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground">
                  {formatValue(exp.appointment_status)}
                </p>
              </div>

              {/* Government Service */}
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                    Type
                  </span>
                </div>
                <div className="mt-0.5">
                  {exp.govt_service ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold uppercase tracking-wide bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                      Gov't
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-foreground">
                      Private
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}