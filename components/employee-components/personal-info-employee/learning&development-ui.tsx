"use client";

import { BookOpen, Calendar, Clock, Pencil, Trash2, Building2 } from "lucide-react";

interface LDIntervention {
  ld_intervention_id: string;
  title: string;
  date_from: string;
  date_to: string;
  no_hours: number;
  conducted_by: string;
}

interface Props {
  data: LDIntervention[];
}

export default function LDInterventionSectionUI({ data }: Props) {

  const interventions = data ?? [];

  const formatDateRange = (start: string, end: string) => {
    const s = new Date(start).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const e = new Date(end).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return `${s} - ${e}`;
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-4 md:gap-6 max-w-6xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
          Learning & Development
        </h2>

        {interventions.length === 0 && (
          <p className="text-gray-500 italic py-10 text-center bg-white rounded-3xl border border-dashed">
            No training records found.
          </p>
        )}

        {interventions.map((ld) => (
          <div
            key={ld.ld_intervention_id}
            className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 
                       flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
          >

            {/* Left Section */}
            <div className="flex items-center gap-4 md:gap-5 flex-[1.5] min-w-0">

              <div className="p-3 md:p-4 bg-orange-50 rounded-xl md:rounded-2xl shrink-0">
                <BookOpen className="text-orange-500 w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
              </div>

              <div className="space-y-1 min-w-0">

                <h3 className="text-base md:text-lg font-bold text-gray-900 leading-tight break-words">
                  {ld.title}
                </h3>

                <div className="flex items-center gap-1.5 text-gray-500 text-xs md:text-sm">
                  <Building2 size={14} className="shrink-0" />
                  <span className="truncate">{ld.conducted_by}</span>
                </div>

              </div>
            </div>

            {/* Middle Section */}
            <div className="grid grid-cols-2 md:flex md:flex-[2] gap-4 md:gap-0 border-t md:border-t-0 pt-4 md:pt-0">

              {/* Duration */}
              <div className="flex flex-col items-start gap-1 md:flex-1">

                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                    Inclusive Dates
                  </span>
                </div>

                <p className="text-sm font-bold text-gray-800 md:ml-7">
                  {formatDateRange(ld.date_from, ld.date_to)}
                </p>

              </div>

              {/* Hours */}
              <div className="flex flex-col items-start gap-1 md:flex-1">

                <div className="flex items-center gap-2 text-gray-400">
                  <Clock size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                    No. of Hours
                  </span>
                </div>

                <p className="text-sm font-black text-gray-900 md:ml-7">
                  {ld.no_hours} Hours
                </p>

              </div>

            </div>

            {/* Actions */}
            <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 md:ml-4">

              <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase">
                Actions
              </span>

              <span className="hidden md:block text-[10px] font-bold text-gray-400 uppercase mb-1">
                Actions
              </span>

              <div className="flex items-center gap-3">

                <button className="p-2 md:p-2.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
                  <Pencil size={18} fill="currentColor" className="text-white" />
                </button>

                <button className="p-2 md:p-2.5 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors">
                  <Trash2 size={18} fill="currentColor" className="text-white" />
                </button>

              </div>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
} 