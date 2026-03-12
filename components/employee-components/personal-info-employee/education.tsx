"use client";

import { useState, useEffect } from "react";
import { Calendar, GraduationCap, Loader2, Award, BookOpen } from "lucide-react";
import { getEmployeeId, getToken, logout, apiFetch } from "@/lib/api/personal-info/auth";

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

type EducationLevel = "Elementary" | "High School" | "Senior High" | "College" | "Other";

const EDUCATION_LEVELS: { label: EducationLevel; color: string; bg: string }[] = [
  { label: "Elementary",  color: "text-green-600",  bg: "bg-green-50 border-green-200"  },
  { label: "High School", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" },
  { label: "Senior High", color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  { label: "College",     color: "text-blue-600",   bg: "bg-blue-50 border-blue-200"   },
  { label: "Other",       color: "text-gray-500",   bg: "bg-gray-50 border-gray-200"   },
];

function detectEducationLevel(course: string, schoolName: string): EducationLevel {
  const text = `${course} ${schoolName}`.toLowerCase();
  if (text.includes("senior high") || text.includes("shs") || text.includes("grade 11") || text.includes("grade 12")) return "Senior High";
  if (text.includes("high school") || text.includes("secondary")) return "High School";
  if (text.includes("elementary") || text.includes("primary") || text.includes("grade school")) return "Elementary";
  if (
    text.includes("bachelor") || text.includes("bs ") || text.includes("ab ") ||
    text.includes("college") || text.includes("university") || text.includes("degree") ||
    text.includes("master") || text.includes("doctor") || text.includes("phd") ||
    text.includes("engineer") || text.includes("nursing") || text.includes("medicine")
  ) return "College";
  return "Other";
}

export default function EducationSectionUI() {
  const employeeId = getEmployeeId();
  const token = getToken();
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducations = async () => {
      if (!employeeId || !token) {
        logout();
        return;
      }
      setLoading(true);
      try {
        const res = await apiFetch(`/protected/view_employee/${employeeId}`);
        const data = await res.json();
        if (data.success && data.data?.emp_education) {
          setEducations(data.data.emp_education);
        } else {
          setEducations([]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch education records");
      } finally {
        setLoading(false);
      }
    };
    fetchEducations();
  }, [employeeId, token]);

  const formatYear = (dateStr: string | null) => {
    if (!dateStr) return "Present";
    return new Date(dateStr).getFullYear();
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 size={30} className="animate-spin text-blue-500" />
    </div>
  );
  if (error) return <p className="text-red-500 p-8">{error}</p>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Education History</h2>

        {educations.length === 0 && (
          <p className="text-gray-500 italic">No education records found.</p>
        )}

        {educations.map((edu) => {
          const level = detectEducationLevel(edu.basic_educ_degree_course, edu.school_name);
          const levelStyle = EDUCATION_LEVELS.find((l) => l.label === level) ?? EDUCATION_LEVELS[4];

          return (
            <div
              key={edu.education_id}
              className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 
                         flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
            >
              {/* Left: Icon & Degree Info */}
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

              {/* Middle: Duration & Honors */}
              <div className="grid grid-cols-2 md:flex md:flex-2 gap-4 md:gap-0 border-t md:border-t-0 pt-4 md:pt-0">

                {/* Attendance Period */}
                <div className="flex flex-col items-start gap-1 md:flex-1">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={16} />
                    <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">Duration</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800 md:ml-6">
                    {formatYear(edu.attendance_start_date)} — {formatYear(edu.attendance_end_date)}
                  </p>
                </div>

                {/* Academic Honors */}
                <div className="flex flex-col items-start gap-1 md:flex-1">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Award size={16} />
                    <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">Honors</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800 md:ml-6 truncate w-full">
                    {edu.scholarship_academic_honors || "—"}
                  </p>
                </div>
              </div>

              {/* Right: Educational Level Badge */}
              <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-2 pt-4 md:pt-0 border-t md:border-t-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Level</span>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${levelStyle.bg} ${levelStyle.color}`}>
                  <BookOpen size={13} />
                  {levelStyle.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}