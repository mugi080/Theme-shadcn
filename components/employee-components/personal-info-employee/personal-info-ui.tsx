"use client";

import React from "react";
import { User, MapPin, Phone, Mail, IdCard, Hash, Calendar } from "lucide-react";

interface PersonalInfo {
  firstname?: string;
  middlename?: string;
  surname?: string;
  name_ext?: string;
  birthdate?: string;
  mobile_no?: string;
  email_address?: string;
  civil_status?: string;
  gsis_no?: string;
  pagibig_no?: string;
  philhealth_no?: string;
  sss_no?: string;
  tin_no?: string;
  ra_barangay?: string;
  ra_city_municipality?: string;
  ra_province?: string;
  blood_type?: string;
  citizenship?: string;
}

interface Props {
  data: PersonalInfo;
}

export default function PersonalInfoSectionUI({ data }: Props) {
  const FullName = `${data.firstname || ""} ${data.middlename || ""} ${data.surname || ""} ${data.name_ext || ""}`.trim();

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Personal Details */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <IdCard className="text-blue-500" size={20} /> Personal Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <DetailItem label="Birth Date" value={data.birthdate || ""} icon={<Calendar size={16} />} />
            <DetailItem label="Mobile Number" value={data.mobile_no || ""} icon={<Phone size={16} />} />
            <DetailItem label="Email Address" value={data.email_address || ""} icon={<Mail size={16} />} />
            <DetailItem
              label="Residential Address"
              value={`${data.ra_barangay || ""}, ${data.ra_city_municipality || ""}, ${data.ra_province || ""}`}
              icon={<MapPin size={16} />}
            />
          </div>
        </div>

        {/* Government IDs */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Hash className="text-blue-500" size={20} /> Government Identifiers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <IdBadge label="GSIS" value={data.gsis_no || ""} />
            <IdBadge label="PAG-IBIG" value={data.pagibig_no || ""} />
            <IdBadge label="PHILHEALTH" value={data.philhealth_no || ""} />
            <IdBadge label="SSS" value={data.sss_no || ""} />
            <IdBadge label="TIN" value={data.tin_no || ""} />
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-200">
          <h2 className="font-bold mb-4 opacity-90">Quick Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-white/20 pb-2">
              <span className="text-sm opacity-80">Blood Type</span>
              <span className="font-bold">{data.blood_type || "Not Provided"}</span>
            </div>
            <div className="flex justify-between border-b border-white/20 pb-2">
              <span className="text-sm opacity-80">Citizenship</span>
              <span className="font-bold">{data.citizenship || "Not Provided"}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Sub-components
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