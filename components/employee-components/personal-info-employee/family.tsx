"use client";

import { useState, useEffect } from "react";
import { Loader2, Users, Baby } from "lucide-react";
import { getEmployeeId, getToken, logout, apiFetch } from "@/lib/api/personal-info/auth";

interface FamilyInfo {
  family_id: string;
  // Spouse
  spouse_firstname: string;
  spouse_middlename: string;
  spouse_surname: string;
  spouse_name_ext: string;
  spouse_occupation: string;
  spouse_employer_business_name: string;
  spouse_business_address: string;
  spouse_telephone_no: string;
  // Father
  father_firstname: string;
  father_middlename: string;
  father_surname: string;
  father_name_ext: string;
  // Mother
  mother_firstname: string;
  mother_middlename: string;
  mother_surname: string;
}

interface Child {
  children_id: string;
  child_name: string;
  child_birthdate: string;
  status: string;
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[11px] font-bold text-blue-500 uppercase tracking-widest mb-3">
      {label}
    </p>
  );
}

function FieldGroup({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value || "—"}</p>
    </div>
  );
}

function Divider() {
  return <hr className="border-gray-100 my-4" />;
}

export default function FamilyBackgroundSectionUI() {
  const employeeId = getEmployeeId();
  const token = getToken();
  const [family, setFamily] = useState<FamilyInfo | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFamily = async () => {
      if (!employeeId || !token) {
        logout();
        return;
      }
      setLoading(true);
      try {
        const res = await apiFetch(`/protected/view_employee/${employeeId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setFamily(data.data.emp_family ?? null);
          setChildren(data.data.emp_children ?? []);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch family records");
      } finally {
        setLoading(false);
      }
    };
    fetchFamily();
  }, [employeeId, token]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 size={30} className="animate-spin text-blue-400" />
    </div>
  );
  if (error) return <p className="text-red-500 p-8">{error}</p>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Family Background</h2>

        <div className="flex flex-col lg:flex-row gap-5">

          {/* ── Left Card: Spouse & Parents ── */}
          <div className="flex-[1.4] bg-white border border-gray-100 rounded-2xl md:rounded-3xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Users size={18} className="text-gray-400" />
              <h3 className="text-base font-bold text-gray-800">Spouse & Parents</h3>
            </div>

            {/* SPOUSE */}
            <SectionLabel label="Spouse" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4 mb-2">
              <FieldGroup label="Surname"     value={family?.spouse_surname ?? ""} />
              <FieldGroup label="First Name"  value={family?.spouse_firstname ?? ""} />
              <FieldGroup label="Middle Name" value={family?.spouse_middlename ?? ""} />
              <FieldGroup label="Suffix"      value={family?.spouse_name_ext ?? ""} />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 mt-3">
              <FieldGroup label="Occupation"    value={family?.spouse_occupation ?? ""} />
              <FieldGroup label="Telephone No." value={family?.spouse_telephone_no ?? ""} />
            </div>

            {/* BUSINESS */}
            <Divider />
            <SectionLabel label="Business" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <FieldGroup label="Name"    value={family?.spouse_employer_business_name ?? ""} />
              <FieldGroup label="Address" value={family?.spouse_business_address ?? ""} />
            </div>

            {/* FATHER */}
            <Divider />
            <SectionLabel label="Father" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4">
              <FieldGroup label="Surname"     value={family?.father_surname ?? ""} />
              <FieldGroup label="First Name"  value={family?.father_firstname ?? ""} />
              <FieldGroup label="Middle Name" value={family?.father_middlename ?? ""} />
              <FieldGroup label="Suffix"      value={family?.father_name_ext ?? ""} />
            </div>

            {/* MOTHER */}
            <Divider />
            <SectionLabel label="Mother" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4">
              <FieldGroup label="Surname"     value={family?.mother_surname ?? ""} />
              <FieldGroup label="First Name"  value={family?.mother_firstname ?? ""} />
              <FieldGroup label="Middle Name" value={family?.mother_middlename ?? ""} />
              <FieldGroup label="Suffix"      value={"—"} />
            </div>
          </div>

          {/* ── Right Card: Children ── */}
          <div className="flex-1 bg-white border border-gray-100 rounded-2xl md:rounded-3xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Baby size={18} className="text-gray-400" />
              <h3 className="text-base font-bold text-gray-800">Children</h3>
            </div>

            {children.length === 0 ? (
              <p className="text-gray-400 text-sm italic text-center py-10">No children records found.</p>
            ) : (
              <div className="flex flex-col">
                {/* Table Header */}
                <div className="grid grid-cols-3 pb-2 border-b border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Full Name</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Birthdate</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Status</p>
                </div>

                {/* Table Rows */}
                {children.map((child) => (
                  <div
                    key={child.children_id}
                    className="grid grid-cols-3 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors rounded-lg px-1"
                  >
                    <p className="text-sm font-semibold text-gray-800 truncate pr-2">{child.child_name}</p>
                    <p className="text-sm text-gray-600">{formatDate(child.child_birthdate)}</p>
                    <span className="inline-flex items-center">
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        {child.status}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}