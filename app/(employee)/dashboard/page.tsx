"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiFetch, getToken, getEmployeeId, logout } from "@/lib/api/personal-info/auth"
import { Clock, CalendarDays, CheckCircle2, AlertCircle } from "lucide-react"

interface UserInfo {
  firstname: string
  middlename: string
  surname: string
  position?: string
  department?: string
  employment_status?: string
  employee_code?: string
  profile_photo?: string
}

interface LeaveRequest {
  id: number
  type_of_leave: string
  no_of_days: number
  date: string
  inclusive_date: string
  status: "Pending" | "Approved" | "Rejected"
}

// Mock leave data — replace with real API call
const MOCK_LEAVES: LeaveRequest[] = [
  { id: 1, type_of_leave: "Vacation",  no_of_days: 5, date: "Mar 5, 2026",  inclusive_date: "March 5-10, 2026",  status: "Pending"  },
  { id: 2, type_of_leave: "Sick",      no_of_days: 5, date: "Mar 11, 2026", inclusive_date: "March 11-15, 2026", status: "Approved" },
  { id: 3, type_of_leave: "Emergency", no_of_days: 5, date: "Mar 16, 2026", inclusive_date: "March 16-20, 2026", status: "Pending"  },
]

const STATUS_STYLE: Record<string, string> = {
  Pending:  "bg-yellow-100 text-yellow-700 border border-yellow-200",
  Approved: "bg-green-100 text-green-700 border border-green-200",
  Rejected: "bg-red-100 text-red-600 border border-red-200",
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserInfo>({
    firstname: "",
    middlename: "",
    surname: "",
    position: "",
    department: "",
    employment_status: "",
    employee_code: "",
    profile_photo: "",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const employeeId = getEmployeeId()
  const token = getToken()

  useEffect(() => {
    if (!token || !employeeId) {
      logout()
      return
    }

    const fetchUser = async () => {
      try {
        const res = await apiFetch(`/protected/view_employee/${employeeId}`)
        const data = await res.json()
        console.log("PUT RESPONSE:", data)

        if (data.success && data.data) {
          const emp = data.data
          setUser({
            firstname:         emp.firstname         || "",
            middlename:        emp.middlename        || "",
            surname:           emp.surname           || "",
            position:          emp.position          || "Senior Administrative Officer",
            department:        emp.department        || "IT Department",
            employment_status: emp.employment_status || "Regular",
            employee_code:     emp.employee_code     || "2026-0001",
            profile_photo:     emp.profile_photo     || "",
          })
        } else {
          setError("Employee data not found")
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [employeeId, token])

  const fullName = [user.surname, user.firstname, user.middlename]
    .filter(Boolean)
    .join(", ")
    .toUpperCase()
    || "—"

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (error) return <p className="p-6 text-red-500">{error}</p>

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6 bg-gray-100 min-h-screen">

      {/* ── Employee Header Card ── */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 md:p-6">

          {/* Avatar */}
          <div className="shrink-0">
            {user.profile_photo ? (
              <img
                src={user.profile_photo}
                alt="Profile"
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-blue-100"
              />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center">
                <svg viewBox="0 0 64 64" className="w-10 h-10 md:w-12 md:h-12 text-blue-300" fill="currentColor">
                  <circle cx="32" cy="22" r="12" />
                  <path d="M8 52c0-13.255 10.745-24 24-24s24 10.745 24 24" />
                </svg>
              </div>
            )}
          </div>

          {/* Name & Info */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-tight">
              {fullName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {user.position}
              {user.department && (
                <span className="text-gray-300 mx-2">•</span>
              )}
              {user.department}
            </p>
            {user.employment_status && (
              <span className="inline-block mt-2 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-0.5 rounded-full">
                {user.employment_status}
              </span>
            )}
          </div>

          {/* Employee Code */}
          <div className="text-center sm:text-right shrink-0">
            <p className="text-2xl md:text-3xl font-black text-blue-400 tracking-widest leading-none">
              {user.employee_code}
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Employee Code
            </p>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Pending Request */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-3xl md:text-4xl font-black text-yellow-500">10</p>
            <p className="text-xs text-gray-400 font-medium mt-1">Pending Request</p>
          </div>
          <div className="p-2 md:p-3 bg-yellow-50 rounded-xl shrink-0">
            <Clock className="text-yellow-400 w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
          </div>
        </div>

        {/* Remaining Leaves */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-3xl md:text-4xl font-black text-orange-400">10</p>
            <p className="text-xs text-gray-400 font-medium mt-1">Remaining Leaves</p>
          </div>
          <div className="p-2 md:p-3 bg-orange-50 rounded-xl shrink-0">
            <CalendarDays className="text-orange-400 w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-3xl md:text-4xl font-black text-green-500">10</p>
            <p className="text-xs text-gray-400 font-medium mt-1">Approved</p>
          </div>
          <div className="p-2 md:p-3 bg-green-50 rounded-xl shrink-0">
            <CheckCircle2 className="text-green-400 w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
          </div>
        </div>

        {/* Late */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-3xl md:text-4xl font-black text-red-500">10</p>
            <p className="text-xs text-gray-400 font-medium mt-1">Late</p>
          </div>
          <div className="p-2 md:p-3 bg-red-50 rounded-xl shrink-0">
            <AlertCircle className="text-red-400 w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* ── Leave Request Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-800">Leave Request</h2>
          <button className="text-sm text-blue-500 font-semibold hover:underline">See All</button>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wide pb-3 pr-4">No.</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wide pb-3 pr-4">Type of Leave</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wide pb-3 pr-4">No. of</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wide pb-3 pr-4">Date</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wide pb-3 pr-4">Inclusive Date</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wide pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LEAVES.map((leave) => (
                <tr key={leave.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 pr-4 text-gray-500 font-medium">{leave.id}</td>
                  <td className="py-3 pr-4 font-semibold text-gray-800">{leave.type_of_leave}</td>
                  <td className="py-3 pr-4 text-gray-600">{leave.no_of_days}</td>
                  <td className="py-3 pr-4 text-gray-600">{leave.date}</td>
                  <td className="py-3 pr-4 text-gray-600">{leave.inclusive_date}</td>
                  <td className="py-3">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${STATUS_STYLE[leave.status]}`}>
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="flex flex-col gap-3 sm:hidden">
          {MOCK_LEAVES.map((leave) => (
            <div key={leave.id} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="font-bold text-gray-800">{leave.type_of_leave}</p>
                <span className={`text-[11px] font-bold px-3 py-0.5 rounded-full ${STATUS_STYLE[leave.status]}`}>
                  {leave.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                <span>Days: <span className="font-semibold text-gray-700">{leave.no_of_days}</span></span>
                <span>Date: <span className="font-semibold text-gray-700">{leave.date}</span></span>
                <span className="col-span-2">Period: <span className="font-semibold text-gray-700">{leave.inclusive_date}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}