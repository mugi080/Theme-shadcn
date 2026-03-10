"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getToken } from "@/lib/api/personal-info/auth"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const token = getToken()

    // if no token → redirect
    if (!token) {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
    </div>
  )
}