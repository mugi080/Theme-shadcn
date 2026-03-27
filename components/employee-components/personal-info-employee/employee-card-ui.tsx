"use client";

import { useState, useEffect } from "react";
import { User, Loader2, Pencil, Eye } from "lucide-react";
import { getEmployeeId, logout, apiFetch } from "@/lib/api/personal-info/auth";
import EditProfileModal from "../editemployee/editmodalprofile";

export default function EmployeeCard() {
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);

  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);

  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewData, setReviewData] = useState<any>(null);
  const [reviewLoading, setReviewLoading] = useState(false);

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

        setHasPendingRequest(data.data.pending_edit_request ?? false);
        setRequestId(data.data.pending_request_id ?? null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleReview = async () => {
    if (!requestId) return;

    setReviewLoading(true);
    try {
      const res = await apiFetch(
        `/protected/view_changeinforequest/${requestId}`
      );

      if (res.success) {
        setReviewData(res.data);
        setReviewOpen(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  if (!info) return null;

  const fullName = `${info.firstname || ""} ${info.middlename || ""} ${
    info.surname || ""
  } ${info.name_ext || ""}`.trim();

  return (
    <>
      <div className="bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border flex flex-col md:flex-row items-center gap-6 mb-6">
        {/* Avatar */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center bg-muted text-muted-foreground border border-border shadow-sm">
          <User size={48} strokeWidth={1.5} />
        </div>

        {/* Info */}
        <div className="text-center md:text-left flex-1">
          <h1 className="text-2xl md:text-3xl font-black text-foreground leading-tight">
            {fullName}
          </h1>

          <p className="text-muted-foreground font-medium mt-1">
            Employee Code: {info.employee_code || "N/A"}
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
            <span className="bg-primary/20 text-primary px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Active
            </span>

            <span className="bg-muted/20 text-muted-foreground px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              {info.civil_status || "Single"}
            </span>
          </div>

          {/* 🔥 Pending Request UX Block */}
          {hasPendingRequest && (
            <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-sm">
              <p className="font-semibold text-yellow-700">
                🟡 Pending Request
              </p>
              <p className="text-muted-foreground mt-1">
                You already submitted a request.
                <br />
                You can review it below.
              </p>

              <button
                onClick={handleReview}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-yellow-500 text-white hover:opacity-90"
              >
                {reviewLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Eye size={14} />
                )}
                Review Request
              </button>
            </div>
          )}
        </div>

        {/* Action */}
        {!hasPendingRequest && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 ml-auto"
          >
            <Pencil size={14} /> Edit Profile
          </button>
        )}
      </div>

      {/* Edit Modal */}
      {modalOpen && (
        <EditProfileModal
          initialData={info}
          onClose={() => setModalOpen(false)}
          onSubmit={() => {
            setModalOpen(false);
            fetchInfo(); // refresh state
          }}
        />
      )}

      {/* Review Modal */}
      {reviewOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Review Change Request
            </h2>

            <div className="max-h-[400px] overflow-auto text-sm">
              <pre className="bg-muted p-3 rounded-lg">
                {JSON.stringify(reviewData, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setReviewOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}