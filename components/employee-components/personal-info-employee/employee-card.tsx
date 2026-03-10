"use client";

import { useState, useEffect } from "react";
import { User, Loader2, Pencil } from "lucide-react";
import { getEmployeeId, getToken, logout, apiFetch } from "@/lib/api/personal-info/auth";

export default function EmployeeCard() {
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      const employeeId = getEmployeeId();
      const token = getToken();
      if (!employeeId || !token) { logout(); return; }
      
      try {
        const res = await apiFetch(`/protected/view_employee/${employeeId}`);
        const data = await res.json();
        if (data.success) setInfo(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-500" /></div>;
  if (!info) return null;

  const fullName = `${info.firstname} ${info.middlename} ${info.surname} ${info.name_ext}`.trim();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 mb-6">
      {/* Avatar Icon */}
      <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
        <User size={48} strokeWidth={1.5} />
      </div>

      {/* Text Info */}
      <div className="text-center md:text-left flex-1">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
          {fullName}
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Employee Code: {info.employee_code || "N/A"}
        </p>
        
        {/* Badges */}
        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
          <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
            Active
          </span>
          <span className="bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
            {info.civil_status || "Single"}
          </span>
        </div>
      </div>

      {/* Edit Button */}
      <button className="flex items-center gap-2 bg-[#0f172a] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all ml-auto">
        <Pencil size={14} /> Edit Profile
      </button>
    </div>
  );
}