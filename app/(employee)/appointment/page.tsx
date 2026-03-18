"use client"

import { useState, useEffect } from "react"
import {
  Briefcase, CalendarDays, DollarSign, FileText,
  CheckCircle2, Loader2, AlertCircle, Send, ChevronDown,
  ClipboardList, Plus, X, Inbox, CalendarCheck,
  Timer, Hourglass, CalendarX, Hash
} from "lucide-react"
import { apiFetch, getEmployeeId, logout } from "@/lib/api/personal-info/auth"

/* ─── Types ───────────────────────────────────────────── */
interface Designation { designation_id: string; designation_name: string }
interface EmpStatus   { emp_status_id: string;  emp_status_name: string  }
interface AppNature   { app_nature_id: string;  app_nature_name: string  }

interface AppointmentRecord {
  appointment_id:     string
  designation_id:     string
  emp_status_id:      string
  appointment_date:   string
  app_nature_id:      string
  salary_grade:       string
  salary_monthly:     string
  start_date:         string
  end_date:           string
  general_remarks:    string
  app_status:         "Pending" | "Approved" | "Declined"
  decline_reason?:    string | null
  designation?:       { designation_name: string }
  emp_status?:        { emp_status_name: string }
  app_nature?:        { app_nature_name: string }
}

interface AppointmentFormData {
  employee_id:        string
  designation_id:     string
  emp_status_id:      string
  appointment_date:   string
  app_nature_id:      string
  step:               string
  item_no:            string
  salary_grade:       string
  salary_annual:      string
  salary_monthly:     string
  adjustment_date:    string
  adjustment_remarks: string
  general_remarks:    string
  start_date:         string
  end_date:           string
}

/* ─── Fallbacks ───────────────────────────────────────── */
const FALLBACK_DESIGNATIONS: Designation[] = [
  { designation_id: "1", designation_name: "Administrative Assistant" },
  { designation_id: "2", designation_name: "Administrative Officer" },
  { designation_id: "3", designation_name: "Senior Administrative Officer" },
  { designation_id: "4", designation_name: "Department Head" },
  { designation_id: "5", designation_name: "Division Chief" },
]
const FALLBACK_EMP_STATUSES: EmpStatus[] = [
  { emp_status_id: "1", emp_status_name: "Permanent" },
  { emp_status_id: "2", emp_status_name: "Temporary" },
  { emp_status_id: "3", emp_status_name: "Casual" },
  { emp_status_id: "4", emp_status_name: "Contractual" },
  { emp_status_id: "5", emp_status_name: "Co-terminus" },
]
const FALLBACK_APP_NATURES: AppNature[] = [
  { app_nature_id: "1", app_nature_name: "Original Appointment" },
  { app_nature_id: "2", app_nature_name: "Promotion" },
  { app_nature_id: "3", app_nature_name: "Transfer" },
  { app_nature_id: "4", app_nature_name: "Reinstatement" },
  { app_nature_id: "5", app_nature_name: "Reemployment" },
  { app_nature_id: "6", app_nature_name: "Reclassification" },
]
const SALARY_GRADES = Array.from({ length: 33 }, (_, i) => `SG-${i + 1}`)
const STEPS = Array.from({ length: 8 }, (_, i) => String(i + 1))
const FORM_STEP_LABELS = ["Position", "Appointment", "Salary", "Schedule & Remarks"]

/* ─── Status config ───────────────────────────────────── */
const STATUS_CONFIG = {
  Approved: {
    badge: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    dot:   "bg-green-500",
    icon:  CheckCircle2,
    iconBg: "bg-green-50 dark:bg-green-900/30",
    iconClass: "text-green-500",
  },
  Pending: {
    badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-500",
    dot:   "bg-yellow-400",
    icon:  Hourglass,
    iconBg: "bg-yellow-50 dark:bg-yellow-900/30",
    iconClass: "text-yellow-500",
  },
  Declined: {
    badge: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
    dot:   "bg-red-500",
    icon:  CalendarX,
    iconBg: "bg-red-50 dark:bg-red-900/30",
    iconClass: "text-red-500",
  },
}

/* ─── Shared form sub-components ─────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{children}</label>
}

function SelectField({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]; placeholder: string
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full appearance-none border border-border rounded-xl px-4 py-2.5 text-sm font-medium bg-muted/30
          focus:outline-none focus:ring-2 focus:ring-blue-200 transition pr-10
          ${value ? "text-foreground" : "text-muted-foreground/60"}`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
    </div>
  )
}

function InputField({ type = "text", value, onChange, placeholder, prefix }: {
  type?: string; value: string; onChange: (v: string) => void; placeholder?: string; prefix?: string
}) {
  return (
    <div className="relative">
      {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">{prefix}</span>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border border-border rounded-xl py-2.5 text-sm font-medium text-foreground bg-muted/30
          focus:outline-none focus:ring-2 focus:ring-blue-200 transition placeholder:text-muted-foreground/40
          ${prefix ? "pl-8 pr-4" : "px-4"}`}
      />
    </div>
  )
}

function SectionHeader({ icon: Icon, title, subtitle, iconBg, iconColor }: {
  icon: React.ElementType; title: string; subtitle: string; iconBg: string; iconColor: string
}) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-border">
      <div className={`p-2.5 ${iconBg} rounded-xl shrink-0`}>
        <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={1.5} />
      </div>
      <div>
        <h2 className="text-base font-bold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
    </div>
  )
}

/* ─── Appointment Form Modal ──────────────────────────── */
function AppointmentFormModal({
  onClose, onSuccess, designations, empStatuses, appNatures,
}: {
  onClose: () => void; onSuccess: () => void
  designations: Designation[]; empStatuses: EmpStatus[]; appNatures: AppNature[]
}) {
  const employeeId = getEmployeeId()
  const [formStep, setFormStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<AppointmentFormData>({
    employee_id: employeeId ?? "",
    designation_id: "", emp_status_id: "",
    appointment_date: new Date().toISOString().split("T")[0],
    app_nature_id: "", step: "", item_no: "",
    salary_grade: "", salary_annual: "", salary_monthly: "",
    adjustment_date: "", adjustment_remarks: "",
    general_remarks: "", start_date: "", end_date: "",
  })

  const set = (key: keyof AppointmentFormData) => (val: string) =>
    setForm(f => ({ ...f, [key]: val }))

  const displayDesignations = designations.length > 0 ? designations : FALLBACK_DESIGNATIONS
  const displayStatuses     = empStatuses.length  > 0 ? empStatuses  : FALLBACK_EMP_STATUSES
  const displayNatures      = appNatures.length   > 0 ? appNatures   : FALLBACK_APP_NATURES

  const canProceed = () => {
    if (formStep === 0) return !!form.designation_id && !!form.emp_status_id
    if (formStep === 1) return !!form.appointment_date && !!form.app_nature_id
    if (formStep === 2) return !!form.salary_grade && !!form.salary_monthly
    return true
  }

  const getLabel = (arr: { id: string; name: string }[], id: string) =>
    arr.find(a => a.id === id)?.name ?? id

  const reviewItems = [
    { label: "Designation",       value: getLabel(displayDesignations.map(d => ({ id: d.designation_id, name: d.designation_name })), form.designation_id) },
    { label: "Employment Status", value: getLabel(displayStatuses.map(s     => ({ id: s.emp_status_id,  name: s.emp_status_name  })), form.emp_status_id)  },
    { label: "Appointment Date",  value: form.appointment_date },
    { label: "Nature",            value: getLabel(displayNatures.map(n      => ({ id: n.app_nature_id,  name: n.app_nature_name  })), form.app_nature_id)  },
    { label: "Item No.",          value: form.item_no          || "—" },
    { label: "Step",              value: form.step             || "—" },
    { label: "Salary Grade",      value: form.salary_grade     || "—" },
    { label: "Monthly Salary",    value: form.salary_monthly ? `₱${parseFloat(form.salary_monthly).toLocaleString()}` : "—" },
    { label: "Annual Salary",     value: form.salary_annual  ? `₱${parseFloat(form.salary_annual).toLocaleString()}`  : "—" },
    { label: "Start Date",        value: form.start_date       || "—" },
    { label: "End Date",          value: form.end_date         || "—" },
    { label: "General Remarks",   value: form.general_remarks  || "—" },
  ]

  const handleSubmit = async () => {
    if (!employeeId) return
    setSubmitting(true); setError(null)
    try {
      const res  = await apiFetch("/protected/appointments", {
        method: "POST",
        body: JSON.stringify({ ...form, employee_id: employeeId }),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
        setTimeout(() => { onSuccess(); onClose() }, 1800)
      } else setError(data.message || "Submission failed")
    } catch (err: any) {
      setError(err.message || "Submission failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
      <div className="bg-background w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl shadow-xl flex flex-col max-h-[92vh] overflow-hidden border border-border">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/40 rounded-xl">
              <ClipboardList className="text-blue-500 w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Request Appointment</h2>
              <p className="text-xs text-muted-foreground">Step {formStep + 1} of {FORM_STEP_LABELS.length} — {FORM_STEP_LABELS[formStep]}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition">
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-1.5 px-5 py-3 border-b border-border shrink-0">
          {FORM_STEP_LABELS.map((_, i) => (
            <div key={i} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all ${i <= formStep ? "bg-blue-500" : "bg-muted"}`} />
            </div>
          ))}
        </div>

        {/* Success */}
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 gap-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-green-500 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Appointment Submitted!</h3>
            <p className="text-sm text-muted-foreground text-center">
              Your appointment request is now <span className="font-bold text-yellow-500">Pending</span> approval.
            </p>
          </div>
        ) : (
          <>
            {/* Form Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5">

              {/* Step 0 — Position */}
              {formStep === 0 && (
                <div className="flex flex-col gap-5">
                  <SectionHeader icon={Briefcase} title="Position Information"
                    subtitle="Select the designation and employment status."
                    iconBg="bg-blue-50 dark:bg-blue-900/30" iconColor="text-blue-500" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 flex flex-col gap-2">
                      <Label>Designation</Label>
                      <SelectField value={form.designation_id} onChange={set("designation_id")}
                        options={displayDesignations.map(d => ({ value: d.designation_id, label: d.designation_name }))}
                        placeholder="Select designation..." />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Employment Status</Label>
                      <SelectField value={form.emp_status_id} onChange={set("emp_status_id")}
                        options={displayStatuses.map(s => ({ value: s.emp_status_id, label: s.emp_status_name }))}
                        placeholder="Select status..." />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Item No. <span className="text-muted-foreground/40 font-normal normal-case">(optional)</span></Label>
                      <InputField value={form.item_no} onChange={set("item_no")} placeholder="e.g. 12345" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1 — Appointment Details */}
              {formStep === 1 && (
                <div className="flex flex-col gap-5">
                  <SectionHeader icon={CalendarDays} title="Appointment Details"
                    subtitle="Set the appointment date and nature."
                    iconBg="bg-green-50 dark:bg-green-900/30" iconColor="text-green-500" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>Appointment Date</Label>
                      <InputField type="date" value={form.appointment_date} onChange={set("appointment_date")} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Nature of Appointment</Label>
                      <SelectField value={form.app_nature_id} onChange={set("app_nature_id")}
                        options={displayNatures.map(n => ({ value: n.app_nature_id, label: n.app_nature_name }))}
                        placeholder="Select nature..." />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Step</Label>
                      <SelectField value={form.step} onChange={set("step")}
                        options={STEPS.map(s => ({ value: s, label: `Step ${s}` }))}
                        placeholder="Select step..." />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Adjustment Date <span className="text-muted-foreground/40 font-normal normal-case">(optional)</span></Label>
                      <InputField type="date" value={form.adjustment_date} onChange={set("adjustment_date")} />
                    </div>
                    <div className="sm:col-span-2 flex flex-col gap-2">
                      <Label>Adjustment Remarks <span className="text-muted-foreground/40 font-normal normal-case">(optional)</span></Label>
                      <InputField value={form.adjustment_remarks} onChange={set("adjustment_remarks")} placeholder="e.g. Salary adjustment due to..." />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 — Salary */}
              {formStep === 2 && (
                <div className="flex flex-col gap-5">
                  <SectionHeader icon={DollarSign} title="Salary Information"
                    subtitle="Enter the salary grade and corresponding amounts."
                    iconBg="bg-emerald-50 dark:bg-emerald-900/30" iconColor="text-emerald-500" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>Salary Grade</Label>
                      <SelectField value={form.salary_grade} onChange={set("salary_grade")}
                        options={SALARY_GRADES.map(sg => ({ value: sg, label: sg }))}
                        placeholder="Select salary grade..." />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Monthly Salary</Label>
                      <InputField type="number" value={form.salary_monthly} prefix="₱"
                        onChange={v => {
                          const monthly = parseFloat(v) || 0
                          setForm(f => ({ ...f, salary_monthly: v, salary_annual: monthly > 0 ? String((monthly * 12).toFixed(2)) : "" }))
                        }} placeholder="0.00" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Annual Salary <span className="text-muted-foreground/40 font-normal normal-case">(auto-computed)</span></Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">₱</span>
                        <input type="number" value={form.salary_annual}
                          onChange={e => set("salary_annual")(e.target.value)} placeholder="0.00"
                          className="w-full border border-border rounded-xl pl-8 pr-4 py-2.5 text-sm font-medium text-foreground bg-blue-50 dark:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-blue-200 transition placeholder:text-muted-foreground/40" />
                      </div>
                      <p className="text-[11px] text-muted-foreground">Auto-calculated from monthly × 12. You may override.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 — Schedule & Remarks + Review */}
              {formStep === 3 && (
                <div className="flex flex-col gap-5">
                  <SectionHeader icon={FileText} title="Schedule & Remarks"
                    subtitle="Set the effective period and add any general remarks."
                    iconBg="bg-orange-50 dark:bg-orange-900/30" iconColor="text-orange-400" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>Start Date</Label>
                      <InputField type="date" value={form.start_date} onChange={set("start_date")} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>End Date <span className="text-muted-foreground/40 font-normal normal-case">(optional)</span></Label>
                      <InputField type="date" value={form.end_date} onChange={set("end_date")} />
                    </div>
                    <div className="sm:col-span-2 flex flex-col gap-2">
                      <Label>General Remarks <span className="text-muted-foreground/40 font-normal normal-case">(optional)</span></Label>
                      <textarea rows={3} value={form.general_remarks}
                        onChange={e => set("general_remarks")(e.target.value)}
                        placeholder="Add any general notes about this appointment..."
                        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-medium text-foreground bg-muted/30 focus:outline-none focus:ring-2 focus:ring-blue-200 transition resize-none placeholder:text-muted-foreground/40" />
                    </div>
                  </div>

                  {/* Review Summary */}
                  <div className="flex flex-col gap-2 pt-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Review Summary</p>
                    <div className="rounded-2xl border border-border overflow-hidden">
                      {reviewItems.map(({ label, value }, i) => (
                        <div key={label} className={`flex items-start justify-between gap-6 px-4 py-3 ${i % 2 === 0 ? "bg-muted/30" : "bg-background"} ${i < reviewItems.length - 1 ? "border-b border-border" : ""}`}>
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide shrink-0 pt-0.5 whitespace-nowrap">{label}</span>
                          <span className="text-sm font-semibold text-foreground text-right">{value}</span>
                        </div>
                      ))}
                    </div>
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

            {/* Footer Nav */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-border shrink-0">
              <button onClick={() => setFormStep(s => s - 1)} disabled={formStep === 0}
                className="px-5 py-2.5 rounded-xl border border-border bg-background text-sm font-bold text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition">
                ← Back
              </button>
              {formStep < FORM_STEP_LABELS.length - 1 ? (
                <button onClick={() => setFormStep(s => s + 1)} disabled={!canProceed()}
                  className="min-w-[130px] px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition">
                  Continue →
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={submitting}
                  className="min-w-[170px] px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold disabled:opacity-60 transition flex items-center justify-center gap-2">
                  {submitting ? <><Loader2 size={14} className="animate-spin" /> Submitting...</> : <><Send size={14} /> Submit Appointment</>}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ─── Appointment Card ────────────────────────────────── */
function AppointmentCard({ record }: { record: AppointmentRecord }) {
  const status = record.app_status ?? "Pending"
  const cfg    = STATUS_CONFIG[status] ?? STATUS_CONFIG.Pending
  const StatusIcon = cfg.icon

  const designationName = record.designation?.designation_name ?? "Appointment"
  const natureName      = record.app_nature?.app_nature_name   ?? "—"
  const statusName      = record.emp_status?.emp_status_name   ?? "—"

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" }) }
    catch { return d }
  }

  return (
    <div className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">

      {/* Left */}
      <div className="flex items-center gap-4 flex-[1.5] min-w-0">
        <div className={`p-3 rounded-xl shrink-0 ${cfg.iconBg}`}>
          <StatusIcon className={`w-5 h-5 md:w-6 md:h-6 ${cfg.iconClass}`} strokeWidth={1.5} />
        </div>
        <div className="min-w-0 space-y-0.5">
          <h3 className="text-sm md:text-base font-bold text-foreground leading-tight truncate">{designationName}</h3>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <Briefcase size={12} />
            <span className="truncate">{natureName} · {statusName}</span>
          </div>
        </div>
      </div>

      {/* Meta columns */}
      <div className="grid grid-cols-3 md:flex md:flex-[2] gap-4 md:gap-0 border-t md:border-t-0 border-border pt-4 md:pt-0">

        {/* Date Filed */}
        <div className="flex flex-col items-start gap-1 md:flex-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarCheck size={13} />
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">Date Filed</span>
          </div>
          <p className="text-xs md:text-sm font-bold text-foreground">{formatDate(record.appointment_date)}</p>
        </div>

        {/* Salary Grade */}
        <div className="flex flex-col items-start gap-1 md:flex-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Hash size={13} />
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide">Salary Grade</span>
          </div>
          <p className="text-xs md:text-sm font-bold text-foreground">{record.salary_grade || "—"}</p>
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
      {status === "Declined" && record.decline_reason && (
        <div className="w-full md:w-auto md:max-w-xs bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2.5 flex gap-2 items-start">
          <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-wide mb-0.5">Reason</p>
            <p className="text-xs text-red-600 dark:text-red-400">{record.decline_reason}</p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Main Page ───────────────────────────────────────── */
export default function AppointmentPage() {
  const employeeId = getEmployeeId()

  const [designations, setDesignations] = useState<Designation[]>([])
  const [empStatuses,  setEmpStatuses]  = useState<EmpStatus[]>([])
  const [appNatures,   setAppNatures]   = useState<AppNature[]>([])
  const [records,      setRecords]      = useState<AppointmentRecord[]>([])
  const [loading,      setLoading]      = useState(true)
  const [showForm,     setShowForm]     = useState(false)
  const [filter,       setFilter]       = useState<"All" | "Pending" | "Approved" | "Declined">("All")

  const fetchData = async () => {
    if (!employeeId) { logout(); return }
    try {
      const [dRes, sRes, nRes, aRes] = await Promise.all([
        apiFetch("/protected/designations"),
        apiFetch("/protected/emp_statuses"),
        apiFetch("/protected/app_natures"),
        apiFetch(`/protected/appointments/${employeeId}`),
      ])
      const [dData, sData, nData, aData] = await Promise.all([
        dRes.json(), sRes.json(), nRes.json(), aRes.json(),
      ])
      if (dData.success) setDesignations(dData.data ?? [])
      if (sData.success) setEmpStatuses(sData.data  ?? [])
      if (nData.success) setAppNatures(nData.data    ?? [])
      if (aData.success) setRecords(aData.data       ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [employeeId])

  const filtered = filter === "All" ? records : records.filter(r => r.app_status === filter)

  const counts = {
    All:      records.length,
    Pending:  records.filter(r => r.app_status === "Pending").length,
    Approved: records.filter(r => r.app_status === "Approved").length,
    Declined: records.filter(r => r.app_status === "Declined").length,
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Loader2 className="animate-spin text-blue-400" size={32} />
    </div>
  )

  return (
    <div className="p-4 md:p-8 bg-background min-h-screen text-foreground">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Appointment Requests</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Track and manage your appointment applications</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-2xl transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus size={16} />
            Request Appointment
          </button>
        </div>

        {/* Filter Tabs */}
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

        {/* Records List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="p-5 bg-muted rounded-2xl">
              <Inbox size={32} className="text-muted-foreground" />
            </div>
            <p className="text-base font-semibold text-foreground">
              No {filter !== "All" ? filter.toLowerCase() : ""} appointment requests
            </p>
            <p className="text-sm text-muted-foreground max-w-xs">
              {filter === "All"
                ? "You haven't filed any appointment requests yet."
                : `No ${filter.toLowerCase()} requests to show.`}
            </p>
            {filter === "All" && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 mt-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition"
              >
                <Plus size={15} /> Request Appointment
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered
              .slice()
              .sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())
              .map(record => <AppointmentCard key={record.appointment_id} record={record} />)}
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <AppointmentFormModal
          designations={designations}
          empStatuses={empStatuses}
          appNatures={appNatures}
          onClose={() => setShowForm(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  )
}