"use client";

import { Calendar, GraduationCap, Pencil, Trash2, Award } from "lucide-react";

interface Education {
  education_id: string;
  school_name: string;
  basic_educ_degree_course: string;
  attendance_start_date: string | null;
  attendance_end_date: string | null;
  highest_level_units_earned: string;
  year_graduated: string;
  scholarship_academic_honors: string;
}

interface Props {
  data: Education[];
}

export default function EducationSectionUI({ data }: Props) {

  const educations = data ?? [];

  const formatYear = (dateStr: string | null) => {
    if (!dateStr) return "Present";
    return new Date(dateStr).getFullYear();
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Education History
        </h2>

        {educations.length === 0 && (
          <p className="text-gray-500 italic">
            No education records found.
          </p>
        )}

        {educations.map((edu) => (
          <div
            key={edu.education_id}
            className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 
                       flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
          >

            {/* Left */}
            <div className="flex items-center gap-4 md:gap-5 flex-[1.5] min-w-0">

              <div className="p-3 md:p-4 bg-blue-50 rounded-xl md:rounded-2xl shrink-0">
                <GraduationCap className="text-blue-500 w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
              </div>

              <div className="min-w-0 space-y-0.5">

                <h3 className="text-base md:text-lg font-bold text-gray-900 leading-tight truncate">
                  {edu.school_name}
                </h3>

                <p className="text-blue-500 text-xs md:text-sm font-medium truncate">
                  {edu.basic_educ_degree_course}
                </p>

              </div>

            </div>

            {/* Middle */}
            <div className="grid grid-cols-2 md:flex md:flex-[2] gap-4 md:gap-0 border-t md:border-t-0 pt-4 md:pt-0">

              <div className="flex flex-col items-start gap-1 md:flex-1">

                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={16} />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                    Duration
                  </span>
                </div>

                <p className="text-sm font-bold text-gray-800 md:ml-6">
                  {formatYear(edu.attendance_start_date)} — {formatYear(edu.attendance_end_date)}
                </p>

              </div>

              <div className="flex flex-col items-start gap-1 md:flex-1">

                <div className="flex items-center gap-2 text-gray-400">
                  <Award size={16} />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                    Honors
                  </span>
                </div>

                <p className="text-sm font-bold text-gray-800 md:ml-6 truncate w-full">
                  {edu.scholarship_academic_honors || "—"}
                </p>

              </div>

            </div>

            {/* Actions */}
            <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-2 pt-4 md:pt-0 border-t md:border-t-0">

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