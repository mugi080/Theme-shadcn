"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "./toggle-mode"

export function Header() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  return (
    <header className="flex h-16 items-center justify-between border-b px-4">
      
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />

        <nav className="flex items-center gap-2 text-sm">
          {segments.map((segment, index) => {
            const href = "/" + segments.slice(0, index + 1).join("/")

            const label =
              segment.charAt(0).toUpperCase() + segment.slice(1)

            return (
              <div key={href} className="flex items-center gap-2">
                {index > 0 && (
                  <span className="text-muted-foreground">/</span>
                )}
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

      {/* RIGHT SIDE */}
      <ModeToggle />

    </header>
  )
}