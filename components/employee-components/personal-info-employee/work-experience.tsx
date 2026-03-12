"use client";

import { useState, useEffect } from "react";
import { Calendar, Briefcase, Loader2, Banknote } from "lucide-react";
import { getEmployeeId, getToken, logout, apiFetch } from "@/lib/api/personal-info/auth";

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

export default function WorkExperienceSectionUI() {
  const employeeId = getEmployeeId();
  const token = getToken();
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperience = async () => {
      if (!employeeId || !token) {
        logout();
        return;
      }

      setLoading(true);
      try {
        const res = await apiFetch(`/protected/view_employee/${employeeId}`);
        const data = await res.json();

        if (data.success && data.data?.emp_work_exp) {
          setExperiences(data.data.emp_work_exp);
        } else {
          setExperiences([]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch work experience");
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [employeeId, token]);

  const formatYearRange = (start: string, end: string | null) => {
    const startYear = new Date(start).getFullYear();
    const endYear = end ? new Date(end).getFullYear() : "Present";
    return `${startYear}-${endYear}`;
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={30} className="animate-spin text-blue-500" /></div>;
  if (error) return <p className="text-red-500 p-8 bg-red-50 rounded-xl m-8">{error}</p>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-4 md:gap-6 max-w-6xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Work Experience</h2>

        {experiences.length === 0 && (
          <p className="text-gray-500 italic">No work experience records found.</p>
        )}

        {experiences.map((exp) => (
          <div
            key={exp.work_id}
            className="group bg-white border border-gray-100 rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 
                       flex flex-col md:flex-row md:items-center justify-between gap-5 hover:shadow-md transition-shadow"
          >
            {/* Left Section: Icon & Titles */}
            <div className="flex items-center gap-4 md:gap-5 flex-[1.5] min-w-0">
              <div className="p-3 md:p-4 bg-blue-50 rounded-xl md:rounded-2xl shrink-0 flex items-center justify-center">
                <Briefcase className="text-blue-400 w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
              </div>
              <div className="space-y-0.5 md:space-y-1 min-w-0">
                <h3 className="text-base md:text-lg font-bold text-gray-900 leading-tight truncate">
                  {exp.position_title}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-500 text-xs md:text-sm font-medium truncate">
                    {exp.department_company}
                  </span>
                  {exp.govt_service && (
                    <span className="bg-green-100 text-green-700 text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                      Gov't
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Middle Content: Grid on mobile, Flex on desktop */}
            <div className="grid grid-cols-2 md:flex md:flex-[2] gap-4 md:gap-0 border-t md:border-t-0 pt-4 md:pt-0">

              {/* Duration */}
              <div className="flex flex-col items-start gap-1 md:flex-1">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">Duration</span>
                </div>
                <p className="text-sm font-bold text-gray-800 md:ml-7">
                  {formatYearRange(exp.date_from, exp.date_to)}
                </p>
              </div>

              {/* Salary */}
              <div className="flex flex-col items-start gap-1 md:flex-1">
                <div className="flex items-center gap-2 text-gray-400">
                  <Banknote size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">Salary</span>
                </div>
                <p className="text-sm font-black text-gray-900 md:ml-7">
                  {formatCurrency(exp.salary_monthly)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}