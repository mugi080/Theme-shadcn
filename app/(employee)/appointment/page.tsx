"use client";

import { useState, useEffect } from "react";
import { Users, Baby, Loader2, Briefcase, Phone, User } from "lucide-react";
import { getEmployeeId, logout, apiFetch } from "@/lib/api/personal-info/auth";

interface FamilyInfo {
  spouse_firstname: string;
  spouse_middlename: string;
  spouse_surname: string;
  spouse_name_ext: string;
  spouse_occupation: string;
  spouse_employer_business_name: string;
  spouse_business_address: string;
  spouse_telephone_no: string;

  father_firstname: string;
  father_middlename: string;
  father_surname: string;
  father_name_ext: string;

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

export default function FamilyBackgroundSectionUI() {
  const employeeId = getEmployeeId();

  const [family, setFamily] = useState<FamilyInfo | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFamily = async () => {
      if (!employeeId) {
        logout();
        return;
      }

      try {
        const data = await apiFetch(`/protected/view_employee/${employeeId}`);

        if (data.success) {
          setFamily(data.data.emp_family ?? null);
          setChildren(data.data.emp_children ?? []);
        }
      } catch (error) {
        console.error("Family fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFamily();
  }, [employeeId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={30} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* SPOUSE */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Users size={20} className="text-blue-500" /> Spouse Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem
              label="Full Name"
              value={`${family?.spouse_firstname ?? ""} ${family?.spouse_middlename ?? ""} ${family?.spouse_surname ?? ""} ${family?.spouse_name_ext ?? ""}`}
              icon={<User size={16} />}
            />

            <DetailItem
              label="Occupation"
              value={family?.spouse_occupation ?? ""}
              icon={<Briefcase size={16} />}
            />

            <DetailItem
              label="Employer / Business"
              value={family?.spouse_employer_business_name ?? ""}
              icon={<Briefcase size={16} />}
            />

            <DetailItem
              label="Business Address"
              value={family?.spouse_business_address ?? ""}
              icon={<Briefcase size={16} />}
            />

            <DetailItem
              label="Telephone Number"
              value={family?.spouse_telephone_no ?? ""}
              icon={<Phone size={16} />}
            />
          </div>
        </div>

        {/* PARENTS */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Users size={20} className="text-blue-500" /> Parents
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem
              label="Father"
              value={`${family?.father_firstname ?? ""} ${family?.father_middlename ?? ""} ${family?.father_surname ?? ""} ${family?.father_name_ext ?? ""}`}
              icon={<User size={16} />}
            />

            <DetailItem
              label="Mother"
              value={`${family?.mother_firstname ?? ""} ${family?.mother_middlename ?? ""} ${family?.mother_surname ?? ""}`}
              icon={<User size={16} />}
            />
          </div>
        </div>

        {/* CHILDREN */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Baby size={20} className="text-blue-500" /> Children
          </h2>

          {children.length === 0 ? (
            <p className="text-gray-400 italic text-sm">
              No children records found.
            </p>
          ) : (
            <div className="space-y-4">
              {children.map((child) => (
                <div
                  key={child.children_id}
                  className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-2xl p-4"
                >
                  <div>
                    <p className="font-bold text-gray-800">{child.child_name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(child.child_birthdate).toLocaleDateString()}
                    </p>
                  </div>

                  <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase">
                    {child.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

/* ---------- Reusable Component ---------- */

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-gray-400">
        {icon}
        <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="text-sm md:text-base font-bold text-gray-800 ml-6 break-words">
        {value || "Not Provided"}
      </p>
    </div>
  );
}