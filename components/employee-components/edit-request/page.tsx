"use client";

import { useEffect, useState } from "react";
import { apiFetch, getEmployeeId } from "@/lib/api/personal-info/auth";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit2, RotateCcw, Plus, X, ArrowRight, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChangeRequest {
  empinfo_request_id: string;
  old_data: Record<string, any>;
  new_data: Record<string, any>;
  change_description: string | null;
  change_status: string;
  change_status_date: string | null;
  change_remarks: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Keys to skip when diffing (internal/system fields) */
const SKIP_KEYS = new Set([
  "family_id", "created_at", "updated_at", "deleted_at",
  "work_id", "education_id", "eligibility_id", "voluntary_work_id",
  "ld_intervention_id", "children_id", "family",
  "emp_work_exp", "emp_education", "emp_eligibility",
  "emp_voluntary_work", "emp_ldinterventions", "emp_children",
]);

/** Human-readable label map */
const FIELD_LABELS: Record<string, string> = {
  firstname: "First Name", middlename: "Middle Name", surname: "Surname",
  sex: "Sex", birthdate: "Birthdate", birthplace: "Birthplace",
  blood_type: "Blood Type", civil_status: "Civil Status",
  height: "Height (cm)", weight: "Weight (kg)",
  mobile_no: "Mobile No.", telephone_no: "Telephone No.",
  email_address: "Email Address", citizenship: "Citizenship",
  citizenship_category: "Citizenship Category", citizenship_country: "Citizenship Country",
  ra_house_block_lotno: "Res. House/Block/Lot No.", ra_street: "Res. Street",
  ra_subdivision_village: "Res. Subdivision/Village", ra_barangay: "Res. Barangay",
  ra_city_municipality: "Res. City/Municipality", ra_province: "Res. Province",
  ra_zipcode: "Res. Zip Code",
  pa_house_block_lotno: "Perm. House/Block/Lot No.", pa_street: "Perm. Street",
  pa_subdivision_village: "Perm. Subdivision/Village", pa_barangay: "Perm. Barangay",
  pa_city_municipality: "Perm. City/Municipality", pa_province: "Perm. Province",
  pa_zipcode: "Perm. Zip Code",
};

function labelFor(key: string) {
  return FIELD_LABELS[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

/** Shallow diff — returns only keys that differ */
function getDiff(oldData: Record<string, any> | null | undefined, newData: Record<string, any> | null | undefined) {
  const safeOld = oldData ?? {};
  const safeNew = newData ?? {};
  const allKeys = new Set([...Object.keys(safeOld), ...Object.keys(safeNew)]);
  const diffs: { key: string; oldVal: any; newVal: any }[] = [];

  allKeys.forEach(key => {
    if (SKIP_KEYS.has(key)) return;
    const ov = safeOld[key] ?? "";
    const nv = safeNew[key] ?? "";
    if (JSON.stringify(ov) !== JSON.stringify(nv)) {
      diffs.push({ key, oldVal: ov, newVal: nv });
    }
  });

  return diffs;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-PH", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

/** Determine what changed at a high level for the "Request Type" column */
function getRequestType(req: ChangeRequest) {
  if (req.change_description) return req.change_description;
  const diff = getDiff(req.old_data, req.new_data);
  if (diff.length === 0) return "General Update";
  const labels = diff.slice(0, 2).map(d => labelFor(d.key)).join(", ");
  return diff.length > 2 ? `${labels} +${diff.length - 2} more` : labels;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const s = (status || "").toUpperCase();
  if (s === "APPROVED")
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 gap-1.5">
        <CheckCircle2 className="w-3 h-3" /> Approved
      </Badge>
    );
  if (s === "REJECTED")
    return (
      <Badge className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 gap-1.5">
        <XCircle className="w-3 h-3" /> Rejected
      </Badge>
    );
  if (s === "PENDING")
    return (
      <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 gap-1.5">
        <Clock className="w-3 h-3" /> Pending
      </Badge>
    );
  return (
    <Badge variant="secondary" className="gap-1.5">
      <AlertCircle className="w-3 h-3" /> {status || "Unknown"}
    </Badge>
  );
}

// ─── View Modal ───────────────────────────────────────────────────────────────
function ViewModal({ req, onClose }: { req: ChangeRequest; onClose: () => void }) {
  const diff = getDiff(req.old_data, req.new_data);
  const status = (req.change_status || "").toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b bg-gradient-to-r from-slate-50 to-white">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Request Details</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              ID: {req.empinfo_request_id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meta info */}
        <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-slate-50 border-b text-sm">
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Status</p>
            <StatusBadge status={req.change_status} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Submitted</p>
            <p className="text-slate-700 font-medium">{formatDateTime(req.created_at)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Status Date</p>
            <p className="text-slate-700 font-medium">{formatDate(req.change_status_date)}</p>
          </div>
        </div>

        {/* Description */}
        {req.change_description && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
            <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-0.5">Description</p>
            <p className="text-sm text-blue-800">{req.change_description}</p>
          </div>
        )}

        {/* Remarks (for rejected) */}
        {status === "REJECTED" && req.change_remarks && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-100">
            <p className="text-xs text-red-600 font-medium uppercase tracking-wide mb-0.5">Rejection Reason</p>
            <p className="text-sm text-red-800">{req.change_remarks}</p>
          </div>
        )}

        {/* Diff Table */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {diff.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No field differences detected.</p>
            </div>
          ) : (
            <>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Changed Fields ({diff.length})
              </p>
              <div className="space-y-2">
                {diff.map(({ key, oldVal, newVal }) => (
                  <div
                    key={key}
                    className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    {/* Old value */}
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">
                        {labelFor(key)}
                      </p>
                      <p className="text-sm text-slate-500 line-through truncate">
                        {String(oldVal) || <span className="italic opacity-50">empty</span>}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0">
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                    </div>

                    {/* New value */}
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-500 mb-0.5">
                        New Value
                      </p>
                      <p className="text-sm font-semibold text-emerald-700 truncate">
                        {String(newVal) || <span className="italic opacity-50">empty</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-slate-50 flex justify-end">
          <Button variant="outline" onClick={onClose} className="rounded-lg">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit / Resubmit Slide Panel ──────────────────────────────────────────────
function EditPanel({
  req,
  onClose,
  onSaved,
}: {
  req: ChangeRequest;
  onClose: () => void;
  onSaved: () => void;
}) {
  const diff = getDiff(req.old_data, req.new_data);
  const isResubmit = (req.change_status || "").toUpperCase() === "REJECTED";

  // Build editable state from new_data fields that differ
  const [fields, setFields] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    diff.forEach(({ key, newVal }) => {
      init[key] = String(newVal ?? "");
    });
    return init;
  });
  const [description, setDescription] = useState(req.change_description ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError(null);

      // Merge edited fields back into new_data
      const updatedNewData = { ...req.new_data, ...fields };

      await apiFetch(`/protected/update_changeinforequest/${req.empinfo_request_id}`, {
        method: "PUT",
        
        body: JSON.stringify({
          new_data: updatedNewData,
          change_description: description,
          // If resubmitting, reset status
          ...(isResubmit ? { change_status: "PENDING" } : {}),
        }),
        
      });

      onSaved();
      onClose();
    } catch (err: any) {
      setSaveError(err.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Slide panel from right */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b bg-gradient-to-r from-slate-50 to-white">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {isResubmit ? "Resubmit Request" : "Edit Request"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isResubmit
                ? "Update and resubmit your rejected request."
                : "Modify your pending request before it's reviewed."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
              Change Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Reason for this change request..."
            />
          </div>

          {/* Changed fields */}
          {diff.length === 0 ? (
            <p className="text-sm text-slate-400 italic text-center py-6">No editable changes found.</p>
          ) : (
            <>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Edit Changed Fields
              </p>
              <div className="space-y-4">
                {diff.map(({ key, oldVal }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      {labelFor(key)}
                    </label>
                    <div className="text-[11px] text-slate-400 mb-1.5">
                      Current: <span className="font-medium text-slate-500">{String(oldVal) || "—"}</span>
                    </div>
                    <input
                      type="text"
                      value={fields[key] ?? ""}
                      onChange={e => setFields(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`New ${labelFor(key)}...`}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {saveError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {saveError}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-slate-50 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-lg" disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className={`flex-1 rounded-lg ${isResubmit ? "bg-orange-600 hover:bg-orange-700" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Saving...
              </span>
            ) : isResubmit ? (
              <><RotateCcw className="w-4 h-4 mr-1.5" /> Resubmit</>
            ) : (
              <><Edit2 className="w-4 h-4 mr-1.5" /> Save Changes</>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal / panel state
  const [viewingReq, setViewingReq] = useState<ChangeRequest | null>(null);
  const [editingReq, setEditingReq] = useState<ChangeRequest | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const empId = getEmployeeId();
      if (!empId) throw new Error("No employee ID found. Please log in.");

      const response = await apiFetch(`/protected/view_changeinforequest/${empId}`);
      const data = response?.data ?? (Array.isArray(response) ? response : []);
      console.log("✅ API Update Response:", response);
      setRequests(data);
    } catch (err: any) {
      setError(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <p className="text-muted-foreground text-sm">Loading your requests...</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Request Dashboard</h1>
            <p className="text-slate-500 mt-1">
              Track and manage your profile information change requests.
            </p>
          </div>
          <Button
            onClick={() => (window.location.href = "/user-profile")}
            className="shrink-0 bg-blue-600 hover:bg-blue-700 rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" /> New Request
          </Button>
        </div>

        {/* Summary stats */}
        {requests.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {["PENDING", "APPROVED", "REJECTED"].map(s => {
              const count = requests.filter(r => (r.change_status || "").toUpperCase() === s).length;
              const colors: Record<string, string> = {
                PENDING: "bg-amber-50 border-amber-200 text-amber-700",
                APPROVED: "bg-emerald-50 border-emerald-200 text-emerald-700",
                REJECTED: "bg-red-50 border-red-200 text-red-700",
              };
              return (
                <div key={s} className={`rounded-xl border p-4 ${colors[s]}`}>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-80 mt-0.5">{s}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Error */}
        {error ? (
          <div className="p-6 border border-destructive/50 rounded-xl bg-destructive/10 text-destructive">
            <p className="font-semibold">Error loading requests</p>
            <p className="text-sm mt-1">{error}</p>
            <Button variant="outline" className="mt-4" onClick={fetchRequests}>
              Try Again
            </Button>
          </div>
        ) : (
          <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[160px] font-semibold text-slate-600">Date Submitted</TableHead>
                  <TableHead className="font-semibold text-slate-600">Request Type</TableHead>
                  <TableHead className="font-semibold text-slate-600">Status</TableHead>
                  <TableHead className="font-semibold text-slate-600">Status Date</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20 text-slate-400">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p>You haven't submitted any requests yet.</p>
                      <Button
                        variant="link"
                        className="mt-2 text-blue-600"
                        onClick={() => (window.location.href = "/user-profile")}
                      >
                        Create your first request →
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((req) => {
                    const status = (req.change_status || "").toUpperCase();
                    const canEdit = status === "PENDING" || status === "REJECTED";
                    const diffCount = getDiff(req.old_data, req.new_data).length;

                    return (
                      <TableRow
                        key={req.empinfo_request_id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        {/* Date */}
                        <TableCell className="font-medium text-slate-700">
                          {formatDate(req.created_at)}
                        </TableCell>

                        {/* Request Type */}
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-slate-800 font-medium text-sm">
                              {getRequestType(req)}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              {diffCount} field{diffCount !== 1 ? "s" : ""} changed
                            </span>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <StatusBadge status={req.change_status} />
                        </TableCell>

                        {/* Status Date */}
                        <TableCell className="text-sm text-slate-500">
                          {formatDate(req.change_status_date)}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {/* View */}
                            <Button
                              variant="ghost"
                              size="sm"
                              title="View Details"
                              onClick={() => setViewingReq(req)}
                              className="text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              <span className="text-xs">View</span>
                            </Button>

                            {/* Edit / Resubmit */}
                            {canEdit && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingReq(req)}
                                className={
                                  status === "REJECTED"
                                    ? "text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100"
                                    : "text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100"
                                }
                              >
                                {status === "REJECTED" ? (
                                  <><RotateCcw className="w-3.5 h-3.5 mr-1" /><span className="text-xs">Resubmit</span></>
                                ) : (
                                  <><Edit2 className="w-3.5 h-3.5 mr-1" /><span className="text-xs">Edit</span></>
                                )}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewingReq && (
        <ViewModal req={viewingReq} onClose={() => setViewingReq(null)} />
      )}

      {/* Edit / Resubmit Panel */}
      {editingReq && (
        <EditPanel
          req={editingReq}
          onClose={() => setEditingReq(null)}
          onSaved={fetchRequests}
        />
      )}
    </>
  );
}