"use client";

import { User, MapPin, Phone, CreditCard, Calendar, Map } from "lucide-react";

interface Reference {
  reference_id: string;
  name: string;
  address: string;
  tel_no: string;
  order: number;
}

interface Identification {
  identification_id: string;
  govt_issued_id: string;
  id_no: string;
  issuance_date: string | null;
  issuance_place: string;
}

interface ReferenceGisData {
  emp_references: Reference[];
  emp_identifications: Identification[];
}

interface Props {
  data: ReferenceGisData | null;
}

const formatValue = (value: string | null | undefined): string => {
  if (!value || value.trim() === "") return "—";
  return value;
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

export default function ReferenceGisSectionUI({ data }: Props) {
  const refs = data?.emp_references ?? [];
  const ids = data?.emp_identifications ?? [];

  return (
    <div className="p-4 md:p-8 bg-background min-h-screen text-foreground">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          References & GIS
        </h2>

        {/* References Section */}
        <div
          className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 
                     hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 md:p-4 bg-orange-50 dark:bg-orange-900/40 rounded-xl md:rounded-2xl shrink-0">
              <User
                className="text-orange-500 dark:text-orange-400 w-6 h-6 md:w-8 md:h-8"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-foreground">
                Personal References
              </h3>
              <p className="text-orange-500 dark:text-orange-400 text-xs md:text-sm font-medium">
                {refs.length} reference{refs.length !== 1 ? "s" : ""} listed
              </p>
            </div>
          </div>

          {refs.length === 0 ? (
            <p className="text-muted-foreground italic text-sm pl-14">
              No references recorded.
            </p>
          ) : (
            <div className="space-y-3 pl-0 md:pl-14">
              {refs
                .sort((a, b) => a.order - b.order)
                .map((ref) => (
                  <div
                    key={ref.reference_id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-background/50 rounded-xl border border-border"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg shrink-0">
                        <User className="text-orange-600 dark:text-orange-400 w-4 h-4" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <p className="text-sm font-bold text-foreground truncate">
                          {formatValue(ref.name)}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3" />
                            {formatValue(ref.address)}
                          </span>
                          <span className="flex items-center gap-1 truncate">
                            <Phone className="w-3 h-3" />
                            {formatValue(ref.tel_no)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Identifications Section */}
        <div
          className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 
                     hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 md:p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl md:rounded-2xl shrink-0">
              <CreditCard
                className="text-slate-500 dark:text-slate-400 w-6 h-6 md:w-8 md:h-8"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-foreground">
                Government IDs
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium">
                {ids.length} ID{ids.length !== 1 ? "s" : ""} recorded
              </p>
            </div>
          </div>

          {ids.length === 0 ? (
            <p className="text-muted-foreground italic text-sm pl-14">
              No government IDs recorded.
            </p>
          ) : (
            <div className="space-y-3 pl-0 md:pl-14">
              {ids.map((id) => (
                <div
                  key={id.identification_id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-background/50 rounded-xl border border-border"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-slate-100 dark:bg-slate-900/30 rounded-lg shrink-0">
                      <CreditCard className="text-slate-600 dark:text-slate-400 w-4 h-4" />
                    </div>
                    <div className="min-w-0 space-y-1 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <p className="text-sm font-bold text-foreground truncate">
                          {formatValue(id.govt_issued_id)}
                        </p>
                        <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground shrink-0">
                          {formatValue(id.id_no)}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 truncate">
                          <Calendar className="w-3 h-3" />
                          Issued: {formatDate(id.issuance_date)}
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <Map className="w-3 h-3" />
                          {formatValue(id.issuance_place)}
                        </span>
                      </div>
                    </div>
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