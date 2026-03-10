"use client";

import { useState, useEffect } from "react";
import { User, MapPin, Phone, Mail, IdCard, Hash, Loader2, Pencil, Calendar, Heart } from "lucide-react";
import { getEmployeeId, getToken, logout, apiFetch } from "@/lib/api/personal-info/auth";

interface PersonalInfo {
  firstname: string;
  middlename: string;
  surname: string;
  name_ext: string;
  employee_code: string;
  birthdate: string;
  mobile_no: string;
  email_address: string;
  civil_status: string;
  gsis_no: string;
  pagibig_no: string;
  philhealth_no: string;
  sss_no: string;
  tin_no: string;
  ra_barangay: string;
  ra_city_municipality: string;
  ra_province: string;
  // ... add other fields as needed
}

export default function PersonalInfoSectionUI() {
  const employeeId = getEmployeeId();
  const token = getToken();
  const [info, setInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      if (!employeeId || !token) {
        logout();
        return;
      }
      setLoading(true);
      try {
        const res = await apiFetch(`/protected/view_employee/${employeeId}`);
        const data = await res.json();
        if (data.success) {
          setInfo(data.data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch personal information");
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [employeeId, token]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={30} className="animate-spin text-blue-500" /></div>;
  if (!info) return null;

  const FullName = `${info.firstname} ${info.middlename} ${info.surname} ${info.name_ext}`.trim();

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
          {/* Contact & Personal Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <IdCard className="text-blue-500" size={20} /> Personal Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <DetailItem label="Birth Date" value={info.birthdate} icon={<Calendar size={16}/>} />
                <DetailItem label="Mobile Number" value={info.mobile_no} icon={<Phone size={16}/>} />
                <DetailItem label="Email Address" value={info.email_address} icon={<Mail size={16}/>} />
                <DetailItem label="Residential Address" 
                  value={`${info.ra_barangay}, ${info.ra_city_municipality}, ${info.ra_province}`} 
                  icon={<MapPin size={16}/>} 
                />
              </div>
            </div>

            {/* Government IDs Section */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Hash className="text-blue-500" size={20} /> Government Identifiers
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <IdBadge label="GSIS" value={info.gsis_no} />
                <IdBadge label="PAG-IBIG" value={info.pagibig_no} />
                <IdBadge label="PHILHEALTH" value={info.philhealth_no} />
                <IdBadge label="SSS" value={info.sss_no} />
                <IdBadge label="TIN" value={info.tin_no} />
              </div>
            </div>
          </div>

          {/* Sidebar Info (e.g. Physical Attributes) */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-200">
              <h2 className="font-bold mb-4 opacity-90">Quick Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span className="text-sm opacity-80">Blood Type</span>
                  <span className="font-bold">O+</span>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span className="text-sm opacity-80">Citizenship</span>
                  <span className="font-bold">Filipino</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
  );
}

// Sub-components for cleaner code
function DetailItem({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-gray-400">
        {icon}
        <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm md:text-base font-bold text-gray-800 ml-6 break-words">
        {value || "Not Provided"}
      </p>
    </div>
  );
}

function IdBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{label}</p>
      <p className="text-sm font-black text-gray-800 truncate">{value || "---"}</p>
    </div>
  );
}