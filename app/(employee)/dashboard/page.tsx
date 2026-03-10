"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiFetch, getToken, getEmployeeId } from "@/lib/api/personal-info/auth"

interface UserInfo {
  firstname: string
  middlename: string
  lastname: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserInfo | null>(null)

  useEffect(() => {
    const token = getToken()

    if (!token) {
      router.push("/login")
      return
    }

    const employeeId = getEmployeeId()

    const fetchUser = async () => {
      try {
        const res = await apiFetch(`/protected/view_employee/${employeeId}`)
        const data = await res.json()

        // adjust depending on backend structure
        setUser(data.employee)
      } catch (error) {
        console.error("Failed to fetch employee:", error)
      }
    }

    fetchUser()
  }, [router])

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">

      {/* USER INFO */}
      {user && (
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold">Employee</h2>
          <p>
            {user.firstname} {user.middlename} {user.lastname}
          </p>
        </div>
      )}

      {/* DASHBOARD CARDS */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>

    </div>
  )
}