"use client"

import { useState, useEffect } from "react"
import {
  CalendarDays, Clock, CheckCircle2, Loader2, AlertCircle,
  FileText, Send, Plus, X, ChevronRight, Inbox,
  CalendarCheck, CalendarX, Timer, Hourglass
} from "lucide-react"
import { apiFetch, getEmployeeId, logout } from "@/lib/api/personal-info/auth"

/* ─── Types ─────────────────────────────────────────── */
interface LeaveType {
  leave_type_id: string
  leave_type_name: string
}

interface LeaveBalance {
  vl_balance: number
  sl_balance: number
}

interface LeaveRequest {
  leave_request_id: string
  leave_type_id: string
  filing_date: string
  inclusive_dates: string
  no_days: number
  commutation: string
  remarks: string
  leave_status: "Pending" | "Approved" | "Declined"
  leave_type?: { leave_type_name: string }
  decline_reason?: string | null
}

interface LeaveFormData {
  leave_type_id: string
  filing_date: string
  inclusive_dates: string
  no_days: number
  commutation: "Requested" | "Not Requested"
  remarks: string
  others_reason: string
}

/* ─── Constants ─────────────────────────────────────── */
const FALLBACK_LEAVE_TYPES = [
  "Vacation Leave", "Sick Leave", "Emergency Leave",
  "Maternity Leave", "Paternity Leave",
]

const STEP_LABELS = ["Leave Type", "Schedule", "Details", "Review"]

const STATUS_CONFIG = {
  Approved: {
    badge: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    dot: "bg-green-500",
    icon: CheckCircle2,
    iconClass: "text-green-500",
  },
  Pending: {
    badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-500",
    dot: "bg-yellow-400",
    icon: Hourglass,
    iconClass: "text-yellow-500",
  },
  Declined: {
    badge: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
    dot: "bg-red-500",
    icon: CalendarX,
    iconClass: "text-red-500",
  },
}

/* ─── Leave Form (modal) ─────────────────────────────── */
function LeaveForm({
  onClose,
  onSuccess,
  leaveTypes,
  balance,
}: {
  onClose: () => void
  onSuccess: () => void
  leaveTypes: LeaveType[]
  balance: LeaveBalance
}) {
  const employeeId = getEmployeeId()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<LeaveFormData>({
    leave_type_id: "",
    filing_date: new Date().toISOString().split("T")[0],
    inclusive_dates: "",
    no_days: 1,
    commutation: "Not Requested",
    remarks: "",
    others_reason: "",
  })

  const displayTypes: LeaveType[] = leaveTypes.length > 0
    ? leaveTypes
    : FALLBACK_LEAVE_TYPES.map((name, i) => ({ leave_type_id: String(i + 1), leave_type_name: name }))

  const selectedLeaveName = form.leave_type_id === "others" ? "Others" : (displayTypes.find(l => l.leave_type_id === form.leave_type_id)?.leave_type_name ?? "")

  const canProceed = () => {
    if (step === 0) return !!form.leave_type_id && (form.leave_type_id !== "others" || form.others_reason.trim().length > 0)
    if (step === 1) return !!form.inclusive_dates && form.no_days > 0
    return true
  }

  const handleSubmit = async () => {
    if (!employeeId) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await apiFetch("/protected/leave_request", {
        method: "POST",
        body: JSON.stringify({
          employee_id: employeeId,
          filing_date: form.filing_date,
          leave_type_id: form.leave_type_id,
          no_days: form.no_days,
          inclusive_dates: form.inclusive_dates,
          commutation: form.commutation,
          remarks: form.leave_type_id === "others" ? form.others_reason : form.remarks,
          leave_status: "Pending",
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
        setTimeout(() => { onSuccess(); onClose() }, 1800)
      } else {
        setError(data.message || "Submission failed")
      }
    } catch (err: any) {
      setError(err.message || "Submission failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
      <div className="bg-background w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl shadow-xl flex flex-col max-h-[92vh] overflow-hidden border border-border">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/40 rounded-xl">
              <FileText className="text-blue-500 w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Apply for Leave</h2>
              <p className="text-xs text-muted-foreground">Step {step + 1} of {STEP_LABELS.length} — {STEP_LABELS[step]}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition">
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-1.5 px-5 py-3 border-b border-border shrink-0">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex items-center gap-1.5 flex-1">
              <div className={`flex-1 h-1.5 rounded-full transition-all ${i <= step ? "bg-blue-500" : "bg-muted"}`} />
              {i === STEP_LABELS.length - 1 && null}
            </div>
          ))}
        </div>

        {/* Submitted state */}
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 gap-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-green-500 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Leave Filed!</h3>
            <p className="text-sm text-muted-foreground text-center">
              Your leave application is now <span className="font-bold text-yellow-500">Pending</span> approval.
            </p>
          </div>
        ) : (
          <>
            {/* Form Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5">

              {/* Step 0 — Leave Type */}
              {step === 0 && (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground">Choose the type of leave you want to apply for.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {displayTypes.map((lt) => (
                      <button
                        key={lt.leave_type_id}
                        onClick={() => setForm({ ...form, leave_type_id: lt.leave_type_id, others_reason: "" })}
                        className={`text-left px-4 py-3.5 rounded-xl border-2 transition-all
                          ${form.leave_type_id === lt.leave_type_id
                            ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30"
                            : "border-border hover:border-blue-200 hover:bg-muted/50"}`}
                      >
                        <p className={`text-sm font-semibold ${form.leave_type_id === lt.leave_type_id ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>
                          {lt.leave_type_name}
                        </p>
                        {form.leave_type_id === lt.leave_type_id && (
                          <p className="text-[11px] font-bold text-blue-400 mt-0.5">✓ Selected</p>
                        )}
                      </button>
                    ))}
                    {/* Others option */}
                    <button
                      onClick={() => setForm({ ...form, leave_type_id: "others", others_reason: "" })}
                      className={`text-left px-4 py-3.5 rounded-xl border-2 transition-all
                        ${form.leave_type_id === "others"
                          ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30"
                          : "border-border hover:border-blue-200 hover:bg-muted/50"}`}
                    >
                      <p className={`text-sm font-semibold ${form.leave_type_id === "others" ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>
                        Others
                      </p>
                      {form.leave_type_id === "others" && (
                        <p className="text-[11px] font-bold text-blue-400 mt-0.5">✓ Selected</p>
                      )}
                    </button>
                  </div>

                  {/* Others reason textarea — appears when Others is selected */}
                  {form.leave_type_id === "others" && (
                    <div className="flex flex-col gap-2 mt-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                        Reason for Leave <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        autoFocus
                        rows={4}
                        placeholder="Please describe your reason for taking leave..."
                        value={form.others_reason}
                        onChange={e => setForm({ ...form, others_reason: e.target.value })}
                        className="w-full border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground bg-muted/30 focus:outline-none focus:ring-2 focus:ring-blue-200 transition resize-none placeholder:text-muted-foreground/40"
                      />
                      {form.others_reason.trim().length === 0 && (
                        <p className="text-[11px] text-red-400 font-medium">A reason is required to continue.</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 1 — Schedule */}
              {step === 1 && (
                <div className="flex flex-col gap-5">
                  <p className="text-sm text-muted-foreground">Set your leave dates and number of days.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Filing Date</label>
                      <input
                        type="date"
                        value={form.filing_date}
                        onChange={e => setForm({ ...form, filing_date: e.target.value })}
                        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-medium text-foreground bg-muted/30 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Number of Days</label>
                      <div className="flex items-center border border-border rounded-xl bg-muted/30 overflow-hidden">
                        <button onClick={() => setForm({ ...form, no_days: Math.max(1, form.no_days - 1) })}
                          className="px-4 py-2.5 hover:bg-muted text-muted-foreground font-bold text-lg transition border-r border-border">−</button>
                        <span className="flex-1 text-center text-xl font-black text-blue-500">{form.no_days}</span>
                        <button onClick={() => setForm({ ...form, no_days: form.no_days + 1 })}
                          className="px-4 py-2.5 hover:bg-muted text-muted-foreground font-bold text-lg transition border-l border-border">+</button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Inclusive Dates</label>
                    <input
                      type="text"
                      placeholder="e.g. March 5-10, 2026"
                      value={form.inclusive_dates}
                      onChange={e => setForm({ ...form, inclusive_dates: e.target.value })}
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-medium text-foreground bg-muted/30 focus:outline-none focus:ring-2 focus:ring-blue-200 transition placeholder:text-muted-foreground/40"
                    />
                    <p className="text-[11px] text-muted-foreground">Enter the full range of dates covered by this leave.</p>
                  </div>
                </div>
              )}

              {/* Step 2 — Details */}
              {step === 2 && (
                <div className="flex flex-col gap-5">
                  <p className="text-sm text-muted-foreground">Provide additional information for your leave request.</p>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Commutation</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["Requested", "Not Requested"] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setForm({ ...form, commutation: opt })}
                          className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all
                            ${form.commutation === opt
                              ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              : "border-border text-muted-foreground bg-muted/30 hover:border-blue-200"}`}
                        >{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      Remarks <span className="text-muted-foreground/50 font-normal normal-case">(optional)</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Add a note or reason for your leave..."
                      value={form.remarks}
                      onChange={e => setForm({ ...form, remarks: e.target.value })}
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground bg-muted/30 focus:outline-none focus:ring-2 focus:ring-blue-200 transition resize-none placeholder:text-muted-foreground/40"
                    />
                  </div>
                </div>
              )}

              {/* Step 3 — Review */}
              {step === 3 && (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground">Confirm all details before submitting your leave request.</p>
                  <div className="rounded-2xl border border-border overflow-hidden">
                    {[
                      { label: "Leave Type",     value: selectedLeaveName || form.leave_type_id },
                      { label: "Filing Date",     value: form.filing_date },
                      { label: "Inclusive Dates", value: form.inclusive_dates },
                      { label: "No. of Days",     value: `${form.no_days} day${form.no_days > 1 ? "s" : ""}` },
                      { label: "Commutation",     value: form.commutation },
                      { label: "Remarks",         value: form.remarks || "—" },
                      ...(form.leave_type_id === "others" ? [{ label: "Others Reason", value: form.others_reason || "—" }] : []),
                    ].map(({ label, value }, i, arr) => (
                      <div key={label} className={`flex items-start justify-between gap-6 px-4 py-3 ${i % 2 === 0 ? "bg-muted/30" : "bg-background"} ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide shrink-0 pt-0.5">{label}</span>
                        <span className="text-sm font-semibold text-foreground text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                  {error && (
                    <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                      <AlertCircle size={16} className="text-red-500 shrink-0" />
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer Nav */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-border shrink-0">
              <button
                onClick={() => setStep(s => s - 1)}
                disabled={step === 0}
                className="px-5 py-2.5 rounded-xl border border-border bg-background text-sm font-bold text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition"
              >← Back</button>
              {step < STEP_LABELS.length - 1 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canProceed()}
                  className="min-w-[130px] px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition"
                >Continue →</button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="min-w-[150px] px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold disabled:opacity-60 transition flex items-center justify-center gap-2"
                >
                  {submitting ? <><Loader2 size={14} className="animate-spin" /> Submitting...</> : <><Send size={14} /> Submit Leave</>}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ─── Leave Card ─────────────────────────────────────── */
function LeaveCard({ leave }: { leave: LeaveRequest }) {
  const status = leave.leave_status ?? "Pending"
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.Pending
  const StatusIcon = cfg.icon

  const typeName = leave.leave_type?.leave_type_name ?? "Leave"

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })
    } catch { return d }
  }

  return (
    <div className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">

      {/* Left */}
      <div className="flex items-center gap-4 flex-[1.5] min-w-0">
        <div className={`p-3 rounded-xl shrink-0 ${status === "Approved" ? "bg-green-50 dark:bg-green-900/30" : status === "Declined" ? "bg-red-50 dark:bg-red-900/30" : "bg-yellow-50 dark:bg-yellow-900/30"}`}>
          <StatusIcon className={`w-5 h-5 md:w-6 md:h-6 ${cfg.iconClass}`} strokeWidth={1.5} />
        </div>
        <div className="min-w-0 space-y-0.5">
          <h3 className="text-sm md:text-base font-bold text-foreground leading-tight truncate">{typeName}</h3>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <CalendarDays size={12} />
            <span className="truncate">{leave.inclusive_dates || "—"}</span>
          </div>
        </div>
      </div>

      {/* Meta columns */}
      <div className="grid grid-cols-3 md:flex md:flex-[2] gap-4 md:gap-0 border-t md:border-t-0 border-border pt-4 md:pt-0">

        {/* Filed */}
        <div className="flex flex-col items-start gap-1 md:flex-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarCheck size={13} />
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">Filed</span>
          </div>
          <p className="text-xs md:text-sm font-bold text-foreground">{formatDate(leave.filing_date)}</p>
        </div>

        {/* Days */}
        <div className="flex flex-col items-start gap-1 md:flex-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock size={13} />
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">Days</span>
          </div>
          <p className="text-xs md:text-sm font-bold text-foreground">{leave.no_days} day{leave.no_days > 1 ? "s" : ""}</p>
        </div>

        {/* Status */}
        <div className="flex flex-col items-start gap-1 md:flex-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Timer size={13} />
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">Status</span>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {status}
          </span>
        </div>
      </div>

      {/* Decline reason */}
      {status === "Declined" && leave.decline_reason && (
        <div className="w-full md:w-auto md:max-w-xs mt-1 md:mt-0 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2.5 flex gap-2 items-start">
          <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-wide mb-0.5">Reason</p>
            <p className="text-xs text-red-600 dark:text-red-400">{leave.decline_reason}</p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Main Page ──────────────────────────────────────── */
export default function LeavePage() {
  const employeeId = getEmployeeId()

  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])
  const [balance, setBalance] = useState<LeaveBalance>({ vl_balance: 0, sl_balance: 0 })
  const [leaves, setLeaves] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<"All" | "Pending" | "Approved" | "Declined">("All")

  const fetchData = async () => {
    if (!employeeId) { logout(); return }
    try {
      const [ltRes, empRes, leavesRes] = await Promise.all([
        apiFetch("/protected/leave_types"),
        apiFetch(`/protected/view_employee/${employeeId}`),
        apiFetch(`/protected/leave_request/${employeeId}`),
      ])
      const ltData = await ltRes.json()
      const empData = await empRes.json()
      const leavesData = await leavesRes.json()

      if (ltData.success) setLeaveTypes(ltData.data ?? [])
      if (empData.success && empData.data) {
        setBalance({ vl_balance: empData.data.vl_balance ?? 0, sl_balance: empData.data.sl_balance ?? 0 })
      }
      if (leavesData.success) setLeaves(leavesData.data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [employeeId])

  const filtered = filter === "All" ? leaves : leaves.filter(l => l.leave_status === filter)

  const counts = {
    All: leaves.length,
    Pending: leaves.filter(l => l.leave_status === "Pending").length,
    Approved: leaves.filter(l => l.leave_status === "Approved").length,
    Declined: leaves.filter(l => l.leave_status === "Declined").length,
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Loader2 className="animate-spin text-blue-400" size={32} />
    </div>
  )

  return (
    <div className="p-4 md:p-8 bg-background min-h-screen text-foreground">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Leave Requests</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Track and manage your leave applications</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* VL Balance */}
            <div className="flex items-center gap-2.5 bg-card border border-blue-100 dark:border-blue-900/40 rounded-2xl px-4 py-2.5">
              <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide leading-none">VL Balance</p>
                <p className="text-base font-black text-blue-500 leading-tight">{balance.vl_balance} <span className="text-xs font-medium text-muted-foreground">days</span></p>
              </div>
            </div>
            {/* SL Balance */}
            <div className="flex items-center gap-2.5 bg-card border border-rose-100 dark:border-rose-900/40 rounded-2xl px-4 py-2.5">
              <div className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide leading-none">SL Balance</p>
                <p className="text-base font-black text-rose-500 leading-tight">{balance.sl_balance} <span className="text-xs font-medium text-muted-foreground">days</span></p>
              </div>
            </div>
            {/* Apply Button */}
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-2xl transition-colors shadow-sm"
            >
              <Plus size={16} />
              Apply Leave
            </button>
          </div>
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex gap-2 flex-wrap">
          {(["All", "Pending", "Approved", "Declined"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border
                ${filter === f
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"}`}
            >
              {f}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                ${filter === f ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"}`}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        {/* ── Leave Cards ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="p-5 bg-muted rounded-2xl">
              <Inbox size={32} className="text-muted-foreground" />
            </div>
            <p className="text-base font-semibold text-foreground">No {filter !== "All" ? filter.toLowerCase() : ""} leave requests</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              {filter === "All" ? "You haven't filed any leave requests yet." : `No ${filter.toLowerCase()} requests to show.`}
            </p>
            {filter === "All" && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 mt-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition"
              >
                <Plus size={15} /> Apply for Leave
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered
              .slice()
              .sort((a, b) => new Date(b.filing_date).getTime() - new Date(a.filing_date).getTime())
              .map(leave => <LeaveCard key={leave.leave_request_id} leave={leave} />)}
          </div>
        )}
      </div>

      {/* ── Leave Form Modal ── */}
      {showForm && (
        <LeaveForm
          leaveTypes={leaveTypes}
          balance={balance}
          onClose={() => setShowForm(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  )
}