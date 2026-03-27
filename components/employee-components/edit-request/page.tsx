"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Eye,
  Plus,
  X,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

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

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_REQUESTS: ChangeRequest[] = [
  {
    empinfo_request_id: "REQ-001",
    old_data: { spouse_name: "" },
    new_data: { spouse_name: "Maria Santos" },
    change_description: "Updating family background and spouse/parent information",
    change_status: "PENDING",
    change_status_date: null,
    change_remarks: null,
    created_at: "2026-03-24T08:00:00Z",
    updated_at: "2026-03-24T08:00:00Z",
  },
  {
    empinfo_request_id: "REQ-002",
    old_data: { mobile_no: "09171234567" },
    new_data: { mobile_no: "09281234567" },
    change_description: "Profile Update",
    change_status: "PENDING",
    change_status_date: null,
    change_remarks: null,
    created_at: "2026-03-24T09:30:00Z",
    updated_at: "2026-03-24T09:30:00Z",
  },
  {
    empinfo_request_id: "REQ-003",
    old_data: {},
    new_data: {},
    change_description: "Profile Update",
    change_status: "PENDING",
    change_status_date: null,
    change_remarks: null,
    created_at: "2026-03-24T10:00:00Z",
    updated_at: "2026-03-24T10:00:00Z",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const SKIP_KEYS = new Set([
  "family_id", "created_at", "updated_at", "deleted_at",
  "work_id", "education_id", "eligibility_id", "voluntary_work_id",
  "ld_intervention_id", "children_id", "family",
  "emp_work_exp", "emp_education", "emp_eligibility",
  "emp_voluntary_work", "emp_ldinterventions", "emp_children",
]);

const FIELD_LABELS: Record<string, string> = {
  firstname: "First Name", middlename: "Middle Name", surname: "Surname",
  sex: "Sex", birthdate: "Birthdate", birthplace: "Birthplace",
  blood_type: "Blood Type", civil_status: "Civil Status",
  height: "Height (cm)", weight: "Weight (kg)",
  mobile_no: "Mobile No.", telephone_no: "Telephone No.",
  email_address: "Email Address", citizenship: "Citizenship",
  spouse_name: "Spouse Name",
};

function labelFor(key: string) {
  return FIELD_LABELS[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getDiff(oldData: Record<string, any>, newData: Record<string, any>) {
  const allKeys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);
  const diffs: { key: string; oldVal: any; newVal: any }[] = [];
  allKeys.forEach((key) => {
    if (SKIP_KEYS.has(key)) return;
    const ov = oldData[key] ?? "";
    const nv = newData[key] ?? "";
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

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const s = (status || "").toUpperCase();
  if (s === "APPROVED")
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 gap-1.5 font-medium">
        <CheckCircle2 className="w-3 h-3" /> Approved
      </Badge>
    );
  if (s === "REJECTED")
    return (
      <Badge className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 gap-1.5 font-medium">
        <XCircle className="w-3 h-3" /> Rejected
      </Badge>
    );
  if (s === "PENDING")
    return (
      <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 gap-1.5 font-medium">
        <Clock className="w-3 h-3" /> Pending
      </Badge>
    );
  return (
    <Badge variant="secondary" className="gap-1.5 font-medium">
      <AlertCircle className="w-3 h-3" /> {status || "Unknown"}
    </Badge>
  );
}

// ─── View Dialog ──────────────────────────────────────────────────────────────
function ViewDialog({ req, onClose }: { req: ChangeRequest; onClose: () => void }) {
  const diff = getDiff(req.old_data, req.new_data);
  const status = (req.change_status || "").toUpperCase();

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden rounded-2xl">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-br from-slate-50 to-white">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-lg font-bold text-slate-800">
                Request Details
              </DialogTitle>
              <p className="text-xs text-slate-400 font-mono">
                {req.empinfo_request_id}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-px bg-slate-100 border-b">
          <div className="bg-white px-5 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Status</p>
            <StatusBadge status={req.change_status} />
          </div>
          <div className="bg-white px-5 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Submitted</p>
            <p className="text-sm font-medium text-slate-700">{formatDateTime(req.created_at)}</p>
          </div>
        </div>

        {/* Description */}
        {req.change_description && (
          <div className="px-5 py-3 bg-blue-50 border-b border-blue-100">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-500 mb-1">Description</p>
            <p className="text-sm text-blue-800">{req.change_description}</p>
          </div>
        )}

        {/* Rejection reason */}
        {status === "REJECTED" && req.change_remarks && (
          <div className="px-5 py-3 bg-red-50 border-b border-red-100">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-red-500 mb-1">Rejection Reason</p>
            <p className="text-sm text-red-800">{req.change_remarks}</p>
          </div>
        )}

        {/* Diff */}
        <ScrollArea className="max-h-72">
          <div className="px-5 py-4">
            {diff.length === 0 ? (
              <div className="text-center py-8 text-slate-400 space-y-2">
                <AlertCircle className="w-7 h-7 mx-auto opacity-30" />
                <p className="text-sm">No field differences detected.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Changed Fields ({diff.length})
                </p>
                {diff.map(({ key, oldVal, newVal }) => (
                  <div
                    key={key}
                    className="grid grid-cols-[1fr_20px_1fr] items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                        {labelFor(key)}
                      </p>
                      <p className="text-xs text-slate-400 line-through truncate">
                        {String(oldVal) || <span className="italic">empty</span>}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-500 mb-0.5">
                        New
                      </p>
                      <p className="text-xs font-semibold text-emerald-700 truncate">
                        {String(newVal) || <span className="italic opacity-50">empty</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="px-5 py-3 border-t bg-slate-50">
          <Button variant="outline" onClick={onClose} className="rounded-lg text-sm">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EmployeeInfoChangeRequestPage() {
  const [requests] = useState<ChangeRequest[]>(MOCK_REQUESTS);
  const [viewingReq, setViewingReq] = useState<ChangeRequest | null>(null);

  const counts = {
    PENDING: requests.filter((r) => r.change_status.toUpperCase() === "PENDING").length,
    APPROVED: requests.filter((r) => r.change_status.toUpperCase() === "APPROVED").length,
    REJECTED: requests.filter((r) => r.change_status.toUpperCase() === "REJECTED").length,
  };

  return (
    <>
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-100">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Change Requests
              </h1>
            </div>
            <p className="text-sm text-slate-500 pl-9">
              View and track your personal information change requests.
            </p>
          </div>
          <Button
            onClick={() => (window.location.href = "/user-profile")}
            className="shrink-0 bg-blue-600 hover:bg-blue-700 rounded-xl h-9 text-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" /> New Request
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Pending", key: "PENDING", color: "bg-amber-50 border-amber-200", text: "text-amber-700", dot: "bg-amber-400" },
            { label: "Approved", key: "APPROVED", color: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-400" },
            { label: "Rejected", key: "REJECTED", color: "bg-red-50 border-red-200", text: "text-red-700", dot: "bg-red-400" },
          ].map(({ label, key, color, text, dot }) => (
            <div key={key} className={`rounded-xl border p-4 ${color}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <p className={`text-xs font-semibold uppercase tracking-wider ${text} opacity-80`}>{label}</p>
              </div>
              <p className={`text-2xl font-bold ${text}`}>{counts[key as keyof typeof counts]}</p>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b bg-slate-50 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">All Requests</p>
            <p className="text-xs text-slate-400">{requests.length} total</p>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500 w-[140px]">
                  Date Submitted
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Request Type
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500 w-[120px]">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500 text-right w-[80px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-16 text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-25" />
                    <p className="text-sm">No requests submitted yet.</p>
                    <Button
                      variant="link"
                      size="sm"
                      className="mt-1 text-blue-600 text-xs"
                      onClick={() => (window.location.href = "/user-profile")}
                    >
                      Create your first request →
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((req, i) => {
                  const diffCount = getDiff(req.old_data, req.new_data).length;
                  const isLast = i === requests.length - 1;

                  return (
                    <TableRow
                      key={req.empinfo_request_id}
                      className={`hover:bg-slate-50/80 transition-colors group ${isLast ? "" : ""}`}
                    >
                      {/* Date */}
                      <TableCell className="text-sm font-medium text-slate-700 py-3.5">
                        {formatDate(req.created_at)}
                      </TableCell>

                      {/* Request Type */}
                      <TableCell className="py-3.5">
                        <div>
                          <p className="text-sm font-medium text-slate-800 leading-snug">
                            {req.change_description || "General Update"}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {diffCount} field{diffCount !== 1 ? "s" : ""} changed
                          </p>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-3.5">
                        <StatusBadge status={req.change_status} />
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right py-3.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingReq(req)}
                          className="h-8 px-2.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span className="text-xs font-medium">View</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* View Dialog */}
      {viewingReq && (
        <ViewDialog req={viewingReq} onClose={() => setViewingReq(null)} />
      )}
    </>
  );
}