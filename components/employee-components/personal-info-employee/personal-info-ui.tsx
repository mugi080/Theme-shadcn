"use client";

import { 
  User, MapPin, Phone, Mail, IdCard, Hash, Calendar, 
  Droplet, Ruler, Weight, Building2, Home 
} from "lucide-react";

interface PersonalInfo {
  employee_id?: string;
  employee_code?: string;
  active_status?: string;
  firstname?: string;
  middlename?: string;
  surname?: string;
  name_ext?: string;
  birthdate?: string;
  birthplace?: string;
  sex?: string;
  civil_status?: string;
  height?: string;
  weight?: string;
  blood_type?: string;
  gsis_no?: string;
  pagibig_no?: string;
  philhealth_no?: string;
  sss_no?: string;
  tin_no?: string;
  agency_emp_no?: string;
  citizenship?: string;
  citizenship_category?: string;
  citizenship_country?: string;
  ra_house_block_lotno?: string;
  ra_street?: string;
  ra_subdivision_village?: string;
  ra_barangay?: string;
  ra_city_municipality?: string;
  ra_province?: string;
  ra_zipcode?: string;
  pa_house_block_lotno?: string;
  pa_street?: string;
  pa_subdivision_village?: string;
  pa_barangay?: string;
  pa_city_municipality?: string;
  pa_province?: string;
  pa_zipcode?: string;
  telephone_no?: string;
  mobile_no?: string;
  email_address?: string;
}

interface Props {
  data: PersonalInfo;
}

const formatValue = (value: string | null | undefined): string => {
  if (!value || value.trim() === "" || value.toLowerCase() === "n/a") return "—";
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
      month: "long",
      day: "numeric"
    });
  } catch {
    return dateStr;
  }
};

const buildAddress = (
  houseBlockLot: string,
  street: string,
  subdivision: string,
  barangay: string,
  city: string,
  province: string,
  zipcode: string
): string => {
  const parts = [
    houseBlockLot,
    street,
    subdivision,
    barangay,
    city,
    province,
    zipcode
  ].filter((part) => part && part.trim() !== "");
  
  return parts.length > 0 ? parts.join(", ") : "—";
};

export default function PersonalInfoSectionUI({ data }: Props) {
  const fullName = formatName(
    data.firstname || "",
    data.middlename || "",
    data.surname || "",
    data.name_ext || ""
  );

  const residentialAddress = buildAddress(
    data.ra_house_block_lotno || "",
    data.ra_street || "",
    data.ra_subdivision_village || "",
    data.ra_barangay || "",
    data.ra_city_municipality || "",
    data.ra_province || "",
    data.ra_zipcode || ""
  );

  const permanentAddress = buildAddress(
    data.pa_house_block_lotno || "",
    data.pa_street || "",
    data.pa_subdivision_village || "",
    data.pa_barangay || "",
    data.pa_city_municipality || "",
    data.pa_province || "",
    data.pa_zipcode || ""
  );

  const isSameAddress = residentialAddress === permanentAddress;

  return (
    <div className="p-4 md:p-8 bg-background min-h-screen text-foreground">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Personal Profile
        </h2>

        {/* Identity Card */}
        <div
          className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 
                     flex flex-col md:flex-row md:items-center gap-6 hover:shadow-md transition-shadow"
        >
          {/* Avatar/Icon */}
          <div className="flex items-center gap-4 md:gap-5 flex-[1.5] min-w-0">
            <div className="p-3 md:p-4 bg-blue-50 dark:bg-blue-900/40 rounded-xl md:rounded-2xl shrink-0">
              <User
                className="text-blue-500 dark:text-blue-400 w-6 h-6 md:w-8 md:h-8"
                strokeWidth={1.5}
              />
            </div>

            <div className="min-w-0 space-y-0.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold uppercase tracking-wide bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 mb-1">
                Employee
              </span>
              <h3 className="text-base md:text-lg font-bold text-foreground leading-tight truncate">
                {fullName}
              </h3>
              <p className="text-blue-500 dark:text-blue-400 text-xs md:text-sm font-medium">
                {formatValue(data.civil_status)} • {formatValue(data.sex)}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 md:flex md:flex-[2] gap-4 md:gap-0 border-t md:border-t-0 pt-4 md:pt-0">
            <div className="flex flex-col items-start gap-1 md:flex-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar size={16} />
                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                  Birth Date
                </span>
              </div>
              <p className="text-sm font-bold text-foreground md:ml-6">
                {formatDate(data.birthdate ?? null)}
              </p>
            </div>

            <div className="flex flex-col items-start gap-1 md:flex-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Ruler size={16} />
                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                  Height
                </span>
              </div>
              <p className="text-sm font-bold text-foreground md:ml-6">
                {formatValue(data.height) !== "—" ? `${formatValue(data.height)} cm` : "—"}
              </p>
            </div>

            <div className="flex flex-col items-start gap-1 md:flex-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Weight size={16} />
                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                  Weight
                </span>
              </div>
              <p className="text-sm font-bold text-foreground md:ml-6">
                {formatValue(data.weight) !== "—" ? `${formatValue(data.weight)} kg` : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Birth & Physical Details */}
        <div
          className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 
                     hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 md:p-4 bg-cyan-50 dark:bg-cyan-900/40 rounded-xl md:rounded-2xl shrink-0">
              <Droplet
                className="text-cyan-500 dark:text-cyan-400 w-6 h-6 md:w-8 md:h-8"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-foreground">
                Birth & Physical Details
              </h3>
              <p className="text-cyan-500 dark:text-cyan-400 text-xs md:text-sm font-medium">
                Personal attributes
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pl-0 md:pl-14">
            <InfoBadge label="Birth Place" value={data.birthplace} />
            <InfoBadge label="Blood Type" value={data.blood_type} />
            <InfoBadge label="Sex" value={data.sex} />
            <InfoBadge label="Civil Status" value={data.civil_status} />
          </div>
        </div>

        {/* Contact Information */}
        <div
          className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 
                     hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 md:p-4 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl md:rounded-2xl shrink-0">
              <Phone
                className="text-emerald-500 dark:text-emerald-400 w-6 h-6 md:w-8 md:h-8"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-foreground">
                Contact Information
              </h3>
              <p className="text-emerald-500 dark:text-emerald-400 text-xs md:text-sm font-medium">
                Reach out anytime
              </p>
            </div>
          </div>

          <div className="space-y-3 pl-0 md:pl-14">
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-xl border border-border">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg shrink-0">
                <Phone className="text-emerald-600 dark:text-emerald-400 w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
                  Mobile Number
                </p>
                <p className="text-sm font-bold text-foreground">
                  {formatValue(data.mobile_no)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-xl border border-border">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg shrink-0">
                <Phone className="text-emerald-600 dark:text-emerald-400 w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
                  Telephone
                </p>
                <p className="text-sm font-bold text-foreground">
                  {formatValue(data.telephone_no)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-xl border border-border">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg shrink-0">
                <Mail className="text-emerald-600 dark:text-emerald-400 w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
                  Email Address
                </p>
                <p className="text-sm font-bold text-foreground truncate">
                  {formatValue(data.email_address)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div
          className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 
                     hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 md:p-4 bg-orange-50 dark:bg-orange-900/40 rounded-xl md:rounded-2xl shrink-0">
              <MapPin
                className="text-orange-500 dark:text-orange-400 w-6 h-6 md:w-8 md:h-8"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-foreground">
                Addresses
              </h3>
              <p className="text-orange-500 dark:text-orange-400 text-xs md:text-sm font-medium">
                Location details
              </p>
            </div>
          </div>

          <div className="space-y-4 pl-0 md:pl-14">
            {/* Residential */}
            <div className="flex items-start gap-3 p-3 bg-background/50 rounded-xl border border-border">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg shrink-0 mt-0.5">
                <Home className="text-orange-600 dark:text-orange-400 w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
                  Residential Address
                </p>
                <p className="text-sm font-bold text-foreground">
                  {residentialAddress}
                </p>
              </div>
            </div>

            {/* Permanent - only show if different */}
            {!isSameAddress && (
              <div className="flex items-start gap-3 p-3 bg-background/50 rounded-xl border border-border">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg shrink-0 mt-0.5">
                  <Building2 className="text-orange-600 dark:text-orange-400 w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
                    Permanent Address
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {permanentAddress}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Government IDs */}
        <div
          className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 
                     hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 md:p-4 bg-violet-50 dark:bg-violet-900/40 rounded-xl md:rounded-2xl shrink-0">
              <Hash
                className="text-violet-500 dark:text-violet-400 w-6 h-6 md:w-8 md:h-8"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-foreground">
                Government Identifiers
              </h3>
              <p className="text-violet-500 dark:text-violet-400 text-xs md:text-sm font-medium">
                Official records
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pl-0 md:pl-14">
            <IdCardBadge label="GSIS" value={data.gsis_no} />
            <IdCardBadge label="PAG-IBIG" value={data.pagibig_no} />
            <IdCardBadge label="PHILHEALTH" value={data.philhealth_no} />
            <IdCardBadge label="SSS" value={data.sss_no} />
            <IdCardBadge label="TIN" value={data.tin_no} />
            <IdCardBadge label="Agency No." value={data.agency_emp_no} />
          </div>
        </div>

        {/* Citizenship */}
        <div
          className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 
                     hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 md:p-4 bg-amber-50 dark:bg-amber-900/40 rounded-xl md:rounded-2xl shrink-0">
              <IdCard
                className="text-amber-500 dark:text-amber-400 w-6 h-6 md:w-8 md:h-8"
                strokeWidth={1.5}
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-base md:text-lg font-bold text-foreground">
                Citizenship
              </h3>
              <p className="text-amber-500 dark:text-amber-400 text-xs md:text-sm font-medium">
                Nationality information
              </p>
              <div className="space-y-1 mt-2">
                <p className="text-sm font-bold text-foreground">
                  {formatValue(data.citizenship)}
                </p>
                {data.citizenship_category && data.citizenship_category !== "" && (
                  <p className="text-xs text-muted-foreground">
                    Category: {formatValue(data.citizenship_category)}
                  </p>
                )}
                {data.citizenship_country && data.citizenship_country !== "" && (
                  <p className="text-xs text-muted-foreground">
                    Country: {formatValue(data.citizenship_country)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Sub-component for simple info badges
function InfoBadge({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="flex flex-col gap-1 p-3 bg-background/50 rounded-xl border border-border">
      <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <p className="text-sm font-bold text-foreground">
        {formatValue(value)}
      </p>
    </div>
  );
}

// Sub-component for ID badges - matching the established pattern
function IdCardBadge({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="flex flex-col gap-1 p-3 bg-background/50 rounded-xl border border-border">
      <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <p className="text-sm font-bold text-foreground font-mono">
        {formatValue(value)}
      </p>
    </div>
  );
}