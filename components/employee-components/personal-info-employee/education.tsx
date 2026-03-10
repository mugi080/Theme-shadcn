"use client";

import { useState, useEffect, useCallback } from "react";
import {
  GraduationCap,
  Calendar,
  Award,
  Pencil,
  Trash2,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { Education, CreateEducationPayload } from "@/lib/api/personal-info/education.types";
import { educationApi } from "@/lib/api/personal-info/education";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Present";
  return new Date(dateStr).toISOString().split("T")[0];
}

// ─── Modal ──────────────────────────────────────────────────────────────────

function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Form ───────────────────────────────────────────────────────────────────

const emptyForm: CreateEducationPayload = {
  school_name: "",
  basic_educ_degree_course: "",
  attendance_start_date: "",
  attendance_end_date: null,
  highest_level_units_earned: "",
  year_graduated: "",
  scholarship_academic_honors: "",
  level_id: "",
};

function EducationForm({
  initial = emptyForm,
  loading,
  onSubmit,
  onCancel,
}: {
  initial?: CreateEducationPayload;
  loading: boolean;
  onSubmit: (data: CreateEducationPayload) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<CreateEducationPayload>(initial);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value === "" ? null : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">School Name</label>
        <input
          className={inputClass}
          name="school_name"
          value={form.school_name}
          onChange={handleChange}
          placeholder="e.g. University of Manila"
          required
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">Degree / Course</label>
        <input
          className={inputClass}
          name="basic_educ_degree_course"
          value={form.basic_educ_degree_course}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Start Date</label>
          <input
            className={inputClass}
            type="date"
            name="attendance_start_date"
            value={form.attendance_start_date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">
            End Date <span className="text-gray-300">(blank = present)</span>
          </label>
          <input
            className={inputClass}
            type="date"
            name="attendance_end_date"
            value={form.attendance_end_date ?? ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Highest Level / Units Earned</label>
          <input
            className={inputClass}
            name="highest_level_units_earned"
            value={form.highest_level_units_earned}
            onChange={handleChange}
            placeholder="e.g. Graduate"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Year Graduated</label>
          <input
            className={inputClass}
            name="year_graduated"
            value={form.year_graduated}
            onChange={handleChange}
            placeholder="e.g. 2023"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">Academic Honors</label>
        <input
          className={inputClass}
          name="scholarship_academic_honors"
          value={form.scholarship_academic_honors}
          onChange={handleChange}
          placeholder="e.g. Cum Laude"
        />
      </div>

      <div className="flex justify-end gap-2 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors disabled:opacity-60"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          Save
        </button>
      </div>
    </form>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface EducationSectionProps {
  employeeId: string; // UUID e.g. "a94d0410-75df-4d6b-ba16-fda0df03b1f6"
}

export default function EducationSection({ employeeId }: EducationSectionProps) {
  const [educations, setEducations] = useState<Education[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Education | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Education | null>(null);
  const [mutating, setMutating] = useState(false);

  // ── Fetch all ──
  const fetchEducations = useCallback(async () => {
    setFetchLoading(true);
    setFetchError(null);
    try {
      const data = await educationApi.getAll(employeeId);
      setEducations(data);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load education records.");
    } finally {
      setFetchLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchEducations();
  }, [fetchEducations]);

  // ── Add ──
  const handleAdd = async (payload: CreateEducationPayload) => {
    setMutating(true);
    try {
      const created = await educationApi.create(employeeId, payload);
      setEducations((prev) => [...prev, created]);
      setAddOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add education.");
    } finally {
      setMutating(false);
    }
  };

  // ── Edit ──
  const handleEdit = async (payload: CreateEducationPayload) => {
    if (!editTarget?.id) return;
    setMutating(true);
    try {
      const updated = await educationApi.update(editTarget.id, payload);
      setEducations((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      setEditTarget(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update education.");
    } finally {
      setMutating(false);
    }
  };

  // ── Delete ──
  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    setMutating(true);
    try {
      await educationApi.delete(deleteTarget.id);
      setEducations((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete education.");
    } finally {
      setMutating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* Header */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow transition-colors"
        >
          <Plus size={16} />
          Add Education
        </button>
      </div>

      {/* Loading */}
      {fetchLoading && (
        <div className="flex items-center justify-center py-20 text-blue-400">
          <Loader2 size={28} className="animate-spin" />
        </div>
      )}

      {/* Error */}
      {fetchError && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-4 text-sm">
          {fetchError}
          <button onClick={fetchEducations} className="ml-3 underline font-semibold">
            Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {!fetchLoading && !fetchError && educations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <GraduationCap size={40} className="text-gray-300" />
          <p className="text-sm">No education records found.</p>
        </div>
      )}

      {/* Cards */}
      {!fetchLoading && !fetchError && (
        <div className="flex flex-col gap-4">
          {educations.map((edu, index) => (
            <div
              key={edu.id ?? index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5 flex items-center gap-6"
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                <GraduationCap size={28} className="text-blue-400" />
              </div>

              {/* School & Degree */}
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-semibold text-base leading-tight truncate">
                  {edu.school_name}
                </p>
                <p className="text-blue-500 text-sm mt-0.5 truncate">
                  {edu.basic_educ_degree_course}
                </p>
              </div>

              {/* Attendance Period */}
              <div className="flex-shrink-0 min-w-[190px]">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                  <Calendar size={13} />
                  <span>Attendance Period</span>
                </div>
                <p className="text-gray-800 font-semibold text-sm">
                  {formatDate(edu.attendance_start_date)} — {formatDate(edu.attendance_end_date)}
                </p>
              </div>

              {/* Academic Honors */}
              <div className="flex-shrink-0 min-w-[160px]">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                  <Award size={13} />
                  <span>Academic Honors</span>
                </div>
                <p className="text-gray-800 font-semibold text-sm">
                  {edu.scholarship_academic_honors || "—"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex flex-col items-end gap-1">
                <span className="text-gray-400 text-xs mb-1">Actions</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditTarget(edu)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-50 text-blue-400 hover:text-blue-600 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(edu)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal open={addOpen} title="Add Education" onClose={() => setAddOpen(false)}>
        <EducationForm
          loading={mutating}
          onSubmit={handleAdd}
          onCancel={() => setAddOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editTarget} title="Edit Education" onClose={() => setEditTarget(null)}>
        {editTarget && (
          <EducationForm
            initial={{
              school_name: editTarget.school_name,
              basic_educ_degree_course: editTarget.basic_educ_degree_course,
              attendance_start_date: editTarget.attendance_start_date,
              attendance_end_date: editTarget.attendance_end_date,
              highest_level_units_earned: editTarget.highest_level_units_earned,
              year_graduated: editTarget.year_graduated,
              scholarship_academic_honors: editTarget.scholarship_academic_honors,
              level_id: editTarget.level_id,
            }}
            loading={mutating}
            onSubmit={handleEdit}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteTarget} title="Delete Education" onClose={() => setDeleteTarget(null)}>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-800">{deleteTarget?.school_name}</span>? This
          action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setDeleteTarget(null)}
            className="px-4 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={mutating}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {mutating && <Loader2 size={14} className="animate-spin" />}
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}