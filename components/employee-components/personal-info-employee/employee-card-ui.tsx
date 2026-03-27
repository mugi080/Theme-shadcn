"use client";

import { useState, useEffect } from "react";
import { User, Loader2, Pencil, ClipboardList } from "lucide-react";
import { getEmployeeId, logout, apiFetch } from "@/lib/api/personal-info/auth";
import EditProfileModal from "../editemployee/editmodalprofile";

const MAX_PENDING_REQUESTS = 3;

interface EmployeeCardProps {
  onEditRequestsToggle?: (isOpen: boolean) => void;
}

export default function EmployeeCard({ onEditRequestsToggle }: EmployeeCardProps) {
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchInfo = async () => {
      const employeeId = getEmployeeId();
      if (!employeeId) {
        logout();
        return;
      }

      try {
        const data = await apiFetch(`/protected/view_employee/${employeeId}`);
        if (data.success) {
          setInfo(data.data);
        }

        const requestsRes = await apiFetch(`/protected/view_changeinforequest/${employeeId}`);
        const requests = requestsRes?.data ?? (Array.isArray(requestsRes) ? requestsRes : []);
        const pending = requests.filter(
          (r: any) => (r.change_status || "").toUpperCase() === "PENDING"
        ).length;
        setPendingCount(pending);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  if (loading) return (
    <div className="flex justify-center p-8">
      <Loader2 className="animate-spin text-primary" />
    </div>
  );

  if (!info) return null;

  const fullName = `${info.firstname || ""} ${info.middlename || ""} ${info.surname || ""} ${info.name_ext || ""}`.trim();
  const isMaxedOut = pendingCount >= MAX_PENDING_REQUESTS;

  return (
    <>
      <div className="bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center bg-muted text-muted-foreground border border-border shadow-sm">
          <User size={48} strokeWidth={1.5} />
        </div>

        <div className="text-center md:text-left flex-1">
          <h1 className="text-2xl md:text-3xl font-black text-foreground leading-tight">{fullName}</h1>
          <p className="text-muted-foreground font-medium mt-1">Employee Code: {info.employee_code || "N/A"}</p>

          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
            <span className="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-800">
              Active
            </span>
            <span className="bg-muted/20 text-muted-foreground px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              {info.civil_status || "Single"}
            </span>
          </div>
        </div>

        {isMaxedOut ? (
          <button
            onClick={() => onEditRequestsToggle?.(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all ml-auto bg-amber-500 text-white hover:bg-amber-600"
          >
            <ClipboardList size={14} /> View Edit Requests
          </button>
        ) : (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all ml-auto bg-primary text-primary-foreground hover:opacity-90"
          >
            <Pencil size={14} /> Edit Profile
          </button>
        )}
      </div>

      {/* Edit Profile Modal */}
      {modalOpen && (
        <EditProfileModal
          initialData={info}
          onClose={() => setModalOpen(false)}
          onSubmit={() => setPendingCount(prev => prev + 1)}
        />
      )}
    </>
  );
}