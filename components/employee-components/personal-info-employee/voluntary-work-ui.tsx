"use client";

import { Heart, Calendar, Clock, MapPin, Pencil, Trash2 } from "lucide-react";

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

export default function VoluntaryWorkSectionUI({ data }: Props) {

  const volunteers = data ?? [];

  const formatYear = (dateStr: string | null) => {
    if (!dateStr) return "Present";
    return new Date(dateStr).getFullYear();
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-4 md:gap-6 max-w-6xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
          Voluntary Work
        </h2>

        {volunteers.length === 0 && (
          <p className="text-gray-500 italic text-center py-10 bg-white rounded-3xl">
            No voluntary work records found.
          </p>
        )}

        {volunteers.map((work) => (
          <div
            key={work.voluntary_work_id}
            className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6
                       flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
          >
            {/* Organization */}
            <div className="flex items-center gap-4 md:gap-5 flex-[1.5] min-w-0">
              <div className="p-3 md:p-4 bg-rose-50 rounded-xl md:rounded-2xl shrink-0">
                <Heart className="text-rose-500 w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
              </div>

              <div className="space-y-1 min-w-0">
                <h3 className="text-base md:text-lg font-bold text-gray-900 leading-tight truncate">
                  {work.organization_name}
                </h3>

                <div className="flex flex-col gap-0.5">
                  <p className="text-rose-500 text-xs md:text-sm font-semibold truncate">
                    {work.position_nature_of_work}
                  </p>

                  <div className="flex items-center gap-1 text-gray-400 text-[11px] md:text-xs">
                    <MapPin size={12} />
                    <span className="truncate">{work.organization_address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Duration + Hours */}
            <div className="grid grid-cols-2 md:flex md:flex-[2] gap-4 md:gap-0 border-t md:border-t-0 pt-4 md:pt-0">

              <div className="flex flex-col items-start gap-1 md:flex-1">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={16} />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                    Duration
                  </span>
                </div>

                <p className="text-sm font-bold text-gray-800 md:ml-6">
                  {formatYear(work.date_from)} — {formatYear(work.date_to)}
                </p>
              </div>

              <div className="flex flex-col items-start gap-1 md:flex-1">
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock size={16} />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                    Total Hours
                  </span>
                </div>

                <p className="text-sm font-black text-gray-900 md:ml-6">
                  {work.no_hours} hrs
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