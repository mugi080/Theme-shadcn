"use client"

import { useState, useEffect } from "react"
import { Loader2, Star, Trophy, Users } from "lucide-react"
import { apiFetch, getEmployeeId, logout } from "@/lib/api/personal-info/auth"

// ─── Types ───────────────────────────────────────────────
interface Skill        { skill_id: string;       description: string; order: number }
interface Recognition  { recognition_id: string; description: string; order: number }
interface Membership   { membership_id: string;  description: string; order: number }

// ─── Section Card ────────────────────────────────────────
function SectionCard({
  icon: Icon,
  title,
  color,
  iconBg,
  badgeColor,
  items,
  emptyText,
}: {
  icon: React.ElementType
  title: string
  color: string
  iconBg: string
  badgeColor: string
  items: { id: string; description: string; order: number }[]
  emptyText: string
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 md:px-6 py-4 border-b border-gray-100">
        <div className={`p-2.5 ${iconBg} rounded-xl shrink-0`}>
          <Icon className={`w-5 h-5 ${color}`} strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm md:text-base font-bold text-gray-900">{title}</h3>
          <p className="text-[11px] text-gray-400 font-medium">{items.length} record{items.length !== 1 ? "s" : ""}</p>
        </div>
        <span className={`text-xs font-black px-2.5 py-1 rounded-full ${badgeColor}`}>
          {items.length}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
            <div className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color} opacity-40`} strokeWidth={1.5} />
            </div>
            <p className="text-gray-400 text-sm italic">{emptyText}</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {[...items]
              .sort((a, b) => a.order - b.order)
              .map((item, i) => (
                <li
                  key={item.id}
                  className="flex items-start gap-4 px-5 md:px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black mt-0.5 ${badgeColor}`}>
                    {item.order || i + 1}
                  </span>
                  <p className="text-sm font-medium text-gray-700 leading-relaxed flex-1">
                    {item.description}
                  </p>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────
export default function OtherInfoSectionUI() {
  const employeeId = getEmployeeId()

  const [skills,       setSkills]       = useState<Skill[]>([])
  const [recognitions, setRecognitions] = useState<Recognition[]>([])
  const [memberships,  setMemberships]  = useState<Membership[]>([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState<string | null>(null)

  useEffect(() => {
    if (!employeeId) { logout(); return }
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await apiFetch(`/protected/view_employee/${employeeId}`)
        if (data.success && data.data) {
          setSkills(data.data.emp_skills             ?? [])
          setRecognitions(data.data.emp_recognitions ?? [])
          setMemberships(data.data.emp_memberships   ?? [])
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch records")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [employeeId])

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <Loader2 size={30} className="animate-spin text-blue-400" />
    </div>
  )

  if (error) return <p className="text-red-500 p-8">{error}</p>

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* Page Header */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Other Information</h2>
          <p className="text-sm text-gray-400 mt-0.5">Skills, recognitions, and organization memberships</p>
        </div>

        {/* Three cards */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          <SectionCard
            icon={Star}
            title="Special Skills & Hobbies"
            color="text-yellow-500"
            iconBg="bg-yellow-50"
            badgeColor="bg-yellow-100 text-yellow-700"
            items={skills.map(s => ({ id: s.skill_id, description: s.description, order: s.order }))}
            emptyText="No special skills or hobbies recorded."
          />

          <SectionCard
            icon={Trophy}
            title="Non-Academic Distinctions / Recognitions"
            color="text-blue-500"
            iconBg="bg-blue-50"
            badgeColor="bg-blue-100 text-blue-700"
            items={recognitions.map(r => ({ id: r.recognition_id, description: r.description, order: r.order }))}
            emptyText="No recognitions or distinctions recorded."
          />

          <SectionCard
            icon={Users}
            title="Organization Memberships"
            color="text-emerald-500"
            iconBg="bg-emerald-50"
            badgeColor="bg-emerald-100 text-emerald-700"
            items={memberships.map(m => ({ id: m.membership_id, description: m.description, order: m.order }))}
            emptyText="No organization memberships recorded."
          />

        </div>
      </div>
    </div>
  )
}