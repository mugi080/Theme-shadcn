"use client";

import { useState, useEffect } from "react";
import { Award, Calendar, MapPin, Loader2, ShieldCheck } from "lucide-react";
import { getEmployeeId, getToken, logout, apiFetch } from "@/lib/api/personal-info/auth";

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

export default function EligibilitySectionUI() {
  const employeeId = getEmployeeId();
  const token = getToken();
  const [eligibilities, setEligibilities] = useState<Eligibility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEligibility = async () => {
      if (!employeeId || !token) {
        logout();
        return;
      }

      setLoading(true);
      try {
        const res = await apiFetch(`/protected/view_employee/${employeeId}`);
        const data = await res.json();

        if (data.success && data.data?.emp_eligibility) {
          setEligibilities(data.data.emp_eligibility);
        } else {
          setEligibilities([]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch eligibility records");
      } finally {
        setLoading(false);
      }
    };

    fetchEligibility();
  }, [employeeId, token]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={30} className="animate-spin text-blue-500" /></div>;
  if (error) return <p className="text-red-500 p-8">{error}</p>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-4 md:gap-6 max-w-6xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Civil Service Eligibility</h2>

        {eligibilities.length === 0 && (
          <p className="text-gray-500 italic">No eligibility records found.</p>
        )}

        {eligibilities.map((elig) => (
          <div
            key={elig.eligibility_id}
            className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 
                       flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
          >
            {/* Left: Eligibility Type & Place */}
            <div className="flex items-center gap-4 md:gap-5 flex-[1.5] min-w-0">
              <div className="p-3 md:p-4 bg-purple-50 rounded-xl md:rounded-2xl shrink-0">
                <Award className="text-purple-500 w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="text-base md:text-lg font-bold text-gray-900 leading-tight break-words">
                  {elig.cse_particular}
                </h3>
                <div className="flex flex-wrap items-center gap-1.5 text-gray-500 text-xs md:text-sm">
                  <MapPin size={14} className="shrink-0" />
                  <span className="truncate">{elig.exam_place_conferment}</span>
                  {elig.status === "Active" && (
                    <span className="bg-blue-100 text-blue-700 text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                      {elig.status}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Middle Content (Grid for mobile, Flex for desktop) */}
            <div className="grid grid-cols-2 md:flex md:flex-[2] gap-4 md:gap-0 border-t md:border-t-0 pt-4 md:pt-0">

              {/* Rating & Date */}
              <div className="flex flex-col items-start gap-1 md:flex-1">
                <div className="flex items-center gap-2 text-gray-400">
                  <ShieldCheck size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">Rating</span>
                </div>
                <div className="md:ml-7">
                  <p className="text-sm font-bold text-gray-800">{elig.rating}%</p>
                  <p className="text-[10px] md:text-[11px] text-gray-500">{formatDate(elig.exam_date_conferment)}</p>
                </div>
              </div>

              {/* License / Validity */}
              <div className="flex flex-col items-start gap-1 md:flex-1">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">License</span>
                </div>
                <div className="md:ml-7">
                  <p className="text-sm font-black text-gray-900 truncate max-w-[120px] md:max-w-none">
                    {elig.license_no || "N/A"}
                  </p>
                  <p className="text-[10px] md:text-[11px] text-gray-500">Exp: {formatDate(elig.validity_date)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}