"use client";

// EditProfileModal.tsx

import { useState, useRef, useEffect } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/api/personal-info/auth";

import PersonalInfoSection        from "./sections/personalinfo";
import FamilyBackgroundSection    from "./sections/familybgsection";
import EducationSection           from "./sections/educationsection";
import WorkExperienceSection      from "./sections/workexperiencesection";
import EligibilitySection         from "./sections/eligibilitysection";
import VoluntaryWorkSection       from "./sections/voluntarysection";
import LearningDevelopmentSection from "./sections/learning&developmentsection";
import OtherInfoSection           from "./sections/otherinfosection";

interface EditProfileModalProps {
  initialData: any;
  onClose: () => void;
  onSubmit: () => void;
}

export default function EditProfileModal({ initialData, onClose, onSubmit }: EditProfileModalProps) {
  const [formData, setFormData] = useState({ ...initialData });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ personal: true });
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── Generic field change ───────────────────────────────
  const handleFieldChange = (field: string, value: any) =>
    setFormData((f: any) => ({ ...f, [field]: value }));

  // ── Array handlers (Education, Work, etc.) ─────────────
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

  // ── Family-specific field change ───────────────────────
  // Handles both shapes:
  //   Shape A: formData.emp_family_background = { spouse_firstname, ... }
  //   Shape B: formData.spouse_firstname  (flat, same as personal info)
  const handleFamilyChange = (field: string, value: any) => {
    if (formData.emp_family_background && typeof formData.emp_family_background === "object") {
      // Shape A — update inside the nested object
      setFormData((f: any) => ({
        ...f,
        emp_family_background: { ...f.emp_family_background, [field]: value },
      }));
    } else {
      // Shape B — update flat on formData
      handleFieldChange(field, value);
    }
  };

  // ── Resolve family object & children for FamilyBackgroundSection ──
  // Pre-extract exactly like: records={formData.emp_education ?? []}
  const familyObj: any =
    formData.emp_family_background &&
    typeof formData.emp_family_background === "object" &&
    !Array.isArray(formData.emp_family_background)
      ? formData.emp_family_background   // Shape A
      : formData;                        // Shape B (flat)

  const childrenArr: any[] =
    Array.isArray(formData.emp_children)
      ? formData.emp_children
      : Array.isArray(formData.emp_family_background?.emp_children)
      ? formData.emp_family_background.emp_children
      : [];

  // ── Submit ─────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const data = await apiFetch("/protected/insert_changeinforequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (data.success) {
        setSubmitted(true);
        setTimeout(() => { onSubmit(); onClose(); }, 1600);
      } else {
        alert("Failed to submit changes");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting changes");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Shared props for all array-based sections
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

        @keyframes modalIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes successPop {
          0%   { transform: scale(0.7); opacity: 0; }
          60%  { transform: scale(1.12); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes accordionOpen {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes recordIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .modal-overlay  { animation: overlayIn 0.2s ease both; }
        .modal-card     { animation: modalIn 0.3s cubic-bezier(0.22,1,0.36,1) both; }
        .accordion-body { animation: accordionOpen 0.22s ease both; }
        .success-icon   { animation: successPop 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .record-in      { animation: recordIn 0.22s ease both; }

        .field-input, .field-select {
          width: 100%;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          padding: 9px 12px;
          font-size: 14px;
          color: #1e293b;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
          outline: none;
          font-family: 'Sora', sans-serif;
        }
        .field-select { appearance: none; cursor: pointer; }
        .field-input:focus, .field-select:focus {
          border-color: #3b82f6;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
        }
        .field-input::placeholder { color: #94a3b8; }

        .section-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: #fff;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s;
          border-radius: 14px;
        }
        .section-btn:hover { background: #f8fafc; }
        .section-btn.open  { border-radius: 14px 14px 0 0; }

        .section-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .chevron-icon {
          margin-left: auto;
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1);
          color: #94a3b8;
        }
        .chevron-icon.open { transform: rotate(180deg); }

        .submit-btn {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 14px rgba(37,99,235,0.35);
          font-family: 'Sora', sans-serif;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.92; transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(37,99,235,0.4);
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .record-card {
          background: #f8fafc;
          border: 1px solid #e9eef5;
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 10px;
          position: relative;
        }
        .record-card:last-child { margin-bottom: 0; }

        .record-index {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 10px;
          font-family: 'JetBrains Mono', monospace;
        }

        .add-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 10px;
          border: 1.5px dashed #cbd5e1;
          background: transparent;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s;
          width: 100%;
          justify-content: center;
          margin-top: 10px;
          font-family: 'Sora', sans-serif;
        }
        .add-btn:hover {
          border-color: #3b82f6;
          color: #3b82f6;
          background: #eff6ff;
        }

        .delete-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 28px; height: 28px;
          border-radius: 8px;
          border: none;
          background: #fee2e2;
          color: #ef4444;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .delete-btn:hover { background: #ef4444; color: white; }

        .select-wrapper { position: relative; }
        .select-chevron {
          position: absolute;
          right: 10px; top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #94a3b8;
        }

        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
      `}</style>

      <div
        className="modal-overlay modal-root fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div
          className="modal-card bg-white w-full sm:max-w-2xl lg:max-w-3xl flex flex-col"
          style={{ borderRadius: "20px 20px 0 0", maxHeight: "92dvh" }}
        >
          {/* ── Header ── */}
          <div
            className="flex items-center justify-between px-5 pt-5 pb-4 flex-shrink-0 relative"
            style={{ borderBottom: "1.5px solid #f1f5f9" }}
          >
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gray-200 sm:hidden" />
            <div>
              <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mono mb-0.5">
                Employee Record
              </p>
              <h2 className="text-lg font-bold text-slate-800 leading-tight">Edit Profile</h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* ── Body ── */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 sm:px-5 py-4 space-y-3">

            {/* Personal Info — flat fields directly on formData */}
            <PersonalInfoSection
              formData={formData}
              isOpen={!!openSections.personal}
              onToggle={() => toggleSection("personal")}
              onFieldChange={handleFieldChange}
            />

            {/* Family Background — pre-extracted exactly like Education uses records={} */}
            <FamilyBackgroundSection
              family={familyObj}
              children={childrenArr}
              isOpen={!!openSections.family}
              onToggle={() => toggleSection("family")}
              onFamilyChange={handleFamilyChange}
              onArrayChange={handleArrayChange}
              onAdd={addRecord}
              onDelete={deleteRecord}
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
              isOpen={!!openSections.otherinfo}
              onToggle={() => toggleSection("otherinfo")}
              onArrayChange={handleArrayChange}
              onAdd={addRecord}
              onDelete={deleteRecord}
            />

          </div>

          {/* ── Footer ── */}
          <div
            className="flex-shrink-0 flex items-center justify-between gap-3 px-5 py-4"
            style={{ borderTop: "1.5px solid #f1f5f9" }}
          >
            <p className="text-xs text-slate-400 hidden sm:block">
              Changes will be submitted for review.
            </p>
            <div className="flex items-center gap-3 ml-auto">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || submitted}
                className="submit-btn"
              >
                {submitted ? (
                  <><CheckCircle2 size={16} className="success-icon" /> Submitted!</>
                ) : submitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Submitting…</>
                ) : (
                  "Submit Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}