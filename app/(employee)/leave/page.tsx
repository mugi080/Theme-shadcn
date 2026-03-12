"use client"

import { useState, useEffect } from "react"
import { CalendarDays, Clock, CheckCircle2, Loader2, AlertCircle, FileText, Send } from "lucide-react"
import { apiFetch, getEmployeeId, logout } from "@/lib/api/personal-info/auth"

interface LeaveType {
  leave_type_id: string
  leave_type_name: string
}

interface LeaveBalance {
  vl_balance: number
  sl_balance: number
}

interface LeaveFormData {
  leave_type_id: string
  filing_date: string
  inclusive_dates: string
  no_days: number
  commutation: "Requested" | "Not Requested"
  remarks: string
}

const FALLBACK_LEAVE_TYPES = [
  "Vacation Leave",
  "Sick Leave",
  "Emergency Leave",
  "Maternity Leave",
  "Paternity Leave",
]

const STEP_LABELS = ["Leave Type", "Schedule", "Details", "Review"]

export default function LeaveApplicationForm() {
  const employeeId = getEmployeeId()


  const [step, setStep] = useState(0)
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])
  const [balance, setBalance] = useState<LeaveBalance>({ vl_balance: 0, sl_balance: 0 })
  const [loading, setLoading] = useState(true)
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
  })

  useEffect(() => {
    if (!employeeId) {
      logout()
      return
}
    const init = async () => {
      try {
        const ltRes = await apiFetch("/protected/leave_types")
        const ltData = await ltRes.json()
        if (ltData.success) setLeaveTypes(ltData.data ?? [])

        const empRes = await apiFetch(`/protected/view_employee/${employeeId}`)
        const empData = await empRes.json()
        if (empData.success && empData.data) {
          setBalance({
            vl_balance: empData.data.vl_balance ?? 0,
            sl_balance: empData.data.sl_balance ?? 0,
          })
        }
      } catch (err: any) {
        setError(err.message || "Failed to load form data")
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [employeeId])

  const displayTypes: LeaveType[] = leaveTypes.length > 0
    ? leaveTypes
    : FALLBACK_LEAVE_TYPES.map((name, i) => ({ leave_type_id: String(i + 1), leave_type_name: name }))

  const selectedLeaveName = displayTypes.find(l => l.leave_type_id === form.leave_type_id)?.leave_type_name ?? ""

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
          remarks: form.remarks,
          leave_status: "Pending",
        }),
      })
      const data = await res.json()
      if (data.success) setSubmitted(true)
      else setError(data.message || "Submission failed")
    } catch (err: any) {
      setError(err.message || "Submission failed")
    } finally {
      setSubmitting(false)
    }
  }

  const canProceed = () => {
    if (step === 0) return !!form.leave_type_id
    if (step === 1) return !!form.inclusive_dates && form.no_days > 0
    return true
  }

  const resetForm = () => {
    setSubmitted(false); setStep(0)
    setForm({ leave_type_id: "", filing_date: new Date().toISOString().split("T")[0], inclusive_dates: "", no_days: 1, commutation: "Not Requested", remarks: "" })
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Loader2 className="animate-spin text-blue-400" size={32} />
    </div>
  )

  if (submitted) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="text-green-500 w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Leave Filed!</h2>
        <p className="text-gray-400 text-sm mb-8">
          Your leave application is now <span className="font-bold text-yellow-500">Pending</span> approval.
        </p>
        <button onClick={resetForm} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 rounded-2xl transition-colors text-sm">
          File Another Leave
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Leave Application</h1>
            <p className="text-gray-400 text-sm mt-0.5">File your leave request below</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 bg-white border border-blue-100 rounded-2xl px-4 py-2.5 shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide leading-none">VL Balance</p>
                <p className="text-base font-black text-blue-500 leading-tight">{balance.vl_balance} <span className="text-xs font-medium text-gray-400">days</span></p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-white border border-rose-100 rounded-2xl px-4 py-2.5 shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide leading-none">SL Balance</p>
                <p className="text-base font-black text-rose-500 leading-tight">{balance.sl_balance} <span className="text-xs font-medium text-gray-400">days</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">

          {/* ── Sidebar ── */}
          <div className="w-full lg:w-60 shrink-0">
            {/* Mobile: horizontal stepper */}
            <div className="flex lg:hidden items-center bg-white border border-gray-100 rounded-2xl shadow-sm p-4 gap-1 overflow-x-auto">
              {STEP_LABELS.map((label, i) => (
                <div key={i} className="flex items-center gap-1 shrink-0">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all
                      ${i < step ? "bg-blue-500 text-white" : i === step ? "bg-blue-500 text-white ring-4 ring-blue-100" : "bg-gray-100 text-gray-400"}`}>
                      {i < step ? <CheckCircle2 size={13} /> : i + 1}
                    </div>
                    <span className={`text-[10px] font-bold whitespace-nowrap ${i === step ? "text-blue-500" : "text-gray-400"}`}>{label}</span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div className={`w-8 h-0.5 rounded-full mb-4 mx-0.5 ${i < step ? "bg-blue-400" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Desktop: vertical sidebar */}
            <div className="hidden lg:flex flex-col bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Progress</p>
              </div>
              <div className="flex flex-col p-3 gap-1">
                {STEP_LABELS.map((label, i) => (
                  <button
                    key={i}
                    onClick={() => i < step && setStep(i)}
                    disabled={i > step}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all
                      ${i === step ? "bg-blue-50" : i < step ? "hover:bg-gray-50 cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all
                      ${i <= step ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                      {i < step ? <CheckCircle2 size={13} /> : i + 1}
                    </div>
                    <span className={`text-sm font-semibold ${i === step ? "text-blue-600" : i < step ? "text-gray-600" : "text-gray-400"}`}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Live summary preview */}
              {(selectedLeaveName || form.inclusive_dates) && (
                <div className="mx-3 mb-3 flex flex-col gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Summary</p>
                  {selectedLeaveName && (
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold">Type</p>
                      <p className="text-xs font-bold text-gray-700">{selectedLeaveName}</p>
                    </div>
                  )}
                  {form.inclusive_dates && (
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold">Dates</p>
                      <p className="text-xs font-bold text-gray-700">{form.inclusive_dates}</p>
                    </div>
                  )}
                  {step > 1 && (
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold">Days</p>
                      <p className="text-xs font-bold text-gray-700">{form.no_days} day{form.no_days > 1 ? "s" : ""}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Form Panel ── */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 md:p-7">

              {/* Step 0 — Leave Type */}
              {step === 0 && (
                <div className="flex flex-col gap-5">
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="p-2.5 bg-blue-50 rounded-xl shrink-0">
                      <FileText className="text-blue-500 w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">Select Leave Type</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Choose the type of leave you want to apply for.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {displayTypes.map((lt) => (
                      <button
                        key={lt.leave_type_id}
                        onClick={() => setForm({ ...form, leave_type_id: lt.leave_type_id })}
                        className={`text-left px-4 py-4 rounded-xl border-2 transition-all
                          ${form.leave_type_id === lt.leave_type_id
                            ? "border-blue-400 bg-blue-50"
                            : "border-gray-100 hover:border-blue-200 hover:bg-gray-50"}`}
                      >
                        <p className={`text-sm font-bold ${form.leave_type_id === lt.leave_type_id ? "text-blue-700" : "text-gray-700"}`}>
                          {lt.leave_type_name}
                        </p>
                        {form.leave_type_id === lt.leave_type_id && (
                          <p className="text-[11px] font-bold text-blue-400 mt-1">✓ Selected</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1 — Schedule */}
              {step === 1 && (
                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="p-2.5 bg-green-50 rounded-xl shrink-0">
                      <CalendarDays className="text-green-500 w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">Leave Schedule</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Set your leave dates and number of days.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Filing Date</label>
                      <input
                        type="date"
                        value={form.filing_date}
                        onChange={e => setForm({ ...form, filing_date: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Number of Days</label>
                      <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                        <button
                          onClick={() => setForm({ ...form, no_days: Math.max(1, form.no_days - 1) })}
                          className="px-4 py-3 hover:bg-gray-200 text-gray-600 font-bold text-lg transition border-r border-gray-200"
                        >−</button>
                        <span className="flex-1 text-center text-xl font-black text-blue-500">{form.no_days}</span>
                        <button
                          onClick={() => setForm({ ...form, no_days: form.no_days + 1 })}
                          className="px-4 py-3 hover:bg-gray-200 text-gray-600 font-bold text-lg transition border-l border-gray-200"
                        >+</button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Inclusive Dates</label>
                    <input
                      type="text"
                      placeholder="e.g. March 5-10, 2026"
                      value={form.inclusive_dates}
                      onChange={e => setForm({ ...form, inclusive_dates: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition placeholder:text-gray-300"
                    />
                    <p className="text-[11px] text-gray-400">Enter the full range of dates covered by this leave.</p>
                  </div>
                </div>
              )}

              {/* Step 2 — Details */}
              {step === 2 && (
                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="p-2.5 bg-orange-50 rounded-xl shrink-0">
                      <Clock className="text-orange-400 w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">Additional Details</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Provide additional information for your leave request.</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Commutation</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["Requested", "Not Requested"] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setForm({ ...form, commutation: opt })}
                          className={`py-3.5 px-4 rounded-xl border-2 text-sm font-semibold transition-all
                            ${form.commutation === opt
                              ? "border-blue-400 bg-blue-50 text-blue-700"
                              : "border-gray-100 text-gray-500 bg-gray-50 hover:border-gray-200"}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Remarks <span className="text-gray-300 font-normal normal-case">(optional)</span>
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Add a note or reason for your leave..."
                      value={form.remarks}
                      onChange={e => setForm({ ...form, remarks: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition resize-none placeholder:text-gray-300"
                    />
                  </div>
                </div>
              )}

              {/* Step 3 — Review */}
              {step === 3 && (
                <div className="flex flex-col gap-5">
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="p-2.5 bg-purple-50 rounded-xl shrink-0">
                      <Send className="text-purple-400 w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">Review & Submit</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Confirm all details before submitting your leave request.</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-100 overflow-hidden">
                    {[
                      { label: "Leave Type",     value: selectedLeaveName || form.leave_type_id },
                      { label: "Filing Date",     value: form.filing_date },
                      { label: "Inclusive Dates", value: form.inclusive_dates },
                      { label: "No. of Days",     value: `${form.no_days} day${form.no_days > 1 ? "s" : ""}` },
                      { label: "Commutation",     value: form.commutation },
                      { label: "Remarks",         value: form.remarks || "—" },
                    ].map(({ label, value }, i, arr) => (
                      <div key={label} className={`flex items-start justify-between gap-6 px-5 py-4 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"} ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide shrink-0 pt-0.5">{label}</span>
                        <span className="text-sm font-semibold text-gray-800 text-right">{value}</span>
                      </div>
                    ))}
                  </div>

                  {error && (
                    <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      <AlertCircle size={16} className="text-red-500 shrink-0" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setStep(s => s - 1)}
                disabled={step === 0}
                className="px-6 py-3 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm"
              >
                ← Back
              </button>
              {step < STEP_LABELS.length - 1 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canProceed()}
                  className="min-w-[140px] px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="min-w-[160px] px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold disabled:opacity-60 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  {submitting ? <><Loader2 size={15} className="animate-spin" /> Submitting...</> : <><Send size={15} /> Submit Leave</>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}