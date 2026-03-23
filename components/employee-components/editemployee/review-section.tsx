"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Props {
  open: boolean
  oldData: any
  newData: any
  onCancel: () => void
  onConfirm: () => void
}

// ── Human-readable labels ─────────────────────────────────────────
const FIELD_LABELS: Record<string, string> = {
  firstname: "First Name",
  middlename: "Middle Name",
  surname: "Last Name",
  suffix: "Suffix",
  birthdate: "Birth Date",
  birthplace: "Birth Place",
  sex: "Sex",
  civil_status: "Civil Status",
  blood_type: "Blood Type",
  height: "Height",
  weight: "Weight",
  mobile_no: "Mobile Number",
  email_address: "Email Address",
  telephone_no: "Telephone Number",
  citizenship: "Citizenship",
  citizenship_category: "Citizenship Category",
  citizenship_country: "Citizenship Country",
  ra_house_block_lotno: "Residential House/Block/Lot No.",
  ra_street: "Residential Street",
  ra_subdivision_village: "Residential Subdivision/Village",
  ra_barangay: "Residential Barangay",
  ra_city_municipality: "Residential City/Municipality",
  ra_province: "Residential Province",
  ra_zipcode: "Residential Zip Code",
  pa_house_block_lotno: "Permanent House/Block/Lot No.",
  pa_street: "Permanent Street",
  pa_subdivision_village: "Permanent Subdivision/Village",
  pa_barangay: "Permanent Barangay",
  pa_city_municipality: "Permanent City/Municipality",
  pa_province: "Permanent Province",
  pa_zipcode: "Permanent Zip Code",
  // Family
  spouse_firstname: "Spouse First Name",
  spouse_middlename: "Spouse Middle Name",
  spouse_surname: "Spouse Last Name",
  spouse_name_ext: "Spouse Name Ext.",
  spouse_occupation: "Spouse Occupation",
  spouse_employer_business_name: "Spouse Employer/Business",
  spouse_business_address: "Spouse Business Address",
  spouse_telephone_no: "Spouse Telephone No.",
  father_firstname: "Father First Name",
  father_middlename: "Father Middle Name",
  father_surname: "Father Last Name",
  father_name_ext: "Father Name Ext.",
  mother_firstname: "Mother First Name",
  mother_middlename: "Mother Middle Name",
  mother_surname: "Mother Last Name",
  // Children
  child_name: "Child Name",
  child_birthdate: "Child Birth Date",
  status: "Status",
  // Education
  level: "Education Level",
  level_name: "Education Level",
  school_name: "School Name",
  degree_course: "Degree/Course",
  from_year: "From Year",
  to_year: "To Year",
  highest_level: "Highest Level Earned",
  year_graduated: "Year Graduated",
  honors_received: "Honors Received",
  // Work Experience
  position_title: "Position Title",
  company_name: "Company Name",
  from_date: "From Date",
  to_date: "To Date",
  monthly_salary: "Monthly Salary",
  salary_grade: "Salary Grade",
  status_of_appointment: "Status of Appointment",
  govt_service: "Government Service",
  // Eligibility
  career_service: "Career Service",
  rating: "Rating",
  examination_date: "Examination Date",
  examination_place: "Examination Place",
  license_no: "License No.",
  license_validity: "License Validity",
  // Voluntary Work
  organization_name: "Organization Name",
  hours: "Number of Hours",
  position: "Position",
  // L&D
  title: "Training Title",
  ld_type: "Type of L&D",
  conducted_by: "Conducted By",
}

// ── Keys to never show in diff ────────────────────────────────────
const SKIP_KEYS = new Set([
  "id", "employee_id", "children_id", "education_id", "work_id",
  "eligibility_id", "voluntary_id", "ld_id", "family_id",
  "level_id", "created_at", "updated_at", "deleted_at", "emp_children",
])

const toLabel = (key: string) =>
  FIELD_LABELS[key] ??
  key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

// ── Smart value formatter — extracts readable text from objects ───
const formatValue = (value: any): string => {
  if (value === null || value === undefined || value === "") return "—"
  if (typeof value === "boolean") return value ? "Yes" : "No"

  // ✅ If it's an object, try common "name" keys before falling back to JSON
  if (typeof value === "object" && !Array.isArray(value)) {
    if (value.level_name)    return value.level_name
    if (value.name)          return value.name
    if (value.title)         return value.title
    if (value.description)   return value.description
    // Fallback: show all non-meta string values joined
    const readable = Object.entries(value)
      .filter(([k, v]) =>
        !SKIP_KEYS.has(k) && v !== null && v !== undefined && typeof v !== "object"
      )
      .map(([, v]) => String(v))
      .join(", ")
    return readable || "—"
  }

  if (Array.isArray(value)) return `${value.length} item(s)`
  return String(value)
}

// ── Auto-detect all meaningful fields from two arrays ─────────────
const autoFields = (oldArr: any[], newArr: any[]) =>
  Array.from(
    new Set([
      ...((oldArr ?? []).flatMap((r: any) => Object.keys(r ?? {}))),
      ...((newArr ?? []).flatMap((r: any) => Object.keys(r ?? {}))),
    ])
  ).filter((k) => !SKIP_KEYS.has(k))

// ── Previous → New diff row ───────────────────────────────────────
function DiffRow({ oldVal, newVal }: { oldVal: any; newVal: any }) {
  const oldText = formatValue(oldVal)
  const newText = formatValue(newVal)

  return (
    <div className="flex items-start gap-2 mt-1">
      {/* Previous */}
      <div className="flex-1 min-w-0 rounded-md bg-destructive/5 border border-destructive/10 px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-destructive mb-0.5">
          Previous
        </p>
        <p className="text-sm text-muted-foreground break-words leading-snug">
          {oldText}
        </p>
      </div>

      {/* Arrow */}
      <div className="shrink-0 mt-5 text-muted-foreground/40 text-sm select-none">→</div>

      {/* New */}
      <div className="flex-1 min-w-0 rounded-md bg-primary/5 border border-primary/10 px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-0.5">
          New
        </p>
        <p className="text-sm font-semibold text-foreground break-words leading-snug">
          {newText}
        </p>
      </div>
    </div>
  )
}

// ── Section card wrapper ──────────────────────────────────────────
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 bg-muted/40 border-b border-border">
        <span className="font-bold text-sm text-foreground">{title}</span>
        <Badge variant="outline" className="text-xs">Modified</Badge>
      </div>
      <div className="px-4 py-3 space-y-4">{children}</div>
    </div>
  )
}

// ── Single changed field block ────────────────────────────────────
function FieldChange({ fieldKey, oldVal, newVal }: { fieldKey: string; oldVal: any; newVal: any }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground mb-1">{toLabel(fieldKey)}</p>
      <DiffRow oldVal={oldVal} newVal={newVal} />
    </div>
  )
}

// ── Flat object diff (personal info, family fields) ───────────────
function FlatObjectDiff({
  oldObj,
  newObj,
  skipKeys = [],
}: {
  oldObj: any
  newObj: any
  skipKeys?: string[]
}) {
  const skip = new Set([...SKIP_KEYS, ...skipKeys])
  const allKeys = Array.from(
    new Set([...Object.keys(oldObj ?? {}), ...Object.keys(newObj ?? {})])
  ).filter((k) => !skip.has(k))

  const changedKeys = allKeys.filter(
    (k) => JSON.stringify(oldObj?.[k]) !== JSON.stringify(newObj?.[k])
  )

  if (changedKeys.length === 0) return null

  return (
    <>
      {changedKeys.map((k) => (
        <FieldChange key={k} fieldKey={k} oldVal={oldObj?.[k]} newVal={newObj?.[k]} />
      ))}
    </>
  )
}

// ── Children diff ─────────────────────────────────────────────────
function ChildrenDiff({ oldChildren, newChildren }: { oldChildren: any[]; newChildren: any[] }) {
  const old_ = oldChildren ?? []
  const new_ = newChildren ?? []
  const maxLen = Math.max(old_.length, new_.length)
  if (maxLen === 0) return null

  const rows: React.ReactNode[] = []

  for (let i = 0; i < maxLen; i++) {
    const o = old_[i]
    const n = new_[i]

    if (!o && n) {
      rows.push(
        <div key={i} className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
            + Child #{i + 1} Added
          </p>
          <p className="text-sm text-foreground font-medium">
            {n.child_name || "—"} &nbsp;·&nbsp; {n.child_birthdate || "—"}
          </p>
        </div>
      )
      continue
    }

    if (o && !n) {
      rows.push(
        <div key={i} className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
          <p className="text-xs font-bold text-destructive uppercase tracking-wider mb-1">
            − Child #{i + 1} Removed
          </p>
          <p className="text-sm text-muted-foreground line-through">
            {o.child_name || "—"} &nbsp;·&nbsp; {o.child_birthdate || "—"}
          </p>
        </div>
      )
      continue
    }

    const childFields = ["child_name", "child_birthdate", "status"]
    const changed = childFields.filter(
      (f) => JSON.stringify(o?.[f]) !== JSON.stringify(n?.[f])
    )

    if (changed.length > 0) {
      rows.push(
        <div key={i} className="rounded-lg border border-border bg-muted/10 px-4 py-3 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Child #{i + 1}
          </p>
          {changed.map((f) => (
            <FieldChange key={f} fieldKey={f} oldVal={o?.[f]} newVal={n?.[f]} />
          ))}
        </div>
      )
    }
  }

  if (rows.length === 0) return null

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Children
      </p>
      {rows}
    </div>
  )
}

// ── Generic array section diff ────────────────────────────────────
function ArraySectionDiff({
  oldArr,
  newArr,
  itemLabel,
}: {
  oldArr: any[]
  newArr: any[]
  itemLabel: string
}) {
  const old_ = oldArr ?? []
  const new_ = newArr ?? []
  const fields = autoFields(old_, new_)
  const maxLen = Math.max(old_.length, new_.length)
  if (maxLen === 0) return null

  const rows: React.ReactNode[] = []

  for (let i = 0; i < maxLen; i++) {
    const o = old_[i]
    const n = new_[i]

    // ── Added ──
    if (!o && n) {
      rows.push(
        <div key={i} className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
            + {itemLabel} #{i + 1} Added
          </p>
          <div className="space-y-1">
            {fields.map((f) =>
              n[f] !== null && n[f] !== undefined && n[f] !== "" ? (
                <div key={f} className="flex gap-2 text-sm">
                  <span className="text-muted-foreground shrink-0 w-36">{toLabel(f)}:</span>
                  <span className="text-foreground font-medium break-words">
                    {formatValue(n[f])}
                  </span>
                </div>
              ) : null
            )}
          </div>
        </div>
      )
      continue
    }

    // ── Removed ──
    if (o && !n) {
      rows.push(
        <div key={i} className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
          <p className="text-xs font-bold text-destructive uppercase tracking-wider mb-2">
            − {itemLabel} #{i + 1} Removed
          </p>
          <div className="space-y-1">
            {fields.map((f) =>
              o[f] !== null && o[f] !== undefined && o[f] !== "" ? (
                <div key={f} className="flex gap-2 text-sm line-through text-muted-foreground">
                  <span className="shrink-0 w-36">{toLabel(f)}:</span>
                  <span className="break-words">{formatValue(o[f])}</span>
                </div>
              ) : null
            )}
          </div>
        </div>
      )
      continue
    }

    // ── Modified — only changed fields ──
    const changedFields = fields.filter(
      (f) => JSON.stringify(o?.[f]) !== JSON.stringify(n?.[f])
    )

    if (changedFields.length > 0) {
      rows.push(
        <div key={i} className="rounded-lg border border-border bg-muted/10 px-4 py-3 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {itemLabel} #{i + 1}
          </p>
          {changedFields.map((f) => (
            <FieldChange key={f} fieldKey={f} oldVal={o?.[f]} newVal={n?.[f]} />
          ))}
        </div>
      )
    }
  }

  if (rows.length === 0) return null
  return <div className="space-y-3">{rows}</div>
}

// ── MAIN ──────────────────────────────────────────────────────────
export default function ReviewChanges({ open, oldData, newData, onCancel, onConfirm }: Props) {
  if (!oldData || !newData) return null

  const personalKeys = [
    "firstname","middlename","surname","suffix",
    "birthdate","birthplace","sex","civil_status","blood_type","height","weight",
    "mobile_no","email_address","telephone_no",
    "citizenship","citizenship_category","citizenship_country",
    "ra_house_block_lotno","ra_street","ra_subdivision_village","ra_barangay",
    "ra_city_municipality","ra_province","ra_zipcode",
    "pa_house_block_lotno","pa_street","pa_subdivision_village","pa_barangay",
    "pa_city_municipality","pa_province","pa_zipcode",
  ]

  const changedPersonal = personalKeys.filter(
    (k) => JSON.stringify(oldData[k]) !== JSON.stringify(newData[k])
  )

  const familyChanged      = JSON.stringify(oldData.family)            !== JSON.stringify(newData.family)
  const educationChanged   = JSON.stringify(oldData.emp_education)     !== JSON.stringify(newData.emp_education)
  const workChanged        = JSON.stringify(oldData.emp_work_exp)      !== JSON.stringify(newData.emp_work_exp)
  const eligibilityChanged = JSON.stringify(oldData.emp_eligibility)   !== JSON.stringify(newData.emp_eligibility)
  const voluntaryChanged   = JSON.stringify(oldData.emp_voluntary_work)!== JSON.stringify(newData.emp_voluntary_work)
  const ldChanged          = JSON.stringify(oldData.emp_ldinterventions)!==JSON.stringify(newData.emp_ldinterventions)

  const hasAnyChange =
    changedPersonal.length > 0 || familyChanged || educationChanged ||
    workChanged || eligibilityChanged || voluntaryChanged || ldChanged

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="flex flex-col h-[90vh] max-w-4xl p-0 gap-0 bg-card text-card-foreground border-border">

        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
          <DialogTitle className="text-lg font-semibold">Review Changes</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Please verify the following modifications before submitting.
          </p>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-hidden p-6">
          <ScrollArea className="h-full w-full pr-4">
            <div className="space-y-4">

              {!hasAnyChange && (
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  No changes detected.
                </div>
              )}

              {changedPersonal.length > 0 && (
                <SectionCard title="Personal Information">
                  {changedPersonal.map((k) => (
                    <FieldChange key={k} fieldKey={k} oldVal={oldData[k]} newVal={newData[k]} />
                  ))}
                </SectionCard>
              )}

              {familyChanged && (
                <SectionCard title="Family Background">
                  <FlatObjectDiff
                    oldObj={oldData.family}
                    newObj={newData.family}
                    skipKeys={["emp_children"]}
                  />
                  {JSON.stringify(oldData.family?.emp_children) !==
                    JSON.stringify(newData.family?.emp_children) && (
                    <div className="pt-2 border-t border-border">
                      <ChildrenDiff
                        oldChildren={oldData.family?.emp_children}
                        newChildren={newData.family?.emp_children}
                      />
                    </div>
                  )}
                </SectionCard>
              )}

              {educationChanged && (
                <SectionCard title="Education">
                  <ArraySectionDiff
                    oldArr={oldData.emp_education}
                    newArr={newData.emp_education}
                    itemLabel="Education"
                  />
                </SectionCard>
              )}

              {workChanged && (
                <SectionCard title="Work Experience">
                  <ArraySectionDiff
                    oldArr={oldData.emp_work_exp}
                    newArr={newData.emp_work_exp}
                    itemLabel="Work"
                  />
                </SectionCard>
              )}

              {eligibilityChanged && (
                <SectionCard title="Eligibility">
                  <ArraySectionDiff
                    oldArr={oldData.emp_eligibility}
                    newArr={newData.emp_eligibility}
                    itemLabel="Eligibility"
                  />
                </SectionCard>
              )}

              {voluntaryChanged && (
                <SectionCard title="Voluntary Work">
                  <ArraySectionDiff
                    oldArr={oldData.emp_voluntary_work}
                    newArr={newData.emp_voluntary_work}
                    itemLabel="Voluntary Work"
                  />
                </SectionCard>
              )}

              {ldChanged && (
                <SectionCard title="Learning & Development">
                  <ArraySectionDiff
                    oldArr={oldData.emp_ldinterventions}
                    newArr={newData.emp_ldinterventions}
                    itemLabel="L&D"
                  />
                </SectionCard>
              )}

            </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-border bg-muted/20 shrink-0">
          <Button variant="outline" onClick={onCancel} className="border-border">
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Confirm & Submit
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}