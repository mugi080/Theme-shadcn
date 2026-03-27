"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/api/personal-info/auth";

/* Sections */
import PersonalInfoSection from "./sections/personal-info";
import FamilyBackgroundSection from "./sections/family-background-section";
import EducationSection from "./sections/education-section";
import WorkExperienceSection from "./sections/work-experience-section";
import EligibilitySection from "./sections/eligibility-section";
import VoluntaryWorkSection from "./sections/voluntary-section";
import LearningDevelopmentSection from "./sections/learning&developmentsection";
import OtherInfoSection from "./sections/otherinfosection";

/* UI Components */
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReviewChanges from "./review-section";

interface Props {
  initialData: any;
  onClose: () => void;
  onSubmit: () => void;
}

export default function EditProfileModal({ initialData, onClose, onSubmit }: Props) {

  // ── Core State ──────────────────────────────────────────
  const [formData, setFormData] = useState(() => {
    const clone = structuredClone(initialData);
    if (!clone.family || typeof clone.family !== "object") clone.family = {};
    if (!Array.isArray(clone.family.emp_children)) clone.family.emp_children = [];
    if (!Array.isArray(clone.emp_skills))          clone.emp_skills = [];
    if (!Array.isArray(clone.emp_recognitions))    clone.emp_recognitions = [];
    if (!Array.isArray(clone.emp_memberships))     clone.emp_memberships = [];
    if (!Array.isArray(clone.emp_addtl))           clone.emp_addtl = [];
    if (!Array.isArray(clone.emp_references))      clone.emp_references = [];
    if (!Array.isArray(clone.emp_identifications)) clone.emp_identifications = [];
    return clone;
  });

  const [submitting, setSubmitting]       = useState(false);
  const [submitted, setSubmitted]         = useState(false);
  const [openSections, setOpenSections]   = useState<Record<string, boolean>>({
    personal: true,
    family:   true,
    other:    true,
  });
  const [showReview, setShowReview]       = useState(false);
  const [reviewPayload, setReviewPayload] = useState<any>(null);

  // ✅ Shared description state — passed down to ReviewChanges
  const [changeDescription, setChangeDescription] = useState("Profile Update");

  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Toggle Accordion ────────────────────────────────────
  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── Field handlers ──────────────────────────────────────
  const handleFieldChange = (field: string, value: any) =>
    setFormData((f: any) => ({ ...f, [field]: value }));

  const handleFamilyChange = (field: string, value: any) =>
    setFormData((f: any) => ({
      ...f,
      family: { ...f.family, [field]: value },
    }));

  const handleChildArrayChange = (
    _section: string, index: number, field: string, value: any
  ) =>
    setFormData((f: any) => {
      const emp_children = [...(f.family?.emp_children ?? [])];
      emp_children[index] = { ...emp_children[index], [field]: value };
      return { ...f, family: { ...f.family, emp_children } };
    });

  const addChild = (_section: string, blank: object) =>
    setFormData((f: any) => ({
      ...f,
      family: {
        ...f.family,
        emp_children: [...(f.family?.emp_children ?? []), blank],
      },
    }));

  const deleteChild = (_section: string, index: number) =>
    setFormData((f: any) => ({
      ...f,
      family: {
        ...f.family,
        emp_children: (f.family?.emp_children ?? []).filter(
          (_: any, i: number) => i !== index
        ),
      },
    }));

  const handleArrayChange = (section: string, index: number, field: string, value: any) =>
    setFormData((f: any) => {
      const arr = [...(f[section] ?? [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...f, [section]: arr };
    });

  const addRecord = (section: string, blank: object) =>
    setFormData((f: any) => ({
      ...f,
      [section]: [...(f[section] ?? []), blank],
    }));

  const deleteRecord = (section: string, index: number) =>
    setFormData((f: any) => ({
      ...f,
      [section]: (f[section] ?? []).filter((_: any, i: number) => i !== index),
    }));

  // ── Change Detection ────────────────────────────────────
  const hasChanges = useMemo(
    () => JSON.stringify(formData) !== JSON.stringify(initialData),
    [formData, initialData]
  );

  // ── Build Payload ───────────────────────────────────────
  const buildPayload = () => {
    const payload: any = {
      employee_id: initialData.employee_id,
      old_data: {},
      new_data: {},
      change_description: changeDescription.trim() || "Profile Update",
    };

    const keys = [
      "firstname", "middlename", "surname", "name_ext", "birthdate", "birthplace",
      "sex", "civil_status", "blood_type", "height", "weight",
      "mobile_no", "email_address", "telephone_no",
      "citizenship", "citizenship_category", "citizenship_country",
      "ra_house_block_lotno", "ra_street", "ra_subdivision_village", "ra_barangay",
      "ra_city_municipality", "ra_province", "ra_zipcode",
      "pa_house_block_lotno", "pa_street", "pa_subdivision_village", "pa_barangay",
      "pa_city_municipality", "pa_province", "pa_zipcode",
      "family", "emp_education", "emp_work_exp", "emp_eligibility",
      "emp_voluntary_work", "emp_ldinterventions",
      "emp_skills", "emp_recognitions", "emp_memberships",
      "emp_addtl", "emp_references", "emp_identifications",
    ];

    keys.forEach((key) => {
      payload.old_data[key] = initialData[key];
      payload.new_data[key] = formData[key];
    });
    return payload;
  };

  // ── Open review dialog ──────────────────────────────────
  const handleSubmit = () => {
    if (!hasChanges) { alert("No changes detected."); return; }
    setReviewPayload(buildPayload());
    setShowReview(true);
  };

  // ✅ CORRECT — useEffect at component top level (NOT inside a function).
  //    Keeps reviewPayload.change_description in sync when user
  //    types/selects a suggestion inside the review dialog.
  useEffect(() => {
    if (reviewPayload) {
      setReviewPayload((prev: any) => ({
        ...prev,
        change_description: changeDescription.trim() || "Profile Update",
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeDescription]);

  // ── Confirm & POST to API ───────────────────────────────
  const confirmSubmit = async () => {
    if (!reviewPayload) return;
    setSubmitting(true);
    try {
      const data = await apiFetch("/protected/insert_changeinforequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...reviewPayload,
          change_description: changeDescription.trim() || "Profile Update",
        }),
      });
      if (data.success) {
        setSubmitted(true);
        setTimeout(() => { onSubmit(); onClose(); }, 1200);
      } else {
        alert("Failed to submit changes");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting changes");
    } finally {
      setSubmitting(false);
      setShowReview(false);
    }
  };

  // ── Lock background scroll ──────────────────────────────
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const arrayProps = {
    onArrayChange: handleArrayChange,
    onAdd:         addRecord,
    onDelete:      deleteRecord,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .modal-root * { font-family: 'Sora', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }

        @keyframes modalIn { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes successPop { 0% { transform: scale(0.7); opacity: 0; } 60% { transform: scale(1.12); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes recordIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        .modal-overlay { animation: overlayIn 0.2s ease both; }
        .modal-card { animation: modalIn 0.3s cubic-bezier(0.22,1,0.36,1) both; }
        .success-icon { animation: successPop 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .record-in { animation: recordIn 0.22s ease both; }

        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: var(--ring); }
      `}</style>

      {/* ================= MAIN MODAL ================= */}
      <div
        className="modal-overlay modal-root fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-background/80 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="modal-card bg-card w-full sm:max-w-2xl lg:max-w-3xl flex flex-col rounded-t-[20px] sm:rounded-[20px] max-h-[92dvh] border border-border shadow-xl">

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 flex-shrink-0 border-b border-border relative">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-muted sm:hidden" />
            <div>
              <p className="text-xs font-semibold tracking-widest text-primary uppercase mono mb-0.5">Employee Record</p>
              <h2 className="text-lg font-bold text-foreground leading-tight">Edit Profile</h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 sm:px-5 py-4 space-y-3">

            <PersonalInfoSection
              formData={formData}
              isOpen={!!openSections.personal}
              onToggle={() => toggleSection("personal")}
              onFieldChange={handleFieldChange}
            />

            <FamilyBackgroundSection
              formData={formData.family ?? {}}
              records={formData.family?.emp_children ?? []}
              isOpen={!!openSections.family}
              onToggle={() => toggleSection("family")}
              onFieldChange={handleFamilyChange}
              onArrayChange={handleChildArrayChange}
              onAdd={addChild}
              onDelete={deleteChild}
            />

            <EducationSection
              records={formData.emp_education ?? []}
              isOpen={!!openSections.education}
              onToggle={() => toggleSection("education")}
              {...arrayProps}
            />
            <WorkExperienceSection
              records={formData.emp_work_exp ?? []}
              isOpen={!!openSections.work}
              onToggle={() => toggleSection("work")}
              {...arrayProps}
            />
            <EligibilitySection
              records={formData.emp_eligibility ?? []}
              isOpen={!!openSections.eligibility}
              onToggle={() => toggleSection("eligibility")}
              {...arrayProps}
            />
            <VoluntaryWorkSection
              records={formData.emp_voluntary_work ?? []}
              isOpen={!!openSections.voluntary}
              onToggle={() => toggleSection("voluntary")}
              {...arrayProps}
            />
            <LearningDevelopmentSection
              records={formData.emp_ldinterventions ?? []}
              isOpen={!!openSections.ld}
              onToggle={() => toggleSection("ld")}
              {...arrayProps}
            />

            <OtherInfoSection
              formData={formData}
              isOpen={!!openSections.other}
              onToggle={() => toggleSection("other")}
              onArrayChange={handleArrayChange}
              onAdd={addRecord}
              onDelete={deleteRecord}
            />

          </div>

          {/* Footer */}
          <div className="flex-shrink-0 flex items-center justify-between gap-3 px-5 py-4 border-t border-border">
            <p className="text-xs text-muted-foreground hidden sm:block">Changes will be submitted for review.</p>
            <div className="flex items-center gap-3 ml-auto">
              <Button
                variant="outline"
                onClick={onClose}
                className="rounded-full px-5 font-semibold border-border hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting || submitted || !hasChanges}
                className={`
                  rounded-full px-7 font-semibold transition-all duration-150
                  bg-primary text-primary-foreground hover:bg-primary/90
                  disabled:opacity-60 disabled:cursor-not-allowed
                  shadow-[0_4px_14px_color-mix(in_oklch,var(--primary)_35%,transparent)]
                  hover:shadow-[0_6px_20px_color-mix(in_oklch,var(--primary)_40%,transparent)]
                  hover:-translate-y-0.5
                `}
              >
                {submitted ? (
                  <><CheckCircle2 size={16} className="success-icon mr-1.5" /> Submitted!</>
                ) : submitting ? (
                  <><Loader2 size={16} className="animate-spin mr-1.5" /> Submitting…</>
                ) : (
                  "Submit Changes"
                )}
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* ================= REVIEW DIALOG ================= */}
      <Dialog open={showReview} onOpenChange={setShowReview}>
        <ReviewChanges
          open={showReview}
          oldData={reviewPayload?.old_data}
          newData={reviewPayload?.new_data}
          description={changeDescription}
          onDescriptionChange={setChangeDescription}
          onCancel={() => setShowReview(false)}
          onConfirm={confirmSubmit}
        />
      </Dialog>
    </>
  );
}