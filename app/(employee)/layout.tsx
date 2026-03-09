"use client"

import { ReactNode, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

// ✅ Dynamic import for named export
const AppSidebar = dynamic(() => import("@/components/app-sidebar").then(mod => mod.AppSidebar), {
  ssr: false
})

interface EmployeeLayoutProps {
  children: ReactNode
}

export default function EmployeeLayout({ children }: EmployeeLayoutProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <SidebarInset className="flex flex-col flex-1">
          {/* Header */}
          <Header />

          {/* Page Content */}
          <main className="flex-1 p-6 mt-16">{/* Add top margin equal to header height */}
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

/* Header Component */
function Header() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const titles: Record<string, string> = {
    dashboard: "Dashboard",
    "user-profile": "Profile",
    eligibility: "Civil Service Eligibility",
    training: "Learning & Development",
  }

  const lastSegment = segments[segments.length - 1] || ""
  const title =
    (titles[lastSegment] ??
      lastSegment
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ")) || "Employee Panel"

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
      {/* Left Side */}
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm">
          {segments.map((segment, index) => {
            const href = "/" + segments.slice(0, index + 1).join("/")
            const label = titles[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1)
            return (
              <div key={href} className="flex items-center gap-2">
                {index > 0 && <span className="text-muted-foreground">/</span>}
                <Link
                  href={href}
                  className="hover:underline text-muted-foreground hover:text-foreground"
                >
                  {label}
                </Link>
              </div>
            )
          })}
        </nav>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3"></div>
    </header>
  )
}