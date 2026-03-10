"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { GraduationCap, Plus, Pencil, Trash2, BookOpen, Award } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface EducationLevel {
  level_id: number;
  level_name: string;
}

interface EducationRecord {
  education_id: number;
  level_id: number;
  school_name: string;
  basic_educ_degree_course: string;
  attendance_start_date: string;
  attendance_end_date: string;
  highest_level_units_earned: string;
  year_graduated: string;
  scholarship_academic_honors: string;
  employee_id: number;
}

type FormState = Omit<EducationRecord, "education_id" | "employee_id">;

// ─── Constants ────────────────────────────────────────────────────────────────

const EDUCATION_LEVELS: EducationLevel[] = [
  { level_id: 1, level_name: "Elementary" },
  { level_id: 2, level_name: "Secondary" },
  { level_id: 3, level_name: "Vocational / Trade Course" },
  { level_id: 4, level_name: "College" },
  { level_id: 5, level_name: "Graduate Studies" },
];

const EMPTY_FORM: FormState = {
  level_id: 0,
  school_name: "",
  basic_educ_degree_course: "",
  attendance_start_date: "",
  attendance_end_date: "",
  highest_level_units_earned: "",
  year_graduated: "",
  scholarship_academic_honors: "",
};

const SEED_DATA: EducationRecord[] = [
  {
    education_id: 1,
    level_id: 4,
    school_name: "University of the Philippines Diliman",
    basic_educ_degree_course: "BS Computer Science",
    attendance_start_date: "2014-06-01",
    attendance_end_date: "2018-05-31",
    highest_level_units_earned: "",
    year_graduated: "2018",
    scholarship_academic_honors: "University Scholar",
    employee_id: 1001,
  },
  {
    education_id: 2,
    level_id: 2,
    school_name: "Manila Science High School",
    basic_educ_degree_course: "",
    attendance_start_date: "2010-06-01",
    attendance_end_date: "2014-03-31",
    highest_level_units_earned: "",
    year_graduated: "2014",
    scholarship_academic_honors: "With Honors",
    employee_id: 1001,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getLevelName = (level_id: number) =>
  EDUCATION_LEVELS.find((l) => l.level_id === level_id)?.level_name ?? "—";

const formatDate = (d: string) =>
  d ? new Date(d).toLocaleDateString("en-PH", { year: "numeric", month: "short" }) : "—";

// ─── Field Component ─────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  id: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (val: string) => void;
}

const Field = ({
  label,
  id,
  placeholder,
  type = "text",
  required = false,
  value,
  onChange,
}: FieldProps) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
      {label}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 text-sm"
    />
  </div>
);

// ─── Level Badge ──────────────────────────────────────────────────────────────

const getLevelBadgeStyle = (level_id: number): React.CSSProperties => {
  const styles: Record<number, React.CSSProperties> = {
    1: { backgroundColor: "#FFF8E1", color: "#E65100", border: "1px solid #FFCC80" },
    2: { backgroundColor: "#E3F2FD", color: "#1565C0", border: "1px solid #90CAF9" },
    3: { backgroundColor: "#F3E5F5", color: "#6A1B9A", border: "1px solid #CE93D8" },
    4: { backgroundColor: "#E8F5E9", color: "#2E7D32", border: "1px solid #A5D6A7" },
    5: { backgroundColor: "#FCE4EC", color: "#880E4F", border: "1px solid #F48FB1" },
  };
  return styles[level_id] ?? { backgroundColor: "#F5F5F5", color: "#616161", border: "1px solid #E0E0E0" };
};

const LevelBadge = ({ level_id }: { level_id: number }) => (
  <span
    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
    style={getLevelBadgeStyle(level_id)}
  >
    {getLevelName(level_id)}
  </span>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EducationBackground() {
  const [records, setRecords] = useState<EducationRecord[]>(SEED_DATA);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const setField = (key: keyof FormState, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (rec: EducationRecord) => {
    setEditingId(rec.education_id);
    const { education_id, employee_id, ...rest } = rec;
    setForm(rest);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.level_id || !form.school_name) return;
    if (editingId !== null) {
      setRecords((prev) =>
        prev.map((r) => (r.education_id === editingId ? { ...r, ...form } : r))
      );
    } else {
      const newId = Math.max(0, ...records.map((r) => r.education_id)) + 1;
      setRecords((prev) => [...prev, { education_id: newId, employee_id: 1001, ...form }]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setRecords((prev) => prev.filter((r) => r.education_id !== id));
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-muted/40 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Page Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono">CS Form 212</Badge>
            <Badge variant="secondary" className="text-xs">Personal Data Sheet</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Educational Background
          </h1>
          <p className="text-sm text-muted-foreground">
            Record of all educational attainment from elementary to graduate studies.
          </p>
        </div>

        {/* Table Card */}
        <Card className="border-border shadow-sm overflow-hidden">
          <CardHeader className="px-6 pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-white"
                  style={{ backgroundColor: "#1976D2" }}
                >
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Education Records</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {records.length} {records.length === 1 ? "entry" : "entries"} on file
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={openAdd}
                className="h-8 gap-1.5 text-xs text-white"
                style={{ backgroundColor: "#1976D2" }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Record
              </Button>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="p-0">
            {records.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">No records yet</p>
                  <p className="text-xs text-muted-foreground">Click "Add Record" to get started.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="text-xs uppercase tracking-wide font-semibold w-[50px] text-center">#</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide font-semibold w-[150px]">Level</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide font-semibold">School Name</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide font-semibold">Degree / Course</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide font-semibold">Attendance</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide font-semibold">Graduated</TableHead>
                      <TableHead className="text-xs uppercase tracking-wide font-semibold">
                        <div className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" />
                          Honors
                        </div>
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wide font-semibold w-[80px] text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((rec, index) => (
                      <TableRow key={rec.education_id} className="group hover:bg-muted/30 transition-colors">
                        <TableCell className="text-center text-xs text-muted-foreground py-3">
                          {index + 1}
                        </TableCell>
                        <TableCell className="py-3">
                          <LevelBadge level_id={rec.level_id} />
                        </TableCell>
                        <TableCell className="py-3">
                          <p
                            className="text-sm font-medium leading-tight"
                            style={{ color: "#1976D2" }}
                          >
                            {rec.school_name}
                          </p>
                        </TableCell>
                        <TableCell className="py-3 text-sm text-muted-foreground">
                          {rec.basic_educ_degree_course || "—"}
                        </TableCell>
                        <TableCell className="py-3 text-sm text-muted-foreground whitespace-nowrap">
                          {formatDate(rec.attendance_start_date)}
                          {" – "}
                          {formatDate(rec.attendance_end_date)}
                        </TableCell>
                        <TableCell className="py-3 text-sm text-muted-foreground">
                          {rec.year_graduated ||
                            (rec.highest_level_units_earned
                              ? `${rec.highest_level_units_earned} units`
                              : "—")}
                        </TableCell>
                        <TableCell className="py-3 text-sm">
                          {rec.scholarship_academic_honors ? (
                            <span className="font-medium text-amber-700">
                              {rec.scholarship_academic_honors}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-[#1976D2] hover:bg-blue-50"
                              onClick={() => openEdit(rec)}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:bg-red-50"
                              onClick={() => setDeleteId(rec.education_id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <input type="hidden" id="employee_id" />
      </div>

      {/* ── Add / Edit Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="w-4 h-4" style={{ color: "#1976D2" }} />
              {editingId !== null ? "Edit Education Record" : "Add Education Record"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Education Level <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.level_id ? String(form.level_id) : ""}
                onValueChange={(v) => setField("level_id", Number(v))}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION_LEVELS.map((l) => (
                    <SelectItem key={l.level_id} value={String(l.level_id)}>
                      {l.level_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Field
              label="School Name"
              id="school_name"
              placeholder="e.g. University of the Philippines"
              required
              value={form.school_name}
              onChange={(v) => setField("school_name", v)}
            />
            <Field
              label="Basic Education / Degree / Course"
              id="basic_educ_degree_course"
              placeholder="e.g. BS Computer Science"
              value={form.basic_educ_degree_course}
              onChange={(v) => setField("basic_educ_degree_course", v)}
            />

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Date From"
                id="attendance_start_date"
                type="date"
                value={form.attendance_start_date}
                onChange={(v) => setField("attendance_start_date", v)}
              />
              <Field
                label="Date To"
                id="attendance_end_date"
                type="date"
                value={form.attendance_end_date}
                onChange={(v) => setField("attendance_end_date", v)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Highest Level / Units Earned"
                id="highest_level_units_earned"
                placeholder="e.g. 4th Year / 150 units"
                value={form.highest_level_units_earned}
                onChange={(v) => setField("highest_level_units_earned", v)}
              />
              <Field
                label="Year Graduated"
                id="year_graduated"
                placeholder="e.g. 2018"
                value={form.year_graduated}
                onChange={(v) => setField("year_graduated", v)}
              />
            </div>
            <Field
              label="Scholarship / Academic Honors Received"
              id="scholarship_academic_honors"
              placeholder="e.g. University Scholar, Cum Laude"
              value={form.scholarship_academic_honors}
              onChange={(v) => setField("scholarship_academic_honors", v)}
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!form.level_id || !form.school_name}
              className="text-white"
              style={{ backgroundColor: "#1976D2" }}
            >
              {editingId !== null ? "Save Changes" : "Add Record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Delete Record?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently remove this education record. This action cannot be undone.
          </p>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId !== null && handleDelete(deleteId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}