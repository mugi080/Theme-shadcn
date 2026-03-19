"use client";

import { useState, useEffect } from "react";
import { Users, Baby, Loader2, Briefcase, Phone, User } from "lucide-react";
import { getEmployeeId, logout, apiFetch } from "@/lib/api/personal-info/auth";

/* ---------- Interfaces ---------- */

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

  emp_children: Child[];
}

interface Child {
  children_id: string;
  child_name: string;
  child_birthdate: string;
  status: string | null;
}

/* ---------- Main Component ---------- */

export default function FamilyBackgroundSectionUI() {
  const employeeId = getEmployeeId();

  const [family, setFamily] = useState<FamilyInfo | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFamily = async () => {
      if (!employeeId) {
        logout();
        return;
      }

      try {
        const data = await apiFetch(`/protected/view_employee/${employeeId}`);
        console.log("Full API Response:", data);

        if (!data.success) {
          setError("Failed to fetch family data.");
          return;
        }

        // FIX: Use 'family' key from API response
        const familyData: FamilyInfo | null = data.data.family ?? null;

        if (!familyData) {
          setError("No family record found.");
          setFamily(null);
          setChildren([]);
          return;
        }

        setFamily(familyData);
        setChildren(familyData.emp_children ?? []);
      } catch (err) {
        console.error("Family fetch error:", err);
        setError("An error occurred while fetching family data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFamily();
  }, [employeeId]);

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={30} className="animate-spin text-blue-500" />
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (error) {
    return (
      <div className="text-center text-red-500 py-20">{error}</div>
    );
  }

  /* ---------- UI ---------- */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* SPOUSE */}
        <CardSection title="Spouse Information" icon={<Users size={20} className="text-blue-500" />}>
          <DetailItem
            label="Full Name"
            value={formatFullName(family, "spouse")}
            icon={<User size={16} />}
          />
          <DetailItem
            label="Occupation"
            value={family?.spouse_occupation ?? "Not Provided"}
            icon={<Briefcase size={16} />}
          />
          <DetailItem
            label="Employer / Business"
            value={family?.spouse_employer_business_name ?? "Not Provided"}
            icon={<Briefcase size={16} />}
          />
          <DetailItem
            label="Business Address"
            value={family?.spouse_business_address ?? "Not Provided"}
            icon={<Briefcase size={16} />}
          />
          <DetailItem
            label="Telephone Number"
            value={family?.spouse_telephone_no ?? "Not Provided"}
            icon={<Phone size={16} />}
          />
        </CardSection>

        {/* PARENTS */}
        <CardSection title="Parents" icon={<Users size={20} className="text-blue-500" />}>
          <DetailItem
            label="Father"
            value={formatFullName(family, "father")}
            icon={<User size={16} />}
          />
          <DetailItem
            label="Mother"
            value={formatFullName(family, "mother")}
            icon={<User size={16} />}
          />
        </CardSection>

        {/* CHILDREN */}
        <CardSection title="Children" icon={<Baby size={20} className="text-blue-500" />}>
          {children.length === 0 ? (
            <p className="text-gray-400 italic text-sm">No children records found.</p>
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
                    {child.status ?? "N/A"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardSection>

      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

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

function CardSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        {icon} {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
}

/* ---------- Utility ---------- */

function formatFullName(family: FamilyInfo | null, type: "spouse" | "father" | "mother") {
  if (!family) return "Not Provided";

  let firstname = family[`${type}_firstname` as keyof FamilyInfo] as string;
  let middlename = family[`${type}_middlename` as keyof FamilyInfo] as string;
  let surname = family[`${type}_surname` as keyof FamilyInfo] as string;
  let name_ext = family[`${type}_name_ext` as keyof FamilyInfo] as string;

  return [firstname, middlename, surname, name_ext].filter(Boolean).join(" ");
}