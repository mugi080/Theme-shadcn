"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import Link from "next/link"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title} className="overflow-hidden">
            {item.items && item.items.length > 0 ? (
              // Item with dropdown
              <Collapsible defaultOpen={item.isActive} asChild>
                <div className="group/collapsible flex flex-col">
                  <div className="flex items-center w-full">
                    {/* Clickable title */}
                    <Link
                      href={item.url}
                      className="flex-1 flex items-center gap-2 px-2 py-1 rounded hover:bg-muted select-none"
                    >
                      {item.icon && (
                        <span className="flex w-5 h-5 items-center justify-center text-muted-foreground">
                          <item.icon className="w-5 h-5" />
                        </span>
                      )}
                      <span className="truncate">{item.title}</span>
                    </Link>

                    {/* Arrow toggle */}
                    <CollapsibleTrigger asChild>
                      <button className="p-1 ml-auto text-muted-foreground hover:text-foreground transition-transform group-data-[state=open]/collapsible:rotate-90">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </CollapsibleTrigger>
                  </div>

                  {/* Sub-items */}
                  <CollapsibleContent className="overflow-hidden">
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link
                              href={subItem.url}
                              className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted select-none"
                            >
                              <span className="truncate">{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ) : (
              // Item without dropdown
              <SidebarMenuButton asChild>
                <Link
                  href={item.url}
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted select-none"
                >
                  {item.icon && (
                    <span className="flex w-5 h-5 items-center justify-center text-muted-foreground">
                      <item.icon className="w-5 h-5" />
                    </span>
                  )}
                  <span className="truncate">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}