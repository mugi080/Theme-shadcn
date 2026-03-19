"use client";

import { Heart, Users, Baby, Phone, MapPin, Building2, Briefcase } from "lucide-react";

interface Child {
  children_id: string;
  child_name: string;
  child_birthdate: string | null;
  status: string | null;
}

interface FamilyBackground {
  family_id: string;
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

interface Props {
  data: FamilyBackground | null;
}

const formatValue = (value: string | null | undefined): string => {
  if (!value || value.trim() === "") return "—";
  return value;
};

const formatName = (
  firstname: string,
  middlename: string,
  surname: string,
  nameExt: string
): string => {
  const parts = [
    firstname,
    middlename ? `${middlename.charAt(0)}.` : null,
    surname,
    nameExt
  ].filter(Boolean);
  return parts.join(" ") || "—";
};

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch {
    return dateStr;
  }
};

export default function FamilyBackgroundSectionUI({ data }: Props) {
  const family = data;

  if (!family) {
    return (
      <div className="p-4 md:p-8 bg-background min-h-screen text-foreground">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
            Family Background
          </h2>
          <p className="text-muted-foreground italic">
            No family background records found.
          </p>
        </div>
      </div>
    );
  }

  const spouseFullName = formatName(
    family.spouse_firstname,
    family.spouse_middlename,
    family.spouse_surname,
    family.spouse_name_ext
  );

  const fatherFullName = formatName(
    family.father_firstname,
    family.father_middlename,
    family.father_surname,
    family.father_name_ext
  );

  const motherFullName = formatName(
    family.mother_firstname,
    family.mother_middlename,
    family.mother_surname,
    ""
  );

  return (
    <div className="p-4 md:p-8 bg-background min-h-screen text-foreground">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Family Background
        </h2>

        {/* Spouse Section */}
        <div
          className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 
                     flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
        >
          {/* Left */}
          <div className="flex items-center gap-4 md:gap-5 flex-[1.5] min-w-0">
            <div className="p-3 md:p-4 bg-pink-50 dark:bg-pink-900/40 rounded-xl md:rounded-2xl shrink-0">
              <Heart
                className="text-pink-500 dark:text-pink-400 w-6 h-6 md:w-8 md:h-8"
                strokeWidth={1.5}
              />
            </div>

            <div className="min-w-0 space-y-0.5">
              <h3 className="text-base md:text-lg font-bold text-foreground leading-tight">
                Spouse
              </h3>
              <h3 className="text-base md:text-lg font-bold text-foreground leading-tight truncate">
                {spouseFullName}
              </h3>
              <p className="text-pink-500 dark:text-pink-400 text-xs md:text-sm font-medium truncate">
                {formatValue(family.spouse_occupation)}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 md:flex md:flex-[2] gap-4 md:gap-0 border-t md:border-t-0 pt-4 md:pt-0">
            <div className="flex flex-col items-start gap-1 md:flex-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase size={16} />
                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                  Employer
                </span>
              </div>
              <p className="text-sm font-bold text-foreground md:ml-6 truncate w-full">
                {formatValue(family.spouse_employer_business_name)}
              </p>
            </div>

            <div className="flex flex-col items-start gap-1 md:flex-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone size={16} />
                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                  Contact
                </span>
              </div>
              <p className="text-sm font-bold text-foreground md:ml-6">
                {formatValue(family.spouse_telephone_no)}
              </p>
            </div>
          </div>

          {/* Address full width on mobile */}
          <div className="md:hidden border-t pt-4">
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wide block mb-1">
                  Business Address
                </span>
                <p className="text-sm font-bold text-foreground">
                  {formatValue(family.spouse_business_address)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Parents Section */}
        <div
          className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 
                     flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow"
        >
          {/* Left */}
          <div className="flex items-center gap-4 md:gap-5 flex-[1.5] min-w-0">
            <div className="p-3 md:p-4 bg-purple-50 dark:bg-purple-900/40 rounded-xl md:rounded-2xl shrink-0">
              <Users
                className="text-purple-500 dark:text-purple-400 w-6 h-6 md:w-8 md:h-8"
                strokeWidth={1.5}
              />
            </div>

            <div className="min-w-0 space-y-1">
              <h3 className="text-base md:text-lg font-bold text-foreground leading-tight">
                Parents
              </h3>
              <p className="text-purple-500 dark:text-purple-400 text-xs md:text-sm font-medium">
                Family Lineage
              </p>
            </div>
          </div>

          {/* Parents Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:flex-[2] gap-4 md:gap-6 border-t md:border-t-0 pt-4 md:pt-0">
            {/* Father */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                  Father
                </span>
              </div>
              <p className="text-sm font-bold text-foreground">
                {fatherFullName}
              </p>
            </div>

            {/* Mother */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                  Mother
                </span>
              </div>
              <p className="text-sm font-bold text-foreground">
                {motherFullName}
              </p>
            </div>
          </div>
        </div>

        {/* Children Section */}
        <div
          className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 
                     hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 md:p-4 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl md:rounded-2xl shrink-0">
              <Baby
                className="text-emerald-500 dark:text-emerald-400 w-6 h-6 md:w-8 md:h-8"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-foreground">
                Children
              </h3>
              <p className="text-emerald-500 dark:text-emerald-400 text-xs md:text-sm font-medium">
                {family.emp_children?.length || 0} record{family.emp_children?.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {(!family.emp_children || family.emp_children.length === 0) ? (
            <p className="text-muted-foreground italic text-sm pl-14">
              No children records found.
            </p>
          ) : (
            <div className="space-y-3 pl-0 md:pl-14">
              {family.emp_children.map((child) => (
                <div
                  key={child.children_id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 
                             p-3 bg-background/50 rounded-xl border border-border"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg shrink-0">
                      <Baby className="text-emerald-600 dark:text-emerald-400 w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">
                        {formatValue(child.child_name)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Born: {formatDate(child.child_birthdate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] md:text-xs font-semibold px-2 py-1 rounded-full ${
                      child.status === "ACTIVE" 
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {formatValue(child.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}