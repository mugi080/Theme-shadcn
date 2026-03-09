"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CalendarDays,
  CheckCircle2,
  Timer,
  ClipboardList,
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type LeaveRequest = {
  type: string;
  numDays: number;
  dateFrom: string;
  dateTo: string;
  status: "Approved" | "Pending" | "Rejected";
};

// ─── DATA ────────────────────────────────────────────────────────────────────

const employee = {
  name: "ENRIQUEZ, JUSTINE ANGELO",
  position: "Senior Administrative Officer",
  department: "IT Department",
  employmentStatus: "Regular",
  employeeCode: "2026-0001",
};

const statCards = [
  {
    label: "Pending Request",
    value: 10,
    icon: ClipboardList,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-400",
    valueColor: "text-orange-500",
  },
  {
    label: "Remaining Leaves",
    value: 10,
    icon: CalendarDays,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-400",
    valueColor: "text-blue-600",
  },
  {
    label: "Approved",
    value: 10,
    icon: CheckCircle2,
    iconBg: "bg-green-100",
    iconColor: "text-green-500",
    valueColor: "text-green-600",
  },
  {
    label: "Late",
    value: 10,
    icon: Timer,
    iconBg: "bg-red-100",
    iconColor: "text-red-400",
    valueColor: "text-red-500",
  },
];

const leaveRequests: LeaveRequest[] = [
  { type: "Vacation Leave",  numDays: 3, dateFrom: "Mar 10, 2026", dateTo: "Mar 12, 2026", status: "Approved" },
  { type: "Sick Leave",      numDays: 1, dateFrom: "Feb 20, 2026", dateTo: "Feb 20, 2026", status: "Pending"  },
  { type: "Emergency Leave", numDays: 2, dateFrom: "Jan 15, 2026", dateTo: "Jan 16, 2026", status: "Approved" },
  { type: "Vacation Leave",  numDays: 5, dateFrom: "Dec 23, 2025", dateTo: "Dec 27, 2025", status: "Rejected" },
];

const statusStyle: Record<LeaveRequest["status"], string> = {
  Approved: "bg-green-100 text-green-700 border border-green-200",
  Pending:  "bg-orange-100 text-orange-600 border border-orange-200",
  Rejected: "bg-red-100 text-red-600 border border-red-200",
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function UserDashboard() {
  return (
    <div
      className="min-h-screen bg-[#f1f5f9] p-6"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto space-y-5">

        {/* ── Employee Profile Card ── */}
        <Card className="border border-gray-200 bg-white shadow-sm overflow-hidden rounded-2xl">
          {/* Blue gradient top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-blue-700 via-blue-500 to-blue-300" />
          <CardContent className="px-8 py-7">
            <div className="flex items-center gap-5">

              {/* Avatar */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gray-100 border border-gray-200">
                <svg viewBox="0 0 64 64" className="h-12 w-12">
                  <circle  cx="32" cy="20" r="12"  fill="#94a3b8" />
                  <ellipse cx="32" cy="52" rx="20" ry="14" fill="#94a3b8" />
                  <rect x="24" y="34" width="16" height="8" rx="2" fill="#2563eb" />
                </svg>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2
                  className="text-[22px] text-gray-900 tracking-tight"
                  style={{ fontWeight: 800 }}
                >
                  {employee.name}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5" style={{ fontWeight: 400 }}>
                  {employee.position}
                  <span className="mx-2 text-gray-300">•</span>
                  {employee.department}
                </p>
                <span
                  className="inline-flex items-center mt-2 px-3 py-0.5 rounded-full text-xs
                             bg-white border border-gray-300 text-gray-600"
                  style={{ fontWeight: 500 }}
                >
                  {employee.employmentStatus}
                </span>
              </div>

              {/* Employee Code */}
              <div className="text-right shrink-0">
                <p
                  className="text-[28px] text-blue-600 tracking-tight"
                  style={{ fontWeight: 800 }}
                >
                  {employee.employeeCode}
                </p>
                <p
                  className="text-[10px] text-gray-400 mt-1 tracking-widest uppercase"
                  style={{ fontWeight: 600 }}
                >
                  EMPLOYEE CODE
                </p>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => {
            const Icon = s.icon;
            return (
              <Card
                key={s.label}
                className="border border-gray-200 bg-white shadow-sm rounded-2xl hover:shadow-md transition-shadow"
              >
                <CardContent className="px-7 py-7 flex items-center justify-between">
                  <div>
                    <p
                      className={`text-[36px] leading-none ${s.valueColor}`}
                      style={{ fontWeight: 800, letterSpacing: "-0.03em" }}
                    >
                      {s.value}
                    </p>
                    <p
                      className="text-[12px] text-gray-400 mt-2"
                      style={{ fontWeight: 400 }}
                    >
                      {s.label}
                    </p>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${s.iconBg}`}
                  >
                    <Icon className={`h-6 w-6 ${s.iconColor}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ── Leave Request Table ── */}
        <Card className="border border-gray-200 bg-white shadow-sm rounded-2xl">
          <CardHeader className="pb-2 pt-6 px-8">
            {/* "— RECORDS" eyebrow */}
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-6 bg-blue-600" />
              <span
                className="text-[10px] text-blue-600 tracking-[0.12em] uppercase"
                style={{ fontWeight: 700 }}
              >
                RECORDS
              </span>
            </div>
            <CardTitle
              className="text-[18px] text-gray-900"
              style={{ fontWeight: 800 }}
            >
              Leave Request
            </CardTitle>
          </CardHeader>

          <CardContent className="px-0 pb-6 pt-2">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {[
                    { label: "TYPE OF LEAVE",  width: "w-[28%]" },
                    { label: "NO. OF DAYS",    width: "w-[14%]" },
                    { label: "DATE FROM",      width: "w-[18%]" },
                    { label: "DATE TO",        width: "w-[18%]" },
                    { label: "STATUS",         width: "w-[22%]" },
                  ].map((h) => (
                    <th
                      key={h.label}
                      className={`${h.width} px-8 py-3 text-left text-gray-400`}
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leaveRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-8 py-12 text-center text-sm text-gray-300"
                    >
                      No leave requests found.
                    </td>
                  </tr>
                ) : (
                  leaveRequests.map((r, i) => (
                    <tr
                      key={i}
                      className={`hover:bg-gray-50 transition-colors ${
                        i < leaveRequests.length - 1 ? "border-b border-gray-50" : ""
                      }`}
                    >
                      <td
                        className="px-8 py-4 text-gray-800 text-sm"
                        style={{ fontWeight: 700 }}
                      >
                        {r.type}
                      </td>
                      <td
                        className="px-8 py-4 text-gray-500 text-sm"
                        style={{ fontWeight: 400 }}
                      >
                        {r.numDays}
                      </td>
                      <td
                        className="px-8 py-4 text-gray-500 text-sm"
                        style={{ fontWeight: 400 }}
                      >
                        {r.dateFrom}
                      </td>
                      <td
                        className="px-8 py-4 text-gray-500 text-sm"
                        style={{ fontWeight: 400 }}
                      >
                        {r.dateTo}
                      </td>
                      <td className="px-8 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${statusStyle[r.status]}`}
                          style={{ fontWeight: 600 }}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}