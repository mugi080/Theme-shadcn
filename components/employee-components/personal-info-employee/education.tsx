"use client";

import { useState, useEffect, useCallback } from "react";
import { GraduationCap, Calendar, Loader2 } from "lucide-react";
import { Education } from "@/lib/api/personal-info/education.types";
import { educationApi } from "@/lib/api/personal-info/education";
import { getEmployeeId } from "@/lib/api/personal-info/auth";

/* ------------------------------------------------------
   Helper: format dates
------------------------------------------------------ */
function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Present";
  return new Date(dateStr).toLocaleDateString(); // human-readable
}

/* ------------------------------------------------------
   Main Education Section (Read-Only)
------------------------------------------------------ */
export default function EducationSectionReadOnly() {
  const employeeId = getEmployeeId(); // get employeeId from localStorage
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  /* Fetch all education records */
  const fetchEducations = useCallback(async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const data = await educationApi.getAll(employeeId);
      console.log("Fetched educations from API:", data); // ✅ Log for debugging
      setEducations(data?.data ?? data); // handle possible data wrapper
    } catch (err) {
      console.error("Failed to fetch educations:", err);
    }
    setLoading(false);
  }, [employeeId]);

  useEffect(() => {
    fetchEducations();
  }, [fetchEducations]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Education History</h2>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={30} className="animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {educations.length === 0 ? (
            <p className="text-gray-500">No education records found.</p>
          ) : (
            educations.map((edu) => (
              <div
                key={edu.education_id}
                className="bg-white border rounded-xl p-5 flex items-center gap-6"
              >
                <GraduationCap className="text-blue-500" />
                <div className="flex-1">
                  <p className="font-semibold">{edu.school_name}</p>
                  <p className="text-sm text-blue-500">{edu.basic_educ_degree_course}</p>
                </div>
                <div>
                  <div className="flex items-center text-xs text-gray-400 gap-1">
                    <Calendar size={12} /> Attendance
                  </div>
                  <p className="text-sm font-semibold">
                    {formatDate(edu.attendance_start_date)} — {formatDate(edu.attendance_end_date)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}