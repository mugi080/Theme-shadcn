"use client";

import { useState, useRef, useEffect } from "react";
import {
  X, ChevronDown, Loader2,
  User, GraduationCap, Briefcase,
  Award, Heart, BookOpen, CheckCircle2
} from "lucide-react";
import { apiFetch } from "@/lib/api/personal-info/auth";

interface EditProfileModalProps {
  initialData: any;
  onClose: () => void;
  onSubmit: () => void;
}

const SECTIONS = [
  { key: "personal",   label: "Personal Info",             icon: User,          color: "from-blue-500 to-blue-600" },
  { key: "education",  label: "Education",                  icon: GraduationCap, color: "from-violet-500 to-violet-600" },
  { key: "work",       label: "Work Experience",            icon: Briefcase,     color: "from-emerald-500 to-emerald-600" },
  { key: "eligibility",label: "Civil Service Eligibility",  icon: Award,         color: "from-amber-500 to-amber-600" },
  { key: "voluntary",  label: "Voluntary Work",             icon: Heart,         color: "from-rose-500 to-rose-600" },
  { key: "ld",         label: "Learning & Development",     icon: BookOpen,      color: "from-cyan-500 to-cyan-600" },
];

export default function EditProfileModal({ initialData, onClose, onSubmit }: EditProfileModalProps) {
  const [formData, setFormData] = useState({ ...initialData });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ personal: true });
  const [activeSection, setActiveSection] = useState("personal");
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleSection = (key: string) => {
    setOpenSections(prev => {
      const next = { ...prev, [key]: !prev[key] };
      return next;
    });
    setActiveSection(key);
  };

  const handleInputChange = (section: string, field: string, value: any, index?: number) => {
    if (index !== undefined && Array.isArray(formData[section])) {
      const arr = [...formData[section]];
      arr[index] = { ...arr[index], [field]: value };
      setFormData({ ...formData, [section]: arr });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await apiFetch("/protected/insert_changeinforequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
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

  // Trap scroll on mobile
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

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
        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes successPop {
          0%   { transform: scale(0.7); opacity: 0; }
          60%  { transform: scale(1.12); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes accordionOpen {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .modal-overlay {
          animation: overlayIn 0.2s ease both;
        }
        .modal-card {
          animation: modalIn 0.3s cubic-bezier(0.22,1,0.36,1) both;
        }
        .accordion-body {
          animation: accordionOpen 0.22s ease both;
        }
        .success-icon {
          animation: successPop 0.4s cubic-bezier(0.22,1,0.36,1) both;
        }

        .field-input {
          width: 100%;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          padding: 9px 12px;
          font-size: 14px;
          color: #1e293b;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
          outline: none;
        }
        .field-input:focus {
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
        .section-btn.open { border-radius: 14px 14px 0 0; }

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
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(37,99,235,0.4);
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .record-card {
          background: #f8fafc;
          border: 1px solid #e9eef5;
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 12px;
        }
        .record-card:last-child { margin-bottom: 0; }

        .record-index {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 10px;
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
          style={{
            borderRadius: "20px 20px 0 0",
            maxHeight: "92dvh",
          }}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 flex-shrink-0"
            style={{ borderBottom: "1.5px solid #f1f5f9" }}>
            {/* Drag handle (mobile) */}
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

          {/* ── Scrollable body ── */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto scrollbar-thin px-4 sm:px-5 py-4 space-y-3"
          >
            {/* ── Personal Info ── */}
            <AccordionSection
              sectionKey="personal"
              label="Personal Info"
              Icon={User}
              gradient="from-blue-500 to-blue-600"
              isOpen={!!openSections.personal}
              onToggle={() => toggleSection("personal")}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="First Name"     value={formData.firstname}      onChange={v => handleInputChange("", "firstname", v)} />
                <Field label="Middle Name"    value={formData.middlename}     onChange={v => handleInputChange("", "middlename", v)} />
                <Field label="Last Name"      value={formData.surname}        onChange={v => handleInputChange("", "surname", v)} />
                <Field label="Name Extension" value={formData.name_ext}       onChange={v => handleInputChange("", "name_ext", v)} />
                <Field label="Birth Date"     value={formData.birthdate}      type="date" onChange={v => handleInputChange("", "birthdate", v)} />
                <Field label="Mobile Number"  value={formData.mobile_no}      onChange={v => handleInputChange("", "mobile_no", v)} />
                <Field label="Email Address"  value={formData.email_address}  onChange={v => handleInputChange("", "email_address", v)} className="sm:col-span-2" />
              </div>
            </AccordionSection>

            {/* ── Education ── */}
            <AccordionSection
              sectionKey="education"
              label="Education"
              Icon={GraduationCap}
              gradient="from-violet-500 to-violet-600"
              isOpen={!!openSections.education}
              onToggle={() => toggleSection("education")}
            >
              {formData.emp_education?.map((edu: any, i: number) => (
                <div key={edu.education_id} className="record-card">
                  <p className="record-index mono">Record #{i + 1}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="School Name"   value={edu.school_name} onChange={v => handleInputChange("emp_education", "school_name", v, i)} className="sm:col-span-2" />
                    <Field label="Degree/Course" value={edu.basic_educ_degree_course} onChange={v => handleInputChange("emp_education", "basic_educ_degree_course", v, i)} className="sm:col-span-2" />
                    <Field label="Start Date"    value={edu.attendance_start_date} type="date" onChange={v => handleInputChange("emp_education", "attendance_start_date", v, i)} />
                    <Field label="End Date"      value={edu.attendance_end_date}   type="date" onChange={v => handleInputChange("emp_education", "attendance_end_date", v, i)} />
                    <Field label="Honors"        value={edu.scholarship_academic_honors} onChange={v => handleInputChange("emp_education", "scholarship_academic_honors", v, i)} className="sm:col-span-2" />
                  </div>
                </div>
              ))}
            </AccordionSection>

            {/* ── Work Experience ── */}
            <AccordionSection
              sectionKey="work"
              label="Work Experience"
              Icon={Briefcase}
              gradient="from-emerald-500 to-emerald-600"
              isOpen={!!openSections.work}
              onToggle={() => toggleSection("work")}
            >
              {formData.emp_work_exp?.map((work: any, i: number) => (
                <div key={work.work_id} className="record-card">
                  <p className="record-index mono">Record #{i + 1}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Position Title"      value={work.position_title}      onChange={v => handleInputChange("emp_work_exp", "position_title", v, i)} className="sm:col-span-2" />
                    <Field label="Company/Department"  value={work.department_company}  onChange={v => handleInputChange("emp_work_exp", "department_company", v, i)} className="sm:col-span-2" />
                    <Field label="Date From"           value={work.date_from} type="date" onChange={v => handleInputChange("emp_work_exp", "date_from", v, i)} />
                    <Field label="Date To"             value={work.date_to}   type="date" onChange={v => handleInputChange("emp_work_exp", "date_to", v, i)} />
                    <Field label="Monthly Salary"      value={work.salary_monthly}      onChange={v => handleInputChange("emp_work_exp", "salary_monthly", v, i)} />
                  </div>
                </div>
              ))}
            </AccordionSection>

            {/* ── Eligibility ── */}
            <AccordionSection
              sectionKey="eligibility"
              label="Civil Service Eligibility"
              Icon={Award}
              gradient="from-amber-500 to-amber-600"
              isOpen={!!openSections.eligibility}
              onToggle={() => toggleSection("eligibility")}
            >
              {formData.emp_eligibility?.map((elig: any, i: number) => (
                <div key={elig.eligibility_id} className="record-card">
                  <p className="record-index mono">Record #{i + 1}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Eligibility"  value={elig.cse_particular}        onChange={v => handleInputChange("emp_eligibility", "cse_particular", v, i)} className="sm:col-span-2" />
                    <Field label="Rating"       value={elig.rating}                onChange={v => handleInputChange("emp_eligibility", "rating", v, i)} />
                    <Field label="Exam Date"    value={elig.exam_date_conferment} type="date" onChange={v => handleInputChange("emp_eligibility", "exam_date_conferment", v, i)} />
                    <Field label="License No."  value={elig.license_no}            onChange={v => handleInputChange("emp_eligibility", "license_no", v, i)} />
                  </div>
                </div>
              ))}
            </AccordionSection>

            {/* ── Voluntary Work ── */}
            <AccordionSection
              sectionKey="voluntary"
              label="Voluntary Work"
              Icon={Heart}
              gradient="from-rose-500 to-rose-600"
              isOpen={!!openSections.voluntary}
              onToggle={() => toggleSection("voluntary")}
            >
              {formData.emp_voluntary_work?.map((vol: any, i: number) => (
                <div key={vol.voluntary_work_id} className="record-card">
                  <p className="record-index mono">Record #{i + 1}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Organization" value={vol.organization_name}        onChange={v => handleInputChange("emp_voluntary_work", "organization_name", v, i)} className="sm:col-span-2" />
                    <Field label="Position"     value={vol.position_nature_of_work}  onChange={v => handleInputChange("emp_voluntary_work", "position_nature_of_work", v, i)} className="sm:col-span-2" />
                    <Field label="Date From"    value={vol.date_from} type="date"    onChange={v => handleInputChange("emp_voluntary_work", "date_from", v, i)} />
                    <Field label="Date To"      value={vol.date_to}   type="date"    onChange={v => handleInputChange("emp_voluntary_work", "date_to", v, i)} />
                    <Field label="No. of Hours" value={vol.no_hours}                 onChange={v => handleInputChange("emp_voluntary_work", "no_hours", v, i)} />
                  </div>
                </div>
              ))}
            </AccordionSection>

            {/* ── Learning & Development ── */}
            <AccordionSection
              sectionKey="ld"
              label="Learning & Development"
              Icon={BookOpen}
              gradient="from-cyan-500 to-cyan-600"
              isOpen={!!openSections.ld}
              onToggle={() => toggleSection("ld")}
            >
              {formData.emp_ldinterventions?.map((ld: any, i: number) => (
                <div key={ld.ld_intervention_id} className="record-card">
                  <p className="record-index mono">Record #{i + 1}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Title"        value={ld.title}     onChange={v => handleInputChange("emp_ldinterventions", "title", v, i)} className="sm:col-span-2" />
                    <Field label="Date From"    value={ld.date_from} type="date" onChange={v => handleInputChange("emp_ldinterventions", "date_from", v, i)} />
                    <Field label="Date To"      value={ld.date_to}   type="date" onChange={v => handleInputChange("emp_ldinterventions", "date_to", v, i)} />
                    <Field label="No. of Hours" value={ld.no_hours}  onChange={v => handleInputChange("emp_ldinterventions", "no_hours", v, i)} />
                  </div>
                </div>
              ))}
            </AccordionSection>
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

/* ── Accordion Section ── */
function AccordionSection({
  sectionKey, label, Icon, gradient, isOpen, onToggle, children
}: {
  sectionKey: string;
  label: string;
  Icon: any;
  gradient: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: "1.5px solid #e9eef5",
        borderRadius: 14,
        overflow: "hidden",
        transition: "box-shadow 0.2s",
        boxShadow: isOpen ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <button
        onClick={onToggle}
        className={`section-btn ${isOpen ? "open" : ""}`}
        style={{ borderBottom: isOpen ? "1.5px solid #f1f5f9" : "none" }}
      >
        <span className={`section-icon bg-gradient-to-br ${gradient}`}>
          <Icon size={17} color="white" />
        </span>
        <span style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>{label}</span>
        <ChevronDown size={17} className={`chevron-icon ${isOpen ? "open" : ""}`} />
      </button>

      {isOpen && (
        <div className="accordion-body p-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Field Input ── */
function Field({
  label, value, onChange, type = "text", className = ""
}: {
  label: string;
  value: any;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.04em", textTransform: "uppercase" }}>
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        className="field-input"
      />
    </div>
  );
}