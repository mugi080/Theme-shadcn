"use client";

import { useState, useEffect, useCallback } from "react";
import {
  GraduationCap,
  Calendar,
  Pencil,
  Plus,
  X,
  Loader2,
} from "lucide-react";

import {
  Education,
  CreateEducationPayload,
} from "@/lib/api/personal-info/education.types";

import { educationApi } from "@/lib/api/personal-info/education";

/* -----------------------------------------
   Helpers
----------------------------------------- */

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Present";
  return new Date(dateStr).toISOString().split("T")[0];
}

/* -----------------------------------------
   Modal
----------------------------------------- */

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
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg">
        <div className="flex justify-between mb-4">
          <h2 className="font-bold text-lg">{title}</h2>

          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

/* -----------------------------------------
   Form
----------------------------------------- */

const emptyForm: CreateEducationPayload = {
  school_name: "",
  basic_educ_degree_course: "",
  attendance_start_date: "",
  attendance_end_date: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      ...form,
      attendance_end_date: form.attendance_end_date || null,
    });
  };

  const inputClass =
    "w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        className={inputClass}
        placeholder="School Name"
        name="school_name"
        value={form.school_name}
        onChange={handleChange}
      />

      <input
        className={inputClass}
        placeholder="Degree / Course"
        name="basic_educ_degree_course"
        value={form.basic_educ_degree_course}
        onChange={handleChange}
      />

      <input
        className={inputClass}
        type="date"
        name="attendance_start_date"
        value={form.attendance_start_date}
        onChange={handleChange}
      />

      <input
        className={inputClass}
        type="date"
        name="attendance_end_date"
        value={form.attendance_end_date || ""}
        onChange={handleChange}
      />

      <input
        className={inputClass}
        placeholder="Highest Level / Units"
        name="highest_level_units_earned"
        value={form.highest_level_units_earned}
        onChange={handleChange}
      />

      <input
        className={inputClass}
        placeholder="Year Graduated"
        name="year_graduated"
        value={form.year_graduated}
        onChange={handleChange}
      />

      <input
        className={inputClass}
        placeholder="Academic Honors"
        name="scholarship_academic_honors"
        value={form.scholarship_academic_honors}
        onChange={handleChange}
      />

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          Save
        </button>
      </div>
    </form>
  );
}

/* -----------------------------------------
   Main Section
----------------------------------------- */

export default function EducationSection({
  employeeId,
}: {
  employeeId: string;
}) {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Education | null>(null);

  const fetchEducations = useCallback(async () => {
    setLoading(true);

    try {
      const data = await educationApi.getAll(employeeId);
      setEducations(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }, [employeeId]);

  useEffect(() => {
    if (!employeeId) return;
    fetchEducations();
  }, [fetchEducations, employeeId]);

  const handleAdd = async (payload: CreateEducationPayload) => {
    const created = await educationApi.create(employeeId, payload);

    setEducations((prev) => [...prev, created]);

    setAddOpen(false);
  };

  const handleEdit = async (payload: CreateEducationPayload) => {
    if (!editTarget) return;

    const updated = await educationApi.update(
      editTarget.education_id,
      payload
    );

    setEducations((prev) =>
      prev.map((e) =>
        e.education_id === updated.education_id ? updated : e
      )
    );

    setEditTarget(null);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setAddOpen(true)}
          className="flex gap-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          <Plus size={16} />
          Add Education
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 size={30} className="animate-spin" />
        </div>
      )}

      {!loading && (
        <div className="flex flex-col gap-4">
          {educations.map((edu) => (
            <div
              key={edu.education_id}
              className="bg-white border rounded-xl p-5 flex items-center gap-6"
            >
              <GraduationCap className="text-blue-500" />

              <div className="flex-1">
                <p className="font-semibold">{edu.school_name}</p>

                <p className="text-sm text-blue-500">
                  {edu.basic_educ_degree_course}
                </p>
              </div>

              <div>
                <div className="flex items-center text-xs text-gray-400 gap-1">
                  <Calendar size={12} />
                  Attendance
                </div>

                <p className="text-sm font-semibold">
                  {formatDate(edu.attendance_start_date)} —{" "}
                  {formatDate(edu.attendance_end_date)}
                </p>
              </div>

              <button
                onClick={() => setEditTarget(edu)}
                className="text-blue-500"
              >
                <Pencil size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ADD */}
      <Modal open={addOpen} title="Add Education" onClose={() => setAddOpen(false)}>
        <EducationForm
          loading={false}
          onSubmit={handleAdd}
          onCancel={() => setAddOpen(false)}
        />
      </Modal>

      {/* EDIT */}
      <Modal
        open={!!editTarget}
        title="Edit Education"
        onClose={() => setEditTarget(null)}
      >
        {editTarget && (
          <EducationForm
            initial={{
              school_name: editTarget.school_name ?? "",
              basic_educ_degree_course:
                editTarget.basic_educ_degree_course ?? "",
              attendance_start_date:
                editTarget.attendance_start_date ?? "",
              attendance_end_date:
                editTarget.attendance_end_date ?? "",
              highest_level_units_earned:
                editTarget.highest_level_units_earned ?? "",
              year_graduated: editTarget.year_graduated ?? "",
              scholarship_academic_honors:
                editTarget.scholarship_academic_honors ?? "",
              level_id: editTarget.level_id ?? "",
            }}
            loading={false}
            onSubmit={handleEdit}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>
    </div>
  );
}