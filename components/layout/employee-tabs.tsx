"use client"

import * as React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useSwipeable } from "react-swipeable"
import {
  User, Users, GraduationCap, FileCheck,
  Briefcase, HeartHandshake, BookOpen, Info
} from "lucide-react"

type TabItem = {
  label: string
  content: React.ReactNode
  icon?: React.ReactNode
  completed?: boolean
}

interface EmployeeTabsProps {
  tabs: TabItem[]
}

export function EmployeeTabs({ tabs }: EmployeeTabsProps) {

  const [activeTab, setActiveTab] = React.useState(tabs[0]?.label)
  const [animDir, setAnimDir] = React.useState<"left" | "right">("right")
  const [animKey, setAnimKey] = React.useState(0)

  const tabsListRef = React.useRef<HTMLDivElement>(null)
  const tabRefs = React.useRef<{ [key: string]: HTMLButtonElement | null }>({})

  const defaultIcons = [
    <User className="h-4 w-4 mr-2" />,
    <Users className="h-4 w-4 mr-2" />,
    <GraduationCap className="h-4 w-4 mr-2" />,
    <FileCheck className="h-4 w-4 mr-2" />,
    <Briefcase className="h-4 w-4 mr-2" />,
    <HeartHandshake className="h-4 w-4 mr-2" />,
    <BookOpen className="h-4 w-4 mr-2" />,
    <Info className="h-4 w-4 mr-2" />,
  ]

  const tabsWithIcons = tabs.map((tab, index) => ({
    ...tab,
    icon: tab.icon || defaultIcons[index] || defaultIcons[0],
  }))

  // Scroll active tab into view (mobile)
  React.useEffect(() => {
    const el = tabRefs.current[activeTab]
    if (el && tabsListRef.current) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
    }
  }, [activeTab])

  const handleTabChange = (newTab: string) => {
    const currentIndex = tabs.findIndex(t => t.label === activeTab)
    const newIndex = tabs.findIndex(t => t.label === newTab)
    setAnimDir(newIndex > currentIndex ? "right" : "left")
    setAnimKey(k => k + 1)
    setActiveTab(newTab)
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const i = tabs.findIndex(t => t.label === activeTab)
      if (i < tabs.length - 1) handleTabChange(tabs[i + 1].label)
    },
    onSwipedRight: () => {
      const i = tabs.findIndex(t => t.label === activeTab)
      if (i > 0) handleTabChange(tabs[i - 1].label)
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
    delta: 100,
  })

  return (
    <>
      <style>{`
        /* Employee Tabs Dark/Light Mode */
        .emp-tab {
          border-radius: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          color: var(--color-muted-foreground);
          transition: color 0.15s, border-color 0.15s;
        }

        /* Mobile: bottom border only on active tab */
        .emp-tab {
          border-bottom: 2px solid transparent;
          padding-bottom: calc(0.75rem - 2px) !important;
        }

        .emp-tab[data-state="active"] {
          color: var(--color-primary);
          border-bottom: 2px solid var(--color-primary);
        }

        .emp-tab:hover {
          color: var(--color-primary);
          background: transparent !important;
        }

        /* Completed dots */
        .emp-tab .completed-dot {
          color: var(--color-green-500, #22c55e);
        }
        .emp-tab .incomplete-dot {
          color: var(--color-muted-foreground);
        }

        /* Mobile: single gray line at very bottom of tab strip */
        .emp-tabs-list {
          border-bottom: 1px solid var(--color-border);
        }

        /* Desktop: every tab gets a gray bottom border so BOTH rows have a line.
           Active tab overrides with primary color. */
        @media (min-width: 1024px) {
          .emp-tab {
            border-bottom: 2px solid var(--color-border);
          }
          .emp-tab[data-state="active"] {
            border-bottom: 2px solid var(--color-primary);
          }
          /* Remove the list-level border — each tab row handles its own line now */
          .emp-tabs-list {
            border-bottom: none;
          }
        }
      `}</style>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">

        <TabsList
          ref={tabsListRef}
          className="emp-tabs-list flex lg:grid lg:grid-cols-4 w-full overflow-x-auto lg:overflow-visible bg-transparent gap-0 p-0 h-auto justify-start lg:justify-stretch"
        >
          {tabsWithIcons.map((tab) => (
            <TabsTrigger
              key={tab.label}
              value={tab.label}
              ref={(el) => { tabRefs.current[tab.label] = el }}
              className="emp-tab inline-flex items-center justify-center px-3 lg:px-4 py-3 text-sm whitespace-nowrap"
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className={`ml-2 text-xs ${tab.completed ? "completed-dot" : "incomplete-dot"}`}>
                {tab.completed ? "●" : "○"}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div {...handlers} className="relative mt-10 lg:mt-12 min-h-[400px] overflow-hidden">
          {tabsWithIcons.map((tab) => (
            <TabsContent key={tab.label} value={tab.label}>
              <div
                key={`${tab.label}-${animKey}`}
                className={activeTab === tab.label
                  ? (animDir === "right" ? "animate-slide-in-right" : "animate-slide-in-left")
                  : ""}
              >
                {tab.content}
              </div>
            </TabsContent>
          ))}
        </div>

      </Tabs>
    </>
  )
}